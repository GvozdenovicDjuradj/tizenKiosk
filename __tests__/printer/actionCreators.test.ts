import { List } from "immutable"
import { Printer } from "@dnlowman/react-native-star-prnt"
import {
    appendPrinterDebugOutput,
    clearPrinterDebugOutput,
    findConnectedPrinters,
    findConnectedPrintersFulfilled,
    findConnectedPrintersRejected,
    selectPrinter,
    setPrinterEnabled,
    toggleDebugOutput,
    displayPrinterNotification,
    hidePrinterNotification, setDebugOutput,
} from "../../src/printer/actionCreators"
import { APPEND_PRINTER_DEBUG_OUTPUT } from "../../src/printer/constants"

describe(`the printer actionCreators module`, () => {
    it(`should have an action creator called findConnectedPrinters which returns the correct action`, () => {
        // When
        const action = findConnectedPrinters()

        // Then
        expect(action).toMatchSnapshot()
    })

    it(`should have an action creator called findConnectedPrintersFulfilled which returns the correct action`, () => {
        // Given
        const printers: List<Printer> = List.of({
            modelName: "Example",
            macAddress: "Example",
            portName: "Example",
            USBSerialNumber: "Example"
        })

        // When
        const action = findConnectedPrintersFulfilled(printers)

        // Then
        expect(action).toMatchSnapshot()
    })

    it(`should have an action creator called findConnectedPrintersRejected which returns the correct action`, () => {
        // When
        const action = findConnectedPrintersRejected()

        // Then
        expect(action).toMatchSnapshot()
    })

    it(`should have an action creator called selectPrinter which returns the correct action`, () => {
        // Given
        const printer: Printer = {
            modelName: "Test",
            portName: "Test"
        }

        // When
        const action = selectPrinter(printer)

        // Then
        expect(action).toMatchSnapshot()
    })

    it(`should have an action creator called setPrinterEnabled which returns the correct action`, () => {
        // Given
        const enabled = true

        // When
        const action = setPrinterEnabled(enabled)

        // Then
        expect(action).toMatchSnapshot()
    })

    it(`should have an action creator called clearPrinterDebugOutput which returns the correct action`, () => {
        // When
        const action = clearPrinterDebugOutput()

        // Then
        expect(action).toMatchSnapshot()
    })

    it(`should have an action creator called appendPrinterDebugOutput which returns the correct action`, () => {
        // Given
        const message = "SOME EXAMPLE PRINTER OUTPUT"

        // When
        const action = appendPrinterDebugOutput(message)

        // Then
        expect(action.type).toBe(APPEND_PRINTER_DEBUG_OUTPUT)
        expect(action.payload.messages).toHaveLength(1)
        expect(action.payload.messages[0]).toContain("SOME EXAMPLE PRINTER OUTPUT")
    })

    it(`should have an action creator called appendPrinterDebugOutput
        which supports taking an array of strings`, () => {
        // Given
        const messages = ["Hello", "World"]

        // When
        const action = appendPrinterDebugOutput(...messages)

        // Then
        expect(action).toBeDefined()
        expect(action).toHaveProperty("type", APPEND_PRINTER_DEBUG_OUTPUT)
        expect(action.payload.messages).toHaveLength(2)
        expect(action.payload.messages[0]).toContain(messages[0])
        expect(action.payload.messages[1]).toContain(messages[1])
    })

    it(`should have an action creator called toggleDebugOutput which returns the correct action`, () => {
        // When
        const action = toggleDebugOutput()

        // Then
        expect(action).toMatchSnapshot()
    })

    it(`should have an action creator called displayPrinterNotification which returns the correct action`, () => {
        // Given
        const title = "example title"
        const message = "example message"

        // When
        const action = displayPrinterNotification(title, message)

        // Then
        expect(action).toMatchSnapshot()
    })

    it(`should have an action creator called hidePrinterNotification which returns the correct action`, () => {
        // When
        const action = hidePrinterNotification()

        // Then
        expect(action).toMatchSnapshot()
    })

    it(`should export setDebugOutput which returns the correct action`, () => {
        // When
        const action = setDebugOutput(true)

        // Then
        expect(action).toMatchSnapshot()
    })
})
