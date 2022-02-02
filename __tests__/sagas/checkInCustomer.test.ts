import moxios from "moxios"
import { expectSaga } from "redux-saga-test-plan"
import { parsePhoneNumber } from "libphonenumber-js"
import qs from "qs"
import { KIOSK } from "../../src/actions/types"
import { checkInCustomer } from "../../src/sagas/kiosk"
import { goToCheckInConfirmationScreen } from "../../src/actions"

describe("Check in customer saga tests", () => {
  const state = {
    checkIn: {
      callingCode: "+44",
      email: undefined,
      mobileNumber: "07921873635",
      orderNumber: undefined,
    },
    kiosk: {
      fields: {
        hasPrinter: false,
        kioskIdentifier: "123",
        printerUrl: "",
        url: "https://qa.qudini.com",
      },
      serial: "1234567890",
      settings: {
        id: 0,
      }
    }
  }

  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it("should throw error if data missing", () => {
    const state$ = { ...state, checkIn: { } }

    return expectSaga(checkInCustomer)
      .withState(state$)
      .put({
        type: KIOSK.CHECK_IN.FAILURE,
        payload: "Either email, mobile number or reference number must be provided"
      })
      .run()
  })

  it("should fail to check-in customer (API response status 404)", () => {

    moxios.wait(() => moxios
      .requests
      .mostRecent()
      .respondWith({
        status: 404,
        response: {
          status: "Booking not found",
          statusDescription: "Please check your customer details"
        }
      })
    )

    return expectSaga(checkInCustomer)
      .withState(state)
      .put({
        type: KIOSK.CHECK_IN.FAILURE,
        payload: "Booking not found\nPlease check your customer details"
      })
      .run()
  })

  it("should fail to check-in customer (API response status 200)", () => {

    moxios.wait(() => moxios
      .requests
      .mostRecent()
      .respondWith({
        status: 200,
        response: { error: { description: "Booking not found" } }
      })
    )

    return expectSaga(checkInCustomer)
      .withState(state)
      .put({
        type: KIOSK.CHECK_IN.FAILURE,
        payload: "Booking not found"
      })
      .run()
  })

  it("should check-in customer successfully", () => {

    const mobile = parsePhoneNumber(
      `${state.checkIn.callingCode}${state.checkIn.mobileNumber}`
    )

    moxios.wait(() => {
      const req = moxios.requests.mostRecent()
      const data = qs.parse(req.config.data)

      expect(data.mobileNumber).toBe(mobile.formatNational().replace(/ +/g, ""))
      req.respondWith({
        status: 200,
        response: "Data goes here"
      })
    })

    return expectSaga(checkInCustomer)
      .withState(state)
      .put({
        type: KIOSK.CHECK_IN.SUCCESS,
        payload: "Data goes here"
      })
      .put(goToCheckInConfirmationScreen())
      .run()
  })

})
