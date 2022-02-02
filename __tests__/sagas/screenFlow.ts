import { runSaga, SagaIterator } from "redux-saga"
import { put } from "redux-saga/effects"
import {
  skipWelcomeScreen,
  skipServiceSelection,
  skipCustomerDetails,
} from "../../src/sagas/screenFlow"
import {
  NavMethod,
  RouteListenerResult,
  RouteTransitionParams,
} from "../../src/sagas/navigation"
import { AppScreens, REQUIRED } from "../../src/interfaces"
import { KIOSK, QUESTIONS } from "../../src/actions/types"
import { createState } from "../fixtures"

type ScreenFlowSaga = (params: RouteTransitionParams, bypass: RouteListenerResult) => SagaIterator

describe("Kiosk screen flow sagas tests", () => {

  const state = createState()

  it("should skip welcome screen", () => {

    const mockState = { ...state }
    mockState.kiosk.settings!.template.welcomeScreenIsRemove = true

    const params: RouteTransitionParams = {
      current: AppScreens.HOME,
      method: NavMethod.NAVIGATE,
      next: AppScreens.HOME,
    }
    const bypass: RouteListenerResult = {
      routeName: AppScreens.SERVICE_SELECTION
    }

    const saga = runSaga({
      getState: () => mockState
    }, skipWelcomeScreen as ScreenFlowSaga, params, bypass)

    saga.done.then((result) => {
      expect(result).toEqual({ routeName: AppScreens.SERVICE_SELECTION })
    })

  })

  it("should NOT skip welcome screen", () => {

    const params: RouteTransitionParams = {
      current: AppScreens.HOME,
      method: NavMethod.NAVIGATE,
      next: AppScreens.HOME,
    }

    const bypass: RouteListenerResult = {
      routeName: AppScreens.SERVICE_SELECTION
    }

    const saga = runSaga({
      getState: () => state
    }, skipWelcomeScreen as ScreenFlowSaga, params, bypass)

    saga.done.then((result) => {
      expect(result).toEqual(bypass)
    })

  })

  it("should skip service selection screen if there is only one product", () => {

    const mockState = { ...state }
    const products = [{
      id: 0,
      name: "Test product",
      queueId: 0,
      queueName: "Test queue",
      waitTime: 1,
    }]
    mockState.kiosk.settings!.products = products

    const params: RouteTransitionParams = {
      current: AppScreens.HOME,
      method: NavMethod.NAVIGATE,
      next: AppScreens.SERVICE_SELECTION,
    }
    const bypass: RouteListenerResult = {
      routeName: AppScreens.SERVICE_SELECTION
    }

    const route: RouteListenerResult = {
      routeName: AppScreens.CUSTOMER_DETAILS,
      pre: function* pre() {
        yield put({
          type: KIOSK.SET_PRODUCT.REQUEST,
          payload: products[0]
        })
        yield put({ type: QUESTIONS.REQUEST })
      }
    }

    const saga = runSaga({
      getState: () => mockState
    }, skipServiceSelection as ScreenFlowSaga, params, bypass)

    saga.done.then((result) => {
      expect(result).toEqual(route)
    })

  })

  it("should not skip service selection screen", () => {

    const params: RouteTransitionParams = {
      current: AppScreens.HOME,
      method: NavMethod.NAVIGATE,
      next: AppScreens.SERVICE_SELECTION,
    }

    const bypass: RouteListenerResult = {
      routeName: AppScreens.SERVICE_SELECTION
    }

    const saga = runSaga({
      getState: () => state
    }, skipServiceSelection as ScreenFlowSaga, params, bypass)

    saga.done.then((result) => {
      expect(result).toEqual(bypass)
    })

  })

  it(`should skip customer details screen`, () => {
    // If 'Customer Name Field' is set to Not Required AND
    // 'Customer Email' is set to Not Required AND
    // 'Show Mobile' is set to Never AND
    // 'Request Order Number' is set to Never, then
    // does the Enter Details page get skipped and the customer proceeds
    // to the confirmation page and an anonymous customer gets added to the queue?

    const mockState = { ...state }
    mockState.kiosk.settings!.template = {
      ...mockState.kiosk.settings!.template,
      customerScreenGroupSize: REQUIRED.NOT_REQUIRED,
      customerScreenEmail: REQUIRED.NOT_REQUIRED,
      customerScreenNameField: REQUIRED.NOT_REQUIRED,
      customerScreenRequestMobileNumberWhen: REQUIRED.NEVER,
      customerScreenRequestOrderNumber: REQUIRED.NEVER,
    }

    const params: RouteTransitionParams = {
      current: AppScreens.HOME,
      method: NavMethod.NAVIGATE,
      next: AppScreens.CUSTOMER_DETAILS,
    }
    const bypass: RouteListenerResult = {
      routeName: AppScreens.CUSTOMER_DETAILS
    }

    const route: RouteListenerResult = {
      routeName: params.current,
      post: function* postMessage() {
        yield put({ type: KIOSK.CUSTOMER.ADD_TO_QUEUE.REQUEST })
      }
    }

    const saga = runSaga({
      getState: () => mockState
    }, skipCustomerDetails as ScreenFlowSaga, params, bypass)

    saga.done.then((result) => {
      expect(result).toEqual(route)
    })

  })

  it(`should not skip customer details screen`, () => {
    // If 'Customer Name Field' is set to Not Required AND
    // 'Customer Email' is set to Not Required AND
    // 'Show Mobile' is set to Never AND
    // 'Request Order Number' is set to Never, then
    // does the Enter Details page get skipped and the customer proceeds
    // to the confirmation page and an anonymous customer gets added to the queue?

    const mockState = { ...state }
    mockState.kiosk.settings!.template = {
      ...mockState.kiosk.settings!.template,
      customerScreenGroupSize: REQUIRED.NOT_REQUIRED,
      customerScreenEmail: REQUIRED.NOT_REQUIRED,
      customerScreenNameField: REQUIRED.ALWAYS,
      customerScreenRequestMobileNumberWhen: REQUIRED.NEVER,
      customerScreenRequestOrderNumber: REQUIRED.NEVER,
    }

    const params: RouteTransitionParams = {
      current: AppScreens.HOME,
      method: NavMethod.NAVIGATE,
      next: AppScreens.CUSTOMER_DETAILS,
    }
    const bypass: RouteListenerResult = {
      routeName: AppScreens.CUSTOMER_DETAILS
    }

    const saga = runSaga({
      getState: () => mockState
    }, skipCustomerDetails as ScreenFlowSaga, params, bypass)

    saga.done.then((result) => {
      expect(result).toEqual(bypass)
    })

  })

})
