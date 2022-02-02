import React from "react"
import { BackHandler } from "react-native"
import { connect } from "react-redux"
import { createStackNavigator, NavigationInjectedProps } from "react-navigation"
import { AppScreens, RootState } from "./interfaces"
import { selectors } from "./utils"
import ConfirmationScreen from "./components/confirmationScreen"
import CustomerScreen from "./components/customerScreen"
import Home from "./components/Home"
import ServiceSelectionScreen from "./components/serviceSelection"
import SubserviceSelectionScreen from "./components/serviceSelection/SubServiceSelection"
import ServiceInfoScreen from "./components/serviceSelection/ServiceInfoScreen"
import NoConnectionModal from "./components/NoConnectionModal"
import CheckInScreen from "./components/checkInScreen"
import CheckInConfirmation from "./components/checkInConfirmationScreen"
import EventCheckInScreen from "./components/eventCheckInScreen"
import EventCheckInConfirmationScreen from "./components/eventCheckInConfirmationScreen"
import KioskClosedScreen from "./components/kioskClosedScreen"
import QuestionsScreen from "./components/QuestionsScreen"
import QueueFullOrNAScreen from "./components/QueueFullOrNAScreen"
import ScreenSaver from "./components/screenSaver"
import { handleBackButton, removeBackButtonHandler } from "./utils/backButton"
import PrivacyPolicyScreen from "./components/privacyPolicyScreen"
import KeepAwake from 'react-native-keep-awake'
import QueueUnderCapacityScreen from "./components/QueueUnderCapacityScreen"

const AppStackNavigator = createStackNavigator({
  [AppScreens.HOME]: { screen: Home },
  [AppScreens.SERVICE_SELECTION]: { screen: ServiceSelectionScreen },
  [AppScreens.SUBSERVICE_SELECTION]: { screen: SubserviceSelectionScreen },
  [AppScreens.SERVICE_INFO]: { screen: ServiceInfoScreen },
  [AppScreens.CUSTOMER_DETAILS]: { screen: CustomerScreen },
  [AppScreens.SCREEN_SAVER]: { screen: ScreenSaver },
  [AppScreens.QUEUE_CONFIRMATION]: {
    screen: ConfirmationScreen,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  [AppScreens.QUEUE_FULL_OR_NA]: { screen: QueueFullOrNAScreen },
  [AppScreens.QUEUE_UNDER_OCCUPANCY]: { screen: QueueUnderCapacityScreen },
  [AppScreens.QUESTIONS]: { screen: QuestionsScreen },
  [AppScreens.CHECK_IN]: { screen: CheckInScreen },
  [AppScreens.EVENT_CHECK_IN]: { screen: EventCheckInScreen },
  [AppScreens.EVENT_CHECK_IN_CONFIRMATION]: { screen: EventCheckInConfirmationScreen },
  [AppScreens.NO_CONNECTION_MODAL]: { screen: NoConnectionModal },
  [AppScreens.KIOSK_CLOSED]: { screen: KioskClosedScreen },
  [AppScreens.CHECK_IN_CONFIRMATION]: {
    screen: CheckInConfirmation,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  [AppScreens.PRIVACY_POLICY]: { screen: PrivacyPolicyScreen },
}, {
  cardStyle: { backgroundColor: "transparent" },
  headerMode: "none",
  initialRouteName: AppScreens.HOME,
  mode: "card",
})

interface Props extends NavigationInjectedProps {
  loading: boolean,
  hasKioskModeEnable: boolean
}

class AppNavigator extends React.Component<Props> {
  public static router = AppStackNavigator.router

  /**
   * Depending on hasKioskModeEnable props, calling back button will Quit the app or do nothing
   * react navigation back button handler will overwrite that behavior
   */
  public handleBackButtonClick = () => {
   if (!this.props.hasKioskModeEnable) {
     BackHandler.exitApp()
   }
  }

  public componentWillMount() {
    handleBackButton(this.handleBackButtonClick)
  }

  public componentWillUnmount() {
    removeBackButtonHandler(this.handleBackButtonClick)
  }

  public render() {
    const { hasKioskModeEnable } = this.props
    return (
      <React.Fragment>
        { hasKioskModeEnable &&
          <KeepAwake />
        }
        <AppStackNavigator navigation={this.props.navigation} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  hasKioskModeEnable: selectors.isKioskModeEnabled(state)
})

export default connect(mapStateToProps)(AppNavigator)
