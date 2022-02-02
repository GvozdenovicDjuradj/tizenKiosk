import { StyleSheet } from "react-native"
import { metrics } from "../../utils"
export const main = StyleSheet.create({
  view: {
    alignItems: "center",
    flex: 1,
  },
})

const circleSide = metrics.minSize(300, metrics.vh(39))

export const content = StyleSheet.create({
  backgroundImage: {
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: -1,
  },
  circleText: {
    fontSize: metrics.minSize(metrics.scaleSize(110), 110),
    fontWeight: "bold",
  },
  circleView: {
    alignSelf: "center",
    alignItems: "center",
    borderRadius: circleSide / 2,
    height: circleSide,
    justifyContent: "center",
    width: circleSide,
  },
  logo: {
    height: 60,
    width: 300,
    zIndex: -1,
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
  text: {
    fontSize: metrics.minSize(metrics.scaleSize(32), 32),
  },
  textView: {
    marginVertical: metrics.minSize(metrics.scaleSize(10), 10),
  },
  topBarView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  wrapper: {
    alignItems: "stretch",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
})
