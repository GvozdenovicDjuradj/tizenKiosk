import { ViewStyle } from "react-native"
import { ButtonProps } from "../Button"

export interface Styles {
  navButton: ViewStyle
  navButtonLeft: ViewStyle
  navButtonRight: ViewStyle
  triangleLeft: ViewStyle
  triangleRight: ViewStyle
  view: ViewStyle
}

export interface NavButtonProps extends ButtonProps {
  buttonColor?: string
  privacyPolicyButtonDefaultText?: string
}

export interface NavButtonNextState {
  isDisabled: boolean
}
