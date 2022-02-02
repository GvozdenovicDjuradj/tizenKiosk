import { AnyAction } from "redux"
import { expectSaga } from "redux-saga-test-plan"
import { KIOSK } from "../../src/actions/types"
import { Language, KioskSettings, KioskTemplate } from "../../src/interfaces"
import { setDefaultLanguage } from "../../src/sagas/kiosk"

describe("Setting default kiosk language test", () => {
  let initialState: {
    kiosk: {
      language?: Language
      settings?: Partial<KioskSettings>
    }
  }
  const reducer = (state = initialState, action: AnyAction) => {
    if (action.type === KIOSK.SET_LANGUAGE.REQUEST) {
      return { ...state, kiosk: { ...state.kiosk, language: action.payload } }
    }
    return state
  }
  const language: Language = {
    countryCallingCode: "+44",
    countryIsoCode: "GB",
    countryName: "United Kingdom",
    languageIsoCode: "en",
    languageName: "en"
  }
  const template: Partial<KioskTemplate> = {
    languages: {
      mainLanguage: language,
      otherLanguages: [],
      translations: {},
    },
  }

  beforeEach(() => {
    initialState = {
      kiosk: {
        language: undefined,
        settings: undefined,
      }
    }
  })

  it("should skip setting default kiosk language", () => {
    initialState.kiosk.language = language

    return expectSaga(setDefaultLanguage)
      .withReducer(reducer)
      .hasFinalState(initialState)
      .run()
  })

  it("should set kiosk default language", () => {
    initialState.kiosk.settings = { template: template as KioskTemplate }

    return expectSaga(setDefaultLanguage)
      .withReducer(reducer)
      .put({
        type: KIOSK.SET_LANGUAGE.REQUEST,
        payload: language
      })
      .hasFinalState({
        kiosk: {
          language,
          settings: { template },
        }
      })
      .run()
  })

})
