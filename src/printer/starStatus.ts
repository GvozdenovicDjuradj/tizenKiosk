import { Map } from "immutable"

export enum StarStatus {
    PRINTER_ONLINE = "printerOnline",
    PRINTER_PAPER_EMPTY = "printerPaperEmpty",
    PRINTER_OFFLINE = "printerOffline",
    PRINTER_PAPER_NEAR_EMPTY = "printerPaperNearEmpty",
    PRINTER_IMPOSSIBLE = "printerImpossible",
}

export const FriendlyMessageForStatus = Map<string, string>([
    [StarStatus.PRINTER_PAPER_EMPTY, "The paper is empty"],
    [StarStatus.PRINTER_OFFLINE, "The printer is offline"],
    [StarStatus.PRINTER_PAPER_NEAR_EMPTY, "The printer paper is nearly empty"],
    [StarStatus.PRINTER_IMPOSSIBLE, "It is not possible to print"],
])

export const getFriendlyMessageForStatus = (starStatus: StarStatus): string | undefined =>
    FriendlyMessageForStatus.get(starStatus)
