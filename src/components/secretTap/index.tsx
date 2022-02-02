import React from "react"
import { TouchableOpacity } from "react-native"
import { content } from "./styles"
import { secretTap } from "../../actions"
import { connect } from "react-redux"

interface PropsFromDispatch {
  secretTap: () => void
}

const SecretTap = (props: PropsFromDispatch) => (
  <TouchableOpacity
    onPress={props.secretTap}
    activeOpacity={0}
    style={content.secretSettingsBtn}
  />
)

const mapDispatchToProps = {
  secretTap,
}

export default connect(null, mapDispatchToProps)(SecretTap)
