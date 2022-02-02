import { setPrinterCallback } from "../../src/actions/printing"
import reducer, { initialState } from "../../src/reducers/printing"

describe("The printing reducer", () => {
    it("should react to SET_PRINTER_CALLBACK and return the update the state", () => {
        // Given
        const callback = () => "Hi!"
        const action = setPrinterCallback(callback)

        // When
        const state = reducer(initialState, action)

        // Then
        expect(state).toHaveProperty("callback", callback)
    })
})
