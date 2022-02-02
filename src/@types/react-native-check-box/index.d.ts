declare module "react-native-check-box" {
  import * as React from "react"
  import {
    ImageSourcePropType,
    StyleProp,
    TextStyle,
    ViewProps,
    ViewStyle,
  } from "react-native"

  export interface CheckBoxProps extends ViewProps {
    checkBoxColor?: string,
    checkedCheckBoxColor?: string,
    checkedImage?: ImageSourcePropType,
    disabled?: boolean,
    indeterminateImage?: ImageSourcePropType,
    isChecked?: boolean,
    isIndeterminate?: boolean,
    leftText?: string,
    leftTextStyle?: StyleProp<TextStyle>,
    leftTextView?: React.ReactChild,
    onClick: () => void,
    rightText?: string,
    rightTextStyle?: StyleProp<TextStyle>,
    rightTextView?: React.ReactChild,
    style?: StyleProp<ViewStyle>,
    uncheckedCheckBoxColor?: string,
    unCheckedImage?: ImageSourcePropType,
  }

  export default class CheckBox extends React.Component<CheckBoxProps> { }

}
