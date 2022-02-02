import { Platform, StyleSheet } from "react-native"
import { metrics } from "../../utils"

export const input = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  fa: {
    color: "#dfdfdf",
    fontFamily: Platform.OS === "ios" ? "FontAwesome5FreeSolid" : "fontawesome-solid",
    fontSize: 26,
  },
  input: {
    borderWidth: 0,
    flex: 1,
    fontSize: metrics.minSize(metrics.scaleSize(26), 26),
    paddingLeft: 20,
  },
  inputView: {
    backgroundColor: "#fff",
    borderColor: "#dfdfdf",
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    width: "100%",
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 24,
    textAlign: "center",
  },
  errorsView: {
    alignItems: "stretch",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  wrapperView: {
    alignItems: "center",
    width: "100%",
  },
})

export const popup = StyleSheet.create({
  popup: {
    alignItems: "center",
    backgroundColor: "#222",
    bottom: "100%",
    justifyContent: "center",
    left: 0,
    paddingHorizontal: 20,
    position: "absolute",
    width: "100%",
    zIndex: 1000
  },
  popupText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
})
