import React from "react"
import {
  Text,
  View,
} from "react-native"
import { listItem } from "./styles"

interface Props {
  onPress: (item: string) => void;
  selected?: boolean;
  selectedColor?: string;
  title: string;
}

export default (props: Props) => {
  const { onPress, selected, selectedColor, title } = props
  const buttonStyle = [
    listItem.button,
    selected ? [
      listItem.selected,
      { borderColor: selectedColor }
    ] : {}
  ]
  const textStyle = [
    listItem.text,
    selected ? { color: selectedColor } : {}
  ]
  return (
    <View
      onStartShouldSetResponder={() => true}
      onResponderRelease={() => onPress(title)}
      style={buttonStyle}
    >
      <Text style={textStyle}>
        {title}
      </Text>
    </View>
  )
}
