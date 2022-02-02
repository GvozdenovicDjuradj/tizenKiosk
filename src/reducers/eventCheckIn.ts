import { Reducer } from "redux"
import { Action, APP, KIOSK } from "../actions/types"
import { EventCheckInState, StringPayload } from "../interfaces"

export const initialState: EventCheckInState = {
  bookingRef: undefined,
  email: undefined,
  error: undefined,
  isFetching: false,
}

const reducer: Reducer<EventCheckInState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case KIOSK.EVENT_CHECK_IN.SET_EMAIL.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, email: payload }
    }
    case KIOSK.EVENT_CHECK_IN.SET_BOOKING_REF.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, bookingRef: payload }
    }
    case KIOSK.EVENT_CHECK_IN.REQUEST: {
      return { ...state, isFetching: true }
    }
    case KIOSK.EVENT_CHECK_IN.FAILURE: {
      return { ...state, isFetching: false }
    }
    case KIOSK.EVENT_CHECK_IN.SUCCESS:
    case KIOSK.EVENT_CHECK_IN.RESET:
    case APP.RESET.SUCCESS:
      return initialState
    default:
      return state
  }
}

export default reducer
