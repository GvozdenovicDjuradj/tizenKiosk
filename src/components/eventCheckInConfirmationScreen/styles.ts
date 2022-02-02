import { StyleSheet } from "react-native"

export default StyleSheet.create({
  backgroundImage: {
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: -1,
  },
  view: {
    alignItems: "center",
    flex: 1,
  },
  logo: {
    height: 60,
    width: 300,
    zIndex: -1,
  },
  navButton: {
    height: 40,
    backgroundColor: "#c5383a",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  navButtonLeft: {
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  navView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  row: {
    alignItems: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  grid: {
    flex: 0.5,
  },
  col: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    flex: 1,
    padding: 30,
    width: "100%",
  },
  text: {
    fontSize: 32,
    textAlign: "center",
  },
  qudiniLogoView: {
    alignItems: "flex-end",
    bottom: 15,
    justifyContent: "center",
    position: "absolute",
    right: 50,
  },
  qudiniLogo: {
    height: 50,
    width: 170,
    resizeMode: "contain"
  },
})
