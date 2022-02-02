import { AnyAction } from "redux"
import { ERROR_SHOW, ERROR_RESET } from "./types"

export interface ShowError extends AnyAction {
  type: ERROR_SHOW;
  payload: string;
}

export interface ResetError extends AnyAction {
  type: ERROR_RESET
}

export type ErrorAction = ResetError | ShowError

export const showError = (payload: string): ShowError => ({
  type: ERROR_SHOW,
  payload
})

export const resetError = (): ResetError => ({ type: ERROR_RESET })
