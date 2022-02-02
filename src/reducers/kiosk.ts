import { CountryCode } from "libphonenumber-js"
import { Platform } from "react-native"
import { CCA2Code } from "react-native-country-picker-modal"
import DeviceInfo from "react-native-device-info"
import { Reducer } from "redux"
import { SetKioskIdAction, SetKioskSerialAction, SetKioskUrlAction } from "../actions"
import {
  Action,




  ADD_CUSTOMER_TO_QUEUE_START,
  ADD_CUSTOMER_TO_QUEUE_STOP, APP,
  KIOSK,

  PRIVACY_POLICY_AGREE, PRIVACY_POLICY_DISAGREE
} from "../actions/types"
import { SET_KIOSK_ID, SET_KIOSK_SERIAL, SET_KIOSK_URL } from "../constants/kiosk"
import {
  CustomerInQueuePayload,
  GetKioskDataSuccess,
  GetKioskSettingsSuccess,
  KioskState,
  LanguagePayload,





  LoadPrivacyPolicySuccess, LoadScreenSaverDataSuccess, ProductPayload,
  RegisterKioskFieldUpdate,
  RegisterKioskSuccess,
  StringPayload,
  NumberPayload
} from "../interfaces"
import { fonts } from "../theme/fonts"

export const initialState: KioskState = {
  isAddingCustomerToQueue: false,
  customer: {
    groupSize: undefined,
    country: undefined,
    callingCode: "44",
    email: "",
    mobileNumber: "",
    name: "",
    orderNumber: undefined,
    mobileNumberForConfirmationScreen: ""
  },
  data: [],
  error: undefined,
  fields: {
    hasPrinter: false,
    kioskIdentifier: "",
    printerUrl: "",
    url: "https://app.qudini.com",
    hasKioskModeEnable: false,
  },
  isFetching: false,
  kioskId: undefined,
  language: undefined,
  product: undefined,
  serial: Platform.OS === "web" ? "web" : DeviceInfo.getUniqueID(),
  settings: undefined,
  subProduct: undefined,
  venueCountry: undefined,
  privacyPolicy: {
    addCustomerJourney: "",
    agreeButtonText: "",
    createBookingJourney: "",
    disagreeButtonText: "",
    displayPrivacyPolicy: false,
    onlineAppointmentBookingJourney: "",
    onlineEventBookingJourney: "",
    privacyPolicyHeader: "",
    privacyPolicyHyperlinkText: "",
    privacyPolicyText: "",
    privacyPolicyURL: null,
    staffEventBookingJourney: "",
    hasAgreed: false,
  }
}

export const reducer: Reducer<KioskState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_KIOSK_ID: {
      return {
          ...state,
          kioskId: (action as SetKioskIdAction).payload.id
      }
    }

    case SET_KIOSK_SERIAL: {
      return {
          ...state,
          serial: (action as SetKioskSerialAction).payload.serial
      }
    }

    case SET_KIOSK_URL: {
      return {
        ...state,
        fields: {
          ...state.fields,
          url: (action as SetKioskUrlAction).payload.url
        }
      }
    }

    case KIOSK.REGISTER.REQUEST:
      return { ...state, error: undefined, isFetching: true }
    case KIOSK.REGISTER.SUCCESS: {
      const { payload } = action as RegisterKioskSuccess
      return { ...state, error: initialState.error, isFetching: false, kioskId: payload.id }
    }

    case KIOSK.REGISTER.FAILURE:
    case KIOSK.QUEUE_DATA.FAILURE:
    case KIOSK.SETTINGS.FAILURE: {
      const { payload } = action as StringPayload
      return { ...state, error: payload, isFetching: false, isAddingCustomerToQueue: false, }
    }

    case KIOSK.FIELD_UPDATE.REQUEST: {
      const { payload } = action as RegisterKioskFieldUpdate
      return { ...state, fields: { ...state.fields, [payload.name]: payload.value } }
    }
    case KIOSK.SETTINGS.REQUEST:
      return { ...state, error: undefined, isFetching: true }
    case KIOSK.SETTINGS.SUCCESS: {
      const { payload } = action as GetKioskSettingsSuccess
      return { ...state, settings: {
        ...payload,
        template: {
          ...payload.template,
          font: fonts.get(payload.template.font) || "Arial"
        }
      }, isFetching: false }
    }
    case KIOSK.QUEUE_DATA.REQUEST:
      return { ...state, error: undefined, isFetching: true }
    case KIOSK.QUEUE_DATA.SUCCESS: {
      const { payload } = action as GetKioskDataSuccess
      return { ...state, data: payload, isFetching: false }
    }
    case KIOSK.SET_COUNTRY.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, venueCountry: payload as CountryCode }
    }
    case KIOSK.SET_LANGUAGE.REQUEST: {
      const { payload } = action as LanguagePayload
      return { ...state, language: payload }
    }
    case KIOSK.CUSTOMER.SET_NAME.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, customer: { ...state.customer, name: payload } }
    }
    case KIOSK.CUSTOMER.SET_NOTES.REQUEST: {
      const { payload } = action as StringPayload;
      return { ...state, customer: { ...state.customer, notes: payload } };
    }
    case KIOSK.CUSTOMER.SET_EMAIL.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, customer: { ...state.customer, email: payload } }
    }
    case KIOSK.CUSTOMER.SET_GROUP_SIZE.REQUEST: {
      const { payload } = action as NumberPayload
      return { ...state, customer: { ...state.customer, groupSize: payload } }
    }
    case KIOSK.CUSTOMER.SET_COUNTRY.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, customer: { ...state.customer, country: payload as CCA2Code } }
    }
    case KIOSK.CUSTOMER.SET_CALLING_CODE.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, customer: { ...state.customer, callingCode: payload } }
    }
    case KIOSK.CUSTOMER.SET_MOBILE.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, customer: {
        ...state.customer,
        mobileNumber: payload,
        mobileNumberForConfirmationScreen: payload } }
    }
    case KIOSK.CUSTOMER.SET_ORDER.REQUEST: {
      const { payload } = action as StringPayload
      return { ...state, customer: { ...state.customer, orderNumber: payload } }
    }
    case KIOSK.SET_PRODUCT.REQUEST: {
      const { payload } = action as ProductPayload
      return { ...state, product: payload }
    }
    case KIOSK.SET_SUBPRODUCT.REQUEST: {
      const { payload } = action as ProductPayload
      return { ...state, subProduct: payload }
    }
    case KIOSK.CUSTOMER.ADD_TO_QUEUE.REQUEST: {
      return {
        ...state,
        customerInQueue: initialState.customerInQueue,
        error: initialState.error,
        isFetching: true,
      }
    }
    case ADD_CUSTOMER_TO_QUEUE_START: 
      return {
        ...state,
        isAddingCustomerToQueue: true,
      };
    case ADD_CUSTOMER_TO_QUEUE_STOP: 
      return {
        ...state,
        isAddingCustomerToQueue: false,
      };

    case KIOSK.ADD_PRIVATE_CUSTOMER_TO_QUEUE.SUCCESS:
    case KIOSK.CUSTOMER.ADD_TO_QUEUE.SUCCESS: {
      const { payload } = action as CustomerInQueuePayload
      return {
        ...state,
        customer: {
          ...initialState.customer,
          country: state.venueCountry as CCA2Code,
          mobileNumberForConfirmationScreen: state.customer.mobileNumber,
        },
        customerInQueue: payload.customerInQueue,
        isFetching: false,
        product: initialState.product,
        subProduct: initialState.subProduct,
        privacyPolicy: {
          ...state.privacyPolicy,
          hasAgreed: false
        }
      }
    }
    case KIOSK.ADD_PRIVATE_CUSTOMER_TO_QUEUE.FAILURE:
    case KIOSK.CUSTOMER.ADD_TO_QUEUE.FAILURE: {
      const { payload } = action as StringPayload
      return { ...state, isFetching: false, error: payload, isAddingCustomerToQueue: false }
    }
    case KIOSK.CUSTOMER.ADD_TO_QUEUE.RESET: {
      return {
        ...state,
        customer: { ...initialState.customer, country: state.venueCountry as CCA2Code },
        customerInQueue: initialState.customerInQueue,
        error: initialState.error,
        isFetching: false,
        product: initialState.product,
      }
    }
    case PRIVACY_POLICY_DISAGREE: {
      return {
        ...state,
        privacyPolicy: {
          ...state.privacyPolicy,
          hasAgreed: false
        }
      }
    }
    case PRIVACY_POLICY_AGREE: {
      return {
        ...state,
        privacyPolicy: {
          ...state.privacyPolicy,
          hasAgreed: true
        }
      }
    }
    case KIOSK.LOAD_PRIVACY_POLICY_DATA.SUCCESS: {
      const { payload } = action as LoadPrivacyPolicySuccess
      return {
        ...state,
        privacyPolicy: {
          ...state.privacyPolicy,
          ...payload,
        }
      }
    }
    case KIOSK.LOAD_SCREEN_SAVER_DATA.SUCCESS: {
      const { payload } = action as LoadScreenSaverDataSuccess
      const { screenSaverEnableInSeconds, videoURL, enableScreensaver } = payload
      return state.settings ? {
        ...state,
        settings: {
          ...state.settings,
          template: {
            ...state.settings.template,
            screenSaverEnableInSeconds,
            videoURL,
            enableScreensaver,
          }
        }
      } : { ...state }
    }
    case APP.RESET.SUCCESS: return initialState
    default: return state
  }
}

export default reducer
