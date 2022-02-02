import React, { CSSProperties } from "react"
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native"

export interface CheckBoxProps extends React.ComponentClass {
  checkBoxColor?: string,
  checkedCheckBoxColor?: string,
  checkedImage?: HTMLElement,
  disabled?: boolean,
  indeterminateImage?: HTMLElement,
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
  unCheckedImage?: HTMLElement,
}

const styles = {
  leftText: {
    flex: 1,
  },
  rightText: {
    flex: 1,
    marginLeft: 10
  }
}

export default class Checkbox extends React.PureComponent<CheckBoxProps> {

  public get image() {
    if (this.props.isIndeterminate) {
      return this.indeterminateImage()
    } else {
      return this.props.isChecked ? this.checkedImage() : this.uncheckedImage()
    }
  }

  public getStyles(checked = false) {
    const {
      checkBoxColor,
      checkedCheckBoxColor,
      leftTextStyle,
      rightTextStyle,
      uncheckedCheckBoxColor,
    } = this.props
    const checkboxStyles: CSSProperties = {}
    const lTextStyle = StyleSheet.flatten(leftTextStyle)
    const rTextStyle = StyleSheet.flatten(rightTextStyle)
    if (checked) {
      checkboxStyles.color = checkedCheckBoxColor || checkBoxColor
    } else {
      checkboxStyles.color = uncheckedCheckBoxColor || checkBoxColor
    }
    if (lTextStyle && lTextStyle.fontSize) {
      checkboxStyles.fontSize = lTextStyle.fontSize
    }
    if (rTextStyle && rTextStyle.fontSize) {
      checkboxStyles.fontSize = rTextStyle.fontSize
    }
    return checkboxStyles
  }

  public checkedImage = () => (
    <div className="far" style={this.getStyles(true)}>
      &#xf14a;
    </div>
  )
  public uncheckedImage = () => (
    <div className="far" style={this.getStyles()}>
      &#xf0c8;
    </div>
  )
  public indeterminateImage = () => (
    <div className="far" style={this.getStyles()}>
      &#xf146;
    </div>
  )

  public renderLeft() {
    const { leftText, leftTextStyle, leftTextView } = this.props
    if (leftTextView) {
      return leftTextView
    }
    if (!leftText) {
      return null
    }
    const lTextStyle = StyleSheet.flatten(leftTextStyle) as React.CSSProperties
    return (
      <div style={{ ...styles.leftText, ...lTextStyle }}>
        {this.props.leftText}
      </div>
    )
  }

  public renderRight() {
    const { rightText, rightTextStyle, rightTextView } = this.props
    if (rightTextView) {
      return rightTextView
    }
    if (!rightText) {
      return null
    }
    const rTextStyle = StyleSheet.flatten(rightTextStyle) as React.CSSProperties
    return (
      <div style={{ ...styles.rightText, ...rTextStyle }}>
        {this.props.rightText}
      </div>
    )
  }

  public renderImage() {
    if (this.props.isIndeterminate) {
      return this.props.indeterminateImage
        ? this.props.indeterminateImage
        : this.image
    }
    if (this.props.isChecked) {
      return this.props.checkedImage ? this.props.checkedImage : this.image
    } else {
      return this.props.unCheckedImage ? this.props.unCheckedImage : this.image
    }
  }

  public onClick = () => {
    if (this.props.onClick && !this.props.disabled) {
      this.props.onClick()
    }
  }

  public render() {
    const style = StyleSheet.flatten(this.props.style) as React.CSSProperties
    return (
      <div style={{ display: "flex", ...(style || {}) }} onClick={this.onClick}>
        {this.renderLeft()}
        {this.renderImage()}
        {this.renderRight()}
      </div>
    )
  }
}
