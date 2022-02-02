import React from "react"
import { Text, View } from "react-native"
import { KioskTemplate } from "../interfaces"
import { header as headerStyle } from "../theme/styles"

interface Props {
  template?: KioskTemplate
  text: string,
  style?: any

}

export default (props: Props) => {
  const {
      template,
      text,
      style
    } = props
  const templateStyles = {
    header: {},
    text: {},
  }
  if (template) {
    if (template.font) {
      templateStyles.text = {
        ...templateStyles.text,
        fontFamily: template.font
      }
    }
    if (template.headingTextColor) {
      templateStyles.text = {
        ...templateStyles.text,
        color: template.headingTextColor
      }
    }
    if (template.welcomeButtonColor) {
      templateStyles.header = {
        ...templateStyles.header,
        backgroundColor: template.welcomeButtonColor
      }
    }
  }
  return (
    <View style={[headerStyle.view, templateStyles.header, style]}>
      <Text style={[headerStyle.text, templateStyles.text]}>
        {text}
      </Text>
    </View>
  )
}
