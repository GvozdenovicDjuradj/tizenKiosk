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
    UPDATE_TICKET,
} from "./constants"
import { PRINT_TICKET_REJECTED } from "../constants/printing"
import { PrintTicket } from "../actions/printing"
import moment from "moment"

export interface FindConnectedPrintersAction {
    type: FIND_CONNECTED_PRINTERS;
}

export const findConnectedPrinters = (): FindConnectedPrintersAction => ({
    type: FIND_CONNECTED_PRINTERS
})

export interface FindConnectedPrintersFulfilledAction {
    type: FIND_CONNECTED_PRINTERS_FULFILLED;
    payload: {
        printers: List<Printer>;
    };
}

export const findConnectedPrintersFulfilled = (printers: List<Printer>): FindConnectedPrintersFulfilledAction => ({
    type: FIND_CONNECTED_PRINTERS_FULFILLED,
    payload: {
        printers
    }
})

export interface FindConnectedPrintersRejectedAction {
    type: FIND_CONNECTED_PRINTERS_REJECTED;
}

export const findConnectedPrintersRejected = (): FindConnectedPrintersRejectedAction => ({
    type: FIND_CONNECTED_PRINTERS_REJECTED
})

export interface SelectPrinterAction {
    type: SELECT_PRINTER;
    payload: {
        printer: Printer;
    }
}

export const selectPrinter = (printer: Printer): SelectPrinterAction => ({
    type: SELECT_PRINTER,
    payload: {
        printer
    }
})

export interface UpdateTicketAction {
    type: UPDATE_TICKET;
    payload: {
        logoUrl: string;
        ticketMessage: string;
        showAtTopValue: string;
        localCurrentTime: string;
        localCurrentDate: string;
        logoFooterUrl: string;
    }
}

export const updateTicket =
    (logoUrl: string, ticketMessage: string, showAtTopValue: string,
        localCurrentTime: string, localCurrentDate: string, logoFooterUrl: string): UpdateTicketAction => ({
            type: UPDATE_TICKET,
            payload: {
                logoUrl,
                ticketMessage,
                showAtTopValue,
                localCurrentTime,
                localCurrentDate,
                logoFooterUrl
            }
        })

export interface TicketPrintedAction {
    type: TICKET_PRINTED;
}

export const ticketPrinted = (): TicketPrintedAction => ({
    type: TICKET_PRINTED
})

export interface PrintTicketRejectedAction {
    type: PRINT_TICKET_REJECTED;
    payload: {
        title: string;
        message: string;
    }
}

export const printTicketRejected = (): PrintTicketRejectedAction => ({
    type: PRINT_TICKET_REJECTED,
    payload: {
        title: "Ticket could not be printed",
        message: "We could not print a ticket for you please remember your queue position."
    }
})

export interface SetPrinterEnabledAction {
    type: SET_PRINTER_ENABLED,
    payload: {
        enabled: boolean
    }
}

export const setPrinterEnabled = (enabled: boolean): SetPrinterEnabledAction => ({
    payload: {
        enabled
    },
    type: SET_PRINTER_ENABLED,
})

export interface ClearPrinterDebugOutput {
    type: CLEAR_PRINTER_DEBUG_OUTPUT
}

export const clearPrinterDebugOutput = (): ClearPrinterDebugOutput => ({
    type: CLEAR_PRINTER_DEBUG_OUTPUT
})

export interface AppendPrinterDebugOutput {
    type: APPEND_PRINTER_DEBUG_OUTPUT,
    payload: {
        messages: string[]
    }
}

export const appendPrinterDebugOutput = (...messages: string[]): AppendPrinterDebugOutput => ({
    type: APPEND_PRINTER_DEBUG_OUTPUT,
    payload: {
        messages: messages.map((message) => `[${moment().toISOString()}] - ${message}`)
    }
})

export interface ToggleDebugOutputAction {
    type: TOGGLE_DEBUG_OUTPUT;
}

export const toggleDebugOutput = (): ToggleDebugOutputAction => ({
    type: TOGGLE_DEBUG_OUTPUT
})

export interface SetDebugOutputAction {
    type: SET_DEBUG_OUTPUT;
    payload: {
        value: boolean;
    }
}

export const setDebugOutput = (value: boolean): SetDebugOutputAction => ({
    type: SET_DEBUG_OUTPUT,
    payload: {
        value
    }
})

export interface DisplayPrinterNotificationAction {
    type: DISPLAY_PRINTER_NOTIFICATION;
    payload: {
        title: string;
        message: string;
    };
}

export const displayPrinterNotification = (title: string, message: string): DisplayPrinterNotificationAction => ({
    type: DISPLAY_PRINTER_NOTIFICATION,
    payload: {
        title,
        message
    }
})

export interface HidePrinterNotificationAction {
    type: HIDE_PRINTER_NOTIFICATION
}

export const hidePrinterNotification = (): HidePrinterNotificationAction => ({
    type: HIDE_PRINTER_NOTIFICATION
})

export type PrinterActions = FindConnectedPrintersAction
    | FindConnectedPrintersFulfilledAction
    | FindConnectedPrintersRejectedAction
    | SelectPrinterAction
    | UpdateTicketAction
    | TicketPrintedAction
    | PrintTicketRejectedAction
    | SetPrinterEnabledAction
    | ClearPrinterDebugOutput
    | AppendPrinterDebugOutput
    | ToggleDebugOutputAction
    | DisplayPrinterNotificationAction
    | HidePrinterNotificationAction
    | SetDebugOutputAction
    | PrintTicket
