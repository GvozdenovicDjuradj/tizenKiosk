import { StarPRNT } from "@dnlowman/react-native-star-prnt"
import NipponPrinter from "../../src/NipponPrinter"
import { runSaga, RunSagaOptions } from "redux-saga"
import { findConnectedPrinters, watchOnPrinterEvent } from "../../src/printer/sagas"
import {
    FIND_CONNECTED_PRINTERS_FULFILLED,
    FIND_CONNECTED_PRINTERS_REJECTED, SELECT_PRINTER,
} from "../../src/printer/constants"
import { createPrinter, createPrinters } from "./fixtures"
import { Action } from "redux"
import { createPrinterState, createState } from "../fixtures"
import printerReducer from "../../src/printer/reducer"

jest.mock("redux-persist", () => ({
    persistReducer: (reducer: typeof printerReducer) => reducer
}))

jest.mock("react-native", () => ({
    Platform: {
        OS: "android"
    }
}))

jest.mock("@dnlowman/react-native-star-prnt", () => ({
    StarPRNT: {
        portDiscovery: jest.fn()
    }
}))

jest.mock("../../src/NipponPrinter", () => ({
    findPrinter: jest.fn(),
    printImage: jest.fn()
}))

interface ActionWithPayload extends Action {
    payload: any
}

describe(`the printer sagas module`, () => {
    describe(`the findConnectedPrinters saga`, () => {
        it(`should put findConnectedPrintersFulfilled with the list
            of returned printers from the StarPRNT and NipponPrinter module`, async () => {
            // Given
            const starPrinters = createPrinters()
            const nipponPrinters = createPrinters();
            (StarPRNT.portDiscovery as jest.Mock).mockReturnValue(Promise.resolve(starPrinters));
            (NipponPrinter.findPrinter as jest.Mock).mockReturnValue(Promise.resolve(nipponPrinters))
            const dispatched: ActionWithPayload[] = []

            const storeInterface: RunSagaOptions<ActionWithPayload, {}> = {
                dispatch: (action: ActionWithPayload) => dispatched.push(action),
                getState: () => createState({
                    printer: createPrinterState({
                        isFindingPrinters: false
                    })
                })
            }

            // When
            await runSaga(storeInterface, findConnectedPrinters).done

            // Then
            expect(dispatched).toHaveLength(1)
            expect(dispatched[0]).toHaveProperty("type", FIND_CONNECTED_PRINTERS_FULFILLED)
            expect(dispatched[0]).toHaveProperty("payload.printers.size", starPrinters.size + nipponPrinters.size)
        })

        it(`should put selectPrinter when there is only one printer in the list`, async () => {
            // Given
            const starPrinters = [createPrinter()]
            const nipponPrinters = [];
            (StarPRNT.portDiscovery as jest.Mock).mockReturnValue(Promise.resolve(starPrinters));
            (NipponPrinter.findPrinter as jest.Mock).mockReturnValue(Promise.resolve(nipponPrinters))
            const dispatched: ActionWithPayload[] = []

            const storeInterface: RunSagaOptions<ActionWithPayload, {}> = {
                dispatch: (action: ActionWithPayload) => dispatched.push(action),
                getState: () => createState({
                    printer: createPrinterState({
                        isFindingPrinters: false
                    })
                })
            }

            // When
            await runSaga(storeInterface, findConnectedPrinters).done

            // Then
            expect(dispatched).toHaveLength(2)
            expect(dispatched[0]).toHaveProperty("type", FIND_CONNECTED_PRINTERS_FULFILLED)
            expect(dispatched[0]).toHaveProperty("payload.printers.size", starPrinters.length)
            expect(dispatched[1]).toHaveProperty("type", SELECT_PRINTER)
        })

        it(`should put findConnectedPrintersRejected when portDiscovery
            throws an Error`, async () => {
            // Given
            (StarPRNT.portDiscovery as jest.Mock).mockReturnValue(Promise.reject("Failed to find any printers..."))
            const dispatched: ActionWithPayload[] = []

            // When
            await runSaga({
                dispatch: (action: ActionWithPayload) => dispatched.push(action),
                // tslint:disable-next-line:no-empty
                getState: () => createState({
                    printer: createPrinterState({
                        isFindingPrinters: false
                    })
                })
            }, findConnectedPrinters).done

            // Then
            expect(dispatched).toHaveLength(1)
            expect(dispatched[0]).toHaveProperty("type", FIND_CONNECTED_PRINTERS_REJECTED)
        })
    })

    describe(`the watchOnPrinterEvent saga`, () => {
        it(`should not do anything if the printer is falsy`, async () => {
            // Given
            const dispatched: ActionWithPayload[] = []

            // When
            // @ts-ignore
            await runSaga({
                dispatch: (action: ActionWithPayload) => dispatched.push(action),
                getState: () => createState({
                    printer: createPrinterState({
                        selectedPrinter: undefined
                    })
                })
            }, watchOnPrinterEvent).done

            // Then
            expect(dispatched).toHaveLength(0)
        })

        it(`should not do anything if the selected printer does not match a Star model`, async () => {
            // Given
            const dispatched: ActionWithPayload[] = []

            // When
            // @ts-ignore
            await runSaga({
                dispatch: (action: ActionWithPayload) => dispatched.push(action),
                getState: () => createState({
                    printer: createPrinterState({
                        selectedPrinter: createPrinter({
                            modelName: "Nippon"
                        })
                    })
                })
            }, watchOnPrinterEvent).done

            // Then
            expect(dispatched).toHaveLength(0)
        })
    })
})
