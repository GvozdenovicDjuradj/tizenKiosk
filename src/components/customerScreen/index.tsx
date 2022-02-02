import React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { Image, ImageStyle, View } from "react-native"
import KeyboardResponsiveScrollView from "../keyboard/KeyboardResponsiveScrollView"
import Content from "./Content"
import Header from "../Header"
import TopBar from "../TopBar"
import { validationStateChange } from "../../actions/validation"
import { NavButtonBack, NavButtonNext } from "../NavButton"
import LanguageSelector from "../LanguageSelector"
import ComponentWithNavigation, { ComponentWithNavigationProps } from "../ComponentWithNavigation"
import { Action, KIOSK } from "../../actions/types"
import {
  AppScreens,
  KioskTemplate,
  Language,
  RootState,
  REQUIRED,
  ValidationState,
  PrivacyPolicy
} from "../../interfaces"
import {
  getLocaleString,
  getRouteName,
  getTemplateBackground,
  getTemplateStyles,
  selectors
} from "../../utils"
import { keyboardView as styles } from "./styles"
import { customerScreenRequiredOptions } from "./customerScreenConstants"
import { stringNotEmpty } from "../../utils/validators"
import { setAddCustomerToQueueError, goToQuestionsScreen, addCustomerToQueueReset, goToUnderCapacityScreen } from "../../actions"
import SecretTap from "../secretTap"
import { privacyPolicyShowOptions } from "../../interfaces/kiosk"

interface PropsFromState {
  email?: string;
  name?: string;
  mobileNumber?: string;
  orderNumber?: string;
  notes?: string;
  groupSize?: number;
  host?: string;
  initialScreen: AppScreens;
  locale?: Language;
  questionsLength: number;
  screenValid: boolean;
  showQudiniLogo: boolean;
  template?: KioskTemplate;
  showMobileNumber?: boolean;
  mobileRequired?: boolean;
  hasAgreedToPrivacyPolicy?: boolean;
  privacyPolicy: PrivacyPolicy;
  isFetching: boolean;
  underCapacity: boolean,
}

interface PropsFromDispatch {
  goBackExtra: () => any;
  emptyFieldsError: () => void;
  validityChange: (state: ValidationState) => Action;
  dispatch: Dispatch<Action>;
}

interface PropsFromMerge {
  goNext: () => void
  goToUnderCapacity: () => void,
}

type Props =
  PropsFromState &
  PropsFromDispatch &
  PropsFromMerge &
  ComponentWithNavigationProps

class CustomerScreen extends ComponentWithNavigation<Props> {
  public showError = () => {
    const {
      name,
      email,
      showMobileNumber,
      orderNumber,
      notes,
      groupSize,
      validityChange,
      mobileNumber,
      template,
      mobileRequired
    } = this.props
    this.props.emptyFieldsError()

    if (!template) {
      return
    }

    const {
      customerScreenEmail,
      customerScreenRequestOrderNumber,
      customerScreenNameField,
      customerScreenGroupSize,
      customerScreenNotes
    } = template

    if (!stringNotEmpty(name) && customerScreenRequiredOptions.includes(customerScreenNameField)) {
      validityChange({
        [AppScreens.CUSTOMER_DETAILS]: {
          name: { error: [getLocaleString("welcomeScreen.error.customer.mandatoryName") || "Please enter your name"], valid: false }
        }
      })
    }
    if (!stringNotEmpty(email) && customerScreenRequiredOptions.includes(customerScreenEmail)) {
      validityChange({
        [AppScreens.CUSTOMER_DETAILS]: {
          email: { error: [getLocaleString("welcomeScreen.error.customer.mandatoryEmail") || "Please enter your email"], valid: false }
        }
      })
    }
    if (showMobileNumber && !stringNotEmpty(mobileNumber) && mobileRequired) {
      validityChange({
        [AppScreens.CUSTOMER_DETAILS]: {
          mobileNumber: { error: [getLocaleString("welcomeScreen.error.customer.mandatoryPhone") || "Please enter your mobile number"], valid: false }
        }
      })
    }
    if (customerScreenRequiredOptions.includes(customerScreenGroupSize) && !groupSize) {
      validityChange({
        [AppScreens.CUSTOMER_DETAILS]: {
          groupSize: { error: [getLocaleString("welcomeScreen.error.customer.mandatoryGroupSize") || "Please enter a group size"], valid: false }
        }
      })
    }
    if (!stringNotEmpty(orderNumber) && customerScreenRequiredOptions.includes(customerScreenRequestOrderNumber)) {
      validityChange({
        [AppScreens.CUSTOMER_DETAILS]: {
          orderNumber: { error: [getLocaleString("welcomeScreen.error.customer.mandatoryOrder") || "Please enter your order number"], valid: false }
        }
      })
    }
    if (!stringNotEmpty(notes) && customerScreenRequiredOptions.includes(customerScreenNotes)) {
      validityChange({
        [AppScreens.CUSTOMER_DETAILS]: {
          orderNumber: { error: [getLocaleString("welcomeScreen.error.customer.mandatoryNotes") || "Please enter notes"], valid: false }
        }
      })
    }
  }

  public componentWillMount() {
    const { goToUnderCapacity, underCapacity } = this.props

    if (underCapacity) {
      goToUnderCapacity();
    }
  }

  public render() {
    const { goNext, host, initialScreen, screenValid, template} = this.props
    const templateStyles = getTemplateStyles(template, host)
    const templateBackground = getTemplateBackground(template, host)
    let headerText = "withoutMobile"
    if (template) {
      if (template.customerScreenRequestMobileNumberWhen === REQUIRED.ALWAYS ||
        template.customerScreenRequestMobileNumberWhen === REQUIRED.CONDITIONAL) {
        headerText = "withMobile"
      }
    }

    return (
      <KeyboardResponsiveScrollView
        contentContainerStyle={[styles.main, templateBackground.color]}
      >
        <TopBar>
          <View style={styles.navView}>
            <View style={{ flex: 1 }}>
              {initialScreen !== AppScreens.CUSTOMER_DETAILS &&
                <NavButtonBack
                  buttonColor={templateStyles.circle.backgroundColor}
                  onPress={this.goBack}
                  text={getLocaleString("customerScreen.navigation.previous")}
                  textColor={templateStyles.text.color}
                />
              }
            </View>
            <SecretTap />
            {templateStyles.logo ?
              <Image
                resizeMode="contain"
                source={{ uri: templateStyles.logo }}
                style={styles.logo as ImageStyle}
              />
              : null}
            <View style={{ flex: 1 }}>
              <NavButtonNext
                buttonColor={templateStyles.circle.backgroundColor}
                style={this.getIsNextButtonDisabled() ? { opacity: 0.5 } : null}
                onPress={screenValid ? goNext : this.showError}
                text={getLocaleString("customerScreen.navigation.next")}
                textColor={templateStyles.text.color}
                disabled={this.getIsNextButtonDisabled()}
              />
            </View>
          </View>
        </TopBar>
        <Header
          style={{ marginTop: 0 }}
          text={getLocaleString(`customerScreen.header.text.${headerText}`)}
          template={template}
        />
        <Content />
        <View style={styles.bottomView}>
          <View style={{ flex: 1 }}>
            {getRouteName() === initialScreen &&
              <LanguageSelector
                languages={templateStyles.languages}
                show={templateStyles.showLangSelect}
              />
            }
          </View>
          {this.props.showQudiniLogo ? (
            <View style={styles.qudiniLogoView}>
              <Image
                source={require("../../../assets/images/logo-qudini.png")}
                style={styles.qudiniLogo as ImageStyle}
              />
            </View>
          ) : null}
        </View>
        {templateBackground.image.url ? (
          <Image
            resizeMode="contain"
            style={styles.backgroundImage as ImageStyle}
            source={{ cache: "force-cache", uri: templateBackground.image.url }}
          />
        ) : null}
      </ KeyboardResponsiveScrollView>
    )
  }

  private readonly getIsNextButtonDisabled = (): boolean => {
    const { 
      privacyPolicy: { addCustomerJourney, displayPrivacyPolicy },
      hasAgreedToPrivacyPolicy,
      isFetching
    } = this.props

    if (isFetching) {
      return true
    }

    if (addCustomerJourney === privacyPolicyShowOptions.none || !displayPrivacyPolicy) {
      return false
    }

    return !hasAgreedToPrivacyPolicy
  }
}

const mapStateToProps = (state: RootState): PropsFromState => ({
  name: state.kiosk.customer.name,
  email: state.kiosk.customer.email,
  mobileNumber: state.kiosk.customer.mobileNumber,
  orderNumber: state.kiosk.customer.orderNumber,
  groupSize: state.kiosk.customer.groupSize,
  notes: state.kiosk.customer.notes,
  host: state.kiosk.fields.url,
  initialScreen: state.app.initialScreen,
  locale: state.kiosk.language,
  questionsLength: state.questions.questions.length,
  mobileRequired: selectors.mobileRequired(state),
  screenValid: selectors.isScreenValid(AppScreens.CUSTOMER_DETAILS)(state),
  showQudiniLogo: selectors.showQudiniLogo(state),
  showMobileNumber: selectors.showMobileNumber(state),
  template: state.kiosk.settings && state.kiosk.settings.template,
  hasAgreedToPrivacyPolicy: selectors.hasAgreedToPrivacyPolicy(state),
  privacyPolicy: state.kiosk.privacyPolicy,
  isFetching: state.kiosk.isAddingCustomerToQueue,
  underCapacity: selectors.getUnderCapacityFromQueueByProduct(state)
})

const mapDispatchToProps = (dispatch: Dispatch<Action>): PropsFromDispatch => ({
  goBackExtra: () => dispatch(addCustomerToQueueReset()),
  emptyFieldsError: () => dispatch(setAddCustomerToQueueError(getLocaleString("welcomeScreen.error.kiosk.input") || "Please enter the required information")),
  validityChange: (payload: ValidationState) => dispatch(validationStateChange(payload)),
  dispatch,
})

const mergeProps = (
  stateProps: PropsFromState,
  dispatchProps: PropsFromDispatch,
  ownProps: ComponentWithNavigationProps
) => {
  const { dispatch, ...restDispatch } = dispatchProps
  return {
    ...stateProps,
    ...ownProps,
    ...restDispatch,
    goToUnderCapacity: () => {
      dispatch(goToUnderCapacityScreen())
    },
    goNext: () => {
      if (stateProps.questionsLength) {
        dispatch(goToQuestionsScreen())
      } else {
        dispatch({ type: KIOSK.CUSTOMER.ADD_TO_QUEUE.REQUEST })
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CustomerScreen)
