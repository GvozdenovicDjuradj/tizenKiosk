import { NetInfo, ConnectionInfo } from "react-native"
import { expectSaga } from "redux-saga-test-plan"
import { call, select } from "redux-saga/effects"
import { KIOSK_SETTINGS_FORM } from "../../src/actions/types"
import { checkNetworkConnection } from "../../src/sagas/kioskSettings"
import callApi from "../../src/sagas/api"
import { selectors } from "../../src/utils"

describe("Kiosk secret settings network connection test", () => {
  let type = ""
  const kioskFields = { url: "https://qa.qudini.com" }

  beforeAll(() => {
    NetInfo.getConnectionInfo = jest.fn(() => Promise.resolve({ type }) as Promise<ConnectionInfo>)
  })

  afterEach(() => {
    type = ""
  })

  it("should check connection status and respond that Kiosk is offline", () => {
    type = "none"

    return expectSaga(checkNetworkConnection)
    .provide([
      [select(selectors.getKioskFieldsSelector), kioskFields],
      [call(callApi, kioskFields.url), Promise.reject(new Error("Network error"))],
      [call(callApi, "https://www.google.com"), Promise.reject(new Error("Network error"))],
    ])
    .put({
      type: KIOSK_SETTINGS_FORM.CHECK_NETWORK.SUCCESS,
      messages: [
        "Device: offline",
        `Qudini: connection attempt failed (${kioskFields.url})`,
        "Google: connection attempt failed (https://www.google.com)",
      ]
    })
    .run()
  })
  
  it("should check connection status and respond that Kiosk is online", () => {

    return expectSaga(checkNetworkConnection)
      .provide([
        [select(selectors.getKioskFieldsSelector), kioskFields],
        [call(callApi, kioskFields.url), Promise.resolve({})],
        [call(callApi, "https://www.google.com"), Promise.resolve({})],
      ])
      .put({
        type: KIOSK_SETTINGS_FORM.CHECK_NETWORK.SUCCESS,
        messages: [
          "Device: online",
          "Qudini: online",
          "Google: online",
        ]
      })
      .run()
  })

})
