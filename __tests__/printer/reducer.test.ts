import faker from "faker"
import { initialState } from "../../src/printer/reducer"
import {
    appendPrinterDebugOutput,
    clearPrinterDebugOutput,
    displayPrinterNotification,
    findConnectedPrinters,
    findConnectedPrintersFulfilled,
    findConnectedPrintersRejected,
    hidePrinterNotification,
    selectPrinter,
    setDebugOutput,
    setPrinterEnabled, 
    ticketPrinted,
    toggleDebugOutput
} from "../../src/printer/actionCreators"
import reducer from "../../src/printer/reducer"
import { createPrinters } from "./fixtures"
import { Printer } from "@dnlowman/react-native-star-prnt"
import { createCustomerInQueue, createPrinterState } from "../fixtures"
import { printTicket } from "../../src/actions"

describe(`the printer reducer module`, () => {
    it(`should have the following initialState`, () => {
        // Then
        expect(initialState).toMatchSnapshot()
    })

    it(`should react to FIND_CONNECTED_PRINTERS and set isFindingPrinters to true`, () => {
        // Given
        const action = findConnectedPrinters()

        // When
        const state = reducer(initialState, action)

        // Then
        expect(state).toBeDefined()
        expect(state).toHaveProperty("isFindingPrinters", true)
    })

    it(`should react to FIND_CONNECTED_PRINTERS_FULFILLED,
        set isFindingPrinters to false and set connectedPrinters to the new list of printers`, () => {
            // Given
            const printers = createPrinters()
            const action = findConnectedPrintersFulfilled(printers)

            // When
            const state = reducer(initialState, action)

            // Then
            expect(state).toBeDefined()
            expect(state).toHaveProperty("isFindingPrinters", false)
            expect(state).toHaveProperty("connectedPrinters", printers)
        })

    it(`should react to FIND_CONNECTED_PRINTERS_REJECTED and set isFindingPrinters to false`, () => {
        // Given
        const action = findConnectedPrintersRejected()

        // When
        const state = reducer(initialState, action)

        // Then
        expect(state).toBeDefined()
        expect(state).toHaveProperty("isFindingPrinters", false)
    })

    it(`should react to SELECT_PRINTER and set selectedPrinter to the new value`, () => {
        // Given
        const printer: Printer = {
            portName: faker.random.word(),
            modelName: faker.random.word()
        }
        const action = selectPrinter(printer)

        // When
        const state = reducer(initialState, action)

        // Then
        expect(state).toBeDefined()
        expect(state).toHaveProperty("selectedPrinter", printer)
    })

    it(`should react to SET_PRINTER_ENABLED and set isPrinterEnabled and reset selected printer`, () => {
        // Given
        const enabled = faker.random.boolean()
        const action = setPrinterEnabled(enabled)

        // When
        const result = reducer(undefined, action)

        // Then
        expect(result).toBeDefined()
        expect(result).toHaveProperty("isPrinterEnabled", enabled)
        expect(result).toHaveProperty("selectedPrinter", initialState.selectedPrinter)
    })

    it(`should react to CLEAR_PRINTER_DEBUG_OUTPUT and update the state`, () => {
        // Given
        const state = createPrinterState({
            debugOutput: ["Connected", "Fetching template information...", "Failed..."]
        })
        const action = clearPrinterDebugOutput()

        // When
        const result = reducer(state, action)

        // Then
        expect(result).toBeDefined()
        expect(result.debugOutput).toHaveLength(0)
    })

    it(`should react to APPEND_PRINTER_DEBUG_OUTPUT and update the state`, () => {
        // Given
        const message = "Connected"
        const state = createPrinterState({
            debugOutput: []
        })
        const action = appendPrinterDebugOutput(message)

        // When
        const result = reducer(state, action)

        // Then
        expect(result).toBeDefined()
        expect(result.debugOutput).toHaveLength(1)
        expect(result.debugOutput[0]).toContain(message)
    })

    it(`should react to TOGGLE_DEBUG_OUTPUT and update the state`, () => {
        // Given
        const action = toggleDebugOutput()
        const state = createPrinterState()

        // When
        const result = reducer(state, action)

        // Then
        expect(result).toBeDefined()
        expect(result).toHaveProperty("isDebugOutputVisible", !state.isDebugOutputVisible)
    })

    it(`should react to DISPLAY_PRINTER_NOTIFICATION and update the state`, () => {
        // Given
        const title = faker.random.word()
        const message = faker.random.word()
        const action = displayPrinterNotification(title, message)

        // When
        const result = reducer(undefined, action)

        // Then
        expect(result).toBeDefined()
        expect(result).toHaveProperty("notificationTitle", title)
        expect(result).toHaveProperty("notificationMessage", message)
        expect(result).toHaveProperty("isNotificationVisible", true)
    })

    it(`should react to HIDE_PRINTER_NOTIFICATION and update the state`, () => {
        // Given
        const action = hidePrinterNotification()

        // When
        const result = reducer(undefined, action)

        // Then
        expect(result).toBeDefined()
        expect(result).toHaveProperty("isNotificationVisible", false)
    })

    it(`should react to TICKET_PRINTED and update the state`, () => {
        // Given
        const state = createPrinterState()
        const action = ticketPrinted()

        // When
        const result = reducer(state, action)

        // Then
        expect(result).toBeDefined()
        expect(result).toHaveProperty("isPendingPrint", false)
        expect(result).toHaveProperty("isNotificationVisible", false)
        expect(result).toHaveProperty("notificationTitle", "")
        expect(result).toHaveProperty("notificationMessage", "")
    })

    it(`should react to SET_DEBUG_OUTPUT and update the state`, () => {
        // Given
        const value = faker.random.boolean()
        const state = createPrinterState()
        const action = setDebugOutput(value)

        // When
        const result = reducer(state, action)

        // Then
        expect(result).toBeDefined()
        expect(result).toHaveProperty("isDebugOutputVisible", value)
    })

    it(`should react to PRINT_TICKET and update the state`, () => {
        // Given
        const customerInQueue = createCustomerInQueue()
        const value = faker.random.boolean()
        const state = createPrinterState()
        const action = printTicket(customerInQueue, value)

        // When
        const result = reducer(state, action)

        // Then
        expect(result).toBeDefined()
        expect(result).toHaveProperty("isCurrentPrintATest", value)
    })
})
