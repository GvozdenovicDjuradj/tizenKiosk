import React from "react"
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
} from "react-native"
import Checkbox from "../Checkbox"
import { checkbox } from "./styles"

interface Props {
  checkBoxColor?: string;
  onChange?: (value: string) => void;
  options: Array<{label: string, value: string}>;
  textStyle?: StyleProp<TextStyle>;
  value?: string;
}

const optionChecked = (
  isChecked: boolean,
  text: string,
  values: string[],
  onChange: Props["onChange"],
) => {
  const exist = values.findIndex((str) => str === text)
  if (exist > -1 && !isChecked) {
    values.splice(exist, 1)
  }
  if (isChecked && exist < 0) {
    values.push(text)
  }
  if (onChange) {
    onChange(values.length ? values.join(", ") : "")
  }
}

export default (props: Props) => {
  const {
    checkBoxColor,
    onChange,
    options,
    textStyle,
    value,
  } = props
  const values: string[] = (value && value.length) ? value.split(", ") : []
  return (
    <ScrollView
      contentContainerStyle={checkbox.contentContainer}
      style={checkbox.scrollView}
    >
      {options.map((item, i: number) => (
        <Checkbox
          checkBoxColor={checkBoxColor}
          key={i}
          onClick={(isChecked: boolean) =>
            optionChecked(isChecked, item.value, values, onChange)
          }
          rightText={item.label}
          rightTextStyle={StyleSheet.flatten([checkbox.textStyle, textStyle])}
          isChecked={values.indexOf(item.value) > -1}
          style={checkbox.style}
        />
      ))}
    </ScrollView>
  )
}
