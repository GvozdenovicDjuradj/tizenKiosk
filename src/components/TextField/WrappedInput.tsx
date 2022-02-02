import React, { Component } from "react"
import {
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  Text,
  TextInputEndEditingEventData,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { validationStateChange } from "../../actions/validation"
import TextField from "./TextField"
import Popup from "./Popup"
import {
  AppScreens,
  RootState,
  ScreenFieldsState,
  ValidationChangeAction,
  ValidationState,
  ValidatorFn,
} from "../../interfaces"
import { Actions } from "../../actions"
import { getRouteName } from "../../utils"
import { input as styles } from "./styles"

interface PropsFromState {
  error: string[];
  screen?: AppScreens;
}

interface PropsFromDispatch {
  validityChange: (payload: ValidationState) => ValidationChangeAction;
}

export interface InputProps extends TextInputProps {
  buttonStyles?: StyleProp<ViewStyle>;
  inputRef?: (input: any) => any;
  name: string;
  popupStyle?: StyleProp<ViewStyle>;
  popupText?: string;
  validate?: ValidatorFn | ValidatorFn[];
  withPopup?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
}

const validateEvent = Platform.select({
  web: "onBlur",
  default: "onEndEditing"
})

interface WrapperProps extends InputProps, PropsFromState, PropsFromDispatch { }

class WrappedInput extends Component<WrapperProps> {

  public state = { show: false }

  public togglePopup = () => this.setState({ show: !this.state.show })

  public validate =
    (e: NativeSyntheticEvent<TextInputEndEditingEventData> | NativeSyntheticEvent<TextInputFocusEventData>) => {
    const {
      name,
      screen,
      validate: validators,
      validityChange,
    } = this.props
    if (screen && validators) {
      const errors: string[] = []
      if (Array.isArray(validators)) {
        validators.forEach((fn) => {
          const { error } = fn(e.nativeEvent.text)
          if (error && errors.indexOf(error) < 0) {
            errors.push(error)
          }
        })
      } else {
        const { error } = validators(e.nativeEvent.text)
        if (error && errors.indexOf(error) < 0) {
          errors.push(error)
        }
      }
      const newValidityState: ValidationState = {
        [screen]: {
          [name]: {
            error: errors,
            valid: errors.length < 1
          }
        }
      }
      validityChange(newValidityState)
    }
    const handler = this.props[validateEvent as keyof TextInputProps]
    if (handler && typeof handler === "function") {
      (handler as any)(e)
    }
  }

  public render() {
    const {
      buttonStyles,
      error,
      popupStyle,
      popupText = "",
      style,
      validate,
      validityChange,
      withPopup = false,
      wrapperStyle,
      ...inputProps
    } = this.props
    const inputStyle: StyleProp<TextStyle> = [
      styles.input,
      style,
      withPopup ? { } : { paddingRight: 20 },
      {
        height: 54,
      },
    ]

    const isNumeric =
    inputProps.keyboardType === "numeric" ||
    inputProps.keyboardType === "number-pad";

    const keyboardType = isNumeric
      ? Platform.OS === "android"
        ? "numeric"
        : "number-pad"
      : inputProps.keyboardType;

    if (validate) {
      const props = Object
        .keys(inputProps)
        .filter((key) => key !== validateEvent)
        .reduce((obj: any, key: any) => {
          // I'm not quite sure what the point of this reduce is, we have to re-visit this functionality...
          if (obj) {
            obj[key] = (inputProps as InputProps)[key as keyof InputProps]
          }
          return obj
        }, {} as InputProps)
      const textFieldProps = {
        ...props,
        style: inputStyle,
        keyboardType,
        [validateEvent]: this.validate,
        validate: this.validate
      }
      return (
        <View style={[styles.wrapperView, wrapperStyle]}>
          <View style={[styles.inputView, error.length ? styles.errorInput : {}]}>
            <TextField {...textFieldProps} />
            {withPopup ? (
              <TouchableOpacity
                onPress={this.togglePopup}
                style={[styles.button, buttonStyles]}
              >
                <Text style={styles.fa}>&#xf05a;</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {withPopup ? (
            <Popup
              show={this.state.show}
              style={popupStyle}
              text={popupText}
            />
          ) : null}
          {error.length ?
            <View style={styles.errorsView}>
              {error.map((err: string, i: number) => (
                <Text key={i} style={styles.errorText}>{err}</Text>
              ))}
            </View>
            : null
          }
        </View>
      )
    } else {
      if (withPopup) {
        return (
          <View style={[styles.inputView, wrapperStyle]}>
            <TextField style={inputStyle} {...{...inputProps, keyboardType}} />
            <TouchableOpacity
              onPress={this.togglePopup}
              style={[styles.button, buttonStyles]}
            >
              <Text style={styles.fa}>&#xf05a;</Text>
            </TouchableOpacity>
            <Popup
              show={this.state.show}
              style={popupStyle}
              text={popupText}
            />
          </View>
        )
      }
      return (
        <TextField
          style={[styles.inputView, style, { paddingRight: 20 }]}
          {...{...inputProps, keyboardType}}
        />
      )
    }
  }
}

const mapStateToProps = (state: RootState, props: InputProps): PropsFromState => {
  let error: string[] = []
  const screen = getRouteName()
  if (screen) {
    const screenFieldsState: ScreenFieldsState = state.validation[screen]
    if (screenFieldsState && screenFieldsState[props.name]) {
      error = screenFieldsState[props.name].error
    }
  }
  return { error, screen }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): PropsFromDispatch => ({
  validityChange: (payload: ValidationState) => dispatch(validationStateChange(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedInput)
