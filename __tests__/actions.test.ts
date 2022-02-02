import configureMockStore, { MockStoreEnhanced } from "redux-mock-store"
import {
  addCustomerToQueue,
  changeInitialPage,
  changeLanguage,
  checkIn,
  checkNetwork,
  deactivateApp,
  goToInitialScreen,
  initApp,
  loadKioskQueueData,
  loadKioskSettings,
  registerKiosk,
  registerKioskFieldUpdate,
  saveKioskSettingsChanges,
  setCallingCode,
  setCheckInEmail,
  setCheckInMobile,
  setCheckInOrder,
  setCustomerCountry,
  setCustomerEmail,
  setCustomerMobile,
  setCustomerName,
  setCustomerOrder,
  setProduct,
  setSubProduct,
  setVenueCountry,
  stopApp,
  updateSettingsField,
  validateKioskSettings,
  secretTap,
  getPermissionReadPhoneState,
} from "../src/actions"
import { validationStateChange } from "../src/actions/validation"
import {
  AnyProduct,
  AppScreens,
  FieldUpdatePayload,
  Language,
  Product,
  RegisterKioskFields,
} from "../src/interfaces"

describe("Validation action test", () => {

  it(`Should return object with "type" and "payload"`, () => {
    const store = configureMockStore()({
      validation: {
        [AppScreens.HOME]: {
          url: {
            error: ["Some error message"],
            valid: false
          }
        }
      }
    })
    const change = {
      [AppScreens.HOME]: {
        url: { error: [], valid: true }
      }
    }
    expect(store.dispatch(validationStateChange(change))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

})

describe("Kiosk actions tests", () => {

  let store: MockStoreEnhanced

  beforeEach(() => {
    store = configureMockStore()()
  })

  it(`Should return object with property "type"`, () => {
    expect(store.dispatch(registerKiosk(true))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return object with property "type"`, () => {
    expect(store.dispatch(checkIn())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with Customer Email (string) in payload`, () => {
    const payload = "test@qudini.com"
    expect(store.dispatch(setCheckInEmail(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with Customer Email (string) in payload`, () => {
    const payload = "123456"
    expect(store.dispatch(setCheckInOrder(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with Customer Mobile number (string) in payload`, () => {
    const payload = "+380663705600"
    expect(store.dispatch(setCheckInMobile(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return object with property "type"`, () => {
    expect(store.dispatch(addCustomerToQueue())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`should return object with payload for updating field value`, () => {
    const payload = {
      name: RegisterKioskFields.url,
      value: "https://qa.qudini.com"
    }
    expect(store.dispatch(registerKioskFieldUpdate(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with Language as payload`, () => {
    const payload: Language = {
      countryCallingCode: "",
      countryIsoCode: "GB",
      countryName: "GB",
      languageIsoCode: "en",
      languageName: "en",
    }
    expect(store.dispatch(changeLanguage(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with Customer country (string) in payload`, () => {
    const payload = "Country"
    expect(store.dispatch(setCustomerCountry(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with calling code (string) in payload`, () => {
    const payload = "+44"
    expect(store.dispatch(setCallingCode(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with Customer Name (string) in payload`, () => {
    const payload = "Some name"
    expect(store.dispatch(setCustomerName(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with Customer Mobile number (string) in payload`, () => {
    const payload = "+380663705600"
    expect(store.dispatch(setCustomerMobile(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with Customer Email (string) in payload`, () => {
    const payload = "test@qudini.com"
    expect(store.dispatch(setCustomerEmail(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with Customer Order number (string) in payload`, () => {
    const payload = "123456"
    expect(store.dispatch(setCustomerOrder(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`should return action with Venue country (string) in payload`, () => {
    const payload = "UK"
    expect(store.dispatch(setVenueCountry(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return object with property "type"`, () => {
    expect(store.dispatch(goToInitialScreen())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return object with property "type"`, () => {
    expect(store.dispatch(loadKioskQueueData())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return object with property "type"`, () => {
    expect(store.dispatch(loadKioskSettings())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with Product in payload`, () => {
    const payload: Product = {
      waitTime: 0,
      id: 0,
      name: "test",
      queueId: 0,
      queueName: "test"
    }
    expect(store.dispatch(setProduct(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`Should return action with AnyProduct in payload`, () => {
    const payload: AnyProduct = {
      id: 0,
      name: "test",
      queueId: 0,
      queueName: "test",
      infoText: "info text",
      showInfo: true,
      products: [{
        id: "000",
        infoText: "info sub text",
        showInfo: true,
        subTitle: "subtitle",
      }]
    }
    expect(store.dispatch(setSubProduct(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

})

describe("Kiosk Settings actions tests", () => {

  let store: MockStoreEnhanced

  beforeEach(() => {
    store = configureMockStore()()
  })

  it(`should return action to trigger network check`, () => {
    expect(store.dispatch(checkNetwork())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`should return action to trigger save kiosk settings`, () => {
    expect(store.dispatch(saveKioskSettingsChanges())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`should return action to update kiosk settings field`, () => {
    const payload: FieldUpdatePayload = {
      name: RegisterKioskFields.kioskIdentifier,
      value: "test"
    }
    expect(store.dispatch(updateSettingsField(payload))).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`should return action to trigger validation of kiosk settings
      and change Kiosk Identifier and/or Url if valid`, () => {
    expect(store.dispatch(validateKioskSettings())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

})

describe("App actions tests", () => {

  let store: MockStoreEnhanced

  beforeEach(() => {
    store = configureMockStore()()
  })

  it(`should return action to trigger App start`, () => {
    expect(store.dispatch(initApp())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`should return action to trigger App stop`, () => {
    expect(store.dispatch(stopApp())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`should return action to change initial App screen`, () => {
    const action = changeInitialPage(AppScreens.SERVICE_SELECTION)
    expect(store.dispatch(action)).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`should return action to deactivate Kiosk`, () => {
    expect(store.dispatch(deactivateApp())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`should return action to trigger secret tap`, () => {
    expect(store.dispatch(secretTap())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })

  it(`should return action to trigger get permission read phone state`, () => {
    expect(store.dispatch(getPermissionReadPhoneState())).toMatchSnapshot()
    expect(store.getActions()).toMatchSnapshot()
  })
})
