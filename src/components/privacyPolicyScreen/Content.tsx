import React from "react"
import { connect } from "react-redux"
import {
  KioskTemplate,
  RootState,
} from "../../interfaces"
import styled from "styled-components/native"

interface TextProps {
  textColor?: string
  fontFamily?: string
}

const Wrapper = styled.View`
  align-items: stretch;
  flex: 1;
  padding-horizontal: 50px;
  padding-top: 50px;
  width: 100%;
`
const Text = styled.Text`
  color: ${(props: TextProps) => props.textColor};
  font-family: ${(props: TextProps) => props.fontFamily};
  font-size: 20px;
`

interface PropsFromState {
  template?: KioskTemplate
  privacyPolicyText: string
}

const Content = (props: PropsFromState) => {
  const { template, privacyPolicyText } = props

  if (!template) {
    return null
  }
  return (
    <Wrapper>
      <Text textColor={template.secondaryTextColor} fontFamily={template.font || "Arial"}>{privacyPolicyText}</Text>
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState): PropsFromState => ({
  template: state.kiosk.settings && state.kiosk.settings.template,
  privacyPolicyText: state.kiosk.privacyPolicy.privacyPolicyText,
})

export default connect(mapStateToProps)(Content)
