import { StyleSheet } from "react-native";

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
  bottomView: {
    alignItems: "flex-end",
    flexDirection: "row",
    height: 80,
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingLeft: 15,
    paddingRight: 15,
    width: "100%",
    margin: 0,
    marginBottom: 80
  },
  text: {
    fontSize: 32,
    textAlign: "center",
  },
});
