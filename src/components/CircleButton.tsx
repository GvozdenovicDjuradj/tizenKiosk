import React from "react"
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native"
import { NavigationEvents } from "react-navigation"

const circleSide =  260

const styles = StyleSheet.create({
  circleText: {
    fontSize: 30,
    textAlign: "center",
  },
  circleView: {
    alignItems: "center",
    borderRadius: circleSide / 2,
    elevation: 7,
    height: circleSide,
    justifyContent: "center",
    marginBottom: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    width: circleSide,
  },
})

interface Props extends TouchableOpacityProps {
  text: string[];
  textStyle?: StyleProp<TextStyle>;
}

export default class extends React.Component<Props> {
  public state = {
    isDisabled: false
  }

  public disableHandler = (isDisabled: boolean) => () => {
    this.setState({
      isDisabled
    })
  }

  public render() {
    const { text, textStyle, style, ...otherProps } = this.props
    return (
      <React.Fragment>
        <NavigationEvents
          onWillFocus={this.disableHandler(false)}
          onWillBlur={this.disableHandler(true)}
        />
        <TouchableOpacity
          style={[styles.circleView, style]}
          disabled={this.state.isDisabled}
          {...otherProps}
        >
          {text.map((str: string, i: number) => {
            const txtStyle = Array.isArray(textStyle) ? textStyle[i] : textStyle
            return str ? (
              <Text key={i} style={[styles.circleText, txtStyle]}>{str}</Text>
            ) : null
          })}
        </TouchableOpacity>
      </React.Fragment>
    )
  }
}
