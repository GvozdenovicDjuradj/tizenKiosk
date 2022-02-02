import React from "react"
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native"

export interface ButtonProps extends TouchableOpacityProps {
  text?: string
  textColor?: string
  textSize?: number
  textFont?: string
}

export default (props: ButtonProps) => {
  const {
    text,
    textColor,
    textSize = 18,
    textFont = "Arial",
    ...rest
  } = props
  const textStyle = {
    color: textColor,
    fontSize: textSize,
    fontFamily: textFont
  }
  return (
    <TouchableOpacity {...rest}>
      <Text style={textStyle}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}
