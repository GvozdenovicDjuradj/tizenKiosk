import { StyleSheet } from "react-native"

export const keyboardView = StyleSheet.create({
  backgroundImage: {
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: -1,
  },
  bottomView: {
    alignItems: "flex-end",
    flexDirection: "row",
    height: 80,
    justifyContent: "center",
    width: "100%",
    zIndex: 0,
  },
  logo: {
    height: 60,
    width: 300,
    zIndex: 0,
  },
  main: {
    alignItems: "center",
    flex: 1,
  },
  navButton: {
    alignItems: "center",
    backgroundColor: "#c5383a",
    borderRadius: 2,
    borderWidth: 1,
    elevation: 5,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 10,
    shadowOffset: {  width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  navButtonLeft: {
    marginLeft: 20,
    alignSelf: "flex-start",
  },
  navButtonRight: {
    marginRight: 20,
    alignSelf: "flex-end",
  },
  navView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  qudiniLogoView: {
    alignItems: "center",
    height: 80,
    justifyContent: "center",
    marginRight: 60,
    width: 180,
  },
  qudiniLogo: {
    height: 50,
    width: 170,
    resizeMode: "contain"
  },
})

export const content = StyleSheet.create({
  fieldsView: {
    alignItems: "center",
    flexGrow: 1,
    width: "100%",
  },
  textFieldView: {
    marginTop: 15,
    width: "50%",
  },
  warning: {
    fontSize: 30,
  },
  warningView: {
    alignSelf: "flex-start",
    width: "50%",
    paddingBottom: 20,
  },
  wrapper: {
    alignItems: "stretch",
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 50,
    width: "100%",
  },
})
