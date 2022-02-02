import { delay } from "redux-saga"
import {call, put, race, select, takeLatest} from "redux-saga/effects"
import callApi from "./api"
import * as constants from "../constants/printing"
import { CustomerInQueue, RootState } from "../interfaces"
import moment from "moment"
import { PrintTicket, printTicketFulfilled } from "../actions"
import { AxiosResponse } from "axios"
import { AlertError, selectors } from "../utils"
import { REQUEST_TIMEOUT, SLOW_NETWORK, TRY_AGAIN } from "./index"
import {
    appendPrinterDebugOutput,
    clearPrinterDebugOutput,
    setDebugOutput,
    updateTicket
} from "../printer/actionCreators"
import {getIsPrinterEnabled} from "../printer/selectors"

enum SHOW_AT_TOP {
    SHOW_TICKET_NUMBER = "Ticket number",
    SHOW_NAME = "Name",
    SHOW_QUEUE_POSITION = "Queue position",
    SHOW_ESTIMATED_WAIT_TIME = "Estimated Wait time",
    SHOW_STORE_AVERAGE_WAIT_TIME = "Store average wait time"
}

export interface TicketLanguage {
    languageName: string,
    languageIsoCode: string,
    translation: {
        message: string
    }
}

export interface TicketTemplateResponseData {
    id: number,
    name: string,
    logoURL: string,
    isLogoFooterEnabled: boolean,
    logoFooterURL?: string,
    ticketFor: string,
    font: string,
    showAtTop: string,
    merchantId: number,
    mainLanguage: TicketLanguage,
    otherLanguages: TicketLanguage[]
}

export const getCallback = (state: RootState) => state.printing.callback

export const getQueueName = (state: RootState): string => {
    if (state.kiosk.customerInQueue) {
        return state.kiosk.customerInQueue.queue.name
    }

    return ""
}

export const getTicketId = (state: RootState): number | undefined => {
    if (state.kiosk.settings && state.kiosk.settings.ticket) {
        return state.kiosk.settings.ticket.id
    }

    return undefined
}

export const getKioskLanguageIsoCode = (state: RootState): string =>
    state.kiosk.language ? state.kiosk.language.languageIsoCode : ""

export const getVenueName = (state: RootState) => {
    if (state.kiosk.customerInQueue) {
        return state.kiosk.customerInQueue.queue.venue.name
    }
    return ""
}

interface TicketTemplateResponseTimeout {
    ticketTemplateResponse: AxiosResponse<TicketTemplateResponseData>,
    timeout: Promise<true>
}

const correctUrlIfMissingProtocol = (baseUrl: string, url: string): string =>
    url.includes("http") ? url : `${baseUrl}${url}`

export interface ReplaceMessageParameters {
    message: string;
    customerName: string;
    ticketPosition: number;
    queueName: string | undefined;
    venueName: string;
    ticketNumber: string;
    ticketMinutesLeft: number;
    ticketAverageWait: number;
    joinedTimeString: string;
}

export const replaceMessagePlaceholders = (replaceMessageParameters: ReplaceMessageParameters): string =>
    replaceMessageParameters.message
        .replace("{customer-name}", replaceMessageParameters?.customerName || "Unknown")
        .replace("{position}", replaceMessageParameters?.ticketPosition?.toString() || "Unknown")
        .replace("{queue-name}", replaceMessageParameters?.queueName || "Unknown")
        .replace("{venue-name}", replaceMessageParameters?.venueName || "Unknown")
        .replace("{ticket}", replaceMessageParameters?.ticketNumber || "Unknown")
        .replace("{minutes-left}", replaceMessageParameters?.ticketMinutesLeft?.toString() || "Unknown")
        .replace("{queue-length}", ((replaceMessageParameters?.ticketPosition - 1) || "Unknown")?.toString())
        .replace("{average-wait}", replaceMessageParameters?.ticketAverageWait?.toString() || "Unknown")
        .replace("{time}", moment(replaceMessageParameters?.joinedTimeString || moment.invalid())
            .add(replaceMessageParameters?.ticketMinutesLeft, "minutes").format("HH:mm"))

function* getTicketInformation(url: string, ticketId: number, customerInQueue: CustomerInQueue) {
    const { ticketTemplateResponse, timeout }: TicketTemplateResponseTimeout = yield race({
        ticketTemplateResponse: call(callApi, `${url}/api/kiosk/merchant/${ticketId}/ticket`),
        timeout: delay(REQUEST_TIMEOUT)
    })

    if (timeout) {
        throw new AlertError(SLOW_NETWORK, TRY_AGAIN)
    }

    const ticketTemplateResponseData: TicketTemplateResponseData = ticketTemplateResponse.data
    const queueName: string | undefined = yield select(getQueueName)
    const venueName = yield select(getVenueName)

    const {
        currentPosition: ticketPosition,
        customer: {
            name: customerName,
            ticketNumber
        },
        queue: {
            averageServeTimeMinutes: ticketAverageWait
        },
        waitTime: ticketMinutesLeft,
        joinedTime: joinedTimeString
    } = customerInQueue

    const logoURL = correctUrlIfMissingProtocol(url, ticketTemplateResponseData.logoURL)
    const logoFooterURL = ticketTemplateResponseData.logoFooterURL ?
      correctUrlIfMissingProtocol(url, ticketTemplateResponseData.logoFooterURL) : ""

    const replaceMessageParameters: ReplaceMessageParameters = {
        message: ticketTemplateResponseData.mainLanguage.translation.message,
        customerName,
        ticketPosition,
        queueName,
        venueName,
        ticketNumber,
        ticketMinutesLeft,
        ticketAverageWait,
        joinedTimeString
    }

    const languages = ticketTemplateResponseData.otherLanguages != null ? [
        ticketTemplateResponseData.mainLanguage,
        ...ticketTemplateResponseData.otherLanguages
    ] : [ticketTemplateResponseData.mainLanguage]

    const kioskLanguageIsoCode = yield select(getKioskLanguageIsoCode)

    const selectedLanguage = languages.find((otherLanguage) =>
      otherLanguage.languageIsoCode === kioskLanguageIsoCode)

    replaceMessageParameters.message = selectedLanguage ?
      selectedLanguage.translation.message : ticketTemplateResponseData.mainLanguage.translation.message

    const ticketMessage = replaceMessagePlaceholders(replaceMessageParameters)

    const showAtTop: { [index: string]: string } = {
        [SHOW_AT_TOP.SHOW_ESTIMATED_WAIT_TIME]: `${ticketMinutesLeft} min`,
        [SHOW_AT_TOP.SHOW_NAME]: customerName,
        [SHOW_AT_TOP.SHOW_QUEUE_POSITION]: ticketPosition.toString(),
        [SHOW_AT_TOP.SHOW_STORE_AVERAGE_WAIT_TIME]: `${ticketAverageWait} min`,
        [SHOW_AT_TOP.SHOW_TICKET_NUMBER]: ticketNumber
    }

    const showAtTopValue = showAtTop[ticketTemplateResponseData.showAtTop]
    const localCurrentDateTime = moment(joinedTimeString)
    const localCurrentTime = localCurrentDateTime.format("HH:mm")
    const localCurrentDate = localCurrentDateTime.format("DD/MM/YYYY")

    return {
        logoURL,
        logoFooterURL,
        ticketMessage,
        showAtTopValue,
        localCurrentTime,
        localCurrentDate
    }
}

const getTestTicketInformation = () => ({
    logoURL: "https://qa.qudini.com/public/images/rebrand/Qudini_Logo_RGB_Grey.png",
    logoFooterURL: "https://qa.qudini.com/public/images/rebrand/Qudini_Logo_RGB_Grey.png",
    ticketMessage: "TEST OK",
    showAtTopValue: "TEST OK",
    localCurrentTime: "TEST OK",
    localCurrentDate: "TEST OK"
})

export function* printTicket(action: PrintTicket) {
    yield put(clearPrinterDebugOutput())

    try {
        yield put(appendPrinterDebugOutput("Starting print operation"))
        const { url } = yield select(selectors.getKioskFieldsSelector)
        yield put(appendPrinterDebugOutput(`Will use the following URL: ${url}`))

        const isPrinterEnabled = yield select(getIsPrinterEnabled)
        yield put(appendPrinterDebugOutput(`Is the printer enabled? ${isPrinterEnabled ? "Yes" : "No"}`))

        if (!isPrinterEnabled) {
            return
        }

        const ticketId: number | undefined = yield select(getTicketId)

        yield put(appendPrinterDebugOutput(`ticketId: ${ticketId}`, `isTest: ${action.payload.isTest}`))

        if (!ticketId && !action.payload.isTest) {
            yield put({
                type: constants.PRINT_TICKET_REJECTED,
                payload: {
                    title: "Ticket could not be printed",
                    message: "There is no ticket template associated to this kiosk"
                }
            })
            return
        }

        const { logoURL, ticketMessage, showAtTopValue, localCurrentTime, localCurrentDate, logoFooterURL }
        = !action.payload.isTest
        ?   yield* getTicketInformation(url, ticketId as number, action.payload.customer)
        :   getTestTicketInformation()

        yield put(appendPrinterDebugOutput(`Ticket Information:
        logoURL: ${logoURL}
        ticketMessage: ${ticketMessage}
        showAtTopValue: ${showAtTopValue}
        localCurrentTime: ${localCurrentTime}
        localCurrentDate: ${localCurrentDate}
        logoFooterURL: ${logoFooterURL}`))

        yield put(updateTicket(logoURL, ticketMessage, showAtTopValue,
            localCurrentTime, localCurrentDate, logoFooterURL))

        yield put(appendPrinterDebugOutput("The ticket has been updated"))

        yield put(printTicketFulfilled())
    } catch (e) {
        if (action.payload.isTest) {
            yield put(setDebugOutput(true))
        }

        yield put(appendPrinterDebugOutput(`Ticket failed to print due to an error being thrown: ${e.toString()}`))
        yield put({
            type: constants.PRINT_TICKET_REJECTED,
            payload: {
                title: "Ticket could not be printed",
                message: "We could not print a ticket for you please remember your queue position."
            }
        })
    }
}

export const printTicketSagas = [
    takeLatest(constants.PRINT_TICKET, printTicket)
]
