import { call, put, race, select, take } from "redux-saga/effects"
import { SagaIterator } from "redux-saga"
import {
  AppScreens,
  KioskSettings,
  KioskTemplate,
  Product,
  Question,
  REQUIRED,
  RootState,
} from "../interfaces"
import {
  RouteListenerResult,
  RouteTransitionParams,
  subscribeRouteListener,
  unsubscribeRouteListener,
} from "./navigation"
import { APP, KIOSK, QUESTIONS } from "../actions/types"
import { selectors } from "../utils"
import { addPrivateCustomerToQueueRequest } from "../actions"

export function* skipWelcomeScreen(params: RouteTransitionParams, bypass: RouteListenerResult)
  : SagaIterator | RouteListenerResult {
  const kioskId = yield select((state: RootState) => state.kiosk.kioskId)
  let result = bypass
  if (kioskId && params.next === AppScreens.HOME) {
    const settings: KioskSettings = (yield select((state: RootState) => state.kiosk.settings)) as any
    if (settings && settings.template) {
      if (settings.template.welcomeScreenIsRemove) {
        result = { routeName: AppScreens.SERVICE_SELECTION }
      }
    }
  }
  return result
}

export function* skipPrivacyPolicyScreen(params: RouteTransitionParams, bypass: RouteListenerResult)
: SagaIterator | RouteListenerResult {
  if (params.next !== AppScreens.PRIVACY_POLICY) {
    return bypass
  }

  const isWalkInEnabled = yield select(selectors.walkInEnabledSelector)

  if (!isWalkInEnabled) {
    return {
      routeName: AppScreens.SERVICE_SELECTION
    } as RouteListenerResult
  }

  return bypass
}

/**
 * Service selection screen useful when we have more than one product
 * but if we have only one, we must select it automatically for customer
 * since there is no other options
 */
export function* skipServiceSelection(params: RouteTransitionParams, bypass: RouteListenerResult)
  : SagaIterator | RouteListenerResult {

  if (params.next !== AppScreens.SERVICE_SELECTION) {
    return bypass
  }

  const products: Product[] = (yield select((state: RootState) => {
    return state.kiosk.settings ? state.kiosk.settings.products : []
  })) as any
  if (products.length !== 1) {
    return bypass
  }

  if (params.current === AppScreens.PRIVACY_POLICY && products.length === 1) {
    yield put({
      type: KIOSK.SET_PRODUCT.REQUEST,
      payload: products[0]
    })
    return {
      routeName: AppScreens.CUSTOMER_DETAILS,
      post: function* refreshQuestions() {
        yield put({
          type: KIOSK.SET_PRODUCT.REQUEST,
          payload: products[0]
        })
        yield put({ type: QUESTIONS.REQUEST })
      }
    } as RouteListenerResult
  }

  return {
    routeName: AppScreens.CUSTOMER_DETAILS,
    pre: function* pre() {
      yield put({
        type: KIOSK.SET_PRODUCT.REQUEST,
        payload: products[0]
      })
      yield put({ type: QUESTIONS.REQUEST })
    }
  } as RouteListenerResult
}

/**
 * If 'Customer Name Field' is set to Not Required AND
 * 'Customer Email' is set to Not Required AND
 * 'Show Mobile' is set to Never AND
 * 'Request Order Number' is set to Never, then
 * does the Enter Details page get skipped and the customer proceeds
 * to the confirmation page and an anonymous customer gets added to the queue?
 */
export function* skipCustomerDetails(params: RouteTransitionParams, bypass: RouteListenerResult)
  : SagaIterator | RouteListenerResult {
  if (params.next !== AppScreens.CUSTOMER_DETAILS) {
    return bypass
  }

  const hasAgreed = yield select(selectors.hasAgreedToPrivacyPolicy)
  const shouldDisplayPrivacyPolicyPopup = yield select(selectors.isPrivacyPolicyPopup)

  const underCapacity: boolean = (yield select(
    selectors.getUnderCapacityFromQueueByProduct
  )) as any;

  if (underCapacity) {
    return {
      routeName: AppScreens.QUEUE_UNDER_OCCUPANCY
    }
  }

  if (!hasAgreed && shouldDisplayPrivacyPolicyPopup) {
    const productId = yield select(selectors.getProductId)
    const queueId = yield select(selectors.getQueueId)

    yield put(addPrivateCustomerToQueueRequest(queueId, productId))
    return {
      routeName: AppScreens.QUEUE_CONFIRMATION,
    } as RouteListenerResult
  }

  const template: KioskTemplate = (yield select((state: RootState) =>
    state.kiosk.settings && state.kiosk.settings.template
  )) as any

  if (!template) {
    return bypass
  }

  const {
    products,
    isFetching
  }: {
      products: Product[],
      isFetching: boolean
    } = (yield select((state: RootState) => ({
      products: state.kiosk.settings ? state.kiosk.settings.products : [],
      isFetching: state.questions.isFetching
    }))) as any
  const {
    customerScreenGroupSize,
    customerScreenEmail,
    customerScreenNameField,
    customerScreenRequestOrderNumber,
    customerScreenNotes
  } = template

  const showMobileNumber: boolean = (yield select(selectors.showMobileNumber)) as any

  const skipScreen = (
    !showMobileNumber &&
    customerScreenNameField === REQUIRED.NOT_REQUIRED &&
    customerScreenEmail === REQUIRED.NOT_REQUIRED &&
    customerScreenGroupSize === REQUIRED.NEVER &&
    customerScreenRequestOrderNumber === REQUIRED.NEVER &&
    customerScreenNotes === REQUIRED.NEVER
  )

  if (!skipScreen) {
    return bypass
  }

  if (isFetching) {
    yield race({
      success: take(QUESTIONS.SUCCESS),
      fail: take(QUESTIONS.FAILURE)
    })
  }
  const questions: Question[] = (yield select((state: RootState) => state.questions.questions)) as any
  if (questions.length) {
    return {
      routeName: AppScreens.QUESTIONS
    }
  } else {
    const routeName = products.length === 1 ? AppScreens.HOME : params.current
    return {
      routeName,
      post: function* postMessage() {
        yield put({ type: KIOSK.CUSTOMER.ADD_TO_QUEUE.REQUEST })
      }
    }
  }
}

export function* skipQuestionsScreen(params: RouteTransitionParams, bypass: RouteListenerResult)
  : SagaIterator | RouteListenerResult {
  if (params.next !== AppScreens.QUESTIONS) {
    return bypass
  }

  const hasAgreed = yield select(selectors.hasAgreedToPrivacyPolicy)
  const shouldDisplayPrivacyPolicyPopup = yield select(selectors.isPrivacyPolicyPopup)

  if (!hasAgreed && shouldDisplayPrivacyPolicyPopup) {
    return {
      routeName: AppScreens.QUEUE_CONFIRMATION,
    } as RouteListenerResult
  }

  return bypass
}

const postChangeIdleTime = (time: number) => function*() {
  yield put({ type: APP.SET_IDLE_INTERVAL.REQUEST, time, backgroundTask: true })
}

export function* changeIdleTime(params: RouteTransitionParams, bypass: RouteListenerResult)
  : SagaIterator | RouteListenerResult {
  const finalPages = [AppScreens.QUEUE_CONFIRMATION, AppScreens.CHECK_IN_CONFIRMATION]
  if (finalPages.indexOf(params.next) !== -1) {
    return {
      ...bypass,
      post: postChangeIdleTime(10)
    }
  }
  if (params.next === AppScreens.QUEUE_FULL_OR_NA) {
    return {
      ...bypass,
      post: postChangeIdleTime(60)
    }
  }
  return bypass
}

export function* setupScreenFlow(): SagaIterator {
  yield call(subscribeRouteListener, skipWelcomeScreen)
  yield call(subscribeRouteListener, skipPrivacyPolicyScreen)
  yield call(subscribeRouteListener, skipServiceSelection)
  yield call(subscribeRouteListener, skipCustomerDetails)
  yield call(subscribeRouteListener, skipQuestionsScreen)
  yield call(subscribeRouteListener, changeIdleTime)
}

export function* removeScreenFlow(): SagaIterator {
  yield call(unsubscribeRouteListener, skipWelcomeScreen)
  yield call(unsubscribeRouteListener, skipPrivacyPolicyScreen)
  yield call(unsubscribeRouteListener, skipServiceSelection)
  yield call(unsubscribeRouteListener, skipCustomerDetails)
  yield call(unsubscribeRouteListener, skipQuestionsScreen)
  yield call(unsubscribeRouteListener, changeIdleTime)
}
