import React from "react"
import { Image, ImageStyle, Text, View } from "react-native"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import Button from "../Button"
import Header from "../Header"
import TopBar from "../TopBar"
import { NavButtonBack } from "../NavButton"
import ComponentWithNavigation, { ComponentWithNavigationProps } from "../ComponentWithNavigation"
import { CheckInData, KioskTemplate, RootState } from "../../interfaces"
import { getTemplateBackground, getTemplateStyles, selectors } from "../../utils"
import { Actions, goToInitialScreen } from "../../actions"
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

const getContent = (textStyle: object) => (
  <View style={styles.row}>
    <View style={styles.grid}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={[styles.text, textStyle]}>
            You have successfully checked-in to the event
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
    const { goBack, host, template } = this.props
    const templateBackground = getTemplateBackground(template, host)
    const templateStyles = getTemplateStyles(template, host)
    const textStyle = { color: "", fontFamily: "" }
    const button = { backgroundColor: "" }
    const buttonText = { color: "" }
    if (template) {
      button.backgroundColor = template.welcomeButtonColor
      buttonText.color = template.buttonTextColor
      textStyle.color = template.secondaryTextColor
      textStyle.fontFamily = template.font
    }
    return (
      <View style={[styles.view, templateBackground.color]}>
        <TopBar>
          <View style={styles.navView}>
            <View style={{ flex: 1 }}>
              <NavButtonBack
                buttonColor={templateStyles.circle.backgroundColor}
                onPress={goBack}
                text={"Home"}
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
            </View>
          </View>
        </TopBar>
        <Header
          style={{ marginTop: 0 }}
          text={"Thanks for checking in"}
          template={template}
        />
        <View style={styles.content}>
          {getContent(textStyle)}
        </View>
        <View style={[mixins.centerItem(true)]}>
          <Button
            onPress={goBack}
            style={[button, { padding: 15 }]}
            text={"Next Customer"}
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

const mapDispatchToProps = (dispatch: Dispatch<Actions>): PropsFromDispatch => ({
  goBack: () => dispatch(goToInitialScreen())
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckInConfirmation)
