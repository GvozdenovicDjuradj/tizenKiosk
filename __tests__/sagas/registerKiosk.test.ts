import moxios from "moxios"
import { expectSaga } from "redux-saga-test-plan"
import { select } from "redux-saga/effects"
import { registerKiosk } from "../../src/sagas/kiosk"
import { KIOSK } from "../../src/actions/types"
import { selectors } from "../../src/utils"
import { KioskFields } from "../../src/interfaces"

describe("Kiosk assign saga tests", () => {

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

  it("should fail kiosk assign", () => {

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).toBe(`${kioskFieldsMock.url}/api/kiosk/assign`)
      return request.respondWith({
        response: { status: "not ok" },
        status: 200
      })
    })

    return expectSaga(registerKiosk, { type: KIOSK.REGISTER.REQUEST })
      .provide([
        [select(selectors.getKioskFieldsSelector), kioskFieldsMock],
        [select(selectors.serialSelector), "1234567890"],
        [select(selectors.getImei), "123"]
      ])
      .put({
        type: KIOSK.REGISTER.FAILURE,
        payload: "not ok",
        errorMessage: "not ok"
      })
      .run()
  })

  it("should throw error about missing data", () => {
    kioskFieldsMock.kioskIdentifier = ""
    kioskFieldsMock.url = ""

    return expectSaga(registerKiosk, { type: KIOSK.REGISTER.REQUEST })
      .provide([
        [select(selectors.getKioskFieldsSelector), kioskFieldsMock],
        [select(selectors.serialSelector), "1234567890"]
      ])
      .put({
        type: KIOSK.REGISTER.FAILURE,
        payload: "Registration URL or Kiosk ID is missing",
        errorMessage: "Registration URL or Kiosk ID is missing"
      })
      .run()
  })

  it("should assign kiosk successfully", () => {
    kioskFieldsMock.hasPrinter = true
    kioskFieldsMock.printerUrl = "192.168.1.1"

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).toBe(`${kioskFieldsMock.url}/api/kiosk/assign`)
      return request.respondWith({
        response: { status: "ok", id: 1 },
        status: 200
      })
    })

    return expectSaga(registerKiosk, { type: KIOSK.REGISTER.REQUEST })
      .provide([
        [select(selectors.getKioskFieldsSelector), kioskFieldsMock],
        [select(selectors.serialSelector), "1234567890"],
        [select(selectors.getImei), "123"]
      ])
      .put({
        type: KIOSK.REGISTER.SUCCESS,
        payload: { status: "ok", id: 1 },
      })
      .run()
  })

})
