import React from "react"
import { connect } from "react-redux"
import { View } from "react-native"
import KeyboardResponsiveScrollView from "../keyboard/KeyboardResponsiveScrollView"
import Content from "./Content"
import Header from "../Header"
import TopBar from "../TopBar"
import { NavButtonBack, PrivacyPolicyNavButton } from "../NavButton"
import LanguageSelector from "../LanguageSelector"
import ComponentWithNavigation, { ComponentWithNavigationProps } from "../ComponentWithNavigation"
import { Action } from "../../actions/types"
import {
  AppScreens,
  KioskTemplate,
  RootState,
  PrivacyPolicy,
} from "../../interfaces"
import {
  getLocaleString,
  getRouteName,
  getTemplateBackground,
  getTemplateStyles,
  selectors
} from "../../utils"
import {
  agreePrivacyPolicy,
  disagreePrivacyPolicy,
  goToCustomerDetailsScreen,
  goToServiceSelectionScreen,
  addCustomerToQueueReset
} from "../../actions"
import SecretTap from "../secretTap"
import styled from "styled-components/native"

const ButtonsContainer = styled.View`
  flex-direction: row;
`

const NavView = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`

const BottomView = styled.View`
  align-items: flex-end;
  flex-direction: row;
  height: 80px;
  justify-content: center;
  width: 100%;
  z-index: 0;
`

const Logo = styled.Image`
  height: 60px;
  width: 300px;
  z-index: 0;
`

const QudiniLogoView = styled.View`
  align-items: center;
  height: 80px;
  justify-content: center;
  margin-right: 60px;
  width: 180px;
`

const QudiniLogo = styled.Image`
  height: 50px;
  width: 170px;
`

const BackgroundImage = styled.Image`
  height: 100%;
  left: 0px;
  position: absolute;
  top: 0px;
  width: 100%;
  z-index: -1;
`

interface PropsFromState {
  host?: string
  initialScreen: AppScreens
  showQudiniLogo: boolean
  template?: KioskTemplate
  welcomeScreenIsRemove?: boolean
  privacyPolicy: PrivacyPolicy;
  isLoading: boolean;
}

interface PropsFromDispatch {
  goBackExtra: () => Action
  customerAgree: () => Action
  customerDisagree: () => Action
  goToServiceSelection: () => Action
  goToCustomerDetails: () => Action
}

type Props =
  PropsFromState &
  PropsFromDispatch &
  ComponentWithNavigationProps

class PrivacyPolicyScreen extends ComponentWithNavigation<Props> {

  public navigationHandler = () => {
    const { goToCustomerDetails, goToServiceSelection, welcomeScreenIsRemove } = this.props
    welcomeScreenIsRemove ? goToCustomerDetails() : goToServiceSelection()
  }

  public disagreePrivacyPolicy = () => {
    this.props.customerDisagree()
    this.navigationHandler()
  }

  public agreePrivacyPolicy = () => {
    this.props.customerAgree()
    this.navigationHandler()
  }

  public render() {
    const { host, initialScreen, template, privacyPolicy, isLoading } = this.props
    const { agreeButtonText, privacyPolicyHeader, disagreeButtonText } = privacyPolicy
    const templateStyles = getTemplateStyles(template, host)
    const templateBackground = getTemplateBackground(template, host)

    return (
      <KeyboardResponsiveScrollView
        contentContainerStyle={[templateBackground.color, { alignItems: "center", flex: 1 }]}
      >
        <TopBar>
          <NavView>
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
              <Logo
                resizeMode="contain"
                source={{ uri: templateStyles.logo }}
              /> : null
            }
              <View style={{ flex: 1 }}></View>
          </NavView>
        </TopBar>
        <Header
          style={{ marginTop: 0 }}
          text={privacyPolicyHeader}
          template={template}
        />
        <Content />
        <ButtonsContainer>
          <PrivacyPolicyNavButton
            privacyPolicyButtonDefaultText="Do not agree"
            buttonColor={templateStyles.circle.backgroundColor}
            onPress={this.disagreePrivacyPolicy}
            text={disagreeButtonText}
            textColor={templateStyles.text.color}
            disabled={isLoading}
          />
          <PrivacyPolicyNavButton
            privacyPolicyButtonDefaultText="Agree"
            buttonColor={templateStyles.circle.backgroundColor}
            onPress={this.agreePrivacyPolicy}
            text={agreeButtonText}
            textColor={templateStyles.text.color}
            disabled={isLoading}
          />
        </ButtonsContainer>
        <BottomView>
          <View style={{ flex: 1 }}>
            {getRouteName() === initialScreen &&
              <LanguageSelector
                languages={templateStyles.languages}
                show={templateStyles.showLangSelect}
              />
            }
          </View>
          {this.props.showQudiniLogo ? (
            <QudiniLogoView>
              <QudiniLogo
                source={require("../../../assets/images/logo-qudini.png")}
              />
            </QudiniLogoView>
          ) : null}
        </BottomView>
        {templateBackground.image.url ? (
          <BackgroundImage
            resizeMode="contain"
            source={{ cache: "force-cache", uri: templateBackground.image.url }}
          />
        ) : null}
      </KeyboardResponsiveScrollView>
    )
  }
}

const mapStateToProps = (state: RootState): PropsFromState => ({
  host: state.kiosk.fields.url,
  initialScreen: state.app.initialScreen,
  showQudiniLogo: selectors.showQudiniLogo(state),
  template: state.kiosk.settings && state.kiosk.settings.template,
  welcomeScreenIsRemove: state.kiosk.settings && state.kiosk.settings.template.welcomeScreenIsRemove,
  privacyPolicy: state.kiosk.privacyPolicy,
  isLoading: state.kiosk.isAddingCustomerToQueue,
})

const mapDispatchToProps = {
  goBackExtra: addCustomerToQueueReset,
  customerAgree: agreePrivacyPolicy,
  customerDisagree: disagreePrivacyPolicy,
  goToServiceSelection: goToServiceSelectionScreen,
  goToCustomerDetails: goToCustomerDetailsScreen,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivacyPolicyScreen)
