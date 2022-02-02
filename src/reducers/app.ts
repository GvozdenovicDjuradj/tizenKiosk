import { Reducer } from "redux"
import { APP } from "../actions/types"
import { AppScreens, AppState } from "../interfaces"

export const initialState: AppState = {
  initialScreen: AppScreens.HOME,
  keyboardDisplayed: false,
  offline: false,
  deviceImei: null
}

const reducer: Reducer<AppState> = (state = initialState, action: any) => {
  switch (action.type) {
    case APP.OFFLINE.REQUEST:
      return { ...state, offline: true }
    case APP.ONLINE.REQUEST:
      return { ...state, offline: false }
    case APP.CHANGE_INITIAL_PAGE.REQUEST: {
      return { ...state, initialScreen: action.payload as AppScreens }
    }
    case APP.KEYBOARD_STATE_CHANGE:
      return { ...state, keyboardDisplayed: action.payload }
    case APP.PHONE_STATE_PERMISSION.SUCCESS:
      return { ...state, deviceImei: action.payload.deviceImei }
    default: return state
  }
}

export default reducer
