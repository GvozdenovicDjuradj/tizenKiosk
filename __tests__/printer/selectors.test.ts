import faker from "faker"
import {
    getIsFindingPrinters,
    getConnectedPrinters,
    getSelectedPrinter,
    getPrinterSelectItems,
    getIsSelectedPrinterNippon,
    getIsPrinterEnabled,
    getDebugOutput,
    getIsNotificationVisible,
    getNotificationMessage,
    getNotificationTitle,
    getIsDebugOutputVisible,
    getIsCurrentPrintATest,
} from "../../src/printer/selectors"
import { RootState } from "../../src/interfaces"
import { createPrinters } from "./fixtures"
import { createPrinterState, createState } from "../fixtures"

describe(`the printer selectors module`, () => {
    it(`should have a function called getIsFindingPrinters which returns
        the correct value`, () => {
            // Given
            const state: Partial<RootState> = {
                printer: {
                    isFindingPrinters: faker.random.boolean(),
                    connectedPrinters: createPrinters(),
                    selectedPrinter: {
                        portName: faker.random.word(),
                        modelName: faker.random.word()
                    },
                    logoUrl: "",
                    logoFooterUrl: "",
                    showAtTopValue: "",
                    ticketMessage: "",
                    isPendingPrint: false,
                    localCurrentDate: "",
                    localCurrentTime: ""
                }
            }

            // When
            const isFindingPrinters = getIsFindingPrinters(state as RootState)

            // Then
            expect(isFindingPrinters).toBeDefined()
            expect(isFindingPrinters).toBe(state.printer!.isFindingPrinters)
        })

    it(`should have a function called getConnectedPrinters which returns
        the correct value`, () => {
            // Given
            const state: Partial<RootState> = {
                printer: {
                    isFindingPrinters: faker.random.boolean(),
                    connectedPrinters: createPrinters(),
                    selectedPrinter: {
                        portName: faker.random.word(),
                        modelName: faker.random.word()
                    },
                    logoUrl: "",
                    logoFooterUrl: "",
                    showAtTopValue: "",
                    ticketMessage: "",
                    isPendingPrint: false,
                    localCurrentDate: "",
                    localCurrentTime: ""
                }
            }

            // When
            const connectedPrinters = getConnectedPrinters(state as RootState)

            // Then
            expect(connectedPrinters).toBeDefined()
            expect(connectedPrinters).toBe(state.printer!.connectedPrinters)
        })

    it(`should have a function called getPrinterSelectItems which returns
        the correct value`, () => {
            // Given
            const state: Partial<RootState> = {
                printer: {
                    isFindingPrinters: faker.random.boolean(),
                    connectedPrinters: createPrinters(),
                    selectedPrinter: {
                        portName: faker.random.word(),
                        modelName: faker.random.word()
                    },
                    logoUrl: "",
                    logoFooterUrl: "",
                    showAtTopValue: "",
                    ticketMessage: "",
                    isPendingPrint: false,
                    localCurrentDate: "",
                    localCurrentTime: ""
                }
            }

            // When
            const selectItems = getPrinterSelectItems(state as RootState)

            // Then
            expect(selectItems).toBeDefined()
            expect(selectItems).toHaveLength(state.printer!.connectedPrinters.size)
            selectItems.forEach((selectItem, index) => {
                expect(selectItem.label).toBe(state.printer!.connectedPrinters.get(index)!.modelName)
                expect(selectItem.value).toEqual(state.printer!.connectedPrinters.get(index))
            })
        })

    it(`should have a function called getSelectedPrinter which returns
        the correct value`, () => {
            // Given
            const state: Partial<RootState> = {
                printer: {
                    isFindingPrinters: faker.random.boolean(),
                    connectedPrinters: createPrinters(),
                    selectedPrinter: {
                        portName: faker.random.word(),
                        modelName: faker.random.word()
                    },
                    logoUrl: "",
                    logoFooterUrl: "",
                    showAtTopValue: "",
                    ticketMessage: "",
                    isPendingPrint: false,
                    localCurrentDate: "",
                    localCurrentTime: ""
                }
            }

            // When
            const selectedPrinter = getSelectedPrinter(state as RootState)

            // Then
            expect(selectedPrinter).toBeDefined()
            expect(selectedPrinter).toBe(state.printer!.selectedPrinter)
        })

    describe(`the selector function isSelectedPrinterNippon`, () => {
        it(`should return true when valid`, () => {
            // Given
            const state: Partial<RootState> = {
                printer: {
                    isFindingPrinters: faker.random.boolean(),
                    connectedPrinters: createPrinters(),
                    selectedPrinter: {
                        portName: faker.random.word(),
                        modelName: "Nippon"
                    },
                    logoUrl: "",
                    logoFooterUrl: "",
                    showAtTopValue: "",
                    ticketMessage: "",
                    isPendingPrint: false,
                    localCurrentDate: "",
                    localCurrentTime: ""
                }
            }

            // When
            const isSelectedPrinterNippon = getIsSelectedPrinterNippon(state as RootState)

            // Then
            expect(isSelectedPrinterNippon).toBeDefined()
            expect(isSelectedPrinterNippon).toBeTruthy()
        })

        it(`should return false when invalid`, () => {
            // Given
            const state: Partial<RootState> = {
                printer: {
                    isFindingPrinters: faker.random.boolean(),
                    connectedPrinters: createPrinters(),
                    selectedPrinter: {
                        portName: faker.random.word(),
                        modelName: ""
                    },
                    logoUrl: "",
                    logoFooterUrl: "",
                    showAtTopValue: "",
                    ticketMessage: "",
                    isPendingPrint: false,
                    localCurrentDate: "",
                    localCurrentTime: ""
                }
            }

            // When
            const isSelectedPrinterNippon = getIsSelectedPrinterNippon(state as RootState)

            // Then
            expect(isSelectedPrinterNippon).toBeDefined()
            expect(isSelectedPrinterNippon).toBeFalsy()
        })
    })

    describe(`the getIsPrinterEnabled selector function`, () => {
        it(`should return the correct property within the state`, () => {
            // Given
            const state = createState()

            // When
            const result = getIsPrinterEnabled(state)

            // Then
            expect(result).toBe(state.printer.isPrinterEnabled)
        })
    })

    describe(`the getDebutOutput selector function`, () => {
        it(`should return an array of strings representing the debug output`, () => {
            // Given
            const state = createState({
                printer: createPrinterState({
                    debugOutput: ["One", "Two", "Three"]
                })
            })

            // When
            const result = getDebugOutput(state)

            // Then
            expect(result).toBeDefined()
            expect(result).toHaveLength(3)
        })
    })

    it(`should export selector functions for the notification title, message and visible boolean`, () => {
        // Given
        const state = createState()

        // When
        const title = getNotificationTitle(state)
        const message = getNotificationMessage(state)
        const isNotificationVisible = getIsNotificationVisible(state)

        // Then
        expect(title).toBeDefined()
        expect(title).toBe(state.printer.notificationTitle)
        expect(message).toBe(state.printer.notificationMessage)
        expect(isNotificationVisible).toBe(state.printer.isNotificationVisible)
    })

    it(`should export getIsDebugOutputVisible which returns the correct property`, () => {
        // Given
        const state = createState()

        // When
        const result = getIsDebugOutputVisible(state)

        // Then
        expect(result).toBe(state.printer.isDebugOutputVisible)
    })

    it(`should export getIsCurrentPrintATest which returns the correct property`, () => {
        // Given
        const state = createState()

        // When
        const result = getIsCurrentPrintATest(state)

        // Then
        expect(result).toBe(state.printer.isCurrentPrintATest)
    })
})
