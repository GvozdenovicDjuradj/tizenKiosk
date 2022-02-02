import {createKioskQueueData, createKioskState, createState} from "../fixtures"
import { getIsKioskClosed } from "../../src/selectors/kiosk"

describe(`the kiosk selectors module`, () => {
    describe(`the getIsKioskClosed selector function`, () => {
        it(`it should return true when any queue associated to a kiosk
            has the property storeOpen with the value false`, () => {
            // Given
            const state = createState({
                kiosk: createKioskState({
                    data: [
                        createKioskQueueData({
                            storeOpen: true
                        }),
                        createKioskQueueData({
                            storeOpen: true
                        }),
                        createKioskQueueData({
                            storeOpen: false
                        })
                    ]
                })
            })

            // When
            const result = getIsKioskClosed(state)

            // Then
            expect(result).toBe(true)
        })

        it(`it should return false when any queue associated to a kiosk
            does not have the property storeOpen with the value false`, () => {
            // Given
            const state = createState({
                kiosk: createKioskState({
                    data: [
                        createKioskQueueData({
                            storeOpen: true
                        })
                    ]
                })
            })

            // When
            const result = getIsKioskClosed(state)

            // Then
            expect(result).toBe(false)
        })
    })
})
