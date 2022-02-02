import React from "react"
import { Platform } from "react-native"
import { NavigationEvents } from "react-navigation"
import { NavButtonProps, NavButtonNextState } from "./interfaces"
import styled from "styled-components/native"
import NavButtonText from "./NavButtonTextContainer"

const TriangleRight = styled.View`
  background-color: transparent;
  border-bottom-color: transparent;
  border-bottom-width: 35px;
  border-color: ${(props: NavButtonProps) => props.buttonColor};
  border-left-width: 30px;
  border-style: solid;
  border-top-color: transparent;
  border-top-width: 35px;
  height: 0px;
  width: 0px;
`

const NavButton = styled.View`
  align-items: center;
  background-color: #d2d2d2;
  height: 70px;
  justify-content: center;
  min-width: 220px;
  padding: 15px;
  background-color: ${(props: NavButtonProps) => props.buttonColor};
`

const ButtonContainer = styled.TouchableOpacity`
  margin-right: 20px;
  align-self: flex-end;
  background-color: transparent;
  flex-direction: row;
  ${Platform.OS === "ios" ?
    "box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);" :
    "elevation: 7;"
  }
`

export default class extends React.Component<NavButtonProps, NavButtonNextState> {
  public state = {
    isDisabled: false
  }

  public disableHandler = (isDisabled: boolean) => () => {
    this.setState({
      isDisabled
    })
  }

  public render() {
    const {
      buttonColor,
      style,
      text = "Continue",
      textColor = "#000",
      textSize = 28,
      ...buttonProps
    } = this.props

    return (
      <React.Fragment>
        <NavigationEvents
          onWillFocus={this.disableHandler(false)}
          onWillBlur={this.disableHandler(true)}
        />
        <ButtonContainer
          activeOpacity={0.75}
          disabled={this.state.isDisabled}
          {...buttonProps}
          style={style}
        >
          <NavButton buttonColor={buttonColor}>
            <NavButtonText textColor={textColor} textSize={textSize}>
              {text}
            </NavButtonText>
          </NavButton>
          <TriangleRight buttonColor={buttonColor} />
        </ButtonContainer>
      </React.Fragment>
    )
  }
}
