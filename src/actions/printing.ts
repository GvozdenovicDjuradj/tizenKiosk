import * as constants from "../constants/printing"
import { AnyAction } from "redux"
import { CustomerInQueue } from "../interfaces"

export interface SetPrinterCallback extends AnyAction {
    payload: {
        callback: (data: string) => void
    };
    type: constants.SET_PRINTER_CALLBACK;
}

export interface PrintTicket extends AnyAction {
    type: constants.PRINT_TICKET;
    payload: {
        customer: CustomerInQueue;
        isTest: boolean;
    };
}

export interface PrintTicketFulfilled extends AnyAction {
    type: constants.PRINT_TICKET_FULFILLED
}

export type PrintingAction = SetPrinterCallback | PrintTicket | PrintTicketFulfilled

export function setPrinterCallback(callback: (data: string) => void): PrintingAction {
    return {
        payload: {
            callback
        },
        type: constants.SET_PRINTER_CALLBACK
    }
}

export function printTicket(customer: CustomerInQueue, isTest = false): PrintTicket {
    return {
        type: constants.PRINT_TICKET,
        payload: {
            customer,
            isTest
        }
    }
}

export function printTicketFulfilled(): PrintTicketFulfilled {
    return {
        type: constants.PRINT_TICKET_FULFILLED
    }
}
