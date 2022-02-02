import { List } from "immutable"
import { Printer } from "@dnlowman/react-native-star-prnt"
import {
    APPEND_PRINTER_DEBUG_OUTPUT,
    CLEAR_PRINTER_DEBUG_OUTPUT,
    DISPLAY_PRINTER_NOTIFICATION,
    FIND_CONNECTED_PRINTERS,
    FIND_CONNECTED_PRINTERS_FULFILLED,
    FIND_CONNECTED_PRINTERS_REJECTED,
    HIDE_PRINTER_NOTIFICATION,
    SELECT_PRINTER,
    SET_DEBUG_OUTPUT,
    SET_PRINTER_ENABLED,
    TICKET_PRINTED,
    TOGGLE_DEBUG_OUTPUT,
    UPDATE_TICKET
} from "./constants"
import { PrinterActions } from "./actionCreators"
import { Reducer } from "redux"
import { APP } from "../actions/types"
import { PRINT_TICKET } from "../constants/printing"

const { freeze } = Object

export interface PrinterState {
    isFindingPrinters: boolean;
    connectedPrinters: List<Printer>;
    selectedPrinter?: Printer;
    logoUrl: string;
    ticketMessage: string;
    showAtTopValue: string;
    localCurrentTime: string;
    localCurrentDate: string;
    logoFooterUrl: string;
    isPendingPrint: boolean;
    isPrinterEnabled: boolean;
    debugOutput: string[];
    isDebugOutputVisible: boolean;
    notificationTitle: string;
    notificationMessage: string;
    isNotificationVisible: boolean;
    isCurrentPrintATest: boolean;
}

export const initialState: Readonly<PrinterState> = freeze({
    isFindingPrinters: false,
    connectedPrinters: List<Printer>(),
    selectedPrinter: undefined,
    logoUrl: "",
    ticketMessage: "",
    showAtTopValue: "",
    localCurrentTime: "",
    localCurrentDate: "",
    logoFooterUrl: "",
    isPendingPrint: false,
    isPrinterEnabled: false,
    debugOutput: [],
    isDebugOutputVisible: false,
    notificationTitle: "",
    notificationMessage: "",
    isNotificationVisible: false,
    isCurrentPrintATest: false,
})

const reducer: Reducer<PrinterState, PrinterActions> =
    (state: PrinterState = initialState, action: PrinterActions): Readonly<PrinterState> => {
        switch (action.type) {
            case PRINT_TICKET:
                return {
                    ...state,
                    isCurrentPrintATest: action.payload.isTest
                }

            case APP.SECRET_TAP.SUCCESS:
                return {
                    ...state,
                    isPendingPrint: false
                }

            case FIND_CONNECTED_PRINTERS:
                return {
                    ...state,
                    connectedPrinters: List.of<Printer>(),
                    isFindingPrinters: true,
                    selectedPrinter: undefined,
                }

            case FIND_CONNECTED_PRINTERS_FULFILLED:
                return {
                    ...state,
                    connectedPrinters: action.payload.printers,
                    isFindingPrinters: false,
                }

            case FIND_CONNECTED_PRINTERS_REJECTED:
                return {
                    ...state,
                    isFindingPrinters: false
                }

            case SELECT_PRINTER:
                return {
                    ...state,
                    selectedPrinter: action.payload.printer,
                }

            case UPDATE_TICKET:
                return {
                    ...state,
                    logoUrl: action.payload.logoUrl,
                    ticketMessage: action.payload.ticketMessage,
                    showAtTopValue: action.payload.showAtTopValue,
                    localCurrentTime: action.payload.localCurrentTime,
                    localCurrentDate: action.payload.localCurrentDate,
                    logoFooterUrl: action.payload.logoFooterUrl,
                    isPendingPrint: true
                }

            case TICKET_PRINTED:
                return {
                    ...state,
                    isPendingPrint: false,
                    isNotificationVisible: false,
                    notificationTitle: "",
                    notificationMessage: "",
                }

            case SET_PRINTER_ENABLED:
                return {
                    ...state,
                    isPrinterEnabled: action.payload.enabled,
                    selectedPrinter: initialState.selectedPrinter,
                }

            case CLEAR_PRINTER_DEBUG_OUTPUT:
                return {
                    ...state,
                    debugOutput: []
                }

            case APPEND_PRINTER_DEBUG_OUTPUT:
                return {
                    ...state,
                    debugOutput: [...state.debugOutput, ...action.payload.messages]
                }

            case TOGGLE_DEBUG_OUTPUT:
                return {
                    ...state,
                    isDebugOutputVisible: !state.isDebugOutputVisible
                }

            case DISPLAY_PRINTER_NOTIFICATION:
                return {
                    ...state,
                    notificationTitle: action.payload.title,
                    notificationMessage: action.payload.message,
                    isNotificationVisible: __DEV__,
                    // This functionality is currently only available on a dev build as we still need to implement i18n
                }

            case HIDE_PRINTER_NOTIFICATION:
                return {
                    ...state,
                    isNotificationVisible: false,
                }

            case SET_DEBUG_OUTPUT:
                return {
                    ...state,
                    isDebugOutputVisible: action.payload.value
                }

            default:
                return state
        }
    }

export default reducer
