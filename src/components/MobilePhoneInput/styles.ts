import { Platform, StyleSheet } from "react-native"
import { CountryPickerStyles } from "react-native-country-picker-modal"

export const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: -1,
  },
  errorText: {
    color: "red",
    fontSize: 24,
    textAlign: "center",
  },
  errorsView: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  fa: {
    color: "#dfdfdf",
    fontFamily: Platform.OS === "ios" ? "FontAwesome5FreeSolid" : "fontawesome-solid",
    fontSize: 26,
    marginLeft: 10,
    textAlign: "center",
  },
  flagImage: {
    borderColor: "#dfdfdf",
    borderWidth: 0.5,
    height: 24,
    resizeMode: "stretch",
    width: 34,
  },
  flagView: {
    alignItems: "center",
    borderColor: "#dfdfdf",
    borderRightWidth: 1,
    borderWidth: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: Platform.select({
      android: 15,
      ios: 2.75,
    })
  },
  input: {
    flex: 1,
    fontSize: 26,
    paddingHorizontal: 20,
  },
  inputView: {
    backgroundColor: "#fff",
    borderColor: "#dfdfdf",
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    width: "100%",
  },
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
})

export const countryPickerStyles: CountryPickerStyles = {
  callingCode: {
    flex: 1,
    textAlign: "right",
  },
  container: {
    justifyContent: "center",
    width: 100,
  },
  contentContainer: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    ...Platform.OS === "web" ? {
      position: "absolute",
      top: 0,
      height: "100%",
      width: "100%",
    } : {}
  },
  header: {
    backgroundColor: "white",
    margin: 0,
    paddingRight: 15,
  },
  input: {
    flex: 1,
    width: "auto"
  },
  keyboardView: {
  },
  keyboardViewContent: {
  },
  listView: {
    height: "100%",
  },
  modalContainer: {
    alignItems: "stretch",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: "15%",
    paddingVertical: "5%",
    zIndex: 3,
  },
  touchFlag: {
    margin: 0,
  }
}
