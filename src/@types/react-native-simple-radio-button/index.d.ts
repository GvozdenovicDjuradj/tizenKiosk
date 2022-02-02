declare module "react-native-simple-radio-button" {
  import * as React from "react"
  import { StyleProp, TextStyle, ViewStyle } from "react-native"

  export interface RadioItem {
    label: string,
    value: string | number,
  }

  export interface RadioFormProps {
    animation?: boolean,
    buttonColor?: string,
    disabled?: boolean,
    formHorizontal?: boolean,
    initial?: number,
    labelColor?: string,
    labelHorizontal?: boolean,
    labelStyle?: StyleProp<TextStyle>,
    onPress: (arg: RadioItem["value"], index: number) => void,
    radio_props: RadioItem[],
    radioStyle?: RadioButtonProps["style"],
    selectedButtonColor?: string,
    selectedLabelColor?: string,
    style?: StyleProp<ViewStyle>,
    wrapStyle?: StyleProp<ViewStyle>,
  }

  export default class RadioForm extends React.Component<RadioFormProps> {}

  export interface RadioButtonProps {
    accessibilityLabel?: string,
    accessible?: boolean,
    buttonColor?: string,
    idSeparator?: string,
    isSelected?: boolean,
    labelColor?: string,
    labelHorizontal?: boolean,
    onPress: (arg: RadioItem["value"], index: number) => void,
    selectedButtonColor?: string,
    style?: StyleProp<ViewStyle>,
    testID?: string,
    wrapStyle?: StyleProp<ViewStyle>,
  }

  export class RadioButton extends React.Component<RadioButtonProps> {}

  export interface RadioButtonInputProps {
    accessibilityLabel?: string,
    accessible?: boolean,
    buttonInnerColor?: string,
    buttonOuterColor?: string,
    buttonOuterSize?: number,
    buttonSize?: number,
    buttonStyle?: StyleProp<ViewStyle>,
    buttonWrapStyle?: StyleProp<ViewStyle>,
    isSelected?: boolean,
    obj: RadioItem,
    onPress: (arg: RadioItem["value"], index: number) => void,
    testID?: string,
  }

  export class RadioButtonInput extends React.Component<RadioButtonInputProps> {}

  interface RadioButtonLabelProps {
    accessibilityLabel?: string,
    accessible?: boolean,
    labelHorizontal?: boolean,
    labelStyle?: StyleProp<TextStyle>,
    labelWrapStyle?: StyleProp<ViewStyle>,
    obj: RadioItem,
    onPress: (arg: RadioItem["value"], index: number) => void,
    testID?: string,
  }

  export class RadioButtonLabel extends React.Component<RadioButtonLabelProps> {}

}
