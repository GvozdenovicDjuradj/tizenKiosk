import { KIOSK, OTHER_ACTION, VALIDATION_STATE_CHANGE } from "../../src/actions/types"
import reducer, { initialState } from "../../src/reducers/screenValidation"
import { AppScreens } from "../../src/interfaces"

describe("screen validation reducer tests", () => {

  it("should set empty object as initial state", () => {
    expect(reducer({}, { type: OTHER_ACTION })).not.toBe(initialState)
  })

  it("should set initial state", () => {
    expect(reducer(initialState, { type: OTHER_ACTION })).toEqual(initialState)
  })

  it("should set email error", () => {
    const payload = {
      [AppScreens.CUSTOMER_DETAILS]: {
        email: { error: [ "test" ], valid: false }
      }
    }
    expect(reducer(initialState, {
      type: VALIDATION_STATE_CHANGE,
      payload
    })).toEqual({
      ...initialState,
      [AppScreens.CUSTOMER_DETAILS]: {
        ...initialState[AppScreens.CUSTOMER_DETAILS],
        ...payload[AppScreens.CUSTOMER_DETAILS]
      }
    })
  })

  it("should clear errors for Check-in screen", () => {
    expect(reducer({
      ...initialState,
      [AppScreens.CHECK_IN]: {
        email: { error: [ "test error" ], valid: false },
        orderNumber: { error: [ "test" ], valid: false },
      }
    }, {
      type: VALIDATION_STATE_CHANGE,
      payload: { [AppScreens.CHECK_IN]: initialState[AppScreens.CHECK_IN] }
    })).toEqual(initialState)
  })

  it("should add new screen validation state", () => {
    const payload = {
      [AppScreens.SERVICE_SELECTION]: {
        test: { error: [ ], valid: true },
        test2: { error: [ "test error" ], valid: false },
      }
    }
    expect(reducer(initialState, {
      type: VALIDATION_STATE_CHANGE,
      payload
    })).toEqual({ ...initialState, ...payload })
  })

  it("should reset customer screen validation state", () => {
    const customerScreen = {
      [AppScreens.CUSTOMER_DETAILS]: {
        name: { error: [], valid: true },
        email: { error: [ "test" ], valid: false },
        mobileNumber: { error: [ "test" ], valid: false },
        orderNumber: { error: [ "test" ], valid: true },
      }
    }
    expect(reducer(
      { ...initialState, ...customerScreen },
      { type: KIOSK.CUSTOMER.ADD_TO_QUEUE.RESET }
    )).toEqual(initialState)
  })

  it("should reset check-in screen validation state", () => {
    const checkInScreen = {
      [AppScreens.CHECK_IN]: {
        email: { error: [ "test" ], valid: false },
        mobileNumber: { error: [ "test" ], valid: false },
        orderNumber: { error: [ "test" ], valid: true },
      }
    }
    expect(reducer(
      { ...initialState, ...checkInScreen },
      { type: KIOSK.CHECK_IN.RESET }
    )).toEqual(initialState)
  })

  it("should reset event check-in screen validation state", () => {
    const checkInScreen = {
      [AppScreens.EVENT_CHECK_IN]: {
        email: { error: [ "test" ], valid: false },
        orderNumber: { error: [ "test" ], valid: true },
      }
    }
    expect(reducer(
      { ...initialState, ...checkInScreen },
      { type: KIOSK.EVENT_CHECK_IN.RESET }
    )).toEqual(initialState)
  })

})
