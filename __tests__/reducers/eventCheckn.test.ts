import { KIOSK, OTHER_ACTION } from "../../src/actions/types"
import eventCheckInReducer, { initialState } from "../../src/reducers/eventCheckIn"

describe("Event check-in reducer tests", () => {
  const email = "test@email.test"
  const error = "test error"
  const bookingRef = "123"

  it("should set empty object as initial state", () => {
    expect(eventCheckInReducer({ isFetching: true }, { type: OTHER_ACTION }))
      .not.toBe(initialState)
  })

  it("should set initial state", () => {
    expect(eventCheckInReducer(initialState, { type: OTHER_ACTION }))
      .toEqual(initialState)
  })

  it("should set email", () => {
    expect(eventCheckInReducer(initialState, {
      type: KIOSK.EVENT_CHECK_IN.SET_EMAIL.REQUEST,
      payload: email
    })).toEqual({ ...initialState, email })
  })

  it("should set booking reference number", () => {
    expect(eventCheckInReducer(initialState, {
      type: KIOSK.EVENT_CHECK_IN.SET_BOOKING_REF.REQUEST,
      payload: bookingRef
    })).toEqual({ ...initialState, bookingRef })
  })

  it("should reset state", () => {
    expect(eventCheckInReducer(
      { ...initialState, email, bookingRef, error },
      { type: KIOSK.EVENT_CHECK_IN.RESET }
    )).toEqual(initialState)
  })

  it("should reset state upon successfully checked-in", () => {
    expect(eventCheckInReducer(
      { ...initialState, email, bookingRef, error },
      { type: KIOSK.EVENT_CHECK_IN.SUCCESS }
    )).toEqual(initialState)
  })

})
