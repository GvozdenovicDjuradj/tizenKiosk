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
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingLeft: 15,
    paddingRight: 15,
    width: "100%",
    margin: 0
  },
  text: {
    fontSize: 32,
    textAlign: "center",
  }
})
