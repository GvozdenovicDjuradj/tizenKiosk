import React from "react"
import { Platform } from "react-native"
import { NavButtonProps } from "./interfaces"
import styled from "styled-components/native"
import NavButtonText from "./NavButtonTextContainer"

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
export default (props: NavButtonProps) => {
  const {
    buttonColor,
    style,
    text,
    textColor = "#000",
    textSize = 28,
    privacyPolicyButtonDefaultText,
    ...buttonProps
  } = props
  return (
    <ButtonContainer
      activeOpacity={0.75}
      style={style}
      {...buttonProps}
    >
      <NavButton buttonColor={buttonColor}>
        <NavButtonText textColor={textColor} textSize={textSize}>
          {text || privacyPolicyButtonDefaultText}
        </NavButtonText>
      </NavButton>
    </ButtonContainer>
  )
}
