export * from "./customer"
export * from "./customerForm"
export * from "./language"
export * from "./queueData"
export * from "./settings"
export * from "./template"
export * from "./templateLanguages"

import { Action } from "redux"
import { CountryCode } from "libphonenumber-js"
import { AnyProduct, Product } from "../product"
import { CustomerInQueue } from "../customerInQueue"
import { KioskCustomer } from "./customer"
import { KioskQueueData } from "./queueData"
import { KioskSettings } from "./settings"
import { Language } from "./language"
import { Question } from "../question"

export interface KioskFields {
  kioskIdentifier: string;
  printerUrl: string;
  hasPrinter: boolean;
  hasKioskModeEnable: boolean;
  url: string;
}

export enum RegisterKioskFields {
  hasPrinter = "hasPrinter",
  kioskIdentifier = "kioskIdentifier",
  printerUrl = "printerUrl",
  url = "url",
  hasKioskModeEnable = "hasKioskModeEnable"
}

export enum KioskCustomerFields {
  email = "email",
  mobileNumber = "mobileNumber",
  name = "name",
  orderNumber = "orderNumber"
}

export enum privacyPolicyShowOptions {
  inline = "INLINE",
  popup = "POPUP",
  none = "NONE"
}

export interface PrivacyPolicy {
    addCustomerJourney: string
    agreeButtonText: string
    createBookingJourney: string
    disagreeButtonText: string
    displayPrivacyPolicy: boolean
    onlineAppointmentBookingJourney: string
    onlineEventBookingJourney: string
    privacyPolicyHeader: string
    privacyPolicyHyperlinkText: string
    privacyPolicyText: string
    privacyPolicyURL: string | null
    staffEventBookingJourney: string
    hasAgreed: boolean
}

export interface KioskState {
  isAddingCustomerToQueue: boolean;
  customer: KioskCustomer;
  customerInQueue?: CustomerInQueue;
  data: KioskQueueData[];
  error?: string;
  fields: KioskFields;
  isFetching: boolean;
  kioskId?: string;
  language?: Language;
  product?: AnyProduct;
  serial: string;
  settings?: KioskSettings;
  subProduct?: AnyProduct;
  venueCountry?: CountryCode;
  privacyPolicy: PrivacyPolicy;
}

export interface Placeholders {
  "{average-wait}": string
  "{customer-name}": string
  "{minutes-left}": string
  "{position}": number
  "{queue-length}": number
  "{queue-name}": string
  "{ticket}": string
  "{time}": number
  "{venue-name}": string
}

export interface ErrorPayload {
  title: string
  message?: string
}

export interface FieldUpdatePayload {
  name: RegisterKioskFields;
  value: string | boolean;
}

export interface StringPayload extends Action {
  payload: string;
}

export interface NumberPayload extends Action {
  payload: number;
}

export interface RegisterKioskFieldUpdate extends Action {
  payload: FieldUpdatePayload
}

export interface RegisterKioskSuccess extends Action {
  payload: {
    id: string;
  }
}

export interface KioskSettingsFieldUpdate extends Action {
  payload: FieldUpdatePayload
}

export interface QuestionsPayload extends Action {
  payload: Question[];
}

export interface ProductPayload extends Action {
  payload: Product | AnyProduct;
}

export interface DatePayload extends Action {
  payload: Date;
}

export interface LanguagePayload extends Action {
  payload: Language;
}

export interface CustomerInQueuePayload extends Action {
  payload: {
    customerInQueue: CustomerInQueue;
  }
}

export interface GetKioskDataSuccess extends Action {
  payload: KioskQueueData[];
}

export interface GetKioskSettingsSuccess extends Action {
  payload: KioskSettings;
}

export interface LoadScreenSaverDataSuccess extends Action {
  backgroundTask: boolean;
  payload: {
    videoURL: string;
    screenSaverEnableInSeconds: number;
    enableScreensaver: boolean;
  }
}

export interface LoadPrivacyPolicySuccess extends Action {
  backgroundTask: boolean;
  payload: PrivacyPolicy
}

export interface AddPrivateCustomerToQueueRequest extends Action {
  queueId?: number,
  productId?: number
}

export interface AddPrivateCustomerToQueueSuccess extends Action {
  payload: {
    customerInQueue: CustomerInQueue
  }
}

export interface AddCustomerToQueueSuccess extends Action {
  payload: {
    customerInQueue: CustomerInQueue
  }
}

export interface AddCustomerToQueueReset extends Action {
  backgroundTask?: boolean
}

export interface LoadScreenSaverDataRequest extends Action {
  backgroundTask: boolean;
}

export interface LoadScreenSaverDataFail extends Action {
  payload: ErrorPayload,
  backgroundTask: boolean;
}
