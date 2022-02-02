export * from "./answers"
export * from "./app"
export * from "./appState"
export * from "./checkIn"
export * from "./customerInQueue"
export * from "./eventCheckIn"
export * from "./kiosk"
export * from "./modal"
export * from "./navigation"
export * from "./product"
export * from "./question"
export * from "./routes"
export * from "./utils"
export * from "./validation"
export * from "./venue"
export * from "./screenSaver"

import { AppState } from "./app"
import { CheckInState } from "./checkIn"
import { EventCheckInState } from "./eventCheckIn"
import { KioskSettingsForm } from "../reducers/kioskSettings"
import { KioskState } from "./kiosk"
import { ModalState } from "./modal"
import { QuestionAnswer } from "./answers"
import { QuestionsReducer } from "./question"
import { ValidationState } from "./validation"
import { PrintingState } from "./printing"
import { PrinterState } from "../printer/reducer"
import { ScreenSaverState } from "./screenSaver"

export interface Flags {
  [key: string]: any
}

export type ValidatorFn = (text: string, ...args: any[]) => { error: string }

export interface RootState {
  answers: QuestionAnswer[];
  app: AppState;
  checkIn: CheckInState;
  error: string;
  eventCheckIn: EventCheckInState;
  kiosk: KioskState;
  kioskSettings: KioskSettingsForm;
  modal: ModalState;
  printer: PrinterState;
  printing: PrintingState;
  questions: QuestionsReducer;
  validation: ValidationState;
  screenSaver?: ScreenSaverState;
}
