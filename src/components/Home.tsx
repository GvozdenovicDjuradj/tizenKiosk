import React from "react"
import { Image, ImageStyle, StyleSheet, View } from "react-native"
import { connect } from "react-redux"
import { KioskTemplate, RootState } from "../interfaces"
import Setup from "./setup"
import Welcome from "./welcome"
import { getTemplateBackground } from "../utils"

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
  },
  backgroundImage: {
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: -1,
  },
})

interface Props {
  host: string;
  kioskId?: string;
  template?: KioskTemplate;
}

const Home = (props: Props) => {
  const { host, kioskId, template } = props
  const templateStyles = getTemplateBackground(template, host)
  return (
    <View style={[styles.content, templateStyles.color]}>
      {kioskId ? <Welcome /> : <Setup />}
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
  kioskId: state.kiosk.kioskId,
  template: state.kiosk.settings && state.kiosk.settings.template,
})

export default connect(mapStateToProps, null)(Home)
