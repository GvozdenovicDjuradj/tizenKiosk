import { Customer } from "./customer"
import { Venue } from "./venue"

export interface CustomerInQueue {
  currentPosition: number;
  customer: Customer;
  id: number;
  minutesRemaining: string;
  queue: {
    averageServeTimeMinutes: number;
    customerLength: number;
    id: number;
    name: string;
    venue: Venue;
  };
  timeRemaining: string;
  joinedTime: string;
  waitTime: number;
}
