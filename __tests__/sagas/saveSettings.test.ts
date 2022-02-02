import { AnyAction } from "redux"
import { expectSaga } from "redux-saga-test-plan"
import { KIOSK } from "../../src/actions/types"
import { saveSettings } from "../../src/sagas/kioskSettings"

describe("Kiosk secret settings test", () => {
  let initialState: {
    kiosk: { fields: { hasPrinter: boolean, printerUrl: string } }
    kioskSettings: { hasPrinter: boolean, printerUrl: string }
  }
  const reducer = (state = initialState, action: AnyAction) => {
    const { type, payload } = action
    if (type === KIOSK.FIELD_UPDATE.REQUEST) {
      return {
        ...state,
        kiosk: {
          fields: { ...state.kiosk.fields, [payload.name]: payload.value }
        }
      }
    }
    return state
  }

  beforeEach(() => {
    initialState = {
      kiosk: { fields: { hasPrinter: false, printerUrl: "" } },
      kioskSettings: { hasPrinter: false, printerUrl: "" }
    }
  })

  it(`should trigger save of "hasPrinter" flag`, () => {
    const finalState = { ...initialState }
    initialState = {
      ...initialState,
      kiosk: { fields: { ...initialState.kiosk.fields, hasPrinter: true } },
    }
    return expectSaga(saveSettings)
      .withState(initialState)
      .withReducer(reducer)
      .put({
        type: KIOSK.FIELD_UPDATE.REQUEST,
        payload: {
          name: "hasPrinter",
          value: initialState.kioskSettings.hasPrinter
        }
      })
      .hasFinalState(finalState)
      .run()
  })

  it(`should trigger save of "hasPrinter" flag and "printerUrl" field`, () => {
    initialState = {
      ...initialState,
      kioskSettings: { hasPrinter: true, printerUrl: "192.168.1.1" }
    }
    const finalState = {
      kiosk: { fields: { hasPrinter: true, printerUrl: "192.168.1.1" } },
      kioskSettings: { hasPrinter: true, printerUrl: "192.168.1.1" }
    }
    return expectSaga(saveSettings)
      .withState(initialState)
      .withReducer(reducer)
      .put({
        type: KIOSK.FIELD_UPDATE.REQUEST,
        payload: {
          name: "hasPrinter",
          value: initialState.kioskSettings.hasPrinter
        }
      })
      .put({
        type: KIOSK.FIELD_UPDATE.REQUEST,
        payload: {
          name: "printerUrl",
          value: initialState.kioskSettings.printerUrl
        }
      })
      .hasFinalState(finalState)
      .run()
  })

})
