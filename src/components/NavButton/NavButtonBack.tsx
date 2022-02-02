
import React from "react"
import { Platform} from "react-native"
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
const TriangleLeft = styled.View`
  background-color: transparent;
  border-bottom-color: transparent;
  border-bottom-width: 35px;
  border-color: ${(props: NavButtonProps) => props.buttonColor};
  border-right-width: 30px;
  border-style: solid;
  border-top-color: transparent;
  border-top-width: 35px;
  height: 0px;
  width: 0px;
`

const ButtonContainer = styled.TouchableOpacity`
  margin-left: 20px;
  align-self: flex-start;
  background-color: transparent;
  flex-direction: row;
  ${Platform.OS === "ios" ?
    "box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);" :
    "elevation: 7;"
  }
`

export default ({
  buttonColor,
  style,
  text = "Back",
  textColor = "#000",
  textSize = 28,
  ...buttonProps
}: NavButtonProps) => {
  return (
    <ButtonContainer
      activeOpacity={0.75}
      {...buttonProps}
    >
      <TriangleLeft buttonColor={buttonColor} />
      <NavButton buttonColor={buttonColor}>
        <NavButtonText textColor={textColor} textSize={textSize}>
          {text}
        </NavButtonText>
      </NavButton>
    </ButtonContainer>
  )}
