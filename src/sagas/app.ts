import { SagaIterator, delay, eventChannel } from "redux-saga"
import {
  call,
  fork,
  Pattern,
  put,
  race,
  select,
  take,
  takeEvery,
  takeLatest,
  throttle,
} from "redux-saga/effects"
import {
  ConnectionInfo,
  NetInfo,
} from "react-native"
import * as navigation from "../navigation"
import { setupScreenFlow, removeScreenFlow } from "./screenFlow"
import { AppScreens, RootState, KioskSettings, KioskQueueData } from "../interfaces"
import { APP, KIOSK, MODAL, SCREEN_SAVER } from "../actions/types"
import { isScreenSaverActive } from "../utils/screenSaver"
import { selectors, requestReadPhoneState, AlertError } from "../utils"
import IMEI from "react-native-imei"
import callApi from "./api"
import { REQUEST_TIMEOUT, SLOW_NETWORK, TRY_AGAIN } from "./index"
import {
  loadScreenSaverDataRequest,
  loadScreenSaverDataFail,
  addCustomerToQueueReset,
  goToInitialScreen as goToInitialScreenAction, kioskSettingsSuccess,
} from "../actions"
import { setDefaultLanguage } from "./kiosk"

const SECONDS = 1000
const idleTime = 20 * SECONDS
const idleInterval = 400
const watchScreenSaverDataInterval = 120

const connectionChangedEventSource = () => {
  return eventChannel((emitter) => {
    const handler = () => NetInfo.getConnectionInfo().then(emitter)
    NetInfo.addEventListener("connectionChange", handler)
    return () => NetInfo.removeEventListener("connectionChange", handler)
  })
}

function* watchConnectionStatus() {
  const connectionInfoChannel = yield call(connectionChangedEventSource)
  let connectionInfo: ConnectionInfo
  while (true) {
    connectionInfo = yield take(connectionInfoChannel)
    if (connectionInfo.type.toLowerCase() === "none") {
      yield put({
        type: APP.OFFLINE.REQUEST
      })
    } else {
      yield put({
        type: APP.ONLINE.REQUEST
      })
    }
  }
}

export function* goToInitialScreen(): SagaIterator {
  const initialScreenName = yield select((state: RootState) => state.app.initialScreen)

  if (initialScreenName) {
    navigation.reset(initialScreenName)
  }
}

export function* initApp(): SagaIterator {
  yield put(goToInitialScreenAction())
  yield call(setupScreenFlow)
}

export function* stopApp(): SagaIterator {
  yield call(removeScreenFlow)
}

function* resetIfNotAtHome(): any {
  const initialScreenName = yield select((state: RootState) => state.app.initialScreen)
  const route = navigation.getCurrentRoute()
  if (route && route.routeName !== initialScreenName) {
    yield put(goToInitialScreenAction())
  }
}

function* tick(interval: number, onTick: () => any) {
  while (true) {
    yield call(delay, interval)
    yield call(onTick)
  }
}

/**
 * reset idle timer each action represented by action pattern
 */
function* resetIdleInterval(bounce: number, pattern: Pattern, reset: () => any): SagaIterator {
  yield throttle(bounce, pattern, reset)
}

/**
 * watch for kiosk idle state
 * idle - no action dispatch being catched in store
 * for idleTimeMs
 * Watcher run clock with period counterStepMs
 */
function* idleWacher(idleTimeMs: number, counterStepMs: number): SagaIterator {
  let counter = 0
  yield fork(tick, counterStepMs, function*() {
    const isOffline = yield select((state: RootState) => state.app.offline)
    const isFetching = yield select(selectors.isFetching)
    if (isOffline || isScreenSaverActive()) { // reset counter when offline or screen saver is active
      counter = 0
    } else {
      if (!isFetching) { // do not increment counter if at loading screen
        counter += counterStepMs
      }
    }
    if (counter >= idleTimeMs) {
      // idle time boundary reached
      counter = 0
      yield call(resetIfNotAtHome)
      yield put({ type: KIOSK.CHECK_IN.RESET, backgroundTask: true })
      yield put({ type: KIOSK.EVENT_CHECK_IN.RESET, backgroundTask: true })
      yield put(addCustomerToQueueReset(true))
    }
  })

  function* setIdleCounter(action: any): SagaIterator {
    yield call(delay, 500)
    counter = idleTime - action.time * SECONDS
  }
  yield fork(
    resetIdleInterval,
    idleInterval,
    (action: any) => !action.backgroundTask,
    () => {
      counter = 0
    }
  )
  yield takeEvery(APP.SET_IDLE_INTERVAL.REQUEST, setIdleCounter)
}

function* goOffline() {
  yield put({
    type: MODAL.HIDE.REQUEST
  })
  yield call(navigation.navigate, AppScreens.NO_CONNECTION_MODAL)
}

function* goOnline() {
  yield call(navigation.goBack)
}

const TAPS_TO_ENTER_SECRET = 6

function* watchForSecretTap() {
  let tapCounter = 0
  let delayTime = 5000
  while (true) {
    const { timeout } = yield race({
      increment: take(APP.SECRET_TAP.REQUEST),
      timeout: delay(delayTime)
    })

    if (timeout) {
      delayTime = 5000
      tapCounter = 0
      continue
    }

    tapCounter += 1
    delayTime = 600
    if (tapCounter >= TAPS_TO_ENTER_SECRET) {
      tapCounter = 0
      yield put({
        type: APP.SECRET_TAP.SUCCESS
      })
    }
  }
}

export function* setImei() {
  try {
    const hasReadPhonePermission = yield call(requestReadPhoneState)
    if (!hasReadPhonePermission) {
      return
    }
    const deviceImei = yield call(IMEI.getImei)
    yield put({
      type: APP.PHONE_STATE_PERMISSION.SUCCESS,
      payload: {
        deviceImei: deviceImei[0]
      }
    })
  } catch (e) {
    yield put({
      type: APP.PHONE_STATE_PERMISSION.FAILURE,
    })
  }
}

function* watchStoreOpen() {
  const data = yield select((state: RootState) => state.kiosk.data)
  if (data.length) {
    const initialScreen = yield select((state: RootState) => state.app.initialScreen)
    const kioskClosed = data.some((q: KioskQueueData) => !q.storeOpen)
    if (kioskClosed) {
      if (initialScreen !== AppScreens.KIOSK_CLOSED) {
        yield put({
          type: APP.CHANGE_INITIAL_PAGE.REQUEST,
          payload: AppScreens.KIOSK_CLOSED
        })
        yield put(goToInitialScreenAction())
      }
    } else {
      if (initialScreen === AppScreens.KIOSK_CLOSED) {
        yield put({ type: KIOSK.SETTINGS.REQUEST })
      }
    }
  }
}

export function* watchSettingsChange() {
  const settings: KioskSettings = yield select((state: RootState) => state.kiosk.settings)
  const initialScreen = yield select((state: RootState) => state.app.initialScreen)
  const route = navigation.getCurrentRoute()

  if (settings && settings.template &&
      route && route.routeName === initialScreen && route.routeName !== AppScreens.SCREEN_SAVER) {
    const { welcomeScreenIsRemove } = settings.template
    let payload = AppScreens.HOME
    if (welcomeScreenIsRemove) {
      payload = AppScreens.SERVICE_SELECTION
      if (settings.products.length === 1) {
        payload = AppScreens.CUSTOMER_DETAILS
      }
    }
    if (payload !== initialScreen) {
      yield put({
        type: APP.CHANGE_INITIAL_PAGE.REQUEST,
        payload
      })
    }
    yield call(initApp)
  }
}

export function* loadScreenSaverData() {
  try {
    const { url } = yield select(selectors.getKioskFieldsSelector)
    const kioskId = yield select(selectors.kioskIdSelector)
    const serial = yield select(selectors.serialSelector)
    const initialScreenName = yield select((state: RootState) => state.app.initialScreen)

    const route = navigation.getCurrentRoute()

    if (route && route.routeName !== initialScreenName) {
      return
    }

    const { response, timeout } = yield race({
      response: call(callApi, `${url}/api/kiosk/settings/${kioskId}?serial=${serial}`),
      timeout: delay(REQUEST_TIMEOUT),
    }) as any // https://jira.qudini.com/browse/QSERVER-9639
    if (timeout) {
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }
    if (response.data.error) {
      throw new Error(response.data.error.description)
    }

    const latestRoute = navigation.getCurrentRoute()

    if (latestRoute && latestRoute.routeName !== initialScreenName) {
      return
    }

    const { enableScreensaver } = response.data.template

    if (!enableScreensaver) {
      yield hideScreenSaver()
    }

    yield put(kioskSettingsSuccess(response.data))

  } catch (e) {
    let payload
    if (e instanceof AlertError) {
      const { message, title } = e
      payload = { title, message }
    } else {
      payload = e.message
    }
    yield put(loadScreenSaverDataFail(payload))
  }
}

function* watchScreenSaverData(counterStepMs: number) {
  let counter = 0
  yield fork(tick, counterStepMs, function*() {
    counter += counterStepMs
    if (counter >= watchScreenSaverDataInterval * SECONDS) {
      // time boundary reached
      counter = 0
      yield put(loadScreenSaverDataRequest())
    }
  })

  yield fork(
    resetIdleInterval,
    idleInterval,
    (action: any) => !action.backgroundTask,
    () => {
      counter = 0
    }
  )
}

function* watchInactivity(counterStepMs: number): SagaIterator {
  let counter = 0
  yield fork(tick, counterStepMs, function*() {
    if (!isScreenSaverActive()) {
      counter += counterStepMs
    }

    const inactivityTime: number = yield select(selectors.getScreenSaverEnableTimer)
    const isScreensaverEnabled = yield select(selectors.isScreensaverEnabled)

    if (!inactivityTime || !isScreensaverEnabled) {
      counter = 0
      return
    }

    if (counter >= inactivityTime * SECONDS) {
      // time boundary reached
      counter = 0

      yield call(navigation.navigate, AppScreens.SCREEN_SAVER)
    }
  })

  yield fork(
    resetIdleInterval,
    idleInterval,
    (action: any) => !action.backgroundTask,
    () => {
      counter = 0
    }
  )
}

export function* hideScreenSaver() {
  const route = navigation.getCurrentRoute()
  if (route && route.routeName === AppScreens.SCREEN_SAVER) {
    yield call(resetIfNotAtHome)
  }
}

export const appSagas = [
  call(initApp),
  fork(idleWacher, idleTime, 2000),
  fork(watchInactivity, 2000),
  fork(watchScreenSaverData, 10000),
  takeLatest(KIOSK.LOAD_SCREEN_SAVER_DATA.REQUEST, loadScreenSaverData),
  takeLatest(APP.GO_INITIAL_SCREEN.REQUEST, goToInitialScreen),
  takeLatest(APP.GO_INITIAL_SCREEN.REQUEST, setDefaultLanguage),
  takeLatest(APP.OFFLINE.REQUEST, goOffline),
  takeLatest(APP.ONLINE.REQUEST, goOnline),
  takeLatest(KIOSK.SETTINGS.SUCCESS, watchSettingsChange),
  takeLatest(KIOSK.QUEUE_DATA.SUCCESS, watchStoreOpen),
  takeLatest(SCREEN_SAVER.RESET, hideScreenSaver),
  takeLatest(APP.PHONE_STATE_PERMISSION.REQUEST, setImei),
  fork(watchConnectionStatus),
  fork(watchForSecretTap),
]
