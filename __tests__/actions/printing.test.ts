import { setPrinterCallback } from "../../src/actions/printing"
import * as constants from "../../src/constants/printing"

describe("The printing action creators", () => {
    describe("setPrinterCallback", () => {
        it("should return the correct action", () => {
            // Given
            const callback = () => "Hi there!"

            // When
            const action = setPrinterCallback(callback)

            // Then
            expect(action).not.toBeNull()
            expect(action).toHaveProperty("type", constants.SET_PRINTER_CALLBACK)
            expect(action).toHaveProperty("payload")
            expect(action.payload).toHaveProperty("callback", callback)
        })
    })
})
