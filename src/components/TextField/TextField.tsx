import React from "react"
import { NativeSyntheticEvent, TextInput, TextInputChangeEventData, TextInputProps } from "react-native"
import { input as styles } from "./styles"
import { RootState } from "../../interfaces"
import { connect } from "react-redux"

interface Props extends TextInputProps {
  inputRef?: (input: any) => void;
  fontFamily?: string
  validate?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void
}

export const TextField = (props: Props) => {
  const { inputRef, fontFamily, style, ...otherProps } = props
  return (
    <TextInput
      underlineColorAndroid="transparent"
      ref={inputRef}
      style={[styles.input, style, { fontFamily } ]}
      onChange={props.validate}
      {...otherProps}
    />
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    fontFamily: state.kiosk.settings && state.kiosk.settings.template.font
  }
}

export default connect(mapStateToProps)(TextField)
