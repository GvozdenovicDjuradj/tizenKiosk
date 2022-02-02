import React from "react"
import styled from "styled-components/native"

const Text = styled.Text`
  color: ${(props: NavButtonTextProps) => props.textColor};
  font-size: ${(props: NavButtonTextProps) => props.textSize};
  font-family: ${(props: NavButtonTextProps) => props.fontFamily};
`

interface NavButtonTextProps {
    textColor?: string
    textSize?: number
    fontFamily?: string
}

type Props = NavButtonTextProps & { children?: React.ReactNode }

const NavButtonText = ({
    textColor = "#000",
    textSize = 28,
    fontFamily = "Arial",
    children
}: Props) => {
    return (
        <Text textColor={textColor} textSize={textSize} fontFamily={fontFamily}>
            {children}
        </Text>
    )
}

export default NavButtonText
