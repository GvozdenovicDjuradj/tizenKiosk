import { StyleSheet } from "react-native"

export const font = {
  color: "#000",
  fontFamily: "Arial",
  fontSize: 20,
}

export const main = StyleSheet.create({
  view: {
    alignItems: "center",
    flex: 1,
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
  logo: {
    height: 60,
    width: 300,
    zIndex: -1,
  },
  topBarView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  row: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
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
  wrapper: {
    alignItems: "stretch",
    flex: 3,
    paddingHorizontal: 50,
    paddingTop: 40,
    width: "100%",
  },
})
