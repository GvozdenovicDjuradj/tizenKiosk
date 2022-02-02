import React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import {
  Image,
  ImageStyle,
  Text,
  View,
} from "react-native"
import ComponentWithNavigation, { ComponentWithNavigationProps } from "../ComponentWithNavigation"
import styles from "./styles"
import Button from "../Button"
import { NavButtonBack } from "../NavButton"
import TopBar from "../TopBar"
import {
  getLocaleString,
  getTemplateBackground,
  getTemplateStyles,
  selectors,
} from "../../utils"
import { Actions, goToCustomerDetailsScreen } from "../../actions"
import { QUESTIONS } from "../../actions/types"
import { mixins } from "../../theme"
import {
  AnyProduct,
  AppScreens,
  KioskTemplate,
  RootState,
  Language,
} from "../../interfaces"

interface PropsFromState {
  host: string;
  initialScreen: AppScreens;
  locale?: Language;
  showQudiniLogo: boolean;
  subProduct?: AnyProduct;
  template?: KioskTemplate;
}

interface PropsFromDispatch {
  proceedToCustomerDetails: () => any;
}

type ServiceInfoProps = PropsFromState & PropsFromDispatch & ComponentWithNavigationProps

class ServiceInfoScreen extends ComponentWithNavigation<ServiceInfoProps> {
  public render() {
    const {
      host,
      proceedToCustomerDetails,
      subProduct,
      showQudiniLogo,
      template,
    } = this.props
    const templateBackground = getTemplateBackground(template, host)
    const templateStyles = getTemplateStyles(template, host)
    const navButtonLeft = {
      backgroundColor: templateStyles.text.color,
      shadowColor: templateStyles.circle.backgroundColor,
    }
    const navButtonRight = {
      backgroundColor: templateStyles.circle.backgroundColor,
      shadowColor: templateStyles.text.color,
    }
    const product = subProduct || { infoText: "" }
    return (
      <View style={[styles.mainView, templateBackground.color]}>
        <TopBar>
          <View style={styles.navView}>
            <View style={{ flex: 1 }}>
              <NavButtonBack
                buttonColor={templateStyles.circle.backgroundColor}
                onPress={this.goBack}
                text={getLocaleString("serviceScreen.navigation.previous")}
                textColor={templateStyles.text.color}
              />
            </View>
            {templateStyles.logo ?
              <Image
                resizeMode="contain"
                source={{ uri: templateStyles.logo }}
                style={styles.logo as ImageStyle}
              />
            : null }
            <View style={{ flex: 1 }}>
            </View>
          </View>
        </TopBar>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            width: "100%",
            ...mixins.padding(20)
          }}
        >
          <View
            style={{
              alignItems: "center",
              ...mixins.padding(20, 20, 40, 20)
            }}
          >
            <Text
              style={{
                color: "#4a4a4a",
                fontSize: 30
              }}
            >
              {product.infoText || ""}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ ...mixins.padding(0, 15), flex: 1 }}>
              <Button
                style={{
                  height: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  ...navButtonRight,
                  ...mixins.padding(0, 15)
                }}
                text={`Join Queue`}
                textSize={20}
                textColor={templateStyles.text.color}
                onPress={proceedToCustomerDetails}
              />
            </View>
            <View style={{ ...mixins.padding(0, 15), flex: 1 }}>
              <Button
                style={{
                  height: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  ...navButtonLeft,
                  ...mixins.padding(0, 15)
                }}
                text={`Cancel`}
                textColor={templateStyles.circle.backgroundColor}
                textSize={20}
                onPress={this.goBack}
              />
            </View>
          </View>
        </View>
        {showQudiniLogo ? (
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
        {templateBackground.image.url
          ?
          <Image
            resizeMode="contain"
            style={styles.backgroundImage as ImageStyle}
            source={{ uri: templateBackground.image.url }}
          />
          : null
        }
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): PropsFromState => ({
  host: state.kiosk.fields.url,
  initialScreen: state.app.initialScreen,
  locale: state.kiosk.language,
  subProduct: state.kiosk.subProduct,
  showQudiniLogo: selectors.showQudiniLogo(state),
  template: state.kiosk.settings && state.kiosk.settings.template,
})

const mapDispatchToProps = (dispatch: Dispatch<Actions>): PropsFromDispatch => ({
  proceedToCustomerDetails: () => {
    dispatch({ type: QUESTIONS.REQUEST })
    dispatch(goToCustomerDetailsScreen())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ServiceInfoScreen)
