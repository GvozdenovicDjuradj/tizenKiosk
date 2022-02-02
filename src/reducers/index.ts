import { combineReducers } from "redux"
import { RootState } from "../interfaces"
import answers, { initialState as answersInitialState } from "./answers"
import app, { initialState as appInitialState } from "./app"
import checkIn, { initialState as checkInInitialState } from "./checkIn"
import error from "./error"
import eventCheckIn, { initialState as eventCheckInInitialState } from "./eventCheckIn"
import kiosk, { initialState as kioskInitialState } from "./kiosk"
import kioskSettings, { initialState as kioskSettingsInitialState } from "./kioskSettings"
import modal, { initialState as modalInitialState } from "./modal"
import questions, { initialState as questionsInitialState } from "./questions"
import validation, { initialState as screenInitialState } from "./screenValidation"
import printing, { initialState as printingInitialState } from "./printing"
import printer, { initialState as printerInitialState } from "../printer/reducer"
import storage from "redux-persist/lib/storage"
import { persistReducer } from "redux-persist"

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    "answers",
    "app",
    "checkIn",
    "modal",
    "validation",
    "printer"
  ]
}

const printerPersistConfig = {
  key: "printer",
  storage,
  whitelist: [
    "isPrinterEnabled",
    "selectedPrinter",
  ]
}

const rootReducer = combineReducers({
  answers,
  app,
  checkIn,
  error,
  eventCheckIn,
  kiosk,
  kioskSettings,
  modal,
  questions,
  validation,
  printing,
  printer: persistReducer(printerPersistConfig, printer),
})

export default persistReducer(persistConfig, rootReducer)

export const initialState: RootState = {
  answers: { ...answersInitialState },
  app: { ...appInitialState },
  checkIn: { ...checkInInitialState },
  error: "",
  eventCheckIn: { ...eventCheckInInitialState },
  kiosk: { ...kioskInitialState },
  kioskSettings: { ...kioskSettingsInitialState },
  modal: { ...modalInitialState },
  questions: { ...questionsInitialState },
  validation: { ...screenInitialState },
  printing: { ...printingInitialState },
  printer: { ...printerInitialState }
}
