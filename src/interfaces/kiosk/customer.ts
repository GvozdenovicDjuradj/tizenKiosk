import { CCA2Code, Country } from "react-native-country-picker-modal";

export interface KioskCustomer {
  callingCode?: Country["callingCode"];
  country?: CCA2Code;
  email?: string;
  groupSize?: number;
  mobileNumber?: string;
  name?: string;
  orderNumber?: string;
  notes?: string;
  mobileNumberForConfirmationScreen?: string;
}
