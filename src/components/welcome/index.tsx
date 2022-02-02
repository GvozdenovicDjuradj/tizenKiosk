import React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { Image, ImageStyle, View, ActivityIndicator } from "react-native"
import { CountryCode, getCountryCallingCode } from "libphonenumber-js"
import Content from "./Content"
import Header from "../Header"
import TopBar from "../TopBar"
import LanguageSelector from "../LanguageSelector"
import { main as styles, content } from "./styles"
import { AppScreens, KioskTemplate, Language, RootState } from "../../interfaces"
import {
  getLocaleString,
  getRouteName,
  getTemplateStyles,
  selectors,
} from "../../utils"
import {
  setCheckInCountry,
  setCheckInCallingCode,
  goToPrivacyPolicyScreen,
  goToServiceSelectionScreen,
  goToEventCheckInScreen,
  goToCheckInScreen,
} from "../../actions"
import { Action } from "../../actions/types"
import SecretTap from "../secretTap"

interface PropsFromState {
  checkInEnabled: boolean;
  eventCheckInEnabled: boolean;
  initialScreen: AppScreens;
  locale?: Language;
  showQudiniLogo: boolean;
  template?: KioskTemplate;
  url: string;
  venueCountry?: string;
  walkInEnabled: boolean;
  shouldDisplayPrivacyPolicy: boolean;
  isLoading: boolean;
}

interface PropsFromDispatch {
  dispatch: Dispatch<Action>;
  goToEventCheckIn: () => Action;
  goToServiceSelection: () => Action;
  setCallingCode: (callingCode: string) => Action;
  setCountry: (countryCode: string) => Action;
  goToPrivacyPolicy: () => Action;
}

type Props =
  Pick<PropsFromState, Exclude<keyof PropsFromState, "venueCountry">> &
  Pick<
    PropsFromDispatch,
    Exclude<keyof PropsFromDispatch, "dispatch" | "setCountry" | "setCallingCode">
  > &
  { goToBookingCheckIn: () => void }

const Welcome = (props: Props) => {
  const {
    checkInEnabled,
    eventCheckInEnabled,
    goToBookingCheckIn,
    goToEventCheckIn,
    shouldDisplayPrivacyPolicy,
    template,
    url,
    walkInEnabled,
    goToPrivacyPolicy,
    goToServiceSelection,
    showQudiniLogo,
    initialScreen,
    isLoading,
  } = props
  const templateStyles = getTemplateStyles(props.template, props.url)

  if (props.template?.welcomeScreenIsRemove) {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%"
        }}
      >
        <ActivityIndicator size="large" color={props.template?.welcomeButtonColor} animating />
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <TopBar>
        <View style={content.topBarView}>
          <SecretTap />
          {templateStyles.logo ?
            <Image
              resizeMode="contain"
              source={{ uri: templateStyles.logo }}
              style={content.logo as ImageStyle}
            />
          : null }
        </View>
      </TopBar>
      <Header
        style={{marginTop: 0}}
        template={template}
        text={getLocaleString("welcomeScreen.header")}
      />
      <Content
        checkInEnabled={checkInEnabled}
        eventCheckInEnabled={eventCheckInEnabled}
        goToCheckIn={goToBookingCheckIn}
        goToEventCheckIn={goToEventCheckIn}
        goToServiceSelection={shouldDisplayPrivacyPolicy ? goToPrivacyPolicy : goToServiceSelection}
        template={template}
        url={url}
        walkInEnabled={walkInEnabled}
        buttonsDisabled={isLoading}
      />
      {showQudiniLogo ? (
        <View style={content.qudiniLogoView}>
          <Image
            source={require("../../../assets/images/logo-qudini.png")}
            style={content.qudiniLogo as ImageStyle}
          />
        </View>
      ) : null}
      {getRouteName() === initialScreen &&
        <LanguageSelector
          languages={templateStyles.languages}
          show={templateStyles.showLangSelect}
        />
      }
    </View>
  )
}

const mapStateToProps = (state: RootState): PropsFromState => ({
  checkInEnabled: selectors.checkInEnabledSelector(state),
  eventCheckInEnabled: selectors.eventCheckInEnabledSelector(state),
  initialScreen: state.app.initialScreen,
  locale: state.kiosk.language,
  showQudiniLogo: selectors.showQudiniLogo(state),
  template: state.kiosk.settings && state.kiosk.settings.template,
  url: state.kiosk.fields.url,
  venueCountry: selectors.venueCountryCode(state),
  walkInEnabled: selectors.walkInEnabledSelector(state),
  shouldDisplayPrivacyPolicy: selectors.isPrivacyPolicyPopup(state),
  isLoading: state.kiosk.isAddingCustomerToQueue,
})

const mapDispatchToProps = (dispatch: Dispatch<Action>): PropsFromDispatch => ({
  dispatch,
  setCountry: (payload: string) => dispatch(setCheckInCountry(payload)),
  setCallingCode: (payload: string) => dispatch(setCheckInCallingCode(payload)),
  goToEventCheckIn: () => dispatch(goToEventCheckInScreen()),
  goToServiceSelection: () => dispatch(goToServiceSelectionScreen()),
  goToPrivacyPolicy: () => dispatch(goToPrivacyPolicyScreen()),
})

const mergeProps = (
  { venueCountry, ...stateProps }: PropsFromState,
  dispatchProps: PropsFromDispatch
): Props => {
  const { dispatch, setCallingCode, setCountry, ...restDispatch } = dispatchProps
  return {
    ...stateProps,
    ...restDispatch,
    goToBookingCheckIn: () => {
      if (venueCountry) {
        const countryCode = venueCountry.toUpperCase() as CountryCode
        const callingCode = getCountryCallingCode(countryCode)
        setCountry(countryCode)
        setCallingCode(`+${callingCode}`)
      }
      dispatch(goToCheckInScreen())
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Welcome)
