import { Platform, StyleSheet } from "react-native"

import { colors } from "../../theme"

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 1,
    height: "100%",
    paddingBottom: 0,
    width: "100%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexGrow: 0.10
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 26,
    color: colors.text
  },
  fa: {
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "FontAwesome5FreeSolid" : "fontawesome-solid",
    fontSize: 32,
  },
  deactivateBtn: {
    alignItems: "center",
    backgroundColor: colors.red,
    borderRadius: 4,
    justifyContent: "center",
    padding: 6,
    width: 120,
  },
  deactivateBtnText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  deactivateWarningView: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
    paddingVertical: 5,
  },
  contentWrapper: {
    flexGrow: 0.90,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colors.white
  },
  textStyles: {
    color: colors.text
  },
  inputStyles: {
    color: colors.text,
    fontSize: 16,
    height: 38,
    lineHeight: 18,
  },
  messagesView: {
    borderColor: colors.black,
    borderWidth: 1,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 50
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 120
  },
  button: {
    alignItems: "center",
    borderColor: colors.grey,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
})
