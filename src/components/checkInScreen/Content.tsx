import React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { Text, View } from "react-native"
import TextField from "../TextField"
import { CCA2Code } from "../MobilePhoneInput"
import {
  Actions,
  setCheckInCallingCode,
  setCheckInCountry,
  setCheckInEmail,
  setCheckInMobile,
  setCheckInOrder,
} from "../../actions"
import { RootState } from "../../interfaces"
import { validators, getLocaleString } from "../../utils"
import { content as styles } from "./styles"
import PhoneNumberTextInput, {PhoneNumberWithValidityStatus} from "../../shared/components/PhoneNumberTextInput"
import {CountryCode} from "libphonenumber-js"

interface Props {
  countryCode?: CCA2Code;
  email?: string;
  mobileNumber?: string;
  orderNumber?: string;
  venueCountry?: CountryCode;
  setCheckInCallingCode: (code: string) => Actions;
  setCheckInCountry: (coutry: CCA2Code) => Actions;
  setCheckInEmail: (val: string) => Actions;
  setCheckInMobile: (val: string) => Actions;
  setCheckInOrder: (val: string) => Actions;
}

const Content = (props: Props) => {
    const [isValidPhoneNumber, setIsValidPhoneNumber] = React.useState(true)
    const OR = getLocaleString("customerScreen.placeholder.orReference") || 'or';

    const onValidPhoneNumber = (phoneNumber: PhoneNumberWithValidityStatus) => {
        setIsValidPhoneNumber(phoneNumber.isValid)
        props.setCheckInMobile(phoneNumber.value)
    }

    return (
        <View style={styles.wrapper}>
          <View style={[styles.textFieldView, styles.row]}>
            <TextField
              autoCorrect={false}
              name="orderNumber"
              onChangeText={props.setCheckInOrder}
              placeholder={getLocaleString("customerScreen.placeholder.bookingReference") || "Enter your reference number"}
              style={styles.textField}
              value={props.orderNumber}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.orBlockView}>
              <Text style={styles.orBlockText}>
                {OR}
              </Text>
            </View>
          </View>
          <View style={[styles.textFieldView, styles.row]}>
            <TextField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              name="email"
              onChangeText={props.setCheckInEmail}
              placeholder={getLocaleString("customerScreen.placeholder.email") || "Email"}
              validate={validators.email}
              value={props.email}
              wrapperStyle={styles.textField}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.orBlockView}>
              <Text style={styles.orBlockText}>
              {OR}
              </Text>
            </View>
          </View>
          <View>
            <PhoneNumberTextInput
              onChange={onValidPhoneNumber}
              defaultCountryCode={props.venueCountry}
              displayInvalidMessage={!isValidPhoneNumber}
              placeholder={getLocaleString("customerScreen.placeholder.mobileNumber") || "Mobile Number"}
              invalidErrorMessage={getLocaleString("welcomeScreen.error.customer.mobile")}
              requiredErrorMessage={getLocaleString("welcomeScreen.error.customer.mandatoryPhone")}
            />
          </View>
        </View>
      )
      }

const mapStateToProps = (state: RootState) => ({
  countryCode: state.checkIn.country,
  email: state.checkIn.email,
  mobileNumber: state.checkIn.mobileNumber,
  orderNumber: state.checkIn.orderNumber,
  venueCountry: state.kiosk.venueCountry
})

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  setCheckInCallingCode: (code: string) => dispatch(setCheckInCallingCode(code)),
  setCheckInCountry: (coutry: CCA2Code) => dispatch(setCheckInCountry(coutry)),
  setCheckInEmail: (email: string) => dispatch(setCheckInEmail(email)),
  setCheckInMobile: (mobileNumber: string) => dispatch(setCheckInMobile(mobileNumber)),
  setCheckInOrder: (order: string) => dispatch(setCheckInOrder(order)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Content)
