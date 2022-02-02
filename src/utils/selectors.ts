import {
  AppScreens,
  KioskCustomer,
  KioskFields,
  KioskQueueData,
  REQUIRED,
  RootState,
  privacyPolicyShowOptions,
  AnyProduct
} from "../interfaces"

export const getKioskFieldsSelector = (state: RootState): KioskFields => state.kiosk.fields

export const serialSelector = (state: RootState) => state.kiosk.serial

export const kioskIdSelector = (state: RootState) => state.kiosk.kioskId

export const getKioskCustomerFieldsSelector = (state: RootState): KioskCustomer => state.kiosk.customer

export const venueCountryCode = (state: RootState) =>
  state.kiosk.settings && state.kiosk.settings.venue.defaultCountryCode

export const isScreenValid = (screen: AppScreens) => (state: RootState) => {
  const screenFields = state.validation[screen]
  if (!screenFields) {
    return true
  }
  return Object.keys(screenFields).every((field: string) => screenFields[field].valid)
}

export const isFetching = (state: RootState) =>
  state.kiosk.isFetching ||
  state.questions.isFetching ||
  state.checkIn.isFetching ||
  state.eventCheckIn.isFetching

export const queueByProduct = (state: RootState) => {

  if (state.kiosk.data.length === 1) {
    return state.kiosk.data[0];
  }

  if (
    state.kiosk.product &&
    state.kiosk.product.queueId &&
    state.kiosk.data.length
  ) {
    const { data, product } = state.kiosk;

    return data.find(
      (queue) => queue.queueId.toString() === product.queueId!.toString()
    );
  } else {
    return undefined;
  }
};

export const getUnderCapacityFromQueueByProduct = (state: RootState): boolean => {
  const queue = queueByProduct(state);

  return queue ? queue.underCapacity : false
}

export const queueRequireMobile = (waitTime: number, queueLength: number, q?: KioskQueueData) => q
  ? (q.waitTime > waitTime || q.length > queueLength)
  : false

export const showMobileNumber = (state: RootState) => {
  const { settings } = state.kiosk
  const queue = queueByProduct(state)
  if (settings && queue) {
    const {
      customerScreenRequestMobileNumberWhen: requestWhen,
      customerScreenRequestMpnQueueLength: queueLength,
      customerScreenRequestMpnWaitTime: waitTime,
    } = settings.template
    if (requestWhen === REQUIRED.CONDITIONAL ||
        requestWhen === REQUIRED.CONDITIONAL_OPTIONAL) {
      return queueRequireMobile(waitTime, queueLength, queue)
    } else if (
      requestWhen === REQUIRED.ALWAYS ||
      requestWhen === REQUIRED.MANDATORY ||
      requestWhen === REQUIRED.OPTIONAL
    ) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export const mobileRequired = (state: RootState) => {
  if (showMobileNumber(state)) {
    const { settings } = state.kiosk
    if (!settings) {
      return false
    }
    const {
      customerScreenRequestMobileNumberWhen: requestWhen,
    } = settings.template
    return (
      requestWhen === REQUIRED.ALWAYS ||
      requestWhen === REQUIRED.MANDATORY ||
      requestWhen === REQUIRED.CONDITIONAL
    )
  } else {
    return false
  }
}

export const checkInEnabledSelector = (state: RootState) =>
  state.kiosk.settings && state.kiosk.settings.template
    ? state.kiosk.settings.template.enableBookingCheckin
    : false

export const eventCheckInEnabledSelector = (state: RootState) =>
  state.kiosk.settings && state.kiosk.settings.template
    ? state.kiosk.settings.template.enableEventCheckin
    : false

export const walkInEnabledSelector = (state: RootState) =>
  state.kiosk.settings && state.kiosk.settings.template
    ? state.kiosk.settings.template.enableWalkin
    : true

export const showQudiniLogo = (state: RootState) => {
  const settings = state.kiosk.settings
  if (settings) {
    return settings.venue.merchant.featureSettings.hasQudiniBrand
  }
  return false
}

export const canValidateSettings = (state: RootState): boolean => {
  const original = state.kiosk.fields
  const form = state.kioskSettings
  const isIdTheSame = original.kioskIdentifier === form.kioskIdentifier
  const isUrlTheSame = original.url === form.url
  const urlInvalid = (
    state.validation[AppScreens.HOME] &&
    state.validation[AppScreens.HOME].newKioskUrl &&
    state.validation[AppScreens.HOME].newKioskUrl.error.length > 0
  )
  return !(isIdTheSame && isUrlTheSame && urlInvalid)
}

export const canSaveChanges = (state: RootState): boolean => {
  const original = state.kiosk.fields
  const form = state.kioskSettings
  const hasPrinterTheSame = original.hasPrinter === form.hasPrinter
  if (hasPrinterTheSame && !form.hasPrinter) {
    return false
  }
  if (hasPrinterTheSame && form.hasPrinter) {
    return form.printerUrl !== original.printerUrl
  }
  return !hasPrinterTheSame
}

export const isKeyboardDisplayed = (state: RootState) => state.app.keyboardDisplayed

export const getScreenSaverVideo = (state: RootState): string | null =>
  state.kiosk.settings
    ? state.kiosk.settings.template.videoURL
    : null

export const getScreenSaverEnableTimer = (state: RootState): number | null =>
    state.kiosk.settings
      ? state.kiosk.settings.template.screenSaverEnableInSeconds
      : null
export const getImei = (state: RootState) => state.app.deviceImei

export const isScreensaverEnabled = (state: RootState) =>
  state.kiosk.settings &&
  state.kiosk.settings.template.enableScreensaver

export const isKioskModeEnabled = (state: RootState) =>
  state.kioskSettings &&
  state.kioskSettings.hasKioskModeEnable

export const getMerchantId = (state: RootState): number | undefined =>
  state.kiosk.settings && state.kiosk.settings.venue.merchant.id

export const isPrivacyPolicyPopup = (state: RootState): boolean =>
  state.kiosk.privacyPolicy.addCustomerJourney ===
    privacyPolicyShowOptions.popup && state.kiosk.privacyPolicy.displayPrivacyPolicy

export const hasAgreedToPrivacyPolicy = (state: RootState): boolean =>
  state.kiosk.privacyPolicy.hasAgreed

export const getProductId = (state: RootState): number | undefined =>
  state.kiosk.product && state.kiosk.product.id

export const getQueueId = (state: RootState): number | undefined =>
  state.kiosk.product && state.kiosk.product.queueId

export const getCurrentLanguageCode = (state: RootState): string | undefined =>
  state.kiosk.language && state.kiosk.language.languageIsoCode;

export const getTranslatedProductName = (state: RootState, product: AnyProduct) => {
  if (state.kiosk.language 
    && state.kiosk.language.languageIsoCode
    && product.nameTranslations
    && product.nameTranslations[state.kiosk.language.languageIsoCode]
    ) {
      return product.nameTranslations[state.kiosk.language.languageIsoCode];
  }
  return product.name || product.title;
}