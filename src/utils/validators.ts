import { ValidatorFn } from "../interfaces"
import { isValidNumberForRegion, isValidNumber, CountryCode } from "libphonenumber-js"
import { getLocaleString } from './localeString'

// tslint:disable-next-line:max-line-length // NOSONAR
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
// tslint:disable-next-line:max-line-length // NOSONAR
const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
// tslint:disable-next-line:max-line-length // NOSONAR
const ipv6Regex = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/

export enum ERROR {
  EMAIL_INVALID = "Not valid email address",
  IP_INVALID = "Not valid IP address",
  PHONE_INVALID = "Please enter a valid phone number",
  QUDINI_URL_INVALID = "Not a valid URL",
  STRLEN = "String is empty",
}

export const stringNotEmpty = (str?: string) => str && str.trim().length > 0

export const strlen: ValidatorFn = (str: string) => {
  if (stringNotEmpty(str)) {
    return { error: "" }
  } else {
    return { error: ERROR.STRLEN }
  }
}

const isCountryCodeIndia = (countryCode?: string) => countryCode === "IN"

export const phoneNumber: ValidatorFn = (str: string, countryCode?: string) => {

  if (!stringNotEmpty(str) || isCountryCodeIndia(countryCode)) {
    return { error: "" }
  }

  let isValidPhone = false
  if (countryCode) {
    countryCode = countryCode.toUpperCase()
    isValidPhone = isValidNumberForRegion(str, countryCode as CountryCode)
  } else {
    isValidPhone = isValidNumber(str)
  }
  if (isValidPhone) {
    return { error: "" }
  } else {
    return { error: getLocaleString("welcomeScreen.error.customer.mobile") || ERROR.PHONE_INVALID }
  }
}

export const email: ValidatorFn = (str: string) => {
  if (!stringNotEmpty(str)) {
    return { error: "" }
  }
  if (emailRegex.test(str)) {
    return { error: "" }
  } else {
    return { error: getLocaleString("welcomeScreen.error.customer.invalidEmail") || ERROR.EMAIL_INVALID }
  }
}

export const ip: ValidatorFn = (str: string) => {
  if (!stringNotEmpty(str)) {
    return { error: "" }
  }
  if (ipv4Regex.test(str) || ipv6Regex.test(str)) {
    return { error: "" }
  } else {
    return { error: ERROR.IP_INVALID }
  }
}

export const qudiniUrl: ValidatorFn = (str: string) => {
  const validUrl = /https?:\/\/.+\.qudini\.com$/
  if (validUrl.test(str)) {
    return { error: "" }
  } else {
    return { error: ERROR.QUDINI_URL_INVALID }
  }
}

export default {
  email,
  ip,
  phoneNumber,
  qudiniUrl,
  strlen,
}
