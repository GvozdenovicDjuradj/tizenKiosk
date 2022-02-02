import { Store } from "redux"
import {
  fixUrl,
  getLocaleString,
  getRouteName,
  selectors,
  validators,
} from "../src/utils"
import { setNavigator } from "../src/navigation"
import { ERROR } from "../src/utils/validators"
import { setup as setupTranslationStore } from "../src/utils/localeString"
import { AppScreens, RootState, REQUIRED, privacyPolicyShowOptions } from "../src/interfaces"
import {
  createNavigator,
  createSettings,
  createState,
  createTemplate,
} from "./fixtures"

describe("util functions tests", () => {

  it("should set provided host for url", () => {
    // Given
    const url = "/api/kiosk/settings"
    const defaultHost = "https://qa.qudini.com"

    // Then
    expect(fixUrl(url, defaultHost)).toBe(`${defaultHost}${url}`)
  })

  it("test validator functions", () => {
    // Given
    const phone = "0800506800"
    const email = "test@qudini.com"
    const IPv4 = "192.168.1.1"
    const IPv6 = "2001:db8:a0b:12f0::1"
    const qudiniUrl = "https://app.qudini.com"

    // Then
    expect(validators.phoneNumber(phone)).toEqual({ error: ERROR.PHONE_INVALID })
    expect(validators.phoneNumber(phone, "ua")).toEqual({ error: "" })
    expect(validators.email("")).toEqual({ error: "" })
    expect(validators.email("test@email")).toEqual({ error: ERROR.EMAIL_INVALID })
    expect(validators.email(email)).toEqual({ error: "" })
    expect(validators.ip("")).toEqual({ error: "" })
    expect(validators.ip("192.168.1.257")).toEqual({ error: ERROR.IP_INVALID })
    expect(validators.ip(IPv4)).toEqual({ error: "" })
    expect(validators.ip("2001:db8:a0b:12fg")).toEqual({ error: ERROR.IP_INVALID })
    expect(validators.ip(IPv6)).toEqual({ error: "" })
    expect(validators.qudiniUrl("http://google.com")).toEqual({ error: ERROR.QUDINI_URL_INVALID })
    expect(validators.qudiniUrl(qudiniUrl)).toEqual({ error: "" })
  })

  it("should test selectors", () => {
    // Given
    const state = createState()
    const templateRequireMobile = createTemplate({
      customerScreenRequestMobileNumberWhen: REQUIRED.ALWAYS
    })
    const settings = createSettings({ template: templateRequireMobile })

    // Then
    expect(selectors.getKioskFieldsSelector(state)).toEqual(state.kiosk.fields)
    expect(selectors.serialSelector(state)).toBe(state.kiosk.serial)
    expect(selectors.kioskIdSelector(state)).toBe(state.kiosk.kioskId)
    expect(selectors.getKioskCustomerFieldsSelector(state)).toEqual({ ...state.kiosk.customer })
    expect(selectors.venueCountryCode(state)).toBe(state.kiosk.settings!.venue.defaultCountryCode)
    expect(selectors.isScreenValid(AppScreens.LOADING)(state)).toBeTruthy()
    expect(selectors.isScreenValid(AppScreens.HOME)(state)).toBeTruthy()
    expect(selectors.queueByProduct(state)).toEqual(state.kiosk.data[1])
    expect(selectors.getMerchantId(state)).toEqual(state.kiosk.settings && state.kiosk.settings.venue.merchant.id)
    expect(selectors.isPrivacyPolicyPopup(state)).toEqual(
      state.kiosk.privacyPolicy.displayPrivacyPolicy &&
      state.kiosk.privacyPolicy.addCustomerJourney === privacyPolicyShowOptions.inline
    )
    expect(selectors.hasAgreedToPrivacyPolicy(state)).toEqual(state.kiosk.privacyPolicy.hasAgreed)
    expect(selectors.getProductId(state)).toEqual(state.kiosk.product && state.kiosk.product.id)
    expect(selectors.getQueueId(state)).toEqual(state.kiosk.product && state.kiosk.product.queueId)
    expect(selectors.queueByProduct({
      ...state,
      kiosk: {
        ...state.kiosk,
        data: [],
        product: undefined
      }
    })).toBeUndefined()
    expect(selectors.mobileRequired(state)).toBeFalsy()
    expect(selectors.mobileRequired({
      ...state,
      kiosk: {
        ...state.kiosk,
        settings: {
          ...state.kiosk.settings,
          ...settings
        }
      }
    })).toBeTruthy()
    expect(selectors.showMobileNumber(state)).toBeFalsy()
    expect(selectors.showMobileNumber({
      ...state,
      kiosk: {
        ...state.kiosk,
        settings: {
          ...state.kiosk.settings,
          ...settings
        }
      }
    })).toBeTruthy()
    const videoURL = state.kiosk.settings && state.kiosk.settings.template ?
      state.kiosk.settings.template.videoURL : undefined
    expect(selectors.getScreenSaverVideo(state)).toEqual(videoURL)
  })

  it("should return translation string for selected language", () => {
    // Given
    const languages = {
      mainLanguage: {
        countryCallingCode: "+44",
        countryIsoCode: "GB",
        countryName: "United Kingdom",
        languageIsoCode: "en",
        languageName: "en"
      },
      otherLanguages: [{
        countryCallingCode: "+7",
        countryIsoCode: "RU",
        countryName: "Russia",
        languageIsoCode: "ru",
        languageName: "ru"
      }],
      translations: {
        en: { welcomeScreen: { center: { number: "test" } } },
        ru: { welcomeScreen: { center: { number: "test 2" } } },
      }
    }
    const language = {
      countryCallingCode: "+44",
      countryIsoCode: "GB",
      countryName: "United Kingdom",
      languageIsoCode: "en",
      languageName: "en"
    }
    const state = createState()
    const store = ({ getState: () => state })

    // Then
    expect(getLocaleString("welcomeScreen.center.number")).toBe("")
    setupTranslationStore(store as Store<RootState>)
    expect(getLocaleString("welcomeScreen.center.number")).toBe("")
    state.kiosk.language = language
    state.kiosk.settings!.template.languages = languages
    expect(getLocaleString("welcomeScreen.center.number")).toBe("test")
    state.kiosk.language = state.kiosk.settings!.template.languages.otherLanguages[0]
    expect(getLocaleString("welcomeScreen.center.number")).toBe("test 2")
    expect(getLocaleString("welcomeScreen.[center].[number]")).toBeUndefined()
  })

  it("should return current route name or undefined", () => {
    // Given
    const navigator = createNavigator()

    // Then
    expect(getRouteName()).toBeUndefined()
    navigator.state.nav.routes.push({
      index: 0,
      key: AppScreens.HOME,
      routeName: AppScreens.HOME,
      isTransitioning: false,
      routes: navigator.state.nav.routes
    })
    setNavigator(navigator)
    expect(getRouteName()).toBe(AppScreens.HOME)
    navigator.state.nav.routes.push({
      index: 1,
      key: AppScreens.CHECK_IN,
      routeName: AppScreens.CHECK_IN,
      isTransitioning: false,
      routes: navigator.state.nav.routes
    })
    navigator.state.nav.index = 1
    expect(getRouteName()).toBe(AppScreens.CHECK_IN)
  })

})
