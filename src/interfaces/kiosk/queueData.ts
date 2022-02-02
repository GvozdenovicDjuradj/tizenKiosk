export enum WeekDay {
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
  sunday = "sunday",
}

export interface WorkingHours {
  endHours: number;
  endMinutes: number;
  id: number;
  startHours: number;
  startMinutes: number;
}

export type OpeningTimes = {
  [day in WeekDay]: WorkingHours
}

export interface KioskQueueData {
  fullyBooked: boolean;
  underCapacity: boolean;
  kioskOpeningTimes: OpeningTimes;
  length: number;
  openingTimes: OpeningTimes;
  queueId: number;
  serversAvailable: number;
  storeOpen: boolean;
  waitTime: number;
}
