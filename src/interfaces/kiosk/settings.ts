import { Product } from "../product"
import { KioskTemplate } from "./template"
import { Venue } from "../venue"

export interface KioskSettings {
  active: boolean;
  assigned: boolean;
  bookingWidgetLink: string | null;
  description: string;
  eventSeriesLink: string | null;
  id: number;
  identifier: string;
  isPushlinkEnabled: string | null;
  lastOnline: Date;
  lastSoftwareUpdate: Date | null;
  makeAndModel?: string;
  operatingSystem?: string;
  products: Product[];
  qudiniVersion: string | null;
  serial: string;
  template: KioskTemplate;
  ticket: {
    font: string,
    id: number,
    merchant: {
      id: number,
      name: string
    },
    name: string,
    showAtTop: string,
    ticketFor: string
  };
  venue: Venue;
}
