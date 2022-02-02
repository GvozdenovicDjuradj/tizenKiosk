import React, {Component} from "react"
import {KeyboardType, Text, TextInputComponent, View} from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import {
  Actions,
  setCustomerEmail,
  setCustomerMobile,
  setCustomerName,
  setCustomerOrder,
  setCustomerCountry,
  setCallingCode,
} from "../../actions"
import { validationStateChange } from "../../actions/validation"
import {
  AppScreens,
  KioskTemplate,
  REQUIRED,
  RootState,
  ValidationState,
  ValidatorFn,
  PrivacyPolicy
} from "../../interfaces"
import { privacyPolicyShowOptions } from "../../interfaces/kiosk"
import { CCA2Code, getAllCountriesExtended } from "../MobilePhoneInput"
import TextField from "../TextField"
import { getLocaleString, selectors, validators } from "../../utils"
import { content as styles } from "./styles"
import { customerScreenRequiredOptions } from "./customerScreenConstants"
import CheckBox from "../Checkbox"
import { agreePrivacyPolicy, disagreePrivacyPolicy, setGroupSize, setNotes } from "../../actions/kiosk"
import styled from "styled-components/native"
import PhoneNumberTextInput, {PhoneNumberWithValidityStatus} from "../../shared/components/PhoneNumberTextInput"
import {CountryCode} from "libphonenumber-js"
import HTMLView from "react-native-htmlview"

const PrivacyPolicyContainer = styled.View`
  margin-top: 10px;
  justify-content: space-between;
  flex-direction: row;
`

interface PropsFromState {
  countryCode?: CCA2Code;
  email?: string;
  mobileNumber?: string;
  mobileRequired: boolean;
  mobileWarning?: string;
  name?: string;
  notes?: string;
  groupSize?: number;
  orderNumber?: string;
  placeholderEmail?: string;
  placeholderEmailInfo?: string;
  placeholderMobile?: string;
  placeholderMobileInfo?: string;
  placeholderName?: string;
  placeholderNameInfo?: string;
  placeholderGroupSize?: string;
  placeholderGroupSizeInfo?: string;
  placeholderOrderNumber?: string;
  placeholderOrderNumberInfo?: string;
  placeholderNotes?: string;
  placeholderNotesInfo?: string;
  showMobileNumber: boolean;
  template?: KioskTemplate;
  privacyPolicy: PrivacyPolicy;
  error: string;
  venueCountry?: CountryCode;
}

interface PropsFromDispatch {
  setCallingCode: (callingCode: string) => Actions
  setCountry: (country: CCA2Code) => Actions
  setEmail: (email: string) => Actions
  setMobile: (mobile: string) => Actions
  setName: (name: string) => Actions
  setNotes: (notes: string) => Actions
  setGroupSize: (groupSize: string) => Actions
  setOrder: (order: string) => Actions
  validityChange: (state: ValidationState) => Actions
  customerAgree: () => Actions
  customerDisagree: () => Actions
}

interface Props extends PropsFromState, PropsFromDispatch { }

const refs: { [key: string]: any } = {}
const fieldsOrder: { [key: string]: number } = {
  name: 1,
  email: 2,
  mobileNumber: 3,
  orderNumber: 4,
}

const focusNextField = (current: string) => () => {
  if (Object.keys(refs).length < 2) {
    return
  }
  const getNextField = (currentField: string): any | undefined => {
    const fieldNames = Object.keys(fieldsOrder)
    if (fieldsOrder[currentField] < fieldNames.length) {
      const nextFieldName = fieldNames[fieldsOrder[currentField]]
      const nextRef = refs[nextFieldName]
      if (nextRef) {
        return nextRef
      } else {
        return getNextField(nextFieldName)
      }
    } else {
      return undefined
    }
  }
  const ref = getNextField(current)
  if (ref) {
    ref.focus()
  }
}

const getField = (
  name: string,
  required: REQUIRED,
  placeholder: string,
  handler: (val: string) => Actions | void,
  value?: string,
  popupText?: string,
  validatorFns?: ValidatorFn | ValidatorFn[],
  keyboardType?: KeyboardType
) => {
  switch (required) {
    case REQUIRED.MANDATORY:
    case REQUIRED.ALWAYS:
    case REQUIRED.OPTIONAL: {
      return (
        <TextField
          autoCorrect={false}
          inputRef={(ref: any) => refs[name] = ref}
          keyboardType={keyboardType}
          name={name}
          onChangeText={handler}
          onSubmitEditing={focusNextField(name)}
          placeholder={placeholder}
          popupText={popupText}
          returnKeyType={"next"}
          validate={validatorFns}
          value={value}
          withPopup
          wrapperStyle={styles.textFieldView}
        />
      )
    }
    case REQUIRED.CONDITIONAL:
    default:
      return null
  }
}

const validateNameLength = (val: string) =>
  validate(val, getLocaleString("welcomeScreen.error.customer.mandatoryName") || "Please enter your name")

const validateNotesLength = (val: string) =>
  validate(val, getLocaleString("welcomeScreen.error.customer.mandatoryNotes") || "Please enter notes")

const validatePhoneLength = (val: string) =>
  validate(val, getLocaleString("welcomeScreen.error.customer.mandatoryPhone") || "Please enter your mobile number")

const validateOrderNumberLength = (val: string) =>
  validate(val, getLocaleString("welcomeScreen.error.customer.mandatoryOrder") || "Please enter your order number")


const validate = (val: string, errorMessage: string) => {
  const { error } = validators.strlen(val)
  if (error) {
    return { error: errorMessage }
  } else {
    return { error }
  }
}

class Content extends Component<Props> {

  public state = {
    isInvalidPhoneNumber: false,
    hasPhoneNumberInputBeenBlurred: false,
    hasSubmittedForm: false,
  }
  public componentDidMount() {
    const { mobileRequired, template, validityChange } = this.props
    if (!template) {
      return
    }
    const {
      customerScreenEmail,
      customerScreenRequestOrderNumber,
      customerScreenNameField,
      customerScreenGroupSize
    } = template
    if (customerScreenRequiredOptions.includes(customerScreenNameField)) {
      validityChange({
        [AppScreens.CUSTOMER_DETAILS]: {
          name: { error: [], valid: false }
        }
      })
    }
    if (customerScreenRequiredOptions.includes(customerScreenEmail)) {
      validityChange({
        [AppScreens.CUSTOMER_DETAILS]: {
          email: { error: [], valid: false }
        }
      })
    }
    if (mobileRequired) {
      validityChange({
        [AppScreens.CUSTOMER_DETAILS]: {
          mobileNumber: { error: [], valid: false }
        }
      })
    }
    if (customerScreenRequiredOptions.includes(customerScreenGroupSize)) {
      validityChange({
        [AppScreens.CUSTOMER_DETAILS]: {
          groupSize: { error: [], valid: false }
        }
      })
    }
    if (customerScreenRequiredOptions.includes(customerScreenRequestOrderNumber)) {
      validityChange({
        [AppScreens.CUSTOMER_DETAILS]: {
          orderNumber: { error: [], valid: false }
        }
      })
    }

    const mobileCountryCode = this.props.countryCode || ""

    const selectedCountry = getAllCountriesExtended()
      .find((country) => country.cca2.toUpperCase() === mobileCountryCode.toUpperCase())

    if (selectedCountry) {
      this.props.setCallingCode(selectedCountry.callingCode)
      this.props.setCountry(selectedCountry.cca2)
    }
  }

  componentWillReceiveProps(nextProps:Props) {
    if (!this.state.hasSubmittedForm) {
      this.setState({hasSubmittedForm: nextProps.error && nextProps.error.length > 0 })
    }
  }

  displayPhoneInputRequireMessage(mobileRequired: boolean) {
    return mobileRequired && (this.state.hasSubmittedForm || this.state.hasPhoneNumberInputBeenBlurred)
  }

  public render() {
    const {
      countryCode,
      email,
      mobileRequired,
      name,
      notes,
      groupSize,
      orderNumber,
      showMobileNumber,
      template,
      customerAgree,
      customerDisagree,
    } = this.props

    const {
      privacyPolicyText,
      hasAgreed,
      addCustomerJourney,
      displayPrivacyPolicy
    } = this.props.privacyPolicy

    if (!template) {
      return null
    }
    const {
      customerScreenEmail,
      customerScreenRequestOrderNumber,
      customerScreenIsShowMobileWarning,
      customerScreenNameField,
      customerScreenGroupSize,
      customerScreenNotes
    } = template
    const nameValidators = customerScreenRequiredOptions.includes(customerScreenNameField)
      ? validateNameLength
      : undefined

    const notesValidators = customerScreenRequiredOptions.includes(customerScreenNotes)
      ? validateNotesLength
      : undefined

    const mobileValidators = [
      (val: string) => validators.phoneNumber(val, countryCode)
    ]
    if (mobileRequired) {
      mobileValidators.unshift(validatePhoneLength)
    }
    const orderNumberValidators = customerScreenRequiredOptions.includes(customerScreenRequestOrderNumber)
      ? validateOrderNumberLength
      : undefined

    const setGroupSizeHandler = (newGroupSize: string) => {
      this.props.setGroupSize(newGroupSize.replace(/[^0-9]/g, ""))
    }

    const validateGroupSizeLength = (val: string) => {
      setGroupSizeHandler(val);
      return validate(
        val,
        getLocaleString("welcomeScreen.error.customer.mandatoryGroupSize") ||
          "Please enter a group size"
      );
    };

    const groupSizeValidators = customerScreenRequiredOptions.includes(customerScreenGroupSize)
      ? validateGroupSizeLength
      : undefined

    const customerDetailsNotice = getLocaleString("customerScreen.customerDetailsNotice")

    return (
      <View style={[styles.wrapper]}>
        <View style={styles.fieldsView}>
          {getField(
            "name",
            customerScreenNameField,
            this.props.placeholderName || "Name",
            this.props.setName,
            name,
            this.props.placeholderNameInfo,
            nameValidators
          )}
          {getField(
            "email",
            customerScreenEmail,
            this.props.placeholderEmail || "Email",
            this.props.setEmail,
            email,
            this.props.placeholderEmailInfo,
            validators.email,
            "email-address"
          )}
          {getField(
            "groupSize",
            customerScreenGroupSize,
            this.props.placeholderGroupSize || "Group size",
            setGroupSizeHandler,
            groupSize ? String(groupSize) : "",
            this.props.placeholderGroupSizeInfo,
            groupSizeValidators,
            "numeric"
          )}
          {getField(
            "orderNumber",
            customerScreenRequestOrderNumber,
            this.props.placeholderOrderNumber || "Order number",
            this.props.setOrder,
            orderNumber,
            this.props.placeholderOrderNumberInfo,
            orderNumberValidators
          )}
          {getField(
            "notes",
            customerScreenNotes,
            this.props.placeholderNotes || "Notes",
            this.props.setNotes,
            notes,
            this.props.placeholderNotesInfo,
            notesValidators
          )}
          {showMobileNumber ? (
            <View style={{ width: "50%", zIndex: 1 }}>
              <PhoneNumberTextInput
                onChange={this.onValidPhoneNumber}
                onBlur={this.onPhoneNumberInputBlur}
                defaultCountryCode={this.props.venueCountry}
                popupMessage={this.props.placeholderMobileInfo}
                displayInvalidMessage={this.state.isInvalidPhoneNumber}
                displayRequiredMessage={this.displayPhoneInputRequireMessage(
                  mobileRequired
                )}
                inputRef={(ref: TextInputComponent | null) =>
                  (refs.mobileNumber = ref)
                }
                onSubmitEditing={focusNextField("mobileNumber")}
                placeholder={
                  getLocaleString("customerScreen.placeholder.mobileNumber") ||
                  "Mobile Number"
                }
                invalidErrorMessage={getLocaleString(
                  "welcomeScreen.error.customer.mobile"
                )}
                requiredErrorMessage={getLocaleString(
                  "welcomeScreen.error.customer.mandatoryPhone"
                )}
              />
            </View>
          ) : null}
        </View>
        {customerScreenIsShowMobileWarning && (
          <View style={styles.warningView}>
            <Text style={{ color: template.secondaryTextColor }}>
              {this.props.mobileWarning}
            </Text>
          </View>
        )}
        {addCustomerJourney === privacyPolicyShowOptions.inline &&
        displayPrivacyPolicy ? (
          <PrivacyPolicyContainer>
            <CheckBox
              onClick={hasAgreed ? customerDisagree : customerAgree}
              isChecked={hasAgreed}
              checkBoxColor="#c5383a"
              style={{ paddingRight: 10 }}
            />
            <Text
              style={{
                color: template.secondaryTextColor,
                fontFamily: template.font,
              }}
            >
              {privacyPolicyText}
            </Text>
          </PrivacyPolicyContainer>
        ) : null}
        {customerDetailsNotice && customerDetailsNotice.length > 0 ? (
          <PrivacyPolicyContainer>
              <HTMLView
                value={`<p>${customerDetailsNotice}</p>`}
                stylesheet={{
                  p: {
                    color: template.secondaryTextColor,
                    fontFamily: template.font,
                  },
                }}
              />
          </PrivacyPolicyContainer>
        ) : null}
      </View>
    );
  }

  private readonly onPhoneNumberInputBlur = () => {
    this.setState({ hasPhoneNumberInputBeenBlurred: true} )
  }

  private readonly onValidPhoneNumber = (phoneNumber: PhoneNumberWithValidityStatus) => {
      if (phoneNumber.isValid) {
          this.props.validityChange({
              [AppScreens.CUSTOMER_DETAILS]: {
                  mobileNumber: { error: [], valid: true }
              }
          })
          this.setState({isInvalidPhoneNumber: false})
      } else {
          this.setState({isInvalidPhoneNumber: true})
      }

      this.props.setMobile(phoneNumber.value)
  }

}

const mapStateToProps = (state: RootState): PropsFromState => ({
  countryCode: state.kiosk.customer.country,
  email: state.kiosk.customer.email,
  groupSize: state.kiosk.customer.groupSize,
  mobileNumber: state.kiosk.customer.mobileNumber,
  mobileRequired: selectors.mobileRequired(state),
  mobileWarning: getLocaleString("customerScreen.warning"),
  name: state.kiosk.customer.name,
  notes: state.kiosk.customer.notes,
  orderNumber: state.kiosk.customer.orderNumber,
  placeholderEmail: getLocaleString("customerScreen.placeholder.email"),
  placeholderEmailInfo: getLocaleString("customerScreen.placeholder.emailInfo"),
  placeholderMobile: getLocaleString("customerScreen.placeholder.mobileNumber"),
  placeholderMobileInfo: getLocaleString("customerScreen.placeholder.mobileNumberInfo"),
  placeholderGroupSize: getLocaleString("customerScreen.placeholder.groupSize"),
  placeholderGroupSizeInfo: getLocaleString("customerScreen.placeholder.groupSizeInfo"),
  placeholderName: getLocaleString("customerScreen.placeholder.name"),
  placeholderNameInfo: getLocaleString("customerScreen.placeholder.nameInfo"),
  placeholderOrderNumber: getLocaleString("customerScreen.placeholder.orderNumber"),
  placeholderOrderNumberInfo: getLocaleString("customerScreen.placeholder.orderNumberInfo"),
  placeholderNotes: getLocaleString("customerScreen.placeholder.notes"),
  placeholderNotesInfo: getLocaleString("customerScreen.placeholder.notesInfo"),
  showMobileNumber: selectors.showMobileNumber(state),
  template: state.kiosk.settings && state.kiosk.settings.template,
  privacyPolicy: state.kiosk.privacyPolicy,
  error: state.error,
  venueCountry: state.kiosk.venueCountry
})

const mapDispatchToProps = (dispatch: Dispatch<Actions>): PropsFromDispatch => ({
  setCallingCode: (callingCode: string) => dispatch(setCallingCode(callingCode)),
  setCountry: (country: CCA2Code) => dispatch(setCustomerCountry(country)),
  setEmail: (email: string) => dispatch(setCustomerEmail(email)),
  setMobile: (mobile: string) => dispatch(setCustomerMobile(mobile)),
  setGroupSize: (groupSize: string) => dispatch(setGroupSize(Number(groupSize))),
  setName: (name: string) => dispatch(setCustomerName(name)),
  setOrder: (orderNumber: string) => dispatch(setCustomerOrder(orderNumber)),
  setNotes: (notes: string) => dispatch(setNotes(notes)),
  validityChange: (payload: ValidationState) => dispatch(validationStateChange(payload)),
  customerAgree: () => dispatch(agreePrivacyPolicy()),
  customerDisagree: () => dispatch(disagreePrivacyPolicy()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Content)
