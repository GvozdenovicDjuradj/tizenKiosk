import { Action, AnyAction } from "redux"
import { APP, KIOSK, PRIVACY_POLICY_AGREE, PRIVACY_POLICY_DISAGREE } from "./types"
import {
  AddCustomerToQueueReset,
  AddCustomerToQueueSuccess,
  AddPrivateCustomerToQueueRequest,
  AddPrivateCustomerToQueueSuccess,
  AnyProduct,
  CustomerInQueue,
  DatePayload,
  ErrorPayload,
  FieldUpdatePayload,
  GetKioskDataSuccess,
  GetKioskSettingsSuccess,
  KioskSettings,
  Language,
  LanguagePayload,
  LoadPrivacyPolicySuccess,
  PrivacyPolicy,
  Product,
  ProductPayload,
  QuestionAnswerPayload,
  RegisterKioskFieldUpdate,
  RegisterKioskSuccess,
  StringPayload,
  NumberPayload
} from "../interfaces"
import { GET_KIOSK_ID_AND_DOMAIN_FROM_URL, SET_KIOSK_ID, SET_KIOSK_SERIAL, SET_KIOSK_URL } from "../constants/kiosk"

export const registerKiosk = (showPrint: boolean): AnyAction =>
  ({ type: KIOSK.REGISTER.REQUEST, hasPrinter: showPrint })

export const registerKioskFieldUpdate = (payload: FieldUpdatePayload): RegisterKioskFieldUpdate => ({
  payload,
  type: KIOSK.FIELD_UPDATE.REQUEST,
})

export const loadKioskSettings = (): Action => ({ type: KIOSK.SETTINGS.REQUEST })

export const loadScreenSaverData = (): Action => ({ type: KIOSK.LOAD_SCREEN_SAVER_DATA.REQUEST })

export const loadKioskQueueData = (): Action => ({ type: KIOSK.QUEUE_DATA.REQUEST })

interface KioskSettingsSuccessAction {
  type: string,
  payload: KioskSettings
}

export const kioskSettingsSuccess = (kioskSettings: KioskSettings): KioskSettingsSuccessAction => ({
  payload: kioskSettings,
  type: KIOSK.SETTINGS.SUCCESS
})

export const changeLanguage = (payload: Language): LanguagePayload => ({
  payload,
  type: KIOSK.SET_LANGUAGE.REQUEST,
})

export const setVenueCountry = (payload: string): StringPayload => ({
  payload,
  type: KIOSK.SET_COUNTRY.REQUEST
})

export const setGroupSize = (payload: number): NumberPayload => ({
  payload,
  type: KIOSK.CUSTOMER.SET_GROUP_SIZE.REQUEST,
})

export const setCustomerName = (payload: string): StringPayload => ({
  payload,
  type: KIOSK.CUSTOMER.SET_NAME.REQUEST,
})

export const setCustomerEmail = (payload: string): StringPayload => ({
  payload,
  type: KIOSK.CUSTOMER.SET_EMAIL.REQUEST,
})

export const setCustomerCountry = (payload: string): StringPayload => ({
  payload,
  type: KIOSK.CUSTOMER.SET_COUNTRY.REQUEST,
})

export const setCallingCode = (payload: string): StringPayload => ({
  payload,
  type: KIOSK.CUSTOMER.SET_CALLING_CODE.REQUEST,
})

export const setCustomerMobile = (payload: string): StringPayload => ({
  payload,
  type: KIOSK.CUSTOMER.SET_MOBILE.REQUEST,
})

export const setCustomerOrder = (payload: string): StringPayload => ({
  payload,
  type: KIOSK.CUSTOMER.SET_ORDER.REQUEST,
})

export const setNotes = (payload: string): StringPayload => ({
  payload,
  type: KIOSK.CUSTOMER.SET_NOTES.REQUEST,
})

export const setProduct = (payload: Product | AnyProduct): ProductPayload => ({
  payload,
  type: KIOSK.SET_PRODUCT.REQUEST,
})

export const setSubProduct = (payload: AnyProduct): ProductPayload => ({
  payload,
  type: KIOSK.SET_SUBPRODUCT.REQUEST,
})

export const addCustomerToQueue = (): Action => ({
  type: KIOSK.CUSTOMER.ADD_TO_QUEUE.REQUEST,
})

export const setAddCustomerToQueueError = (payload: string): StringPayload => ({
  type: KIOSK.CUSTOMER.ADD_TO_QUEUE.FAILURE,
  payload
})

export const setCheckInEmail = (payload: string): StringPayload => ({
  type: KIOSK.CHECK_IN.SET_EMAIL.REQUEST,
  payload,
})

export const setCheckInMobile = (payload: string): StringPayload => ({
  type: KIOSK.CHECK_IN.SET_MOBILE.REQUEST,
  payload,
})

export const setCheckInCountry = (payload: string): StringPayload => ({
  payload,
  type: KIOSK.CHECK_IN.SET_COUNTRY,
})

export const setCheckInCallingCode = (payload: string): StringPayload => ({
  payload,
  type: KIOSK.CHECK_IN.SET_CALLING_CODE,
})

export const setCheckInOrder = (payload: string): StringPayload => ({
  type: KIOSK.CHECK_IN.SET_ORDER.REQUEST,
  payload,
})

export const loadPrivacyPolicyDataSuccess = (payload: PrivacyPolicy, backgroundTask: boolean)
  : LoadPrivacyPolicySuccess => ({
    type: KIOSK.LOAD_PRIVACY_POLICY_DATA.SUCCESS,
    payload,
    backgroundTask
  })

export const addPrivateCustomerToQueueRequest = (queueId?: number, productId?: number)
  : AddPrivateCustomerToQueueRequest => ({
    type: KIOSK.ADD_PRIVATE_CUSTOMER_TO_QUEUE.REQUEST,
    productId,
    queueId,
})

export const addPrivateCustomerToQueueError = (payload: ErrorPayload) => ({
  type: KIOSK.ADD_PRIVATE_CUSTOMER_TO_QUEUE.FAILURE,
  payload
})

export const addPrivateCustomerToQueueSuccess = (customerInQueue: CustomerInQueue)
  : AddPrivateCustomerToQueueSuccess => ({
    type: KIOSK.ADD_PRIVATE_CUSTOMER_TO_QUEUE.SUCCESS,
    payload: {
      customerInQueue
    }
  })

export const addCustomerToQueueSuccess = (customerInQueue: CustomerInQueue)
  : AddCustomerToQueueSuccess => ({
    type: KIOSK.CUSTOMER.ADD_TO_QUEUE.SUCCESS,
    payload: {
      customerInQueue
    }
  })

export const secretTap = () => ({
  type: APP.SECRET_TAP.REQUEST
})

export const addCustomerToQueueReset = (backgroundTask: boolean = false)
  : AddCustomerToQueueReset => ({
    type: KIOSK.CUSTOMER.ADD_TO_QUEUE.RESET,
    backgroundTask
  })

export const checkIn = (): Action => ({ type: KIOSK.CHECK_IN.REQUEST })

export const goToInitialScreen = (): Action => ({ type: APP.GO_INITIAL_SCREEN.REQUEST })

export const loadPrivacyPolicyDataRequest = (): Action => ({ type: KIOSK.LOAD_PRIVACY_POLICY_DATA.REQUEST })

export const agreePrivacyPolicy = (): Action => ({ type: PRIVACY_POLICY_AGREE })

export const disagreePrivacyPolicy = (): Action => ({ type: PRIVACY_POLICY_DISAGREE })

export const addPrivateCustomerToQueueFail = (): Action => ({ type: KIOSK.ADD_PRIVATE_CUSTOMER_TO_QUEUE.FAILURE })

export interface GetKioskIdAndDomainFromUrlAction {
    type: GET_KIOSK_ID_AND_DOMAIN_FROM_URL
}

export const getKioskIdAndDomainFromUrl = (): GetKioskIdAndDomainFromUrlAction => ({
    type: GET_KIOSK_ID_AND_DOMAIN_FROM_URL
})

export interface SetKioskIdAction {
    type: SET_KIOSK_ID,
    payload: {
        id: string;
    }
}

export const setKioskId = (id: string): SetKioskIdAction => ({
    type: SET_KIOSK_ID,
    payload: {
        id
    }
})

export interface SetKioskSerialAction extends Action {
    type: SET_KIOSK_SERIAL,
    payload: {
        serial: string;
    }
}

export const setKioskSerial = (serial: string): SetKioskSerialAction => ({
    type: SET_KIOSK_SERIAL,
    payload: {
        serial
    }
})

export interface SetKioskUrlAction extends Action {
  type: SET_KIOSK_URL,
  payload: {
    url: string;
  }
}

export const setKioskUrl = (url: string): SetKioskUrlAction => ({
  type: SET_KIOSK_URL,
  payload: {
    url
  }
})

export type Actions =
  | Action
  | DatePayload
  | GetKioskDataSuccess
  | GetKioskSettingsSuccess
  | LanguagePayload
  | ProductPayload
  | QuestionAnswerPayload
  | RegisterKioskFieldUpdate
  | RegisterKioskSuccess
  | StringPayload
  | SetKioskUrlAction
  | SetKioskSerialAction
  | SetKioskIdAction
