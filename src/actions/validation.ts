import { VALIDATION_STATE_CHANGE } from "./types"
import { ValidationChangeAction, ValidationState } from "../interfaces"

export const validationStateChange = (payload: ValidationState): ValidationChangeAction => ({
  type: VALIDATION_STATE_CHANGE,
  payload
})

export type Action = ValidationChangeAction
