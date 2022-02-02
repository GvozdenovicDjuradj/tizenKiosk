import { DeviceEventEmitter, Platform } from "react-native"
import { StarPRNT } from "@dnlowman/react-native-star-prnt"
import { call, put, select, take, takeLatest } from "redux-saga/effects"
import { List } from "immutable"
import { FIND_CONNECTED_PRINTERS, SELECT_PRINTER } from "./constants"
import {
    findConnectedPrintersRejected,
    findConnectedPrintersFulfilled,
    SelectPrinterAction,
    hidePrinterNotification, displayPrinterNotification, selectPrinter
} from "./actionCreators"
import NipponPrinter from "../NipponPrinter"
import { eventChannel } from "redux-saga"
import { searchModelInfoByModelName } from "./utils"
import { getFriendlyMessageForStatus, StarStatus } from "./starStatus"
import { getSelectedPrinter } from "./selectors"
import { APPLICATION_START } from "../actions/types"

const EVENT_TYPE = "starPrntData"

export function* findConnectedPrinters() {
    try {
        const printers = yield call(StarPRNT.portDiscovery, "All")
        const nipponPrinters = Platform.OS === "android" ? yield call(NipponPrinter.findPrinter) : []
        const combined = [...printers, ...nipponPrinters]
        yield put(findConnectedPrintersFulfilled(List.of(...combined)))

        if (combined.length === 1) {
            yield put(selectPrinter(combined[0]))
        }
    } catch (e) {
        yield put(findConnectedPrintersRejected())
    }
}

const createPrinterEventChannel = () =>
  eventChannel((emit) => {
      Platform.select({
          ios: () => StarPRNT.StarPRNTManagerEmitter.addListener(
            EVENT_TYPE,
            emit
          ),
          android: () => DeviceEventEmitter.addListener(EVENT_TYPE, emit),
      })()

      return StarPRNT.disconnect
  })

export function* watchOnPrinterEvent(action: SelectPrinterAction) {
    const printer = action?.payload?.printer || (yield select(getSelectedPrinter))

    if (!printer || !printer.modelName || !printer.portName ||
      printer.portName.includes("BT" || printer.modelName.includes("BT"))) {
        return
    }

    const modelInfo = searchModelInfoByModelName(printer.modelName)

    if (!modelInfo) {
        return
    }

    try {
        const printerEventChannel = yield call(createPrinterEventChannel)

        yield call(StarPRNT.connect, printer.portName, modelInfo.emulation, false)

        while (true) {
            try {
                const payload = yield take(printerEventChannel)

                if (payload.dataType === StarStatus.PRINTER_ONLINE) {
                    yield put(hidePrinterNotification())
                    continue
                }

                const friendlyMessage = getFriendlyMessageForStatus(payload.dataType)

                if (friendlyMessage) {
                    yield put(displayPrinterNotification("Printer Error", friendlyMessage))
                }
            } catch (e) {
                yield put(hidePrinterNotification())
            }
        }
    } catch (e) {
        yield put(hidePrinterNotification())
    }
}

export const printerSagas = [
    takeLatest(FIND_CONNECTED_PRINTERS, findConnectedPrinters),
    takeLatest(APPLICATION_START, watchOnPrinterEvent),
    takeLatest(SELECT_PRINTER, watchOnPrinterEvent),
]
