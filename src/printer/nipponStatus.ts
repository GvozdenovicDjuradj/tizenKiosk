import { Map } from "immutable"

export enum NipponStatus {
    SUCCESS,
    PAPER_LOW,
    PAPER_EMPTY,
    COULD_NOT_PRINT,
}

export const FriendlyMessageForStatus = Map<NipponStatus, string>([
    [NipponStatus.SUCCESS, "Success"],
    [NipponStatus.PAPER_LOW, "The paper is low"],
    [NipponStatus.PAPER_EMPTY, "The paper is empty"],
    [NipponStatus.COULD_NOT_PRINT, "Could not print a ticket"],
])

export const getFriendlyMessageForStatus = (nipponStatus: NipponStatus): string =>
    FriendlyMessageForStatus.get(nipponStatus, "Could not print a ticket")
