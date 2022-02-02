import qs from "qs"
import { AppState, Keyboard, Platform } from "react-native"
import { SagaIterator, delay, eventChannel } from "redux-saga"
import { call, fork, put, race, select, take, takeLatest, spawn } from "redux-saga/effects"
import DeviceInfo from "react-native-device-info"
import {
  changeLanguage,
  printTicket,
  setCustomerCountry,
  setVenueCountry,
  showError,
  loadPrivacyPolicyDataSuccess,
  loadPrivacyPolicyDataRequest,
  addPrivateCustomerToQueueFail,
  addPrivateCustomerToQueueError,
  addPrivateCustomerToQueueSuccess,
  goToQueueFullOrNAScreen,
  goToQueueConfirmationScreen,
  goToCheckInConfirmationScreen,
  goToEventCheckInConfirmationScreen,
  addCustomerToQueueSuccess,
  addCustomerToQueueReset,
  setKioskId,
  setKioskSerial,
  setKioskUrl,
  loadScreenSaverData,
  goToInitialScreen,
} from "../actions"
import { APP,
   KIOSK,
   QUESTIONS,
   ADD_CUSTOMER_TO_QUEUE_START,
   ADD_CUSTOMER_TO_QUEUE_STOP,
} from "../actions/types"
import {
  AlertErrorPayload,
  ApplicationState,
  KioskFields,
  KioskSettings,
  RootState,
  StringPayload,
  KioskCustomer,
  AddPrivateCustomerToQueueRequest,
  CustomerInQueue
} from "../interfaces"
import { AlertError, selectors, getLocaleString } from "../utils"
import callApi, { HTTPMethod } from "./api"
import {
  RELOAD_QUEUE_DATA_AFTER,
  REQUEST_TIMEOUT,
  SLOW_NETWORK,
  TRY_AGAIN,
} from "./index"
import * as printingConstants from "../constants/printing"
import { setImei } from "./app"
import { GET_KIOSK_ID_AND_DOMAIN_FROM_URL } from "../constants/kiosk"
import { persistor } from "../store"
import { getKioskIdAndDomainFromWindow } from "../utils/url"
import { loadKioskSettings as loadKioskSettingsActionCreator } from "../actions/kiosk"

function* goToConfirmationScreen(customerInQueue: CustomerInQueue) {
  yield put(goToQueueConfirmationScreen())

  if (customerInQueue) {
    yield put(printTicket(customerInQueue as any))
  }

  yield race({
    timeout: delay(REQUEST_TIMEOUT),
    action: take(APP.GO_INITIAL_SCREEN.REQUEST)
  }) as any // https://jira.qudini.com/browse/QSERVER-9639
  yield put({ type: KIOSK.SETTINGS.REQUEST })
}

export function* registerKiosk(action: any): SagaIterator { // NOSONAR
  try {
    let kioskFields: KioskFields | undefined
    if (action.fields) {
      kioskFields = action.fields
    } else {
      kioskFields = yield select(selectors.getKioskFieldsSelector)
    }

    if (!kioskFields) {
      return
    }

    const {
      hasPrinter,
      kioskIdentifier,
      printerUrl,
      url
    } = kioskFields
    const serial = yield select(selectors.serialSelector)
    if (!url || !kioskIdentifier) {
      throw new Error("Registration URL or Kiosk ID is missing")
    }
    yield call(setImei)
    const imei = yield select(selectors.getImei)
    const getMakeAndModel = (): string => {
      const brand = DeviceInfo.getBrand()
      const model = DeviceInfo.getModel() || DeviceInfo.getDeviceId()
      // Override undefined model name by deviceId as getModel might be unreliable in some instances
      // see https://github.com/react-native-community/react-native-device-info#getmodel
      return `${brand} ${model}`
    }
    const getOperatingSystem = (): string => {
      const operatingSystem = Platform.OS
      const operatingSystemVersion = DeviceInfo.getSystemVersion()
      switch (operatingSystem) {
        case "android":
          return `Android ${operatingSystemVersion} (API level ${DeviceInfo.getAPILevel()})`
        case "ios":
          return `iOS ${operatingSystemVersion}`
        default:
          return operatingSystem
      }
    }
    const data = {
      hasPrinter,
      kioskIdentifier,
      makeAndModel: getMakeAndModel(),
      operatingSystem: getOperatingSystem(),
      printerUrl: hasPrinter ? printerUrl : undefined,
      serial,
      url,
      imei
    }
    const method = HTTPMethod.POST
    const result = yield race({
      response: call(callApi, `${url}/api/kiosk/assign`, { data, method }),
      timeout: delay(REQUEST_TIMEOUT),
    }) as any // https://jira.qudini.com/browse/QSERVER-9639

    if (!result) {
      return
    }

    const { response, timeout } = result as any

    if (timeout) {
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }

    if (response.data.status !== "ok") {
      throw new Error(response.data.status)
    }

    yield put({
      payload: response.data,
      type: KIOSK.REGISTER.SUCCESS,
    })
  } catch (e) {
    let payload
    let errorMessage
    if (e instanceof AlertError) {
      const { message, title } = e
      payload = { message, title }
      errorMessage = message
    } else {
      errorMessage = (e.message || e)
      payload = action.suppressErrorMessage ? "" : errorMessage
    }
    yield put({
      payload,
      type: KIOSK.REGISTER.FAILURE,
      errorMessage
    })
  }
}

export function* loadKioskSettings(): SagaIterator {
  try {
    const { url = "" } = (yield select(selectors.getKioskFieldsSelector)) as any
    const kioskId = (yield select(selectors.kioskIdSelector)) as any
    const serial = (yield select(selectors.serialSelector)) as any
    const { response, timeout } = (yield race({
      response: call(callApi, `${url}/api/kiosk/settings/${kioskId}?serial=${serial}`),
      timeout: delay(REQUEST_TIMEOUT),
    }) as any) as any // https://jira.qudini.com/browse/QSERVER-9639
    if (timeout) {
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }
    if (response.data.error) {
      throw new Error(response.data.error.description)
    }
    yield put({
      payload: response.data,
      type: KIOSK.SETTINGS.SUCCESS,
    })
    const { venue } = response.data as KioskSettings
    const countryCode = venue.defaultCountryCode.toUpperCase()
    yield put(setVenueCountry(countryCode))
    yield put(setCustomerCountry(countryCode))
    yield put(loadPrivacyPolicyDataRequest())
  } catch (e) {
    let payload
    if (e instanceof AlertError) {
      const { message, title } = e
      payload = { title, message }
    } else {
      payload = e.message
    }
    yield put({
      payload,
      type: KIOSK.SETTINGS.FAILURE,
    })
  }
}

export function appStateEventChannel() {
  return eventChannel((emitter) => {
    const handler = (appState: string) => {
      emitter(appState)
    }
    AppState.addEventListener("change", handler)
    return () => AppState.removeEventListener("change", handler)
  })
}

function keyboardStateEventChannel() {
  return eventChannel((emitter) => {
    const keyboardShowHandler = () => {
      emitter({
        type: APP.KEYBOARD_STATE_CHANGE,
        payload: true
      })
    }
    const keyboardHideHandler = () => {
      emitter({
        type: APP.KEYBOARD_STATE_CHANGE,
        payload: false
      })
    }
    Keyboard.addListener("keyboardDidShow", keyboardShowHandler)
    Keyboard.addListener("keyboardDidHide", keyboardHideHandler)
    return () => {
      Keyboard.removeListener("keyboardDidShow", keyboardShowHandler)
      Keyboard.removeListener("keyboardDidHide", keyboardHideHandler)
    }
  })
}

function* watchKeyboardStateChange() {
  const keyboardChannel = yield call(keyboardStateEventChannel)
  while (true) {
    const action = yield take(keyboardChannel)
    yield put(action)
  }
}

export function* watchAppState(): SagaIterator {
  const appStateChannel = yield call(appStateEventChannel)
  while (true) {
    const state: ApplicationState = (yield take(appStateChannel)) as any
    const kioskId = yield select(selectors.kioskIdSelector)
    if (state === ApplicationState.active && kioskId) {
      yield put({ type: KIOSK.SETTINGS.REQUEST })
    }
  }
}

export function* setDefaultLanguage() {
  const languages = yield select((state: RootState) => (
    state.kiosk.settings && state.kiosk.settings.template.languages
  ))
  if (languages && languages.mainLanguage) {
    yield put(changeLanguage(languages.mainLanguage))
  }
}

export function* loadPrivacyPolicyData(action: any) {
  const merchantId = yield select(selectors.getMerchantId)
  if (!merchantId) {
    return
  }
  try {
    const { url } = yield select(selectors.getKioskFieldsSelector)
    const { response, timeout } = yield race({
      response: call(callApi, `${url}/api/v3/merchants/${merchantId}/privacy-policy`),
      timeout: delay(REQUEST_TIMEOUT)
    }) as any // https://jira.qudini.com/browse/QSERVER-9639
    if (timeout) {
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }
    yield put(loadPrivacyPolicyDataSuccess(response.data, action.backgroundTask))

  } catch (e) {
    let payload
    if (e instanceof AlertError) {
      const { message, title } = e
      payload = { title, message }
    } else {
      payload = e.message
    }
    yield put({
      payload,
      backgroundTask: action.backgroundTask,
      type: KIOSK.LOAD_PRIVACY_POLICY_DATA.FAILURE
    })
  }
}

export function* loadKioskQueueData(action: any): SagaIterator {
  try {
    const { url } = (yield select(selectors.getKioskFieldsSelector)) as any
    const kioskId = (yield select(selectors.kioskIdSelector)) as any
    const serial = (yield select(selectors.serialSelector)) as any
    const { response, timeout } = (yield race({
      response: call(callApi, `${url}/api/kiosk/data/${kioskId}?serial=${serial}`),
      timeout: delay(REQUEST_TIMEOUT)
    }) as any) as any // https://jira.qudini.com/browse/QSERVER-9639
    if (timeout) {
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }
    yield put({
      payload: response.data,
      backgroundTask: action.backgroundTask,
      type: KIOSK.QUEUE_DATA.SUCCESS
    })
  } catch (e) {
    let payload
    if (e instanceof AlertError) {
      const { message, title } = e
      payload = { title, message }
    } else {
      payload = e.message
    }
    yield put({
      payload,
      backgroundTask: action.backgroundTask,
      type: KIOSK.QUEUE_DATA.FAILURE
    })
  }
}

export function* updateQueueData(): SagaIterator {
  while (true) {
    if (yield select(selectors.kioskIdSelector)) {
      // If keyboard is open - wait for keyboard to be closed
      while (yield select(selectors.isKeyboardDisplayed)) {
        yield call(delay, 250)
      }
      yield put({ type: KIOSK.QUEUE_DATA.REQUEST, backgroundTask: true })
    }
    yield call(delay, RELOAD_QUEUE_DATA_AFTER)
  }
}

const getIsThereNoCustomerData = (kioskCustomer: KioskCustomer) =>
  !kioskCustomer.email &&
  !kioskCustomer.mobileNumber &&
  !kioskCustomer.name &&
  !kioskCustomer.orderNumber &&
  !kioskCustomer.notes &&
  !kioskCustomer.groupSize;

interface AddCustomerToQueueCallData extends KioskCustomer {
  countryCode?: string;
  languageIsoCode?: string;
  productId?: number;
  queueId?: number;
  venueKioskId?: number;
  venueKioskSerial: string;
}

interface AddPrivateCustomerToQueueCallData {
  venueKioskSerial?: string
  productId?: number
  queueId?: number
  venueKioskId?: number
}

const getAddPrivateCustomerToQueueCall = (url: string, data: AddPrivateCustomerToQueueCallData) => call(
  callApi,
  `${url}/api/kiosk/add-private-customer-to-queue`,
  { data, method: HTTPMethod.POST }
)

const getAddCustomerToQueueCall = (url: string, data: AddCustomerToQueueCallData) => call(
  callApi,
  `${url}/api/kiosk/add-customer-to-queue`,
  { data, method: HTTPMethod.POST }
)

interface ErrorPayload {
  title: string;
  message: string;
}

const getActionPayloadForError = (e: Error | AlertError): ErrorPayload | string => {
  if (e instanceof AlertError) {
    return {
      title: e.title,
      message: e.message
    }
  }

  return e.message
}

export const addPlusSymbolToCallingCodeIfMissing = (callingCode?: string): string | undefined =>
    !callingCode || callingCode.includes("+") ? callingCode : `+${callingCode}`

export function* addPrivateCustomerToQueue(action: AddPrivateCustomerToQueueRequest): SagaIterator {
  try {
    const state: RootState = (yield select((s: RootState) => s)) as any
    const { url } = (yield select(selectors.getKioskFieldsSelector)) as any
    const { settings, serial } = state.kiosk
    const venueKioskId = settings && settings.id
    const { productId, queueId } = action
    const data: AddPrivateCustomerToQueueCallData = {
      productId,
      queueId,
      venueKioskSerial: serial,
      venueKioskId
    }
    const { response, timeout } = (yield race({
      response: getAddPrivateCustomerToQueueCall(url, data),
      timeout: delay(REQUEST_TIMEOUT)
    }) as any) as any // https://jira.qudini.com/browse/QSERVER-9639
    if (timeout) {
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }
    if (response.data.error) {
      const error = response.data.error.description
      if (error) {
        yield put(addPrivateCustomerToQueueFail())
        return yield put(goToQueueFullOrNAScreen())
      }
      throw new Error(error)
    }
    const { customerInQueue } = response.data.success

    yield put(addPrivateCustomerToQueueSuccess(customerInQueue))
    yield call(goToConfirmationScreen, customerInQueue)
  } catch (e) {
    let payload
    if (e instanceof AlertError) {
      const { message, title } = e
      payload = { title, message }
    } else {
      payload = e.message
    }
    yield put(addPrivateCustomerToQueueError(payload))
    return yield put(goToQueueFullOrNAScreen())
  }
}

/*
  I've disabled sonar from analysing the below saga due to its
  complexity, it really requires a refactor which will be
  conducted during the re-implementation of this product.
 */
export function* addCustomerToQueue(): SagaIterator { // NOSONAR
  const state: RootState = (yield select((s: RootState) => s)) as any
  const { kiosk, questions } = state;

  if (kiosk.isAddingCustomerToQueue) {
    console.warn('User tried to request more than once. Ignore until request is complete');
    return;
  }
  const { url } = kiosk.fields
  const {
    customer: customerFields,
    language,
    product,
    serial: venueKioskSerial,
    settings,
    subProduct,
  } = state.kiosk
  let productToSubmit = product && product.id ? product : subProduct

  if (!productToSubmit && settings?.products.length === 1) {
    productToSubmit = settings?.products[0]
  }

  if (!productToSubmit) {
    throw new Error("No product selected")
  }
  const venueKioskId = settings && settings.id
  const { queueId, id: productId } = productToSubmit
  const { callingCode, email, mobileNumber, notes, ...otherFields } = customerFields
  const noCustomerData = getIsThereNoCustomerData(customerFields)
  try {
    const customer = {
      ...otherFields,
      mobileNumber: mobileNumber ? mobileNumber.trim() : "",
      emailAddress: email,
      notes: noCustomerData ? settings && settings.description : notes
    }
    const { countryIsoCode: countryCode, languageIsoCode } = language || {
      countryIsoCode: undefined, languageIsoCode: undefined
    }

    const data: AddCustomerToQueueCallData = {
      countryCode,
      languageIsoCode,
      productId,
      queueId,
      venueKioskId,
      venueKioskSerial,
      ...customer,
    }

    yield put({ type: ADD_CUSTOMER_TO_QUEUE_START });

    const { response, timeout } = (yield race({
      response: getAddCustomerToQueueCall(url, data),
      timeout: delay(REQUEST_TIMEOUT),
    }) as any) as any // https://jira.qudini.com/browse/QSERVER-9639

    if (timeout) {
      yield put({ type: ADD_CUSTOMER_TO_QUEUE_STOP });
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }

    if (response.data.error) {
      const error = response.data.error.description
      if (error) {
        yield put(addCustomerToQueueReset())
        return yield put(goToQueueFullOrNAScreen())
      }
      throw new Error(error)
    }

    const { customerInQueue } = response.data.success;
    yield put(addCustomerToQueueSuccess(customerInQueue))
    yield call(goToConfirmationScreen, customerInQueue);

    if (questions.questions.length) {
      yield put({
        type: QUESTIONS.POST_ANSWERS.REQUEST,
        payload: response.data.success
      })
      yield race({
        success: take(QUESTIONS.POST_ANSWERS.SUCCESS),
        fail: take(QUESTIONS.POST_ANSWERS.FAILURE)
      })
    }
  } catch (e) {
    yield put({ type: ADD_CUSTOMER_TO_QUEUE_STOP });
    yield put(addCustomerToQueueReset())
    return yield put(goToQueueFullOrNAScreen())
  }
}

export function* checkInCustomer(): SagaIterator {
  const { url } = (yield select(selectors.getKioskFieldsSelector)) as any
  const id = yield select((state: RootState) => state.kiosk.settings && state.kiosk.settings.id)
  const serial = yield select(selectors.serialSelector)
  const {
    email,
    mobileNumber,
    orderNumber,
  } = (yield select((state: RootState) => state.checkIn)) as any
  try {
    if (!email && !mobileNumber && !orderNumber) {
      throw new Error(getLocaleString("welcomeScreen.error.customer.emptyDetails") || "Either email, mobile number or reference number must be provided")
    }
    const data = qs.stringify({
      bookingIdentifier: orderNumber,
      mobileNumber: mobileNumber ? mobileNumber.trim() : "",
      email,
      venueKioskId: id,
      venueKioskSerial: serial,
    })
    const { response, timeout } = (yield race({
      response: call(
        callApi,
        `${url}/api/kiosk/booking/arrived`, {
          data,
          headers: { "content-type": "application/x-www-form-urlencoded" },
          method: HTTPMethod.POST,
        }
      ),
      timeout: delay(REQUEST_TIMEOUT)
    }) as any) as any // https://jira.qudini.com/browse/QSERVER-9639
    if (timeout) {
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }
    let error
    if (response.data.error && response.data.error.description) {
      error = response.data.error.description
    }
    if (response.data.status) {
      error = response.data.status
    }
    if (error) {
      throw new Error(error)
    }
    yield put({
      type: KIOSK.CHECK_IN.SUCCESS,
      payload: response.data,
    })
    yield put(goToCheckInConfirmationScreen())
  } catch (e) {
    let payload
    if (e instanceof AlertError) {
      const { title, message } = e
      payload = { title, message }
    } else {
      const { message, response } = e
      payload = message
      if (response && response.data.status && response.data.statusDescription) {
        payload = `${response.data.status}\n${response.data.statusDescription}`
      }
    }
    yield put({
      type: KIOSK.CHECK_IN.FAILURE,
      payload,
    })
  }
}

export function* eventCheckIn() {
  const { url } = yield select(selectors.getKioskFieldsSelector)
  const kioskId = yield select(selectors.kioskIdSelector)
  const serial = yield select(selectors.serialSelector)
  const { bookingRef, email } = yield select((state: RootState) => state.eventCheckIn)
  try {
    if (!email && !bookingRef) {
      throw new Error(getLocaleString("welcomeScreen.error.customer.emptyDetails") || "Either email or booking reference number must be provided")
    }
    const { response, timeout } = yield race({
      response: call(
        callApi,
        [
          `${url}`,
          `/api/kiosks/`,
          `${kioskId}`,
          `/event-attended`,
          `?serial=${serial}`,
          email ? `&eventEmail=${email}` : undefined,
          bookingRef ? `&eventIdentifier=${bookingRef}` : undefined,
        ].join(""),
        { method: HTTPMethod.POST }
      ),
      timeout: delay(REQUEST_TIMEOUT)
    })
    if (timeout) {
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }
    if (response.data.error) {
      throw new Error(response.data.error.description)
    }
    yield put({
      type: KIOSK.EVENT_CHECK_IN.SUCCESS,
      payload: response.data,
    })
    yield put(goToEventCheckInConfirmationScreen())
  } catch (e) {
    let payload
    if (e instanceof AlertError) {
      const { title, message } = e
      payload = { title, message }
    } else {
      const { message, response } = e
      payload = message
      if (response && (response.status === 400 || response.status === 404)) {
        payload = "Event booking not recognised"
      }
    }
    yield put({
      type: KIOSK.EVENT_CHECK_IN.FAILURE,
      payload,
    })
  }
}

export function* deactivateKiosk() {
  const { url } = yield select(selectors.getKioskFieldsSelector)
  const kioskId = yield select(selectors.kioskIdSelector)
  const serial = yield select(selectors.serialSelector)
  try {
    const { response, timeout } = yield race({
      response: call(
        callApi,
        `${url}/api/kiosk/deactivate?identifier=${kioskId}&serial=${serial}`,
        { method: HTTPMethod.POST }
      ),
      timeout: delay(REQUEST_TIMEOUT)
    })
    if (timeout) {
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }
    if (response.data.error) {
      throw new Error(response.data.error.description)
    }
    yield put({ type: APP.RESET.SUCCESS })
  } catch (e) {
    const payload = getActionPayloadForError(e)
    yield put({
      type: APP.RESET.FAILURE,
      payload,
    })
  }
}

export function* errorHandler(action: AlertErrorPayload | StringPayload) {
  const { payload } = action
  let message
  if (typeof payload === "string") {
    message = payload
  } else {
    message = `${payload.title}\n${payload.message}`
  }

  const messageSanitized = message.toLowerCase();
  if (messageSanitized.includes("booking not found")) {
    message =
      getLocaleString("welcomeScreen.error.booking.notFound") || message
  } else if (messageSanitized.includes("you cannot check in this booking yet")) {
    message =
      getLocaleString("welcomeScreen.error.booking.checkInNotYet") || message
  } else if (message.includes("422")) {
    message =
      getLocaleString("welcomeScreen.error.customer.invalidDetails") ||
      "Invalid details. Please check your customer details"
  }

  yield put(showError(message))
}

export function* getKioskIdAndDomainFromUrl() {
    const { kioskId, domain } = getKioskIdAndDomainFromWindow()

    if (kioskId) {
        persistor.purge()
        persistor.flush()

        yield put(setKioskId(kioskId))
        yield put(setKioskSerial("web"))
        yield put(setKioskUrl(domain))
        yield put(loadKioskSettingsActionCreator())
        yield put(loadScreenSaverData())
        yield put(goToInitialScreen())
    }
}

const kioskFailure = [
  KIOSK.CHECK_IN.FAILURE,
  KIOSK.CUSTOMER.ADD_TO_QUEUE.FAILURE,
  KIOSK.EVENT_CHECK_IN.FAILURE,
  KIOSK.QUEUE_DATA.FAILURE,
  KIOSK.REGISTER.FAILURE,
  KIOSK.SETTINGS.FAILURE,
  QUESTIONS.FAILURE,
  QUESTIONS.POST_ANSWERS.FAILURE,
  printingConstants.PRINT_TICKET_REJECTED,
]

export const kioskSagas = [
  takeLatest(KIOSK.CHECK_IN.REQUEST, checkInCustomer),
  takeLatest(KIOSK.CUSTOMER.ADD_TO_QUEUE.REQUEST, addCustomerToQueue),
  takeLatest([KIOSK.QUEUE_DATA.REQUEST, KIOSK.REGISTER.SUCCESS, KIOSK.CUSTOMER.ADD_TO_QUEUE.SUCCESS], loadKioskQueueData),
  takeLatest(KIOSK.REGISTER.REQUEST, registerKiosk),
  takeLatest([KIOSK.SETTINGS.REQUEST, KIOSK.REGISTER.SUCCESS], loadKioskSettings),
  takeLatest(KIOSK.LOAD_PRIVACY_POLICY_DATA.REQUEST, loadPrivacyPolicyData),
  takeLatest(KIOSK.ADD_PRIVATE_CUSTOMER_TO_QUEUE.REQUEST, addPrivateCustomerToQueue),
  takeLatest(KIOSK.EVENT_CHECK_IN.REQUEST, eventCheckIn),
  takeLatest(APP.RESET.REQUEST, deactivateKiosk),
  takeLatest(kioskFailure, errorHandler),
  takeLatest(GET_KIOSK_ID_AND_DOMAIN_FROM_URL, getKioskIdAndDomainFromUrl),
  fork(updateQueueData),
  spawn(watchKeyboardStateChange),
  spawn(watchAppState)
]
