import React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { Image, ImageStyle, Text, View } from "react-native"
import Button from "../Button"
import Header from "../Header"
import TopBar from "../TopBar"
import { NavButtonBack } from "../NavButton"
import ComponentWithNavigation, { ComponentWithNavigationProps } from "../ComponentWithNavigation"
import { CheckInData, KioskTemplate, RootState } from "../../interfaces"
import { getTemplateBackground, getTemplateStyles, selectors, getLocaleString } from "../../utils"
import { Action } from "../../actions/types"
import { goToInitialScreen } from "../../actions"
import styles from "./styles"
import { mixins } from "../../theme"

interface PropsFromState {
  checkInData?: CheckInData;
  host: string;
  showQudiniLogo: boolean;
  template?: KioskTemplate;
}

interface PropsFromDispatch {
  goBack: () => any;
}

type Props = PropsFromState & PropsFromDispatch & ComponentWithNavigationProps

const getContent = (checkInData: CheckInData, textStyle: object) => (
  <View style={styles.row}>
    <View style={styles.grid}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={[styles.text, textStyle]}>
            {getLocaleString(`confirmationScreen.top.subText.name`) || "Name:"}
          </Text>
        </View>
        <View style={styles.col}>
          <Text style={[styles.text, textStyle]}>
            {checkInData.customer.name}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={[styles.text, textStyle]}>
          {getLocaleString(`confirmationScreen.top.subText.bookingReference`) || "Booking ref:"}
          </Text>
        </View>
        <View style={styles.col}>
          <Text style={[styles.text, textStyle]}>
            {checkInData.customer.bookingRef}
          </Text>
        </View>
      </View>
    </View>
  </View>
)

class CheckInConfirmation extends ComponentWithNavigation<Props> {

  public goBack = () => {
    this.props.goBack()
    return true
  }

  public render() {
    const { checkInData, goBack, host, template } = this.props
    const templateBackground = getTemplateBackground(template, host)
    const templateStyles = getTemplateStyles(template, host)
    const button = { backgroundColor: "" }
    const textStyle = { color: "", fontFamily: "" }
    const buttonText = { color: "" }
    if (template) {
      button.backgroundColor = template.welcomeButtonColor
      buttonText.color = template.buttonTextColor
      textStyle.color = template.secondaryTextColor
      textStyle.fontFamily = template.font
    }
    const content = checkInData ? getContent(checkInData, textStyle) : null
    return (
      <View style={[styles.view, templateBackground.color]}>
        <TopBar>
          <View style={styles.navView}>
            <View style={{ flex: 1 }}>
              <NavButtonBack
                buttonColor={button.backgroundColor}
                onPress={goBack}
                text={getLocaleString(`confirmationScreen.navigation.back`) || "Home"}
                textColor={buttonText.color}
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
            </View>
          </View>
        </TopBar>
        <Header
          style={{ marginTop: 0 }}
          text={getLocaleString(`confirmationScreen.header.text.bookingCheckIn`) || "Thanks for checking in"}
          template={template}
        />
        <View style={styles.content}>
          {content}
        </View>
        <View style={[mixins.centerItem(true)]}>
          <Button
            onPress={goBack}
            style={[button, { padding: 15 }]}
            text={getLocaleString(`confirmationScreen.navigation.nextCustomer`) || "Next Customer"}
            textColor={buttonText.color}
            textSize={32}
            textFont={template && template.font}
          />
        </View>
        {templateBackground.image.url ? (
          <Image
            resizeMode="contain"
            style={styles.backgroundImage as ImageStyle}
            source={{ cache: "force-cache", uri: templateBackground.image.url }}
          />
        ) : null}
        {this.props.showQudiniLogo ? (
          <View style={styles.qudiniLogoView}>
            <Image
              source={require("../../../assets/images/logo-qudini.png")}
              style={styles.qudiniLogo as ImageStyle}
            />
          </View>
        ) : null}
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): PropsFromState => ({
  checkInData: state.checkIn.data,
  host: state.kiosk.fields.url,
  showQudiniLogo: selectors.showQudiniLogo(state),
  template: state.kiosk.settings && state.kiosk.settings.template,
})

const mapDispatchToProps = (dispatch: Dispatch<Action>): PropsFromDispatch => ({
  goBack: () => dispatch(goToInitialScreen())
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckInConfirmation)
