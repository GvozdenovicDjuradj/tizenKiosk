import React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { Image, ImageStyle, View } from "react-native"
import Content from "./Content"
import Header from "../Header"
import TopBar from "../TopBar"
import { NavButtonBack, NavButtonNext } from "../NavButton"
import KeyboardResponsiveScrollView from "../keyboard/KeyboardResponsiveScrollView"
import ComponentWithNavigation, { ComponentWithNavigationProps } from "../ComponentWithNavigation"
import { checkIn } from "../../actions"
import { Action, KIOSK } from "../../actions/types"
import { AppScreens, KioskTemplate, RootState } from "../../interfaces"
import { getTemplateBackground, getTemplateStyles, selectors, getLocaleString } from "../../utils"
import { keyboardView as styles } from "./styles"

interface PropsFromState {
  host?: string;
  isInvalid: boolean;
  showQudiniLogo: boolean;
  template?: KioskTemplate;
}

interface PropsFromDispatch {
  goBackExtra: () => any;
  goNext: () => any;
}

type Props = PropsFromState & PropsFromDispatch & ComponentWithNavigationProps

class CheckInScreen extends ComponentWithNavigation<Props> {
  public render() {
    const { goNext, host, template } = this.props
    const templateBackground = getTemplateBackground(template, host)
    const templateStyles = getTemplateStyles(template, host)
    return (
      <KeyboardResponsiveScrollView
        contentContainerStyle={[styles.main, templateBackground.color]}
      >
        <TopBar>
          <View style={styles.navView}>
            <View style={{ flex: 1 }}>
              <NavButtonBack
                buttonColor={templateStyles.circle.backgroundColor}
                onPress={this.goBack}
                text={getLocaleString(`customerScreen.navigation.previous`) || "Back"}
                textColor={templateStyles.text.color}
              />
            </View>
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
                onPress={goNext}
                text={getLocaleString(`customerScreen.navigation.next`) || "Continue"}
                textColor={templateStyles.text.color}
              />
            </View>
          </View>
        </TopBar>
        <Header
          style={{ marginTop: 0 }}
          text={getLocaleString(`customerScreen.header.text.bookingCheckIn`) ||
          "Enter your details so we can find your booking"}
          template={template}
        />
        <Content />
        {this.props.showQudiniLogo ? (
          <View style={styles.bottomView}>
            <View style={{ flex: 1 }}>
            </View>
            <View style={styles.qudiniLogoView}>
              <Image
                source={require("../../../assets/images/logo-qudini.png")}
                style={styles.qudiniLogo as ImageStyle}
              />
            </View>
          </View>
        ) : null}
        {templateBackground.image.url ? (
          <Image
            resizeMode="contain"
            style={styles.backgroundImage as ImageStyle}
            source={{ cache: "force-cache", uri: templateBackground.image.url }}
          />
        ) : null}
      </KeyboardResponsiveScrollView>
    )
  }
}

const isInvalidSelector = (state: RootState) => {
  const nodata = (
    Boolean(state.checkIn.email) === false &&
    Boolean(state.checkIn.mobileNumber) === false &&
    Boolean(state.checkIn.orderNumber) === false
  )
  if (nodata) {
    return true
  }
  return !selectors.isScreenValid(AppScreens.CHECK_IN)(state)
}

const mapStateToProps = (state: RootState): PropsFromState => ({
  host: state.kiosk.fields.url,
  isInvalid: isInvalidSelector(state),
  showQudiniLogo: selectors.showQudiniLogo(state),
  template: state.kiosk.settings && state.kiosk.settings.template,
})

const mapDispatchToProps = (dispatch: Dispatch<Action>): PropsFromDispatch => ({
  goBackExtra: () => dispatch({ type: KIOSK.CHECK_IN.RESET }),
  goNext: () => dispatch(checkIn())
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckInScreen)
