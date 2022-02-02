import { Action } from "redux"
import { runSaga } from "redux-saga"
import {printTicket, replaceMessagePlaceholders, TicketTemplateResponseData} from "../../src/sagas/printTicket"
import { printTicket as printTicketActionCreator } from "../../src/actions/printing"
import callApi from "../../src/sagas/api"
import moment from "moment"
import * as constants from "../../src/constants/printing"
import faker from "faker"
import { CustomerInQueue, Venue } from "../../src/interfaces"
import {createReplaceMessageParameters} from "../fixtures"

jest.mock("../../src/sagas/api")

describe(`the printTicket saga module`, () => {
    const createTicketTemplateResponseData =
        (logoURL?: string, logoFooterURL?: string): TicketTemplateResponseData => ({
            logoFooterURL: logoFooterURL || faker.internet.url(),
            logoURL: logoURL || faker.internet.url(),
            font: faker.random.word(),
            isLogoFooterEnabled: faker.random.boolean(),
            showAtTop: faker.random.word(),
            mainLanguage: {
                translation: {
                    message: faker.random.word()
                },
                languageIsoCode: faker.random.word(),
                languageName: faker.random.word()
            },
            otherLanguages: [],
            id: faker.random.number(),
            name: faker.random.word(),
            ticketFor: faker.random.word(),
            merchantId: faker.random.number()
        })

    const createState = (hasPrinter: boolean, ticketId?: string) => ({
        kiosk: {
            fields: {
                printerUrl: faker.internet.url(),
                url: faker.internet.url()
            },
            settings: {
                ticket: {
                    id: ticketId
                }
            },
            customerInQueue: {
                queue: {
                    name: faker.random.word(),
                    venue: {
                        name: faker.random.word()
                    }
                }
            }
        },
        printing: {
            callback: jest.fn()
        },
        printer: {
            selectedPrinter: faker.random.word(),
            isPrinterEnabled: hasPrinter
        }
    })

    const createCustomer = (): CustomerInQueue => ({
        currentPosition: faker.random.number(),
        customer: {
            bookingRef: "null",
            customerProfile: {},
            id: 0,
            identifier: "null",
            name: faker.name.firstName(),
            orderNumber: null,
            ticketNumber: faker.random.word(),
        },
        id: faker.random.number(),
        joinedTime: moment().toISOString(),
        minutesRemaining: faker.random.word(),
        queue: {
            averageServeTimeMinutes: faker.random.number(),
            customerLength: faker.random.number(),
            id: faker.random.number(),
            name: faker.random.word(),
            venue: {} as Venue
        },
        timeRemaining: faker.random.word(),
        waitTime: faker.random.number(),
    })

    it(`should put PRINT_TICKET_FULFILLED when a ticket has
        been successfully printed along with adding the URI
        protocol to the logoURL and logoFooterURL if they do
        not exist`, async () => {
            // Given
            (callApi as jest.Mock).mockImplementation(() => ({
                data: createTicketTemplateResponseData(faker.internet.ip(), faker.internet.ip())
            }))

            const dispatched: Action[] = []
            const customer = createCustomer()
            const printTicketAction = printTicketActionCreator(customer)
            const state = createState(true, faker.random.word())

            // When
            await runSaga({
                dispatch: (action: Action) => { dispatched.push(action) },
                getState: () => state
            }, printTicket, printTicketAction)

            // Then
            expect(dispatched).toHaveLength(9)
            expect(dispatched[8]).toHaveProperty("type", constants.PRINT_TICKET_FULFILLED)
        })

    it(`should put PRINT_TICKET_FULFILLED when a test ticket has
        been successfully printed`, async () => {
        // Given
        const dispatched: Action[] = []
        const customer = createCustomer()
        const printTicketAction = printTicketActionCreator(customer, true)
        const state = createState(true, faker.random.word())

        // When
        await runSaga({
            dispatch: (action: Action) => { dispatched.push(action) },
            getState: () => state
        }, printTicket, printTicketAction)

        // Then
        expect(dispatched).toHaveLength(9)
        expect(dispatched[8]).toHaveProperty("type", constants.PRINT_TICKET_FULFILLED)
    })

    it(`should not dispatch anything if hasPrinter is false`, async () => {
        // Given
        (callApi as jest.Mock).mockImplementation(() => ({
            data: createTicketTemplateResponseData()
        }))

        const dispatched: Action[] = []
        const customer = createCustomer()
        const printTicketAction = printTicketActionCreator(customer)

        // When
        await runSaga({
            dispatch: (action: Action) => dispatched.push(action),
            getState: () => createState(false, faker.random.word())
        }, printTicket, printTicketAction)

        // Then
        expect(dispatched).toBeDefined()
        expect(dispatched).toHaveLength(4)
    })

    it(`should not dispatch anything if hasPrinter is true
        and ticketId is falsy`, async () => {
            // Given
            (callApi as jest.Mock).mockImplementation(() => ({
                data: createTicketTemplateResponseData()
            }))

            const dispatched: Action[] = []
            const customer = createCustomer()
            const printTicketAction = printTicketActionCreator(customer)

            // When
            await runSaga({
                dispatch: (action: Action) => dispatched.push(action),
                getState: () => createState(true, undefined)
            }, printTicket, printTicketAction)

            // Then
            expect(dispatched).toBeDefined()
            expect(dispatched).toHaveLength(6)
        })

    it(`should put PRINT_TICKET_REJECTED if an error
        is thrown`, async () => {
            // Given
            (callApi as jest.Mock).mockImplementation(() => {
                throw new Error("Error!")
            })

            const dispatched: Action[] = []
            const customer = createCustomer()
            const printTicketAction = printTicketActionCreator(customer)

            // When
            await runSaga({
                dispatch: (action: Action) => dispatched.push(action),
                getState: () => createState(true, faker.random.word())
            }, printTicket, printTicketAction)

            // Then
            expect(dispatched).toBeDefined()
            expect(dispatched).toHaveLength(7)
            expect(dispatched[6].type).toBe(constants.PRINT_TICKET_REJECTED)
        })

    describe(`the replaceMessagePlaceholders function`, () => {
        it(`should successfully update all placeholders`, () => {
            // Given
            const message = `
              {customer-name}
              {position}
              {queue-name}
              {venue-name}
              {ticket}
              {minutes-left}
              {queue-length}
              {average-wait}
              {time}
            `;

            const replaceMessageParameters = createReplaceMessageParameters({
              message
            });


            // When
            const result = replaceMessagePlaceholders(replaceMessageParameters);


            // Then
            expect(result).toBeTruthy();
            expect(result).toMatch(`
              ${replaceMessageParameters.customerName}
              ${replaceMessageParameters.ticketPosition}
              ${replaceMessageParameters.queueName}
              ${replaceMessageParameters.venueName}
              ${replaceMessageParameters.ticketNumber}
              ${replaceMessageParameters.ticketMinutesLeft}
              ${replaceMessageParameters.ticketPosition - 1}
              ${replaceMessageParameters.ticketAverageWait}
              ${moment(replaceMessageParameters.joinedTimeString).format("HH:mm")}
            `);
        })

        it(`should fallback to the text Unknown in the case of falsy values`, () => {
          // Given
          const message = `
                {customer-name}
                {position}
                {queue-name}
                {venue-name}
                {ticket}
                {minutes-left}
                {queue-length}
                {average-wait}
                {time}
              `

          const replaceMessageParameters = createReplaceMessageParameters({
            message,
            customerName: undefined,
            ticketPosition: undefined,
            queueName: undefined,
            venueName: undefined,
            ticketNumber: undefined,
            ticketMinutesLeft: undefined,
            ticketAverageWait: undefined,
            joinedTimeString: undefined
          })


          // When
          const result = replaceMessagePlaceholders(replaceMessageParameters);


          // Then
          expect(result).toBeTruthy();
          expect(result).toMatch(`
                Unknown
                Unknown
                Unknown
                Unknown
                Unknown
                Unknown
                Unknown
                Unknown
                Invalid date
              `);
        })
    })
})

