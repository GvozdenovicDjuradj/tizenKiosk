import memoize from "lodash.memoize"
import modelInfo from "./modelInfo.json"
import { CustomerInQueue } from "../interfaces"

export interface ModelInfo {
    names: string[],
    modelTitle: string,
    defaultPaperWidth: number,
    emulation: string,
}

export const searchModelInfoByModelName =
  memoize((modelName: string): ModelInfo | undefined => {

    for (const model of modelInfo.models) {
        const perfectMatch = model.names.find((name: string) => name === modelName)

        if (perfectMatch) {
            return model
        }

        const partialMatch = model.names.find((name: string) => name.startsWith(modelName))

        if (partialMatch) {
            return model
        }

        const includes = model.names.find((name: string) => modelName.toLowerCase().includes(name.toLowerCase()))

        if (includes) {
            return model
        }

        const modelTitleMatch = model.modelTitle === modelName

        if (modelTitleMatch) {
            return model
        }
    }

    return undefined
})

export const testCustomerInQueue: CustomerInQueue = {
    currentPosition: 1,
    customer: {
        bookingRef: "TEST",
        customerProfile: null,
        id: 2,
        identifier: "TEST",
        name: "TEST",
        orderNumber: null,
        ticketNumber: "TEST",
    },
    id: 3,
    minutesRemaining: "TEST",
    queue: {
        averageServeTimeMinutes: 4,
        customerLength: 5,
        id: 6,
        name: "TEST",
        venue: {
            defaultCountryCode: "TEST",
            defaultLanguageIsoCode: "TEST",
            id: 7,
            isBookingEnabled: false,
            isWalkinEnabled: false,
            name: "TEST",
            merchant: {
                featureSettings: {
                    hasQudiniBrand: false,
                },
                id: 8,
            }
        },
    },
    timeRemaining: "TEST",
    joinedTime: "TEST",
    waitTime: 9,
}
