import { AnyAction } from "redux"
import { expectSaga } from "redux-saga-test-plan"
import { KIOSK, KIOSK_SETTINGS_FORM } from "../../src/actions/types"
import { validateSettings } from "../../src/sagas/kioskSettings"

describe("Kiosk secret settings test", () => {
  let initialState: {
    kioskSettings: {
      diagnosticMessages: string[]
      kioskIdentifier: string
      url: string
    }
    kiosk?: { kioskId: string, serial: string }
  }
  const reducer = (state = initialState, action: AnyAction) => {
    const { type, messages } = action
    if (type === KIOSK_SETTINGS_FORM.VALIDATE.FAILURE || type === KIOSK_SETTINGS_FORM.VALIDATE.SUCCESS) {
      return {
        ...state,
        kioskSettings: {
          ...state.kioskSettings,
          diagnosticMessages: messages
        }
      }
    }
    return state
  }

  beforeEach(() => {
    initialState = {
      kioskSettings: {
        diagnosticMessages: [],
        kioskIdentifier: "",
        url: "",
      }
    }
  })

  it("should put validation failed for empty url", () => {
    const finalState = {
      kioskSettings: {
        ...initialState.kioskSettings,
        diagnosticMessages: ["VALIDATION FAILED: url must be not empty"]
      }
    }

    return expectSaga(validateSettings)
      .withState(initialState)
      .withReducer(reducer)
      .put({
        type: KIOSK_SETTINGS_FORM.VALIDATE.FAILURE,
        messages: ["VALIDATION FAILED: url must be not empty"]
      })
      .hasFinalState(finalState)
      .run()
  })

  it("should put validation failed for invalid url", () => {
    const url = "invalid::url"
    const finalState = {
      kioskSettings: {
        ...initialState.kioskSettings,
        diagnosticMessages: [`VALIDATION FAILED: ${url} doesn't seem to be a valid URL`],
        url
      }
    }
    initialState = {
      ...initialState,
      kioskSettings: { ...initialState.kioskSettings, url }
    }
    return expectSaga(validateSettings)
      .withState(initialState)
      .withReducer(reducer)
      .put({
        type: KIOSK_SETTINGS_FORM.VALIDATE.FAILURE,
        messages: [`VALIDATION FAILED: ${url} doesn't seem to be a valid URL`]
      })
      .hasFinalState(finalState)
      .run()
  })

  it("should put validation failed for empty kiosk ID", () => {
    const url = "https://qa.qudini.com"
    const finalState = {
      kioskSettings: {
        ...initialState.kioskSettings,
        diagnosticMessages: ["VALIDATION FAILED: Kiosk ID must be not empty"],
        url
      }
    }
    initialState = {
      ...initialState,
      kioskSettings: { ...initialState.kioskSettings, url }
    }
    return expectSaga(validateSettings)
      .withState(initialState)
      .withReducer(reducer)
      .put({
        type: KIOSK_SETTINGS_FORM.VALIDATE.FAILURE,
        messages: ["VALIDATION FAILED: Kiosk ID must be not empty"]
      })
      .hasFinalState(finalState)
      .run()
  })

  it("should fail at register kiosk action", () => {
    initialState = {
      ...initialState,
      kioskSettings: {
        ...initialState.kioskSettings,
        kioskIdentifier: "123456",
        url: "https://qa.qudini.com"
      },
      kiosk: { kioskId: "123456", serial: "1234567890" }
    }

    return expectSaga(validateSettings)
      .withState(initialState)
      .provide({
        race: () => ({ failed: { errorMessage: "Test error" } })
      })
      .put({
        type: KIOSK.REGISTER.REQUEST,
        fields: initialState.kioskSettings,
        suppressErrorMessage: true
      })
      .put({
        type: KIOSK_SETTINGS_FORM.VALIDATE.FAILURE,
        messages: ["VALIDATION FAILED: Test error"]
      })
      .run()
  })

  it("should put validate success", () => {
    initialState = {
      ...initialState,
      kioskSettings: {
        ...initialState.kioskSettings,
        kioskIdentifier: "123456",
        url: "https://qa.qudini.com"
      },
      kiosk: { kioskId: "123456", serial: "1234567890" }
    }

    return expectSaga(validateSettings)
      .withState(initialState)
      .provide({
        race: () => ({ success: undefined })
      })
      .put({
        type: KIOSK.REGISTER.REQUEST,
        fields: initialState.kioskSettings,
        suppressErrorMessage: true
      })
      .put({
        type: KIOSK_SETTINGS_FORM.VALIDATE.SUCCESS,
        messages: ["Kiosk Registered successfully"],
        fields: initialState.kioskSettings
      })
      .put({
        type: KIOSK.FIELD_UPDATE.REQUEST,
        payload: {
          name: "kioskIdentifier",
          value: "123456"
        }
      })
      .run()
  })

})
