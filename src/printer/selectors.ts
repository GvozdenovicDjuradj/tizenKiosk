import { RootState } from "../interfaces"
import { Printer } from "@dnlowman/react-native-star-prnt"
import { Item } from "react-native-picker-select"
import { List } from "immutable"

export const getIsFindingPrinters = (state: RootState): boolean =>
    state.printer.isFindingPrinters

export const getConnectedPrinters = (state: RootState): List<Printer> =>
    state.printer.connectedPrinters

export const getPrinterSelectItems = (state: RootState): Item[] => {
    const connectedPrinters = List<Printer>(getConnectedPrinters(state))

    return connectedPrinters.map((connectedPrinter) =>
        ({ label: connectedPrinter.modelName || "Unknown Model", value: connectedPrinter })).toArray()
}

export const getSelectedPrinter = (state: RootState): Printer | undefined =>
    state.printer.selectedPrinter

export const getIsSelectedPrinterNippon = (state: RootState): boolean =>
    state.printer.selectedPrinter != null && state.printer.selectedPrinter.modelName === "Nippon"

export const getLogoUrl = (state: RootState): string =>
    state.printer.logoUrl

export const getTicketMessage = (state: RootState): string =>
    state.printer.ticketMessage

export const getShowAtTopValue = (state: RootState): string =>
    state.printer.showAtTopValue

export const getLocalCurrentTime = (state: RootState): string =>
    state.printer.localCurrentTime

export const getLocalCurrentDate = (state: RootState): string =>
    state.printer.localCurrentDate

export const getLogoFooterUrl = (state: RootState): string =>
    state.printer.logoFooterUrl

export const getIsPendingPrint = (state: RootState): boolean =>
    state.printer.isPendingPrint

export const getIsPrinterEnabled = (state: RootState): boolean =>
    state.printer.isPrinterEnabled

export const getDebugOutput = (state: RootState): string[] =>
    state.printer.debugOutput

export const getNotificationTitle = (state: RootState): string =>
    state.printer.notificationTitle

export const getNotificationMessage = (state: RootState): string =>
    state.printer.notificationMessage

export const getIsNotificationVisible = (state: RootState): boolean =>
    state.printer.isNotificationVisible

export const getIsDebugOutputVisible = (state: RootState): boolean =>
    state.printer.isDebugOutputVisible

export const getIsCurrentPrintATest = (state: RootState): boolean =>
    state.printer.isCurrentPrintATest
