import { setKioskId, setKioskSerial, setKioskUrl } from "../../src/actions"
import { ADD_CUSTOMER_TO_QUEUE_START, KIOSK, OTHER_ACTION } from "../../src/actions/types"
import {
  AnyProduct,
  KioskCustomer,
  KioskQueueData,
  KioskState,
  Language,


  OpeningTimes, Product,
  RegisterKioskFields
} from "../../src/interfaces"
import kiosk, { initialState } from "../../src/reducers/kiosk"
import { createCustomerInQueue, createPrivacyPolicy, createSettings } from "../fixtures"

describe("Kiosk reducer tests", () => {

  it(`should set state from provided argument`, () => {
    expect(kiosk({} as KioskState, { type: OTHER_ACTION })).not.toEqual(initialState)
  })

  it(`should not update reducer state for another action type`, () => {
    expect(kiosk(initialState, { type: OTHER_ACTION })).toEqual(initialState)
  })

  it(`should switch loading state to "true"`, () => {
    expect(kiosk(initialState, {
      type: KIOSK.REGISTER.REQUEST,
    })).toEqual({ ...initialState, isFetching: true })
  })

  it(`should switch loading state to "false" and save kioskId`, () => {
    expect(kiosk(initialState, {
      payload: { id: 1 },
      type: KIOSK.REGISTER.SUCCESS,
    })).toEqual({ ...initialState, isFetching: false, kioskId: 1 })
  })

  it(`should set error`, () => {
    expect(kiosk(initialState, {
      payload: "error string",
      type: KIOSK.REGISTER.FAILURE,
    })).toEqual({ ...initialState, isFetching: false, error: "error string" })
  })

  it(`should check that reducer is updating values`, () => {
    expect(kiosk(initialState, {
      payload: {
        name: RegisterKioskFields.kioskIdentifier,
        value: "kiosk",
      },
      type: KIOSK.FIELD_UPDATE.REQUEST,
    }).fields.kioskIdentifier).toBe("kiosk")

    expect(kiosk(initialState, {
      payload: {
        name: RegisterKioskFields.hasPrinter,
        value: true,
      },
      type: KIOSK.FIELD_UPDATE.REQUEST,
    }).fields.hasPrinter).toBe(true)
  })

  it(`should switch loading state to "true" and remove error`, () => {
    const state = { ...initialState, error: "Test error" }
    expect(kiosk(state, {
      type: KIOSK.SETTINGS.REQUEST
    })).toEqual({ ...initialState, isFetching: true })
  })

  it(`should switch loading state to "false" and save kiosk settings`, () => {
    const state = { ...initialState, isFetching: true }
    const payload = createSettings()
    expect(kiosk(state, {
      type: KIOSK.SETTINGS.SUCCESS,
      payload
    })).toEqual({ ...initialState, isFetching: false, settings: payload })
  })

  it(`should switch loading state to "false" and set error`, () => {
    const state = { ...initialState, isFetching: true }
    expect(kiosk(state, {
      type: KIOSK.SETTINGS.FAILURE,
      payload: "Test error"
    })).toEqual({ ...initialState, isFetching: false, error: "Test error" })
  })

  it(`should switch loading state to "true" and remove error`, () => {
    const state = { ...initialState, error: "Test error" }
    expect(kiosk(state, {
      type: KIOSK.QUEUE_DATA.REQUEST
    })).toEqual({ ...initialState, isFetching: true, error: undefined })
  })

  it(`should switch loading state to "false" and save queue data`, () => {
    const state = { ...initialState, isFetching: true }
    const payload: KioskQueueData = {
      underOccupancy: true,
      fullyBooked: true,
      kioskOpeningTimes: { } as OpeningTimes,
      length: 0,
      openingTimes: { } as OpeningTimes,
      queueId: 0,
      serversAvailable: 0,
      storeOpen: true,
      waitTime: 1,
    }
    expect(kiosk(state, {
      type: KIOSK.QUEUE_DATA.SUCCESS,
      payload
    })).toEqual({ ...initialState, isFetching: false, data: payload })
  })

  it(`should switch loading state to "false" and set error`, () => {
    const state = { ...initialState, isFetching: true }
    const payload = "Failed to load data"
    expect(kiosk(state, {
      type: KIOSK.QUEUE_DATA.FAILURE,
      payload
    })).toEqual({ ...initialState, isFetching: false, error: payload })
  })

  it(`should set venue country`, () => {
    const payload = "GB"
    expect(kiosk(initialState, {
      type: KIOSK.SET_COUNTRY.REQUEST,
      payload
    })).toEqual({ ...initialState, venueCountry: payload })
  })

  it(`should set language`, () => {
    const payload: Language = {
      countryCallingCode: "+44",
      countryIsoCode: "GB",
      countryName: "United Kingdom",
      languageIsoCode: "en",
      languageName: "en",
    }
    expect(kiosk(initialState, {
      type: KIOSK.SET_LANGUAGE.REQUEST,
      payload
    })).toEqual({ ...initialState, language: payload })
  })

  it(`should set Customer name`, () => {
    expect(kiosk(initialState, {
      type: KIOSK.CUSTOMER.SET_NAME.REQUEST,
      payload: "Name"
    })).toEqual({
      ...initialState,
      customer: { ...initialState.customer, name: "Name" }
    })
  })

  it(`should set Customer email`, () => {
    expect(kiosk(initialState, {
      type: KIOSK.CUSTOMER.SET_EMAIL.REQUEST,
      payload: "test@qudini.com"
    })).toEqual({
      ...initialState,
      customer: { ...initialState.customer, email: "test@qudini.com" }
    })
  })

  it(`should set customer country`, () => {
    const payload = "GB"
    expect(kiosk(initialState, {
      type: KIOSK.CUSTOMER.SET_COUNTRY.REQUEST,
      payload
    })).toEqual({
      ...initialState,
      customer: {
        ...initialState.customer,
        country: payload
      }
    })
  })

  it(`should set customer calling code`, () => {
    const payload = "+44"
    expect(kiosk(initialState, {
      type: KIOSK.CUSTOMER.SET_CALLING_CODE.REQUEST,
      payload
    })).toEqual({
      ...initialState,
      customer: {
        ...initialState.customer,
        callingCode: payload
      }
    })
  })

  it(`should set Customer mobile number`, () => {
    expect(kiosk(initialState, {
      type: KIOSK.CUSTOMER.SET_MOBILE.REQUEST,
      payload: "+380663705600"
    })).toEqual({
      ...initialState,
      customer: {
        ...initialState.customer,
        mobileNumber: "+380663705600",
      mobileNumberForConfirmationScreen: "+380663705600" }
    })
  })

  it(`should set Customer order number`, () => {
    expect(kiosk(initialState, {
      type: KIOSK.CUSTOMER.SET_ORDER.REQUEST,
      payload: "123456"
    })).toEqual({
      ...initialState,
      customer: { ...initialState.customer, orderNumber: "123456" }
    })
  })

  it(`should set product selected`, () => {
    const payload: Product = {
      waitTime: 0,
      id: 0,
      name: "Test product",
      queueId: 0,
      queueName: "Test Queue 0",
    }
    expect(kiosk(initialState, {
      type: KIOSK.SET_PRODUCT.REQUEST,
      payload
    })).toEqual({ ...initialState, product: payload })
  })

  it(`should set sub-product selected`, () => {
    const payload: AnyProduct = {
      infoText: "infoText",
      name: "Test product",
      products: [{
        id: "0",
        infoText: "Test Sub-Product",
        showInfo: false,
        subTitle: "subTitle",
      }],
      queueId: 0,
      queueName: "Test Queue 0",
      showInfo: true,
      title: "title",
    }
    expect(kiosk(initialState, {
      type: KIOSK.SET_SUBPRODUCT.REQUEST,
      payload
    })).toEqual({ ...initialState, subProduct: payload })
  })

  it(`should trigger adding user to queue`, () => {
    const state = {
      ...initialState,
      customerInQueue: createCustomerInQueue()
    }
    expect(kiosk(state, {
      type: KIOSK.CUSTOMER.ADD_TO_QUEUE.REQUEST,
    })).toEqual({ ...initialState, isFetching: true })
  })

  it(`should set data about customer position in queue`, () => {
    const customer: KioskCustomer = {
      email: "test@qudini.com",
      mobileNumber: "",
      name: "John Doe",
      orderNumber: undefined,
    }
    const customerInQueue = createCustomerInQueue()
    const product: Product = {
      waitTime: 0,
      id: 0,
      name: "Test product",
      queueId: 0,
      queueName: "Test Queue 0",
    }
    const state = { ...initialState, customer, product }
    expect(kiosk(state, {
      type: KIOSK.CUSTOMER.ADD_TO_QUEUE.SUCCESS,
      payload: { customerInQueue }
    })).toEqual({ ...initialState, customerInQueue })
  })

  it(`should set error`, () => {
    expect(kiosk(initialState, {
      type: KIOSK.CUSTOMER.ADD_TO_QUEUE.FAILURE,
      payload: "Error"
    })).toEqual({ ...initialState, error: "Error" })
  })

  it(`should reset "customer", "customerInQueue" and "error" to initial values`, () => {
    const customer: KioskCustomer = {
      email: "test@qudini.com",
      mobileNumber: "+380663705600",
      name: "John Doe",
      orderNumber: undefined,
    }
    const customerInQueue = createCustomerInQueue()
    const error = "Test error"
    const state = { ...initialState, customer, customerInQueue, error }
    expect(kiosk(state, {
      type: KIOSK.CUSTOMER.ADD_TO_QUEUE.RESET,
    })).toEqual(initialState)
  })

  it(`should set screensaver settings data`, () => {
    const state = {
      ...initialState,
      settings: createSettings()
    }

    expect(kiosk(state, {
      type: KIOSK.LOAD_SCREEN_SAVER_DATA.SUCCESS,
      payload: {
        screenSaverEnableInSeconds: 5,
        videoURL: "https://google.com",
        enableScreensaver: true,
      }
    })).toEqual({
      ...state,
      settings: {
        ...state.settings,
        template: {
          ...state.settings.template,
          screenSaverEnableInSeconds: 5,
          videoURL: "https://google.com",
          enableScreensaver: true,
        }
      }
    })
  })

  it(`should set PrivacyPolicy data`, () => {
    const privacyPolicy = createPrivacyPolicy()
    const state = {...initialState, privacyPolicy}

    expect(kiosk(state, {
      type: KIOSK.LOAD_PRIVACY_POLICY_DATA.SUCCESS,
      payload:  { ...privacyPolicy }
    })).toEqual({
      ...state,
      privacyPolicy: { ...privacyPolicy }
    })
  })

  it(`should react to SET_KIOSK_ID`, () => {
    // Given
    const state = initialState
    const kioskId = "test"
    const action = setKioskId(kioskId)

    // When
    const result = kiosk(state, action)

    // Then
    expect(result).toBeDefined()
    expect(result).toHaveProperty("kioskId", kioskId)
  })

  it(`should react to SET_KIOSK_SERIAL`, () => {
    // Given
    const state = initialState
    const serial = "test"
    const action = setKioskSerial(serial)

    // When
    const result = kiosk(state, action)

    // Then
    expect(result).toBeDefined()
    expect(result).toHaveProperty("serial", serial)
  })

  it(`should react to SET_KIOSK_URL`, () => {
    // Given
    const state = initialState
    const url = "https://qa.qudini.com"
    const action = setKioskUrl(url)

    // When
    const result = kiosk(state, action)

    // Then
    expect(result).toBeDefined()
    expect(result).toHaveProperty("fields.url", url)
  })
  it(`should set PrivacyPolicy data`, () => {
    expect(kiosk(initialState, {
      type: ADD_CUSTOMER_TO_QUEUE_START,
    })).toEqual({
      ...initialState,
      isAddingCustomerToQueue: true,
    })
  });

})
