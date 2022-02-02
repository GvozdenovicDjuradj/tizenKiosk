import moxios from "moxios"
import axios from "axios"
import { expectSaga } from "redux-saga-test-plan"
import { select } from "redux-saga/effects"
import { KIOSK } from "../../src/actions/types"
import { selectors } from "../../src/utils"
import { KioskFields } from "../../src/interfaces"
import { loadKioskQueueData } from "../../src/sagas/kiosk"

describe("Load kiosk queue data saga tests", () => {

  const kioskFieldsMock: KioskFields = {
    hasKioskModeEnable: false,
    hasPrinter: false,
    kioskIdentifier: "123",
    printerUrl: "",
    url: "https://qa.qudini.com",
  }

  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it("should fail loading kiosk queue data", () => {
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

    return expectSaga(loadKioskQueueData, {})
      .provide([
        [select(selectors.getKioskFieldsSelector), kioskFieldsMock],
        [select(selectors.kioskIdSelector), "123456"],
        [select(selectors.serialSelector), "1234567890"],
      ])
      .put({
        type: KIOSK.QUEUE_DATA.FAILURE,
        backgroundTask: undefined,
        payload: "Matching device not found"
      })
      .run()
  })

  it("should load kiosk queue data successfully", () => {

    moxios.wait(() => moxios
      .requests
      .mostRecent()
      .respondWith({
        status: 200,
        response: { data: "Data goes here" }
      })
    )

    return expectSaga(loadKioskQueueData, { backgroundTask: true })
      .provide([
        [select(selectors.getKioskFieldsSelector), kioskFieldsMock],
        [select(selectors.kioskIdSelector), "123456"],
        [select(selectors.serialSelector), "1234567890"],
      ])
      .put({
        type: KIOSK.QUEUE_DATA.SUCCESS,
        backgroundTask: true,
        payload: { data: "Data goes here" }
      })
      .run()
  })

})
