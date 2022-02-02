import React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import Header from "../Header"
import { Image, ImageStyle, View } from "react-native"
import { NavigationActions } from "react-navigation"
import {
  getLocaleString,
  getRouteName,
  getTemplateBackground,
  getTemplateStyles,
  selectors,
} from "../../utils"
import { Actions, setSubProduct } from "../../actions"
import { QUESTIONS } from "../../actions/types"
import {
  AnyProduct,
  AppScreens,
  KioskSettings,
  KioskTemplate,
  Language,
  RootState,
} from "../../interfaces"
import { getButtons } from "./index"
import ComponentWithNavigation, { ComponentWithNavigationProps } from "../ComponentWithNavigation"
import { NavButtonBack } from "../NavButton"
import TopBar from "../TopBar"
import LanguageSelector from "../LanguageSelector"
import styles from "./styles"

interface PropsFromState {
  host: string
  initialScreen: AppScreens
  locale?: Language
  parentProduct: AnyProduct,
  products: AnyProduct[],
  showQudiniLogo: boolean
  template?: KioskTemplate
}

interface PropsFromDispatch {
  selectService: (service: AnyProduct) => any
}

type SubServiceSelectionScreenProps = PropsFromState & PropsFromDispatch & ComponentWithNavigationProps

class SubServiceSelectionScreen extends ComponentWithNavigation<SubServiceSelectionScreenProps> {
  public render() {
    const {
      host,
      initialScreen,
      parentProduct,
      products,
      selectService,
      showQudiniLogo,
      template,
    } = this.props
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
          text={parentProduct.header || ""}
          template={template}
        />
        <View style={styles.flexProductsWrapper}>
          {getButtons(products, selectService, showWaitTime, withIcon)}
        </View>
        {getRouteName() === initialScreen || showQudiniLogo ? (
          <View style={styles.bottomView}>
            <View style={{ flex: 1 }}>
              {getRouteName() === initialScreen &&
                <LanguageSelector
                  languages={templateStyles.languages}
                  show={templateStyles.showLangSelect}
                />
              }
            </View>
            {showQudiniLogo ? (
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
            source={{ uri: templateBackground.image.url }}
          />
        ) : null}
      </View>
    )
  }
}

const subProductsSelector = (state: RootState): AnyProduct[] => {
  const settings = state.kiosk.settings as KioskSettings
  const selectedProduct = state.kiosk.product as AnyProduct
  if (!selectedProduct) {
    return []
  }
  const subProducts = selectedProduct.products || []
  const products = settings.products

  return subProducts.map((product) => {
    const prod = products.find((product$) => Number(product$.id) === Number(product.id))
    if (!prod) {
      return undefined
    }
    return {
      ...prod,
      showInfo: product.showInfo,
      infoText: product.infoText
    }
  })
    .filter((p) => Boolean(p)) as AnyProduct[]
}
const mapStateToProps = (state: RootState): PropsFromState => ({
  host: state.kiosk.fields.url,
  initialScreen: state.app.initialScreen,
  locale: state.kiosk.language,
  parentProduct: state.kiosk.product || {} as AnyProduct,
  products: subProductsSelector(state),
  showQudiniLogo: selectors.showQudiniLogo(state),
  template: state.kiosk.settings && state.kiosk.settings.template,
})

const mapDispatchToProps = (dispatch: Dispatch<Actions>): PropsFromDispatch => ({
  selectService: (product: AnyProduct) => {
    dispatch(setSubProduct(product))
    let screen = AppScreens.CUSTOMER_DETAILS
    if (product.showInfo) {
      screen = AppScreens.SERVICE_INFO
    } else {
      dispatch({ type: QUESTIONS.REQUEST })
    }
    dispatch(NavigationActions.navigate({
      key: screen,
      routeName: screen
    }))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SubServiceSelectionScreen)
