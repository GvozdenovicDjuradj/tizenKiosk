import React from "react"
import { View } from "react-native"
import { KioskTemplate } from "../../interfaces"
import { getLocaleString, getTemplateStyles } from "../../utils"
import CircleButton from "../CircleButton"
import { content as styles } from "./styles"

interface Props {
  checkInEnabled: boolean
  eventCheckInEnabled: boolean
  goToCheckIn: () => any
  goToEventCheckIn: () => any
  goToServiceSelection: () => any
  template?: KioskTemplate
  url: string
  walkInEnabled: boolean;
  buttonsDisabled: boolean;
}

export default (props: Props) => {
  const {
    checkInEnabled,
    eventCheckInEnabled,
    goToCheckIn,
    goToEventCheckIn,
    goToServiceSelection,
    template,
    url,
    walkInEnabled,
    buttonsDisabled,
  } = props
  const templateStyles = getTemplateStyles(template, url)
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {walkInEnabled ? (
          <CircleButton
            onPress={goToServiceSelection}
            style={templateStyles.circle}
            text={[
              getLocaleString("welcomeScreen.center.number"),
              getLocaleString("welcomeScreen.center.position"),
            ]}
            textStyle={[
              [templateStyles.text, { fontWeight: "bold" }],
              [templateStyles.text, { fontWeight: "bold" }]
            ]}
            disabled={buttonsDisabled}
          />
        ) : null }
        {checkInEnabled ? (
          <CircleButton
            onPress={goToCheckIn}
            style={templateStyles.circle}
            text={[
              getLocaleString("welcomeScreen.center.checkInLine1"),
              getLocaleString("welcomeScreen.center.checkInLine2"),
            ]}
            textStyle={[
              [templateStyles.text, { fontWeight: "bold" }],
              [templateStyles.text, { fontWeight: "bold" }]
            ]}
            disabled={buttonsDisabled}
          />
        ) : null}
        {eventCheckInEnabled ? (
          <CircleButton
            onPress={goToEventCheckIn}
            style={templateStyles.circle}
            text={[
              getLocaleString("welcomeScreen.center.eventCheckInLine1"),
              getLocaleString("welcomeScreen.center.eventCheckInLine2"),
            ]}
            textStyle={[
              [templateStyles.text, { fontWeight: "bold" }],
              [templateStyles.text, { fontWeight: "bold" }]
            ]}
            disabled={buttonsDisabled}
          />
        ) : null}
      </View>
    </View>
  )
}
