import { Platform, StyleSheet } from "react-native"

export const wrapper = StyleSheet.create({
  style: {
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "row",
  },
})

export const backdrop = StyleSheet.create({
  view: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    flex: 1,
  }
})

export const flatList = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  buttonText: {
    flex: 1,
    fontSize: 26,
  },
  buttonIcon: {
    fontFamily: Platform.OS === "ios" ? "FontAwesome5FreeSolid" : "fontawesome-solid",
    fontSize: 26,
    textAlign: "center",
    width: 30,
  },
  style: {
    backgroundColor: "#fff",
  },
})

export const listItem = StyleSheet.create({
  button: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  selected: {
    borderLeftWidth: 5,
    paddingLeft: 10,
  },
  text: {
    fontSize: 26,
  },
})
