import { Action } from "redux"
import { KIOSK_SETTINGS_FORM } from "./types"
import {
  FieldUpdatePayload,
  KioskSettingsFieldUpdate
} from "../interfaces"

export const updateSettingsField = (payload: FieldUpdatePayload): KioskSettingsFieldUpdate => ({
  type: KIOSK_SETTINGS_FORM.FIELD_UPDATE.REQUEST,
  payload
})

export const checkNetwork = (): Action => ({
  type: KIOSK_SETTINGS_FORM.CHECK_NETWORK.REQUEST
})

export const validateKioskSettings = (): Action => ({
  type: KIOSK_SETTINGS_FORM.VALIDATE.REQUEST
})

export const saveKioskSettingsChanges = (): Action => ({
  type: KIOSK_SETTINGS_FORM.SUBMIT.REQUEST
})
