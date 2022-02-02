import {
    setAddCustomerToQueueError,
    addCustomerToQueueSuccess,
    addCustomerToQueueReset,
    kioskSettingsSuccess, getKioskIdAndDomainFromUrl, setKioskId, setKioskSerial, setKioskUrl
} from "../../src/actions/kiosk"
import { KIOSK } from "../../src/actions/types"
import { createCustomerInQueue, createSettings } from "../fixtures"

describe("The kiosk action creators", () => {
    describe("setAddCustomerToQueueError", () => {
        it("should return the correct action", () => {
            // Given
            const error = "Error message"

            // When
            const action = setAddCustomerToQueueError(error)

            // Then
            expect(action).not.toBeNull()
            expect(action).toHaveProperty("type", KIOSK.CUSTOMER.ADD_TO_QUEUE.FAILURE)
            expect(action).toHaveProperty("payload", error)
        })
    })

    describe("addCustomerToQueueSuccess", () => {
        it("should return the correct action", () => {
            // Given
            const customerInQueue = createCustomerInQueue()
            const payload = {
                customerInQueue
            }

            // When
            const action = addCustomerToQueueSuccess(customerInQueue)

            // Then
            expect(action).not.toBeNull()
            expect(action).toHaveProperty("type", KIOSK.CUSTOMER.ADD_TO_QUEUE.SUCCESS)
            expect(action).toHaveProperty("payload", payload)
        })
    })

    describe("addCustomerToQueueReset", () => {
        it("should return the correct action", () => {
            // When
            const action = addCustomerToQueueReset(true)

            // Then
            expect(action).not.toBeNull()
            expect(action).toHaveProperty("type", KIOSK.CUSTOMER.ADD_TO_QUEUE.RESET)
            expect(action).toHaveProperty("backgroundTask", true)
        })
    })

    describe("kioskSettingsSuccess", () => {
        it("should return the correct action", () => {
            // Given
            const kioskSettings = createSettings()

            // When
            const action = kioskSettingsSuccess(kioskSettings)

            // Then
            expect(action).toMatchSnapshot()
        })
    })

    describe(`getKioskIdAndDomainFromUrl`, () => {
        it("should return the correct action", () => {
            // When
            const action = getKioskIdAndDomainFromUrl()

            // Then
            expect(action).toMatchSnapshot()
        })
    })

    describe(`setKioskId`, () => {
        it("should return the correct action", () => {
            // When
            const action = setKioskId("test")

            // Then
            expect(action).toMatchSnapshot()
        })
    })

    describe(`setKioskSerial`, () => {
        it("should return the correct action", () => {
            // When
            const action = setKioskSerial("test")

            // Then
            expect(action).toMatchSnapshot()
        })
    })

    describe(`setKioskUrl`, () => {
        it("should return the correct action", () => {
            // When
            const action = setKioskUrl("test")

            // Then
            expect(action).toMatchSnapshot()
        })
    })
})
