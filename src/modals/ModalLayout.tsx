import React from "react"
import Modal from "react-native-modal"
import { StyleSheet, View } from "react-native"
import { connect } from "react-redux"
import { RootState } from "../interfaces"
import { MODAL } from "../actions/types"
import { getRegisteredComponent } from "./index"

interface ModalLayoutProps {
  visible: boolean
  Component: any
  dismiss: () => any
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
})

const ModalLayout = (props: ModalLayoutProps) => {
  const {
    visible,
    Component,
    dismiss
  } = props
  if (!Component) {
    return null
  }
  const componentProps = { dismiss }
  return (
    <Modal isVisible={visible}>
      <View style={styles.view}>
        <Component {...componentProps} />
      </View>
    </Modal>
  )
}

const mapStateToProps = (state: RootState) => ({
  visible: state.modal.visible,
  Component: getRegisteredComponent(state.modal.componentName)
})

export default connect(
  mapStateToProps,
  (dispatch) => ({
    dismiss: () => dispatch({ type: MODAL.HIDE.REQUEST })
  })
)(ModalLayout)
