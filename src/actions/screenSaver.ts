import { Action } from "redux"
import { SCREEN_SAVER, KIOSK } from "./types"
import { LoadScreenSaverDataSuccess,
  LoadScreenSaverDataRequest,
  LoadScreenSaverDataFail,
  ErrorPayload
} from "../interfaces"

export const hideScreenSaver = (): Action => ({ type: SCREEN_SAVER.RESET })

export const loadScreenSaverDataRequest = (): LoadScreenSaverDataRequest => ({
  backgroundTask: true,
  type: KIOSK.LOAD_SCREEN_SAVER_DATA.REQUEST,
})

export const loadScreenSaverDataFail = (payload: ErrorPayload): LoadScreenSaverDataFail => ({
  type: KIOSK.LOAD_SCREEN_SAVER_DATA.FAILURE,
  payload,
  backgroundTask: true,
})

export const loadScreenSaverDataSuccess = (
  videoURL: string,
  screenSaverEnableInSeconds: number,
  enableScreensaver: boolean
): LoadScreenSaverDataSuccess => ({
  type: KIOSK.LOAD_SCREEN_SAVER_DATA.SUCCESS,
  backgroundTask: true,
  payload: {
    videoURL,
    screenSaverEnableInSeconds,
    enableScreensaver
  }
})
