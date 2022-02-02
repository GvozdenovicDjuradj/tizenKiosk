import { Reducer } from "redux"
import { Action, APP, VALIDATION_STATE_CHANGE, KIOSK } from "../actions/types"
import { AppScreens, ValidationState, ValidationChangeAction } from "../interfaces"

export const initialState: ValidationState = {
  [AppScreens.HOME]: {
    url: {
      error: [],
      valid: true,
    },
    printerUrl: {
      error: [],
      valid: true,
    }
  },
  [AppScreens.CHECK_IN]: {
    email: {
      error: [],
      valid: true,
    },
    orderNumber: {
      error: [],
      valid: true,
    },
  },
  [AppScreens.CUSTOMER_DETAILS]: {
    name: {
      error: [],
      valid: true,
    },
    email: {
      error: [],
      valid: true,
    },
    mobileNumber: {
      error: [],
      valid: true,
    },
    orderNumber: {
      error: [],
      valid: true,
    },
    groupSize: {
      error: [],
      valid: true,
    },
    notes: {
      error: [],
      valid: true,
    }
  },
  [AppScreens.EVENT_CHECK_IN]: {
    email: {
      error: [],
      valid: true,
    },
    orderNumber: {
      error: [],
      valid: true,
    }
  },
}

const reducer: Reducer<ValidationState> = (state = initialState, action: Action) => {
  const { payload } = action as ValidationChangeAction
  switch (action.type) {
    case VALIDATION_STATE_CHANGE: {
      const newState = { ...state }
      Object.keys(payload).forEach((screen: string) => {
        newState[screen] = { ...newState[screen], ...payload[screen] }
      })
      return newState
    }
    case KIOSK.CUSTOMER.ADD_TO_QUEUE.RESET:
      return { ...state, [AppScreens.CUSTOMER_DETAILS]: initialState[AppScreens.CUSTOMER_DETAILS] }
    case KIOSK.CHECK_IN.RESET:
      return { ...state, [AppScreens.CHECK_IN]: initialState[AppScreens.CHECK_IN] }
    case KIOSK.EVENT_CHECK_IN.RESET:
      return { ...state, [AppScreens.EVENT_CHECK_IN]: initialState[AppScreens.EVENT_CHECK_IN] }
    case APP.RESET.SUCCESS: return initialState
    default: return state
  }
}

export default reducer
