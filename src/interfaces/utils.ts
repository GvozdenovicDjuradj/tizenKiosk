import { Action } from "redux"
import { TemplateLanguages } from "./kiosk"

export interface TemplateStyles {
  circle: {
    backgroundColor?: string
  },
  languages: TemplateLanguages,
  logo: string,
  queueIsFullUrl: string,
  showLangSelect: boolean,
  text: {
    color?: string,
    fontFamily?: string,
  }
}

export interface AlertErrorPayload extends Action {
  payload: {
    title: string
    message?: string
  }
}
