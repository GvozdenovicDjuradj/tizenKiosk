import React from "react"
import CheckBox, { CheckBoxProps } from "react-native-check-box"

export interface CheckboxProps {
  checkBoxColor?: CheckBoxProps["checkBoxColor"],
  checkedCheckBoxColor?: CheckBoxProps["checkedCheckBoxColor"],
  checkedImage?: CheckBoxProps["checkedImage"],
  disabled?: CheckBoxProps["disabled"],
  indeterminateImage?: CheckBoxProps["indeterminateImage"],
  isChecked?: CheckBoxProps["isChecked"],
  isIndeterminate?: CheckBoxProps["isIndeterminate"],
  leftText?: CheckBoxProps["leftText"],
  leftTextStyle?: CheckBoxProps["leftTextStyle"],
  leftTextView?: CheckBoxProps["leftTextView"],
  onClick?: (isChecked: boolean) => void,
  rightText?: CheckBoxProps["rightText"],
  rightTextStyle?: CheckBoxProps["rightTextStyle"],
  rightTextView?: CheckBoxProps["rightTextView"],
  style?: CheckBoxProps["style"],
  uncheckedCheckBoxColor?: CheckBoxProps["uncheckedCheckBoxColor"],
  unCheckedImage?: CheckBoxProps["unCheckedImage"],
}

const clickHandler = (checked?: CheckboxProps["isChecked"], onClick?: CheckboxProps["onClick"]) =>
  onClick && onClick(!checked)

export default (props: CheckboxProps) => {
  const { isChecked, onClick, ...rest } = props
  return (
    <CheckBox
      {...rest}
      isChecked={isChecked}
      onClick={() => clickHandler(isChecked, onClick)}
    />
  )
}
