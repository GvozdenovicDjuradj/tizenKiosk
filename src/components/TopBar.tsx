import React from "react"
import { View, ViewStyle } from "react-native"

interface TopBarProps {
  children?: React.ReactNode
  style?: ViewStyle
}

const styles: ViewStyle = {
  flexDirection: "row",
  height: 100,
  width: "100%",
}

export default (props: TopBarProps) => {
  return (
    <View style={[styles, props.style]}>
      {props.children}
    </View>
  )
}
