import { StyleSheet } from "react-native"
import { metrics } from "../utils"
export const header = StyleSheet.create({
    text: {
      color: "#fff",
      fontFamily: "Arial",
      fontSize: metrics.minSize(metrics.scaleSize(55), 55),
      fontWeight: "bold",
      textAlign: "center",
    },
    view: {
      alignItems: "center",
      backgroundColor: "#F80347",
      justifyContent: "center",
      marginTop: 80,
      padding: metrics.minSize(metrics.scaleSize(20), 20),
      width: "100%",
    },
  })

export const button = StyleSheet.create({
  text: {
    fontSize: 12
  }
})
