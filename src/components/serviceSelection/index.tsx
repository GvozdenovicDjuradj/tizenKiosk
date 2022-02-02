import React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import Header from "../Header"
import {
  Image,
  ImageStyle,
  ScrollView,
  View,
} from "react-native"
import { NavigationActions } from "react-navigation"
import {
  getLocaleString,
  getRouteName,
  getTemplateBackground,
  getTemplateStyles,
  selectors,
} from "../../utils"
import {
  Actions,
  setProduct,
  addPrivateCustomerToQueueRequest,
  goToPrivacyPolicyScreen,
} from "../../actions"
import { QUESTIONS } from "../../actions/types"
import {
  AnyProduct,
  AppScreens,
  KioskSettings,
  KioskTemplate,
  Language,
  RootState,
} from "../../interfaces"
import ServiceButton from "./ServiceButton"
import { NavButtonBack } from "../NavButton"
import TopBar from "../TopBar"
import LanguageSelector from "../LanguageSelector"
import ComponentWithNavigation, { ComponentWithNavigationProps } from "../ComponentWithNavigation"
import styles from "./styles"
import SecretTap from "../secretTap"

interface PropsFromState {
  host: string
  initialScreen: AppScreens
  hasAgreedToPrivacyPolicy: boolean
  products: AnyProduct[]
  showQudiniLogo: boolean
  locale?: Language
  template?: KioskTemplate
  isPrivacyPolicyPopup?: boolean
}

interface PropsFromDispatch {
  selectService: (service: AnyProduct) => void
  goToPrivacyPolicy: (product: AnyProduct) => void
  addPrivateCustomer: (product: AnyProduct, queueId?: number, productId?: number) => void
}

interface PropsFromMerge {
  goNext: (product: AnyProduct) => void
}

type ServiceSelectionScreenProps = PropsFromState
  & PropsFromDispatch
  & ComponentWithNavigationProps
  & PropsFromMerge

const FLEX_START = "flex-start"

export const getButtons = (
  products: AnyProduct[],
  onPress: (p: AnyProduct) => any,
  showWaitTime: boolean,
  withIcon: boolean
) => {
  let Container: typeof View | typeof ScrollView = View
  let styleAttr: any = { style: styles.productsView }
  const result: any[] = []
  if (products.length > 4) {
    Container = ScrollView
    styleAttr = {
      contentContainerStyle: {
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: FLEX_START,
        padding: 20,
        width: "100%",
      }
    }
  }
  if (products.length === 2) {
    styleAttr[Object.keys(styleAttr)[0]] = [
      styleAttr[Object.keys(styleAttr)[0]],
      { justifyContent: "space-around" }
    ]
    result.push(
      <Container {...styleAttr} key="0">
        {products.map((product, idx) => (
          <ServiceButton
            key={idx}
            onProductPress={onPress}
            product={product}
            showWaitTime={showWaitTime}
            withIcon={withIcon}
          />
        ))}
      </Container>
    )
  } else if (products.length === 4) {
    result.push(
      <Container key="0" style={[styles.productsView, { alignItems: "flex-end", justifyContent: "center" }]}>
        <ServiceButton
          key={products[0].id}
          onProductPress={onPress}
          product={products[0]}
          showWaitTime={showWaitTime}
          style={{ marginHorizontal: 35 }}
          withIcon={withIcon}
        />
        <ServiceButton
          key={products[1].id}
          onProductPress={onPress}
          product={products[1]}
          showWaitTime={showWaitTime}
          style={{ marginHorizontal: 35 }}
          withIcon={withIcon}
        />
      </Container>
    )
    result.push(
      <Container key="1" style={[styles.productsView, { alignItems: FLEX_START, justifyContent: "center" }]}>
        <ServiceButton
          key={products[2].id}
          onProductPress={onPress}
          product={products[2]}
          showWaitTime={showWaitTime}
          style={{ marginHorizontal: 35 }}
          withIcon={withIcon}
        />
        <ServiceButton
          key={products[3].id}
          onProductPress={onPress}
          product={products[3]}
          showWaitTime={showWaitTime}
          style={{ marginHorizontal: 35 }}
          withIcon={withIcon}
        />
      </Container>
    )
  } else {
    styleAttr[Object.keys(styleAttr)[0]] = [
      styleAttr[Object.keys(styleAttr)[0]],
      { justifyContent: products.length > 4 ? FLEX_START : "space-between" }
    ]
    result.push(
      <Container style={{ width: "100%" }} {...styleAttr} key="0">
        {products.map((product) => (
          <ServiceButton
            key={product.id}
            onProductPress={onPress}
            product={product}
            showWaitTime={showWaitTime}
            withIcon={withIcon}
          />
        ))}
      </Container>
    )
  }
  return result
}

class ServiceSelectionScreen extends ComponentWithNavigation<ServiceSelectionScreenProps> {
  public render() {
    const { host, initialScreen, products, template, goNext } = this.props
    const templateBackground = getTemplateBackground(template, host)
    const templateStyles = getTemplateStyles(template, host)
    const withIcon = template ? template.serviceScreenIsWithIcons : false
    const showWaitTime = template ? template.serviceShowWaitTime : false
    return (
      <View style={[styles.mainView, templateBackground.color]}>
        <TopBar>
          <View style={styles.navView}>
            <View style={{ flex: 1 }}>
              {initialScreen !== AppScreens.SERVICE_SELECTION &&
                <NavButtonBack
                  buttonColor={templateStyles.circle.backgroundColor}
                  onPress={this.goBack}
                  text={getLocaleString("serviceScreen.navigation.previous")}
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
            </View>
          </View>
        </TopBar>
        <Header
          style={{ marginTop: 0 }}
          text={getLocaleString("serviceScreen.header")}
          template={template}
        />
        <View style={styles.flexProductsWrapper}>
          {getButtons(products, goNext, showWaitTime, withIcon)}
        </View>
        {this.props.showQudiniLogo || getRouteName() === initialScreen ? (
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
        ) : null}
        {templateBackground.image.url ? (
          <Image
            resizeMode="contain"
            style={styles.backgroundImage as ImageStyle}
            source={{ cache: "force-cache", uri: templateBackground.image.url }}
          />
        ) : null}
      </View>
    )
  }
}

const productsSelector = (state: RootState): AnyProduct[] => {
  const settings = state.kiosk.settings as KioskSettings
  if (!settings) {
    return []
  }

  return settings.products
}

const mapStateToProps = (state: RootState): PropsFromState => ({
  host: state.kiosk.fields.url,
  initialScreen: state.app.initialScreen,
  locale: state.kiosk.language,
  products: productsSelector(state),
  showQudiniLogo: selectors.showQudiniLogo(state),
  template: state.kiosk.settings && state.kiosk.settings.template,
  isPrivacyPolicyPopup: selectors.isPrivacyPolicyPopup(state),
  hasAgreedToPrivacyPolicy: selectors.hasAgreedToPrivacyPolicy(state),
})

const mapDispatchToProps = (dispatch: Dispatch<Actions>): PropsFromDispatch => ({
  selectService: (product: AnyProduct) => {
    dispatch(setProduct(product))
    let routeName = AppScreens.CUSTOMER_DETAILS
    if (product.products) {
      routeName = AppScreens.SUBSERVICE_SELECTION
    } else {
      dispatch({ type: QUESTIONS.REQUEST })
    }
    dispatch(NavigationActions.navigate({
      key: routeName,
      routeName
    }))
  },
  goToPrivacyPolicy: (product: AnyProduct) => {
    dispatch(setProduct(product))
    if (!product.products) {
      dispatch({ type: QUESTIONS.REQUEST })
    }
    dispatch(goToPrivacyPolicyScreen())
  },
  addPrivateCustomer: (product: AnyProduct, queueId?: number, productId?: number) => {
    dispatch(setProduct(product))
    dispatch(addPrivateCustomerToQueueRequest(queueId, productId))
  }
})

const mergeProps = (
  stateProps: PropsFromState,
  dispatchProps: PropsFromDispatch,
  ownProps: ComponentWithNavigationProps
) => {
  const { isPrivacyPolicyPopup, hasAgreedToPrivacyPolicy, ...restState } = stateProps
  const { goToPrivacyPolicy, selectService, addPrivateCustomer, ...restDispatch } = dispatchProps
  const welcomeScreenIsRemove = stateProps.template && stateProps.template.welcomeScreenIsRemove
  return {
    ...restState,
    ...restDispatch,
    ...ownProps,
    goNext: (product: AnyProduct) => {
      welcomeScreenIsRemove && isPrivacyPolicyPopup ? goToPrivacyPolicy(product) : selectService(product)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ServiceSelectionScreen)
