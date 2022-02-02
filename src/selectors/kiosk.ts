import { KioskQueueData, RootState } from "../interfaces"

export const getIsKioskClosed = (state: RootState): boolean =>
    state.kiosk.data.some((kioskQueueData: KioskQueueData) => !kioskQueueData.storeOpen)
