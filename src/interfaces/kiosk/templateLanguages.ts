import { Language } from "./language"

export interface TemplateLanguages {
  mainLanguage: Language;
  otherLanguages: Language[];
  translations: {
    [key: string]: object;
  }
}
