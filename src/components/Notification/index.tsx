import React from "react"
import { connect } from "react-redux"
import { Platform } from "react-native"
import styled from "styled-components/native"
import Message from "./Message"
import { RootState } from "../../interfaces"
import { resetError } from "../../actions"

const View = styled.View`
  align-items: center;
  align-self: center;
  elevation: 3;
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;
  position: absolute;
  shadow-color: #000;
  shadow-opacity: 0.9;
  top: 0;
  width: 75%;
  z-index: 1;
`

const alignCenterInWeb = Platform.select({
  web: { left: 0, right: 0 },
  default: {}
})

interface Props {
  error: string
  resetError: () => void
}

const Notification = ({ error, resetError: reset }: Props) => (
  <View style={alignCenterInWeb}>
    {error.trim().length ? (
      <Message key={error} text={error} done={reset} />
    ) : null}
  </View>
)

const mapStateToProps = (state: RootState) => ({ error: state.error })

const mapDispatchToProps = { resetError }

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
