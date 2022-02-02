import { NetInfo, ConnectionInfo } from "react-native"
import parseUrl from "url-parse"
import { put, select, takeEvery, call, race, take, takeLatest } from "redux-saga/effects"
import { APP, KIOSK_SETTINGS_FORM, MODAL, KIOSK } from "../actions/types"
import { selectors, } from "../utils"
import callApi from "./api"
import { KioskFields, RootState } from "../interfaces"
import { KioskSettingsForm } from "../reducers/kioskSettings"

export function* showSecretSettings() {
  const fields = yield select(selectors.getKioskFieldsSelector)

  yield put({
    type: KIOSK_SETTINGS_FORM.SET_INITIAL_VALUES.SUCCESS,
    ...fields
  })

  yield put({
    type: MODAL.SHOW.REQUEST,
    componentName: "settings"
  })
}

export function* checkNetworkConnection() {
  const connectionInfo: ConnectionInfo = yield call(NetInfo.getConnectionInfo)
  const kioskFields: KioskFields = yield select(selectors.getKioskFieldsSelector)
  const messages: string[] = []

  if (connectionInfo.type.toLowerCase() === "none") {
    messages.push("Device: offline")
  } else {
    messages.push("Device: online")
  }

  try {
    yield call(callApi, kioskFields.url)
    messages.push("Qudini: online")
  } catch (e) {
    messages.push(`Qudini: connection attempt failed (${kioskFields.url})`)
  }
  try {
    yield call(callApi, "https://www.google.com")
    messages.push("Google: online")
  } catch (e) {
    messages.push("Google: connection attempt failed (https://www.google.com)")
  }
  yield put({
    type: KIOSK_SETTINGS_FORM.CHECK_NETWORK.SUCCESS,
    messages
  })
}

export function* saveSettings() {
  const fields: KioskSettingsForm = yield select((state: RootState) => state.kioskSettings)
  yield put({
    type: KIOSK.FIELD_UPDATE.REQUEST,
    payload: {
      name: "hasPrinter",
      value: fields.hasPrinter
    }
  })
  if (fields.hasPrinter) {
    yield put({
      type: KIOSK.FIELD_UPDATE.REQUEST,
      payload: {
        name: "printerUrl",
        value: fields.printerUrl
      }
    })
  }
}

const isValidUrl = (url: string): boolean => {
  const { hostname, protocol } = parseUrl(url)
  return Boolean(hostname) && Boolean(protocol)
}

export function* settingsValidationFailed(messages: string[]) {
  yield put({
    type: KIOSK_SETTINGS_FORM.VALIDATE.FAILURE,
    messages
  })
}

export function* validateSettings() {
  const fields: KioskSettingsForm = yield select((state: RootState) => state.kioskSettings)
  if (!fields.url) {
    yield settingsValidationFailed(["VALIDATION FAILED: url must be not empty"])
    return
  }
  if (!isValidUrl(fields.url)) {
    yield settingsValidationFailed([`VALIDATION FAILED: ${fields.url} doesn't seem to be a valid URL`])
    return
  }
  if (!fields.kioskIdentifier) {
    yield settingsValidationFailed(["VALIDATION FAILED: Kiosk ID must be not empty"])
    return
  }

  const registerKioskAction = {
    type: KIOSK.REGISTER.REQUEST,
    fields,
    suppressErrorMessage: true
  }
  yield put(registerKioskAction)
  const {
    failed
  } = yield race({
    success: take(KIOSK.REGISTER.SUCCESS),
    failed: take(KIOSK.REGISTER.FAILURE)
  })

  if (failed) {
    yield settingsValidationFailed([`VALIDATION FAILED: ${failed.errorMessage}`])
  } else {
    yield put({
      type: KIOSK_SETTINGS_FORM.VALIDATE.SUCCESS,
      messages: ["Kiosk Registered successfully"],
      fields
    })
    const newKioskId = yield select(selectors.kioskIdSelector)
    yield put({
      type: KIOSK.FIELD_UPDATE.REQUEST,
      payload: {
        name: "kioskIdentifier",
        value: newKioskId
      }
    })
    yield put({
      type: KIOSK.FIELD_UPDATE.REQUEST,
      payload: {
        name: "url",
        value: fields.url
      }
    })
    yield put({ type: KIOSK.SETTINGS.REQUEST })
  }
}

export const kioskSettingsSagas = [
  takeEvery(APP.SECRET_TAP.SUCCESS, showSecretSettings),
  takeLatest(KIOSK_SETTINGS_FORM.CHECK_NETWORK.REQUEST, checkNetworkConnection),
  takeLatest(KIOSK_SETTINGS_FORM.SUBMIT.REQUEST, saveSettings),
  takeLatest(KIOSK_SETTINGS_FORM.VALIDATE.REQUEST, validateSettings),
]
