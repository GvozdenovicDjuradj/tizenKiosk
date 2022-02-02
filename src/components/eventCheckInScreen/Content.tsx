import React from "react"
import { Text, View } from "react-native"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import TextField from "../TextField"
import { Action, KIOSK } from "../../actions/types"
import { RootState, StringPayload } from "../../interfaces"
import { getLocaleString, validators } from "../../utils"
import { content as styles } from "./styles"

interface Props {
  bookingRef?: string;
  email?: string;
  setBookingRef: (val: string) => StringPayload;
  setEmail: (val: string) => StringPayload;
}

const Content = (props: Props) => (
  <View style={styles.wrapper}>
    <View style={[styles.textFieldView, styles.row]}>
      <TextField
        autoCorrect={false}
        name="orderNumber"
        onChangeText={props.setBookingRef}
        placeholder={getLocaleString("customerScreen.placeholder.bookingReference") || "Enter your reference number"}
        style={styles.textField}
        value={props.bookingRef}
      />
    </View>
    <View style={styles.row}>
      <View style={styles.orBlockView}>
        <Text style={styles.orBlockText}>
          {getLocaleString("customerScreen.placeholder.orReference") || 'or'}
        </Text>
      </View>
    </View>
    <View style={[styles.textFieldView, styles.row]}>
      <TextField
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        name="email"
        onChangeText={props.setEmail}
        placeholder={getLocaleString("customerScreen.placeholder.email") || "Email"}
        validate={validators.email}
        value={props.email}
        wrapperStyle={styles.textField}
      />
    </View>
  </View>
)

const mapStateToProps = (state: RootState) => ({
  bookingRef: state.eventCheckIn.bookingRef,
  email: state.eventCheckIn.email,
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setBookingRef: (payload: string) => dispatch({
    type: KIOSK.EVENT_CHECK_IN.SET_BOOKING_REF.REQUEST,
    payload,
  }),
  setEmail: (payload: string) => dispatch({
    type: KIOSK.EVENT_CHECK_IN.SET_EMAIL.REQUEST,
    payload,
  }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Content)
