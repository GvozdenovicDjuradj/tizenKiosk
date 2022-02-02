import moxios from "moxios"
import axios from "axios"
import { expectSaga } from "redux-saga-test-plan"
import { select } from "redux-saga/effects"
import { KIOSK } from "../../src/actions/types"
import { selectors } from "../../src/utils"
import { KioskFields } from "../../src/interfaces"
import { loadKioskSettings } from "../../src/sagas/kiosk"

describe("Load kiosk settings saga tests", () => {

  let kioskFieldsMock: KioskFields

  beforeEach(() => {
    moxios.install()
    kioskFieldsMock = {
      hasKioskModeEnable: false,
      hasPrinter: false,
      kioskIdentifier: "123",
      printerUrl: "",
      url: "https://qa.qudini.com",
    }
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it("should fail loading kiosk settings", () => {
    axios.interceptors.response.use(
      response => response,
      error => Promise.reject(new Error(error.response.data.error))
    )

    moxios.wait(() => moxios
      .requests
      .mostRecent()
      .respondWith({
        status: 404,
        response: { error: "Matching device not found" }
      })
    )

    return expectSaga(loadKioskSettings)
      .provide([
        [select(selectors.getKioskFieldsSelector), kioskFieldsMock],
        [select(selectors.kioskIdSelector), "123456"],
        [select(selectors.serialSelector), "1234567890"],
      ])
      .put({
        type: KIOSK.SETTINGS.FAILURE,
        payload: "Matching device not found"
      })
      .run()
  })

  it("should load kiosk settings successfully", () => {

    moxios.wait(() => moxios
      .requests
      .mostRecent()
      .respondWith({
        status: 200,
        response: { data: "Settings goes here" }
      })
    )

    return expectSaga(loadKioskSettings)
      .provide([
        [select(selectors.getKioskFieldsSelector), kioskFieldsMock],
        [select(selectors.kioskIdSelector), "123456"],
        [select(selectors.serialSelector), "1234567890"],
      ])
      .put({
        type: KIOSK.SETTINGS.SUCCESS,
        payload: { data: "Settings goes here" }
      })
      .run()
  })

})
