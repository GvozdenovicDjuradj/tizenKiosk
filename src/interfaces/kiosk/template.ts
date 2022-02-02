import { TemplateLanguages } from "./templateLanguages"

export enum CONFIRMATION_SCREEN {
  CURRENT_STORE_WAIT_TIME = "CURRENT_STORE_WAIT_TIME",
  CUSTOMER_POSITION = "CUSTOMER_POSITION",
  ESTIMATED_WAIT_TIME = "ESTIMATED_WAIT_TIME",
  TICKET_NUMBER = "TICKET_NUMBER"
}

export enum REQUIRED {
  ALWAYS = "ALWAYS",
  /**
   * customer does have to put their mobile number in when the mobile field
   * is displayed due to x amount of customers in the queue
   */
  CONDITIONAL = "CONDITIONAL",
  /**
   * customer doesn't have to put their mobile number in when the mobile field
   * is displayed due to x amount of customers in the queue
   */
  CONDITIONAL_OPTIONAL = "CONDITIONAL_OPTIONAL",
  MANDATORY = "MANDATORY",
  NEVER = "NEVER",
  NOT_REQUIRED = "NOT_REQUIRED",
  OPTIONAL = "OPTIONAL",
}

export interface KioskTemplate {
  backgroundColor: string;
  backgroundImage: null;
  backgroundImageIsEnabled: boolean;
  backgroundImageUrl?: string;
  buttonTextColor: string;
  confirmationScreenToShow: CONFIRMATION_SCREEN;
  customerScreenGroupSize: REQUIRED;
  customerScreenEmail: REQUIRED;
  customerScreenIsRequestOrderNumber: boolean;
  customerScreenIsShowMobileWarning: boolean;
  customerScreenNameField: REQUIRED;
  customerScreenRequestMobileNumberWhen: REQUIRED;
  customerScreenRequestMpnQueueLength: number;
  customerScreenRequestMpnWaitTime: number;
  customerScreenRequestOrderNumber: REQUIRED;
  customerScreenNotes: REQUIRED;
  customerScreenOrderNumberValidation?: string;
  customTextTranslations: object;
  dateCreated: Date;
  dateEdited: Date | null;
  enableBookingCheckin: boolean;
  enableBookingWidget: boolean;
  enableEventCheckin: boolean;
  enableOrderLookupConfig: boolean;
  enableWalkin: boolean;
  font: string;
  headingTextColor: string;
  id: number;
  languageIsDisplayOther: boolean;
  languagePosition: null;
  languages: TemplateLanguages;
  logo: null;
  logoUrl?: string;
  name: string;
  noAvailableImage: object;
  noAvailableImageUrl?: string;
  orderLookupConfig: null;
  screenFlow: string;
  secondaryTextColor: string;
  serviceButtonColor: string;
  serviceScreenIsWithIcons: boolean;
  serviceShowWaitTime: boolean;
  showNothing: boolean
  useDefaultStyleTemplateLogo: boolean;
  welcomeButtonColor: string;
  welcomeScreenIsRemove: boolean;
  videoURL: string;
  screenSaverEnableInSeconds: number;
  enableScreensaver: boolean;
}
