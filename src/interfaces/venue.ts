export interface Venue {
  defaultCountryCode: string;
  defaultLanguageIsoCode: string;
  id: number;
  isBookingEnabled: boolean;
  isWalkinEnabled: boolean;
  name: string;
  merchant: {
    featureSettings: {
        hasQudiniBrand: boolean;
    }
    id: number;
  }
}
