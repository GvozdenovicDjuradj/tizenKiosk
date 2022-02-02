import { KIOSK, OTHER_ACTION } from "../../src/actions/types"
import checkInReducer, { initialState } from "../../src/reducers/checkIn"
import { CheckInData, CheckInState } from "../../src/interfaces"

describe("check-in reducer tests", () => {
  const data = { id: 0 } as CheckInData
  const email = "test@email.test"
  const error = "test error"
  const mobileNumber = "0800506800"
  const orderNumber = "123"

  it("should set empty object as initial state", () => {
    expect(checkInReducer({} as CheckInState, { type: OTHER_ACTION })).not.toBe(initialState)
  })

  it("should set initial state", () => {
    expect(checkInReducer(initialState, { type: OTHER_ACTION })).toEqual(initialState)
  })

  it("should set email", () => {
    expect(checkInReducer(initialState, {
      type: KIOSK.CHECK_IN.SET_EMAIL.REQUEST,
      payload: email
    })).toEqual({ ...initialState, email })
  })

  it("should set order number", () => {
    expect(checkInReducer(initialState, {
      type: KIOSK.CHECK_IN.SET_ORDER.REQUEST,
      payload: orderNumber
    })).toEqual({ ...initialState, orderNumber })
  })

  it("should set mobile number", () => {
    expect(checkInReducer(initialState, {
      type: KIOSK.CHECK_IN.SET_MOBILE.REQUEST,
      payload: mobileNumber
    })).toEqual({ ...initialState, mobileNumber })
  })

  it("should reset saved data and error", () => {
    expect(checkInReducer(
      { ...initialState, email, data, error },
      { type: KIOSK.CHECK_IN.REQUEST }
    )).toEqual({ ...initialState, email, isFetching: true })
  })

  it("should set error message", () => {
    expect(checkInReducer(initialState, {
      type: KIOSK.CHECK_IN.FAILURE,
      payload: error
    })).toEqual({ ...initialState, error })
  })

  it("should set data received", () => {
    expect(checkInReducer(initialState, {
      type: KIOSK.CHECK_IN.SUCCESS,
      payload: data
    })).toEqual({ ...initialState, data })
  })

  it("should reset state", () => {
    expect(checkInReducer(
      { ...initialState, email, data, mobileNumber },
      { type: KIOSK.CHECK_IN.RESET }
    )).toEqual(initialState)
  })

})
