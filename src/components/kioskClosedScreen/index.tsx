import React from "react"
import { Image, ImageStyle, StyleSheet, View } from "react-native"
import { connect } from "react-redux"
import HTMLView from "react-native-htmlview"
import Header from "../Header"
import { KioskTemplate, RootState } from "../../interfaces"
import {
  getLocaleString,
  getTemplateBackground,
} from "../../utils"
import styles from "./styles"

interface Props {
  host: string;
  template?: KioskTemplate;
}

const KioskClosed = (props: Props) => {
  const templateStyles = getTemplateBackground(props.template, props.host)
  const stylesheet = StyleSheet.create({
    body: {
      color: props.template && props.template.secondaryTextColor,
      fontSize: 32,
      textAlign: "center",
    }
  })

  const header = getLocaleString("closeScreen.header")
  const lineText = getLocaleString("closeScreen.lineText")

  // Some client required the screen to be black when KIOSK is closed, intermediary solution to
  // this is to set the closeScreen.header and closeScreen.lineText to empty string.
  // This condition simply test if those value are defined, if not it will return a black screen.
  if (!header && !lineText) {
    return <View style={[styles.view, {backgroundColor: "black"}]}/>
  }

  return (
    <View style={[styles.view, templateStyles.color]}>
      <Header
        text={header}
        template={props.template}
      />
      <View style={styles.content}>
        <HTMLView
          value={`<body>${lineText}</body>`}
          stylesheet={stylesheet}
        />
      </View>
      {templateStyles.image.url ? (
        <Image
          resizeMode="contain"
          style={styles.backgroundImage as ImageStyle}
          source={{ cache: "force-cache", uri: templateStyles.image.url }}
        />
      ) : null}
    </View>
  )
}

const mapStateToProps = (state: RootState) => ({
  host: state.kiosk.fields.url,
  template: state.kiosk.settings && state.kiosk.settings.template,
})

export default connect(mapStateToProps, null)(KioskClosed)
