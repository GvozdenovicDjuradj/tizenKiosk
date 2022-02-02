import { StyleSheet, Platform } from "react-native"

export const font = {
  color: "#000",
  fontFamily: "Arial",
  fontSize: 20,
}

export const keyboardView = StyleSheet.create({
  main: {
    alignItems: "center",
    flex: 1
  },
})

export const header = StyleSheet.create({
  text: {
    color: "#fff",
    fontFamily: "Arial",
    fontSize: 55,
    fontWeight: "bold",
  },
  view: {
    alignItems: "center",
    backgroundColor: "#c5383a",
    flex: 1,
    justifyContent: "center",
    marginTop: 80,
    maxHeight: 150,
    minHeight: 150,
    width: "100%",
  },
})

export const content = StyleSheet.create({
  left: {
    flex: 0.6,
    paddingRight: 15,
  },
  logo: {
    height: 40,
    width: 136,
    resizeMode: "contain"
  },
  logoView: {
    alignItems: "flex-start",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingBottom: 15,
    paddingRight: 15,
  },
  printSwitch: {
    marginRight: 35,
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
  },
  printText: {
    color: "#000",
    fontFamily: Platform.OS === "ios" ? "FontAwesome5FreeSolid" : "fontawesome-solid",
    fontSize: 36,
  },
  printView: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 0,
  },
  right: {
    flex: 0.4,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  saveSettingsBtn: {
    alignItems: "center",
    backgroundColor: "#F80347",
    borderRadius: 5,
    height: 75,
    justifyContent: "center",
    marginTop: 15,
  },
  saveSettingsBtnText: {
    color: "#fff",
    fontSize: 22,
  },
  stepDescriptionView: {
    flex: 1,
    height: 65,
    justifyContent: "center"
  },
  stepNumberText: {
    color: "#000",
    fontSize: 40,
    fontWeight: "bold",
  },
  stepNumberView: {
    alignItems: "center",
    borderRadius: 65 / 2,
    borderWidth: 7,
    height: 65,
    justifyContent: "center",
    width: 65,
  },
  wrapper: {
    flex: 3,
    flexDirection: "row",
    paddingHorizontal: 50,
    paddingTop: 40,
  },
})
