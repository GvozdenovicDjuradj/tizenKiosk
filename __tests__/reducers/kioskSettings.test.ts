import { KIOSK_SETTINGS_FORM, OTHER_ACTION } from "../../src/actions/types"
import reducer, { initialState, KioskSettingsForm } from "../../src/reducers/kioskSettings"
import { registerKiosk } from "../../src/actions"
import * as faker from "faker"

describe("check-in reducer tests", () => {
  const hasPrinter = true
  const kioskIdentifier = "123456"
  const printerUrl = "192.168.1.1"
  const url = "https://qa.qudini.com"

  it("should set empty object as initial state", () => {
    expect(reducer({} as KioskSettingsForm, { type: OTHER_ACTION })).not.toBe(initialState)
  })

  it("should set initial state", () => {
    expect(reducer(initialState, { type: OTHER_ACTION })).toEqual(initialState)
  })

  it("should set values", () => {
    expect(reducer(initialState, {
      type: KIOSK_SETTINGS_FORM.SET_INITIAL_VALUES.SUCCESS,
      hasPrinter,
      kioskIdentifier,
      printerUrl,
      url,
    })).toEqual({
      ...initialState,
      hasPrinter,
      kioskIdentifier,
      printerUrl,
      url
    })
  })

  it("should update value in one field", () => {
    expect(reducer(initialState, {
      type: KIOSK_SETTINGS_FORM.FIELD_UPDATE.REQUEST,
      payload: {
        name: "kioskIdentifier",
        value: kioskIdentifier
      }
    })).toEqual({ ...initialState, kioskIdentifier })
  })

  it("should set diagnostic messages (validate.success)", () => {
    expect(reducer(initialState, {
      type: KIOSK_SETTINGS_FORM.VALIDATE.SUCCESS,
      messages: ["test validate success"]
    })).toEqual({ ...initialState, diagnosticMessages: ["test validate success"] })
  })

  it("should set diagnostic messages (validate.failure)", () => {
    expect(reducer(initialState, {
      type: KIOSK_SETTINGS_FORM.VALIDATE.FAILURE,
      messages: ["test validate failure"]
    })).toEqual({ ...initialState, diagnosticMessages: ["test validate failure"] })
  })

  it("should set diagnostic messages (check_network.success)", () => {
    expect(reducer(initialState, {
      type: KIOSK_SETTINGS_FORM.CHECK_NETWORK.SUCCESS,
      messages: ["test check network success"]
    })).toEqual({ ...initialState, diagnosticMessages: ["test check network success"] })
  })

  it("should react to KIOSK_REGISTER_REQUEST and update the hasPrinter property", () => {
    // Given
    const showPrint = faker.random.boolean()
    const action = registerKiosk(showPrint)

    // When
    const result = reducer(initialState, action)

    // Then
    expect(result).toHaveProperty("hasPrinter", showPrint)
  })

})
