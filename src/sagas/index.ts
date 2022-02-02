import { all, takeLatest } from "redux-saga/effects"
import { SagaIterator } from "redux-saga"
import { appSagas, stopApp } from "./app"
import { kioskSagas } from "./kiosk"
import { kioskSettingsSagas } from "./kioskSettings"
import { navigationSagas } from "./navigation"
import { questionsSagas } from "./questionsAnswers"
import { APP } from "../actions/types"
import { printTicketSagas } from "./printTicket"
import { printerSagas } from "../printer/sagas"
import { getLocaleString } from "../utils"


export const SECOND = 1000
export const REQUEST_TIMEOUT = 10 * SECOND
export const RELOAD_QUEUE_DATA_AFTER = 60 * SECOND
export const TRY_AGAIN = getLocaleString("welcomeScreen.error.kiosk.tryAgain") ||  "Please Try Again"
export const SLOW_NETWORK = getLocaleString("welcomeScreen.error.kiosk.slowNetwork") || "Couldn't process request due to slow network"

function* start(): SagaIterator {
  yield all([
    ...appSagas,
    ...kioskSagas,
    ...kioskSettingsSagas,
    ...navigationSagas,
    ...questionsSagas,
    ...printTicketSagas,
    ...printerSagas
  ])
}

export default function* rootSaga() {
  yield takeLatest(APP.START.REQUEST, start)
  yield takeLatest(APP.SHUTDOWN.REQUEST, stopApp)
}
