import { Action, APP, APPLICATION_START } from "./types"
import { AppScreens } from "../interfaces"

export const applicationStart = (): Action => ({ type: APPLICATION_START })

export const initApp =  (): Action => ({type: APP.START.REQUEST})

export const stopApp = (): Action => ({ type: APP.SHUTDOWN.REQUEST })

export const changeInitialPage = (payload: AppScreens): Action => ({
  type: APP.CHANGE_INITIAL_PAGE.REQUEST,
  payload,
})

export const getPermissionReadPhoneState = () => ({
  type: APP.PHONE_STATE_PERMISSION.REQUEST
})

export const deactivateApp = (): Action => ({ type: APP.RESET.REQUEST })
