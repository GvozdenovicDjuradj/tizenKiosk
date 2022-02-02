import { KioskTemplate, TemplateLanguages, TemplateStyles } from "../interfaces"
import { fixUrl } from "./fixUrl"

export const getTemplateBackground = (template?: KioskTemplate, host?: string) => {
  let result = {
    color: {},
    image: { url: "" },
  }
  if (template) {
    if (template.backgroundColor) {
      result = {
        ...result,
        color: { backgroundColor: template.backgroundColor }
      }
    }
    if (template.backgroundImageIsEnabled && template.backgroundImageUrl) {
      result = {
        ...result,
        image: { url: fixUrl(template.backgroundImageUrl, host) }
      }
    }
  }
  return result
}

export const getTemplateStyles = (template?: KioskTemplate, host?: string): TemplateStyles => {
  const templateStyles: TemplateStyles = {
    circle: {},
    languages: {} as TemplateLanguages,
    logo: "",
    queueIsFullUrl: "",
    showLangSelect: false,
    text: {}
  }
  if (template) {
    const { languages } = template
    if (languages.otherLanguages.length) {
      templateStyles.showLangSelect = true
      templateStyles.languages = languages
    }
    if (template.font) {
      templateStyles.text = {
        ...templateStyles.text,
        fontFamily: template.font
      }
    }
    if (template.buttonTextColor) {
      templateStyles.text = {
        ...templateStyles.text,
        color: template.buttonTextColor
      }
    }
    if (template.welcomeButtonColor) {
      templateStyles.circle = {
        backgroundColor: template.welcomeButtonColor
      }
    }
    if (template.logoUrl) {
      templateStyles.logo = fixUrl(template.logoUrl, host)
    }
    if (template.noAvailableImageUrl) {
      templateStyles.queueIsFullUrl = fixUrl(template.noAvailableImageUrl, host)
    }
  }
  return templateStyles
}
