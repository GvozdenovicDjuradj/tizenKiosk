import { Reducer } from "redux"
import { CCA2Code } from "react-native-country-picker-modal"
import { Action, APP, KIOSK } from "../actions/types"
import { CheckInState, CheckInPayload, StringPayload } from "../interfaces"

export const initialState: CheckInState = {
  callingCode: undefined,
  country: undefined,
  data: undefined,
  email: undefined,
  error: undefined,
  isFetching: false,
  mobileNumber: undefined,
  orderNumber: undefined,
}

const reducer: Reducer<CheckInState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case KIOSK.CHECK_IN.SET_EMAIL.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, email: payload }
    }
    case KIOSK.CHECK_IN.SET_ORDER.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, orderNumber: payload }
    }
    case KIOSK.CHECK_IN.SET_COUNTRY: {
      const { payload } = action as StringPayload
      return { ...state, country: payload as CCA2Code }
    }
    case KIOSK.CHECK_IN.SET_CALLING_CODE: {
      const { payload } = action as StringPayload
      return { ...state, callingCode: payload }
    }
    case KIOSK.CHECK_IN.SET_MOBILE.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, mobileNumber: payload }
    }
    case KIOSK.CHECK_IN.REQUEST:
      return {
        ...state,
        data: initialState.data,
        error: initialState.error,
        isFetching: true,
      }
    case KIOSK.CHECK_IN.FAILURE: {
      const { payload } = action as StringPayload
      return { ...state, error: payload, isFetching: false }
    }
    case KIOSK.CHECK_IN.SUCCESS: {
      const { payload } = action as CheckInPayload
      return {
        ...state,
        data: payload,
        email: initialState.email,
        error: initialState.error,
        isFetching: false,
        mobileNumber: initialState.mobileNumber,
        orderNumber: initialState.orderNumber,
      }
    }
    case KIOSK.CHECK_IN.RESET:
    case APP.RESET.SUCCESS:
      return initialState
    default:
      return state
  }
}

export default reducer
