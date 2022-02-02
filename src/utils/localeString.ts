import { Store } from "redux"
import { RootState } from "../interfaces"

let store: Store<RootState>

const getNested = (object: object, path: string, separator?: string) => {
  try {
    separator = separator || "."
    return path
      .replace("[", separator).replace("]", "")
      .split(separator)
      .reduce<any>((obj: { [key: string]: any }, property) => obj[property], object)
  } catch (err) {
    return undefined
  }
}

export const setup = (reduxStore: Store<RootState>) => {
  store = reduxStore
}

/**
 * @param key path in object i.e. "welcomeScreen.center.number"
 */
export const getLocaleString = (key: string): string => {
  if (!store) {
    return ""
  }
  const state: RootState = store.getState()
  if (!state.kiosk.settings || !state.kiosk.language) {
    return ""
  }
  const locale = state.kiosk.language
  const langCode = locale.languageIsoCode.toLowerCase()
  const { translations } = state.kiosk.settings.template.languages
  return getNested(translations[langCode], key)
}
