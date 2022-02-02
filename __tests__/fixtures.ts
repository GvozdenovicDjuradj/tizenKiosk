import faker from "faker"
import { GestureResponderEvent, NativeSyntheticEvent, TextInputEndEditingEventData } from "react-native"
import { initialState } from "../src/reducers"
import {
    AnyProduct,
    AppScreens,
    AppState,
    CONFIRMATION_SCREEN,
    CustomerInQueue,
    KioskCustomer,
    KioskFields,
    KioskQueueData,
    KioskSettings,
    KioskState,
    KioskTemplate,
    Language,
    OpeningTimes,
    PrivacyPolicy,
    Question,
    REQUIRED,
    RootState,
    TemplateLanguages,
    Venue,
    WeekDay,
} from "../src/interfaces"
import { Navigator } from "../src/navigation"
import {ReplaceMessageParameters, replaceMessagePlaceholders} from "../src/sagas/printTicket"
import {PrinterState} from "../src/printer/reducer"
import {List} from "immutable"
import {Printer} from "@dnlowman/react-native-star-prnt"
import {createPrinter} from "./printer/fixtures"

const generateOpeningTimes =
    (id: number, startHours = 0, startMinutes = 0, endHours = 0, endMinutes = 0): OpeningTimes => {
        const result: OpeningTimes = {
            monday: { id, startHours, startMinutes, endHours, endMinutes },
            tuesday: { id, startHours, startMinutes, endHours, endMinutes },
            wednesday: { id, startHours, startMinutes, endHours, endMinutes },
            thursday: { id, startHours, startMinutes, endHours, endMinutes },
            friday: { id, startHours, startMinutes, endHours, endMinutes },
            saturday: { id, startHours, startMinutes, endHours, endMinutes },
            sunday: { id, startHours, startMinutes, endHours, endMinutes },
        }
        return result
    }

export const createTemplate = (config: Partial<KioskTemplate> = {}): KioskTemplate => ({
    backgroundColor: "#fff",
    backgroundImage: null,
    backgroundImageIsEnabled: false,
    buttonTextColor: "#fff",
    confirmationScreenToShow: CONFIRMATION_SCREEN.CURRENT_STORE_WAIT_TIME,
    customerScreenGroupSize: REQUIRED.OPTIONAL,
    customerScreenEmail: REQUIRED.OPTIONAL,
    customerScreenIsRequestOrderNumber: false,
    customerScreenIsShowMobileWarning: false,
    customerScreenNameField: REQUIRED.OPTIONAL,
    customerScreenRequestMobileNumberWhen: REQUIRED.NEVER,
    customerScreenRequestMpnQueueLength: 0,
    customerScreenRequestMpnWaitTime: 0,
    customerScreenRequestOrderNumber: REQUIRED.OPTIONAL,
    customTextTranslations: {},
    dateCreated: new Date("2018-09-11T10:00:00.000Z"),
    dateEdited: null,
    enableBookingCheckin: false,
    enableBookingWidget: false,
    enableEventCheckin: false,
    enableOrderLookupConfig: false,
    enableWalkin: true,
    font: "Arial",
    headingTextColor: "#fff",
    id: 0,
    languageIsDisplayOther: false,
    languagePosition: null,
    languages: {
        mainLanguage: {
            countryCallingCode: "+44",
            countryIsoCode: "GB",
            countryName: "United Kingdom",
            languageIsoCode: "en",
            languageName: "en",
        },
        otherLanguages: [],
        translations: {},
    },
    logo: null,
    name: "Test template",
    noAvailableImage: {},
    noAvailableImageUrl: undefined,
    orderLookupConfig: null,
    screenFlow: "",
    secondaryTextColor: "#dfdfdf",
    serviceButtonColor: "#fff",
    serviceScreenIsWithIcons: false,
    serviceShowWaitTime: true,
    showNothing: false,
    useDefaultStyleTemplateLogo: true,
    welcomeButtonColor: "#00ff00",
    welcomeScreenIsRemove: false,
    videoURL: "",
    screenSaverEnableInSeconds: 10,
    enableScreensaver: false,
    ...config
})

export const createSettings = (config: Partial<KioskSettings> = {}): KioskSettings => ({
    active: true,
    assigned: true,
    bookingWidgetLink: "some link",
    description: "Test description text",
    eventSeriesLink: "",
    id: 1,
    identifier: "identifier",
    isPushlinkEnabled: "no",
    lastOnline: new Date("2018-09-11T10:00:00.000Z"),
    lastSoftwareUpdate: new Date("2018-09-11T10:00:00.000Z"),
    products: [],
    qudiniVersion: "1.0.0",
    serial: "test",
    template: createTemplate(),
    ticket: {
        font: "Arial",
        id: 0,
        merchant: { id: 0, name: "Test Merchant" },
        name: "Test ticket",
        showAtTop: "no",
        ticketFor: "me",
    },
    venue: {
        defaultCountryCode: "GB",
        defaultLanguageIsoCode: "US",
        id: 1,
        isBookingEnabled: true,
        isWalkinEnabled: true,
        merchant: {
            featureSettings: { hasQudiniBrand: true },
            id: 123
        },
        name: "Test Venue 1",
    },
    ...config
})

export const createKioskCustomer = (kioskCustomer?: Partial<KioskCustomer>): KioskCustomer => ({
    callingCode: undefined,
    country: undefined,
    email: faker.internet.email(),
    mobileNumber: faker.phone.phoneNumber(),
    name: faker.name.firstName(),
    orderNumber: faker.random.word(),
    ...kioskCustomer
})

export const createKioskFields = (kioskFields?: Partial<KioskFields>): KioskFields => ({
    kioskIdentifier: faker.random.word(),
    printerUrl: faker.random.word(),
    hasPrinter: faker.random.boolean(),
    hasKioskModeEnable: faker.random.boolean(),
    url: faker.random.word(),
    ...kioskFields
})

export const createLanguage = (language?: Partial<Language>): Language => ({
    countryName: faker.address.country(),
    countryIsoCode: faker.address.countryCode(),
    countryCallingCode: faker.random.word(),
    languageName: faker.random.word(),
    languageIsoCode: faker.random.word(),
    ...language
})

export const createAnyProduct = (anyProduct?: Partial<AnyProduct>): AnyProduct => ({
    waitTime: faker.random.number(),
    id: faker.random.number(),
    name: faker.random.word(),
    queueId: faker.random.number(),
    queueName: faker.random.word(),
    title: faker.random.word(),
    infoText: faker.random.word(),
    header: faker.random.word(),
    showInfo: faker.random.boolean(),
    products: [],
    ...anyProduct
})

export const createTemplateLanguages = (templateLanguages?: Partial<TemplateLanguages>): TemplateLanguages => ({
    mainLanguage: createLanguage(),
    otherLanguages: [],
    translations: {
        ["en"]: {}
    },
    ...templateLanguages
})

export const createKioskTemplate = (kioskTemplate?: Partial<KioskTemplate>): KioskTemplate => ({
    backgroundColor: faker.random.word(),
    backgroundImage: null,
    backgroundImageIsEnabled: faker.random.boolean(),
    backgroundImageUrl: faker.random.word(),
    buttonTextColor: faker.random.word(),
    confirmationScreenToShow: CONFIRMATION_SCREEN.TICKET_NUMBER,
    customerScreenGroupSize: REQUIRED.ALWAYS,
    customerScreenEmail: REQUIRED.ALWAYS,
    customerScreenIsRequestOrderNumber: faker.random.boolean(),
    customerScreenIsShowMobileWarning: faker.random.boolean(),
    customerScreenNameField: REQUIRED.ALWAYS,
    customerScreenRequestMobileNumberWhen: REQUIRED.ALWAYS,
    customerScreenRequestMpnQueueLength: faker.random.number(),
    customerScreenRequestMpnWaitTime: faker.random.number(),
    customerScreenRequestOrderNumber: REQUIRED.ALWAYS,
    customTextTranslations: {},
    dateCreated: faker.date.recent(),
    dateEdited: faker.date.recent(),
    enableBookingCheckin: faker.random.boolean(),
    enableBookingWidget: faker.random.boolean(),
    enableEventCheckin: faker.random.boolean(),
    enableOrderLookupConfig: faker.random.boolean(),
    enableWalkin: faker.random.boolean(),
    font: faker.random.word(),
    headingTextColor: faker.random.word(),
    id: faker.random.number(),
    languageIsDisplayOther: faker.random.boolean(),
    languagePosition: null,
    languages: createTemplateLanguages(),
    logo: null,
    logoUrl: faker.random.word(),
    name: faker.random.word(),
    noAvailableImage: {},
    noAvailableImageUrl: faker.random.word(),
    orderLookupConfig: null,
    screenFlow: faker.random.word(),
    secondaryTextColor: faker.random.word(),
    serviceButtonColor: faker.random.word(),
    serviceScreenIsWithIcons: faker.random.boolean(),
    serviceShowWaitTime: faker.random.boolean(),
    showNothing: faker.random.boolean(),
    useDefaultStyleTemplateLogo: faker.random.boolean(),
    welcomeButtonColor: faker.random.word(),
    welcomeScreenIsRemove: faker.random.boolean(),
    videoURL: faker.random.word(),
    screenSaverEnableInSeconds: faker.random.number(),
    enableScreensaver: faker.random.boolean(),
    ...kioskTemplate
})

export const createVenue = (venue?: Partial<Venue>): Venue => ({
    defaultCountryCode: faker.random.word(),
    defaultLanguageIsoCode: faker.random.word(),
    id: faker.random.number(),
    isBookingEnabled: faker.random.boolean(),
    isWalkinEnabled: faker.random.boolean(),
    name: faker.random.word(),
    merchant: {
        featureSettings: {
            hasQudiniBrand: faker.random.boolean()
        },
        id: faker.random.number()
    },
    ...venue
})

export const createKioskSettings = (kioskSettings?: Partial<KioskSettings>): KioskSettings => ({
    active: faker.random.boolean(),
    assigned: faker.random.boolean(),
    bookingWidgetLink: faker.internet.url(),
    description: faker.random.word(),
    eventSeriesLink: faker.random.word(),
    id: faker.random.number(),
    identifier: faker.random.word(),
    isPushlinkEnabled: faker.random.word(),
    lastOnline: faker.date.recent(),
    lastSoftwareUpdate: faker.date.recent(),
    makeAndModel: faker.random.word(),
    operatingSystem: faker.random.word(),
    products: [],
    qudiniVersion: faker.random.word(),
    serial: faker.random.word(),
    template: createKioskTemplate(),
    ticket: {
        font: faker.random.word(),
        id: faker.random.number(),
        merchant: {
            id: faker.random.number(),
            name: faker.random.word(),
        },
        name: faker.random.word(),
        showAtTop: faker.random.word(),
        ticketFor: faker.random.word(),
    },
    venue: createVenue(),
    ...kioskSettings
})

export const createPrivacyPolicy = (privacyPolicy?: Partial<PrivacyPolicy>): PrivacyPolicy => ({
    addCustomerJourney: faker.random.word(),
    agreeButtonText: faker.random.word(),
    createBookingJourney: faker.random.word(),
    disagreeButtonText: faker.random.word(),
    displayPrivacyPolicy: faker.random.boolean(),
    onlineAppointmentBookingJourney: faker.random.word(),
    onlineEventBookingJourney: faker.random.word(),
    privacyPolicyHeader: faker.random.word(),
    privacyPolicyHyperlinkText: faker.random.word(),
    privacyPolicyText: faker.random.word(),
    privacyPolicyURL: faker.random.word(),
    staffEventBookingJourney: faker.random.word(),
    hasAgreed: faker.random.boolean(),
    ...privacyPolicy
})

export const createKioskQueueData = (kioskQueueData?: Partial<KioskQueueData>): KioskQueueData => ({
    underOccupancy: faker.random.boolean(),
    fullyBooked: faker.random.boolean(),
    kioskOpeningTimes: {
        [WeekDay.monday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.tuesday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.wednesday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.thursday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.friday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.saturday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.sunday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        }
    },
    length: faker.random.number(),
    openingTimes: {
        [WeekDay.monday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.tuesday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.wednesday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.thursday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.friday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.saturday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        },
        [WeekDay.sunday]: {
            endHours: faker.random.number(),
            endMinutes: faker.random.number(),
            id: faker.random.number(),
            startHours: faker.random.number(),
            startMinutes: faker.random.number()
        }
    },
    queueId: faker.random.number(),
    serversAvailable: faker.random.number(),
    storeOpen: faker.random.boolean(),
    waitTime: faker.random.number(),
    ...kioskQueueData
})

export const createKioskState = (kioskState?: Partial<KioskState>): KioskState => ({
    customer: createKioskCustomer(),
    customerInQueue: createCustomerInQueue(),
    data: [],
    error: faker.random.word(),
    fields: createKioskFields(),
    isFetching: faker.random.boolean(),
    kioskId: faker.random.word(),
    language: createLanguage(),
    product: createAnyProduct(),
    serial: faker.random.word(),
    settings: createKioskSettings(),
    subProduct: createAnyProduct(),
    venueCountry: "001",
    privacyPolicy: createPrivacyPolicy(),
    isAddingCustomerToQueue: faker.random.boolean(),
    ...kioskState
})

export const createState = (config: Partial<RootState> = {}): RootState => ({
    ...initialState,
    kiosk: {
        ...initialState.kiosk,
        privacyPolicy: createPrivacyPolicy(),
        customer: {
            email: "test@qudini.com",
            mobileNumber: "+441234567890",
            name: "John Doe",
        },
        data: [{
            underOccupancy: false,
            fullyBooked: true,
            kioskOpeningTimes: generateOpeningTimes(0, 8, 0, 16, 0),
            openingTimes: generateOpeningTimes(0, 8, 0, 16, 0),
            length: 10,
            queueId: 0,
            serversAvailable: 1,
            storeOpen: true,
            waitTime: 60,
        }, {
            underOccupancy: true,
            fullyBooked: false,
            kioskOpeningTimes: generateOpeningTimes(1, 6, 0, 18, 0),
            openingTimes: generateOpeningTimes(1, 7, 0, 17, 0),
            length: 1,
            queueId: 1,
            serversAvailable: 3,
            storeOpen: true,
            waitTime: 10,
        }],
        kioskId: "123456",
        product: {
            id: 1,
            name: "Test",
            queueId: 1,
        },
        settings: createSettings(),
        serial: "1234567890",
    },
    printer: createPrinterState(),
    screenSaver: {
        videoList: [{ url: "test" }],
        videoIndex: 0
    },
    ...config
})

export const createNavigator = (): Navigator => ({
    context: null,
    dispatch: jest.fn().mockReturnValue(false),
    forceUpdate: jest.fn(),
    props: {},
    refs: {},
    render: jest.fn(),
    setState: jest.fn,
    state: {
        nav: {
            index: 0,
            isTransitioning: false,
            key: "test",
            params: {},
            routes: []
        }
    },
})

export const createQuestion = (type: Question["answerType"]): Question => ({
    isAnswerMandatory: true,
    answerType: type,
    askedType: "WHEN_JOINING",
    customerTypeList: ["QUEUING_CUSTOMERS_BY_STAFF", "QUEUING_CUSTOMERS_BY_SELF"],
    id: 0,
    isOptionForOther: false,
    merchant: {
        id: 0,
        name: "Merchant for test",
    },
    orderId: null,
    orderList: [],
    ordering: null,
    productList: [],
    questionInfoText: null,
    ratingScale: 7,
    selectAnswerList: ["Yes", "No"],
    text: "Question text",
    venueList: [{ id: 0, name: "Test venue" }]
})

export const createCustomerInQueue = (): CustomerInQueue => ({
    currentPosition: 1,
    customer: {
        bookingRef: "null",
        customerProfile: null,
        id: 1,
        identifier: "123456",
        name: "test",
        orderNumber: null,
        ticketNumber: "A001",
    },
    joinedTime: "10:00",
    id: 0,
    minutesRemaining: "0",
    queue: {
        averageServeTimeMinutes: 5,
        customerLength: 1,
        id: 0,
        name: "test",
        venue: {
            defaultCountryCode: "GB",
            defaultLanguageIsoCode: "en",
            id: 0,
            isBookingEnabled: false,
            isWalkinEnabled: true,
            merchant: {
                featureSettings: {
                    hasQudiniBrand: true
                },
                id: 123
            },
            name: "test venue",
        },
    },
    timeRemaining: "0mins",
    waitTime: 5,
})

export const createOnPressEvent = (config: Partial<GestureResponderEvent> = {}): GestureResponderEvent => ({
    bubbles: true,
    cancelable: true,
    currentTarget: 0,
    defaultPrevented: false,
    eventPhase: 0,
    isDefaultPrevented: jest.fn(() => false),
    isPropagationStopped: jest.fn(() => false),
    isTrusted: true,
    nativeEvent: {
        changedTouches: [],
        identifier: "test",
        locationX: 0,
        locationY: 0,
        pageX: 0,
        pageY: 0,
        target: "test",
        timestamp: 0,
        touches: [],
    },
    persist: jest.fn,
    preventDefault: jest.fn,
    stopPropagation: jest.fn,
    target: 0,
    timeStamp: 0,
    type: "onPress",
    ...config
})

export const createOnEndEditingEvent = (
    config: Partial<NativeSyntheticEvent<TextInputEndEditingEventData>> = {}
): NativeSyntheticEvent<TextInputEndEditingEventData> => ({
    bubbles: true,
    cancelable: true,
    currentTarget: 0,
    defaultPrevented: false,
    eventPhase: 0,
    isDefaultPrevented: jest.fn(() => false),
    isPropagationStopped: jest.fn(() => false),
    isTrusted: true,
    nativeEvent: { text: "" },
    persist: jest.fn,
    preventDefault: jest.fn,
    stopPropagation: jest.fn,
    target: 0,
    timeStamp: 0,
    type: "endEditing",
    ...config
})

export const createAppState = (appState?: Partial<AppState>): AppState => ({
    initialScreen: AppScreens.HOME,
    keyboardDisplayed: faker.random.boolean(),
    offline: faker.random.boolean(),
    deviceImei: faker.random.word(),
    ...appState
})

export const createReplaceMessageParameters =
  (replaceMessageParameters?: Partial<ReplaceMessageParameters>): ReplaceMessageParameters => ({
    message: faker.random.word(),
    customerName: faker.random.word(),
    ticketPosition: faker.random.number(),
    queueName: faker.random.word(),
    venueName: faker.random.word(),
    ticketNumber: faker.random.word(),
    ticketMinutesLeft: faker.date.recent().toISOString(),
    ticketAverageWait: faker.random.number(),
    joinedTimeString: faker.date.recent().toISOString(),
    ...replaceMessageParameters
})

export const createPrinterState = (printerState?: Partial<PrinterState>): PrinterState => ({
    isFindingPrinters: faker.random.boolean(),
    connectedPrinters: List.of<Printer>(createPrinter()),
    selectedPrinter: createPrinter(),
    logoUrl: faker.internet.url(),
    ticketMessage: faker.random.word(),
    showAtTopValue: faker.random.word(),
    localCurrentTime: faker.date.recent().toISOString(),
    localCurrentDate: faker.date.recent().toISOString(),
    logoFooterUrl: faker.internet.url(),
    isPendingPrint: faker.random.boolean(),
    isPrinterEnabled: faker.random.boolean(),
    notificationTitle: faker.random.word(),
    notificationMessage: faker.random.word(),
    isNotificationVisible: faker.random.boolean(),
    debugOutput: [],
    isDebugOutputVisible: faker.random.boolean(),
    ...printerState
})
