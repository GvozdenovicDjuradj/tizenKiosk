import { Actions as KioskActions } from "./kiosk"
import { Action as ValidationActions } from "./validation"
import { PrintingAction } from "./printing"

export const APPLICATION_START = "APPLICATION_START"
export type APPLICATION_START = typeof APPLICATION_START

const CANCEL = "CANCEL"
const FAILURE = "FAILURE"
const REQUEST = "REQUEST"
const RESET = "RESET"
const SUCCESS = "SUCCESS"

const _ADD_TO_QUEUE = "ADD_TO_QUEUE"
const _ANSWERED = "ANSWERED"
const _CHECK_IN = "CHECK_IN"
const _CUSTOMER = "CUSTOMER"
const _ERROR = "ERROR"
const _EVENT = "EVENT"
const _FIELD_UPDATE = "FIELD_UPDATE"
const _KIOSK = "KIOSK"
const _LOGIN = "LOGIN"
const _LOGOUT = "LOGOUT"
const _POST_ANSWERS = "POST_ANSWERS"
const _QUESTIONS = "QUESTIONS"
const _QUEUE_DATA = "QUEUE_DATA"
const _REGISTER = "REGISTER"
const _SET_BOOKING_REF = "SET_BOOKING_REF"
const _SET_CALLING_CODE = "SET_CALLING_CODE"
const _SET_COUNTRY = "SET_COUNTRY"
const _SET_CURRENT = "SET_CURRENT"
const _SET_EMAIL = "SET_EMAIL"
const _SET_LANGUAGE = "SET_LANGUAGE"
const _SET_MOBILE = "SET_MOBILE"
const _SET_NAME = "SET_NAME"
const _SET_ORDER = "SET_ORDER"
const _SET_NOTES = "SET_NOTES"
const _SET_GROUP_SIZE = "SET_GROUP_SIZE"
const _SET_PRODUCT = "SET_PRODUCT"
const _SETTINGS = "SETTINGS"
const _TOGGLE_OTHER = "TOGGLE_OTHER"
const _LOAD_SCREEN_SAVER_DATA = "LOAD_SCREEN_SAVER_DATA"
const _LOAD_PRIVACY_POLICY_DATA = "LOAD_PRIVACY_POLICY_DATA"
const _ADD_PRIVATE_CUSTOMER_TO_QUEUE = "ADD_PRIVATE_CUSTOMER_TO_QUEUE"

export function createActionTypes(type: string) {
  return {
    [CANCEL]: `${type}_${CANCEL}`,
    [FAILURE]: `${type}_${FAILURE}`,
    [REQUEST]: `${type}_${REQUEST}`,
    [RESET]: `${type}_${RESET}`,
    [SUCCESS]: `${type}_${SUCCESS}`,
  }
}

export const ADD_CUSTOMER_TO_QUEUE_START = 'ADD_CUSTOMER_TO_QUEUE_START';
export const ADD_CUSTOMER_TO_QUEUE_STOP = 'ADD_CUSTOMER_TO_QUEUE_STOP';

export const PRIVACY_POLICY_AGREE = "PRIVACY_POLICY_AGREE"
export const PRIVACY_POLICY_DISAGREE = "PRIVACY_POLICY_DISAGREE"
export const LOGIN = createActionTypes(_LOGIN)
export const LOGOUT = createActionTypes(_LOGOUT)
export const FIELD_UPDATE = createActionTypes(_FIELD_UPDATE)
export const KIOSK = {
  CHECK_IN: {
    ...createActionTypes(`${_KIOSK}_${_CHECK_IN}`),
    SET_CALLING_CODE: `${_KIOSK}_${_CHECK_IN}_${_SET_CALLING_CODE}`,
    SET_COUNTRY: `${_KIOSK}_${_CHECK_IN}_${_SET_COUNTRY}`,
    SET_EMAIL: createActionTypes(`${_KIOSK}_${_CHECK_IN}_${_SET_EMAIL}`),
    SET_MOBILE: createActionTypes(`${_KIOSK}_${_CHECK_IN}_${_SET_MOBILE}`),
    SET_ORDER: createActionTypes(`${_KIOSK}_${_CHECK_IN}_${_SET_ORDER}`),
  },
  CUSTOMER: {
    ADD_TO_QUEUE: createActionTypes(`${_KIOSK}_${_CUSTOMER}_${_ADD_TO_QUEUE}`),
    SET_CALLING_CODE: createActionTypes(`${_KIOSK}_${_CUSTOMER}_${_SET_CALLING_CODE}`),
    SET_COUNTRY: createActionTypes(`${_KIOSK}_${_CUSTOMER}_${_SET_COUNTRY}`),
    SET_EMAIL: createActionTypes(`${_KIOSK}_${_CUSTOMER}_${_SET_EMAIL}`),
    SET_MOBILE: createActionTypes(`${_KIOSK}_${_CUSTOMER}_${_SET_MOBILE}`),
    SET_NAME: createActionTypes(`${_KIOSK}_${_CUSTOMER}_${_SET_NAME}`),
    SET_GROUP_SIZE: createActionTypes(`${_KIOSK}_${_CUSTOMER}_${_SET_GROUP_SIZE}`),
    SET_ORDER: createActionTypes(`${_KIOSK}_${_CUSTOMER}_${_SET_ORDER}`),
    SET_NOTES: createActionTypes(`${_KIOSK}_${_CUSTOMER}_${_SET_NOTES}`),
  },
  EVENT_CHECK_IN: {
    ...createActionTypes(`${_KIOSK}_${_EVENT}_${_CHECK_IN}`),
    SET_EMAIL: createActionTypes(`${_KIOSK}_${_EVENT}_${_CHECK_IN}_${_SET_EMAIL}`),
    SET_BOOKING_REF: createActionTypes(`${_KIOSK}_${_EVENT}_${_CHECK_IN}_${_SET_BOOKING_REF}`),
  },
  FIELD_UPDATE: createActionTypes(`${_KIOSK}_${_FIELD_UPDATE}`),
  QUEUE_DATA: createActionTypes(`${_KIOSK}_${_QUEUE_DATA}`),
  REGISTER: createActionTypes(`${_KIOSK}_${_REGISTER}`),
  SET_COUNTRY: createActionTypes(`${_KIOSK}_${_SET_COUNTRY}`),
  SET_LANGUAGE: createActionTypes(`${_KIOSK}_${_SET_LANGUAGE}`),
  SET_PRODUCT: createActionTypes(`${_KIOSK}_${_SET_PRODUCT}`),
  SET_SUBPRODUCT: createActionTypes(`${_KIOSK}_SET_SUBPRODUCT`),
  SETTINGS: createActionTypes(`${_KIOSK}_${_SETTINGS}`),
  LOAD_SCREEN_SAVER_DATA: createActionTypes(`${_KIOSK}_${_LOAD_SCREEN_SAVER_DATA}`),
  LOAD_PRIVACY_POLICY_DATA: createActionTypes(`${_KIOSK}_${_LOAD_PRIVACY_POLICY_DATA}`),
  ADD_PRIVATE_CUSTOMER_TO_QUEUE: createActionTypes(`${_KIOSK}_${_ADD_PRIVATE_CUSTOMER_TO_QUEUE}`)
}

export const VALIDATION_STATE_CHANGE = "VALIDATION_STATE_CHANGE"

export const OTHER_ACTION = "OTHER_ACTION"

export const APP = {
  CHANGE_INITIAL_PAGE: createActionTypes("CHANGE_INITIAL_PAGE"),
  KEYBOARD_STATE_CHANGE: "APP_KEYBOARD_STATE_CHANGE",
  PHONE_STATE_PERMISSION: createActionTypes("PHONE_STATE_PERMISSION"),
  NAVIGATE: createActionTypes("APP_NAVIGATE"),
  OFFLINE: createActionTypes("APP_OFFLINE"),
  ONLINE: createActionTypes("APP_ONLINE"),
  SECRET_TAP: createActionTypes("APP_SECRET_TAP"),
  SET_IDLE_INTERVAL: createActionTypes("APP_SET_IDLE_INTERVAL"),
  SHUTDOWN: createActionTypes("APP_SHUTDOWN"),
  RESET: {
    FAILURE: `APP_${RESET}_${FAILURE}`,
    REQUEST: `APP_${RESET}_${REQUEST}`,
    SUCCESS: `APP_${RESET}_${SUCCESS}`,
  },
  START: createActionTypes("APP_START"),
  GO_INITIAL_SCREEN: createActionTypes("APP_GO_INITIAL_SCREEN")
}

export const MODAL = {
  SHOW: createActionTypes("MODAL_SHOW"),
  HIDE: createActionTypes("MODAL_HIDE")
}

export const ERROR_SHOW = "ERROR_SHOW"
export type ERROR_SHOW = typeof ERROR_SHOW

export const ERROR_RESET = `${_ERROR}_${RESET}`
export type ERROR_RESET = typeof ERROR_RESET

export const KIOSK_SETTINGS_FORM = {
  CHECK_NETWORK: createActionTypes("KIOSK_SETTINS_FORM_CHECK_NETWORK"),
  FIELD_UPDATE: createActionTypes("KIOSK_SETTINS_FORM_FIELD_UPDATE"),
  SET_INITIAL_VALUES: createActionTypes("KIOSK_SETTINS_FORM_SET_INITIAL_VALUES"),
  SUBMIT: createActionTypes("KIOSK_SETTINS_FORM_SUBMIT"),
  VALIDATE: createActionTypes("KIOSK_SETTINGS_FORM_VALIDATE"),
}

export const QUESTIONS = {
  ...createActionTypes(`${_QUESTIONS}`),
  ANSWERED: `${_QUESTIONS}_${_ANSWERED}`,
  ANSWERS: { RESET: `${_QUESTIONS}_ANSWERS_${RESET}` },
  NEXT: `${_QUESTIONS}_NEXT`,
  POST_ANSWERS: createActionTypes(`${_QUESTIONS}_${_POST_ANSWERS}`),
  RESET: `${_QUESTIONS}_${RESET}`,
  SET_CURRENT: `${_QUESTIONS}_${_SET_CURRENT}`,
  TOGGLE_OTHER: `${_QUESTIONS}_${_TOGGLE_OTHER}`,
}

export const SCREEN_SAVER = {
  ...createActionTypes("SCREEN_SAVER")
}

export type Action = KioskActions | ValidationActions | PrintingAction
