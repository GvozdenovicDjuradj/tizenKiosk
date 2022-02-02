import { Action } from "redux"
import { CCA2Code, Country } from "react-native-country-picker-modal"
import { Customer } from "./customer"
import { Venue } from "./venue"

export interface CheckInState {
  callingCode?: Country["callingCode"];
  country?: CCA2Code;
  data?: CheckInData;
  email?: string;
  error?: string;
  isFetching: boolean
  mobileNumber?: string;
  orderNumber?: string;
}

export interface CheckInPayload extends Action {
  payload: CheckInData;
}

export interface CheckInData {
  currentPosition: number | null;
  customer: Customer;
  id: number;
  minutesRemaining: string;
  queue: {
    averageServeTimeMinutes: number;
    colour: null;
    customerLength: number;
    id: number;
    maxQueueLength: null;
    maxQueueTimeMinutes: null;
    minWaitTimeMinutes: null;
    name: string;
    venue: Venue;
    timeRemaining: string;
  }
}
