import React, { ReactNode } from "react"
import { Image, ImageStyle, Text, View } from "react-native"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { goToInitialScreen } from "../../actions"
import { Action, ADD_CUSTOMER_TO_QUEUE_STOP } from "../../actions/types"
import {
  CONFIRMATION_SCREEN,
  CustomerInQueue,
  KioskTemplate,
  Placeholders,
  REQUIRED,
  RootState
} from "../../interfaces"
import { mixins } from "../../theme"
import {
  getLocaleString,
  getTemplateBackground,
  getTemplateStyles,

  metrics, selectors
} from "../../utils"
import Button from "../Button"
import Header from "../Header"
import SecretTap from "../secretTap"
import TopBar from "../TopBar"
import { content, main } from "./styles"

interface ConfirmationScreenProps {
  customerInQueue?: CustomerInQueue;
  showQudiniLogo: boolean;
  template?: KioskTemplate;
  url: string;
  mobileNumber?: string;
}

interface ConfirmationScreenDispatchProps {
  goInitialScreen: () => any;
  enableQuestionButton: () => void;
}

interface Strings {
  bottomSubText: string
  bottomText: string
  header: string
  navButton: string
  topSubText: string
  topText: string
}

const keyToShow = (data: CustomerInQueue, type: CONFIRMATION_SCREEN): number | string | undefined => {
  switch (type) {
    case CONFIRMATION_SCREEN.CUSTOMER_POSITION:
      return data.currentPosition
    case CONFIRMATION_SCREEN.TICKET_NUMBER:
      return data.customer.ticketNumber
    case CONFIRMATION_SCREEN.ESTIMATED_WAIT_TIME:
      return data.minutesRemaining
    case CONFIRMATION_SCREEN.CURRENT_STORE_WAIT_TIME:
      return data.minutesRemaining
    default:
      return undefined
  }
}

const getCircleText = (template?: KioskTemplate, customerInQueue?: CustomerInQueue): ReactNode | null => {
  if (!template || !customerInQueue) {
    return null
  }
  const result: any[] = []
  const { confirmationScreenToShow } = template
  const text = keyToShow(customerInQueue, confirmationScreenToShow)
  const textStyle = {
    color: template ? template.headingTextColor : "",
    fontFamily: template ? template.font : ""
  }
  const minsText = {
    fontSize: metrics.minSize(metrics.scaleSize(32), 32),
  }
  result.push(
    <Text key={0} style={[content.circleText, textStyle]}>
      {text}
    </Text>
  )
  if (confirmationScreenToShow.toLowerCase().indexOf("time") > -1) {
    result.push(<Text key={1} style={[textStyle, minsText]}>mins</Text>)
  }
  return result
}

const getContent = (
  template: KioskTemplate,
  strings: Strings,
  circleText: ReactNode,
  goHome: () => void
) => {
  const button = { backgroundColor: template.welcomeButtonColor }
  const text = { color: template.secondaryTextColor, fontFamily: template.font }

  return (
    <React.Fragment>
      <View style={[mixins.centerItem(true), content.textView]}>
        <Text style={[content.text, text]}>
          {strings.topText}
        </Text>
        {strings.topSubText ? (
          <Text style={[content.text, text]}>
            {strings.topSubText}
          </Text>
        ) : null}
      </View>
      {template.showNothing ? null : (
        <View style={[content.circleView, button]}>
          {circleText}
        </View>
      )}
      <View style={[mixins.centerItem(true), content.textView]}>
        <Text style={[mixins.centerItem(), content.text, text]}>
          {strings.bottomText}
        </Text>
        {strings.bottomSubText ? (
          <Text style={[mixins.centerItem(), content.text, text]}>
            {strings.bottomSubText}
          </Text>
        ) : null}
      </View>
      <View style={[mixins.centerItem(true)]}>
        <Button
          style={[button, { paddingHorizontal: 15, paddingVertical: 12 }]}
          text={strings.navButton}
          textColor={template.buttonTextColor}
          textSize={metrics.minSize(metrics.scaleSize(32), 32)}
          onPress={goHome}
          textFont={template && template.font}
        />
      </View>
    </React.Fragment>
  )
}

type Props = ConfirmationScreenProps & ConfirmationScreenDispatchProps & NavigationInjectedProps;

const ConfirmationScreen = (props: Props) => {
  const { customerInQueue, goInitialScreen, template, url, mobileNumber } = props
  if (!customerInQueue || !template) {
    return null
  }
  const templateBackground = getTemplateBackground(template, url)
  const templateStyles = getTemplateStyles(template, url)
  const circleText = getCircleText(template, customerInQueue)
  const placeholders: Placeholders = {
    "{average-wait}": customerInQueue.minutesRemaining,
    "{customer-name}": customerInQueue.customer.name,
    "{minutes-left}": customerInQueue.minutesRemaining,
    "{position}": customerInQueue.currentPosition,
    "{queue-length}": customerInQueue.queue.customerLength,
    "{queue-name}": customerInQueue.queue.name,
    "{ticket}": customerInQueue.customer.ticketNumber,
    "{time}": customerInQueue.waitTime,
    "{venue-name}": customerInQueue.queue.venue.name,
  }
  let textSelector = "withoutMobile"
  if (template.customerScreenRequestMobileNumberWhen === REQUIRED.ALWAYS ||
    template.customerScreenRequestMobileNumberWhen === REQUIRED.CONDITIONAL || mobileNumber) {
    textSelector = "withMobile"
  }
  const strings: Strings = {
    bottomText: getLocaleString(`confirmationScreen.bottom.text.${textSelector}`),
    bottomSubText: getLocaleString(`confirmationScreen.bottom.subText.${textSelector}`),
    header: getLocaleString(`confirmationScreen.header.text.${textSelector}`),
    navButton: getLocaleString("confirmationScreen.navigation.centerNext"),
    topText: getLocaleString(`confirmationScreen.top.text.${textSelector}`),
    topSubText: getLocaleString(`confirmationScreen.top.subText.${textSelector}`),
  }
  Object.keys(strings).forEach((str) => strings[str as keyof Strings]
    ? Object.keys(placeholders).forEach((key) => {
      strings[str as keyof Strings] = strings[str as keyof Strings].replace(
        key, `${placeholders[key as keyof Placeholders]}`
      )
    })
    : false
  )

  const centerSection = getContent(template, strings, circleText, goInitialScreen)

  React.useEffect(() => {
    const navigationListener = props.navigation.addListener("didFocus", () => {
      props.enableQuestionButton()
    })
    return () => { navigationListener.remove() }
  }, [])

  return (
    <View style={[main.view, templateBackground.color]}>
      <TopBar>
        <View style={content.topBarView}>
          {templateStyles.logo ?
            <Image
              resizeMode="contain"
              source={{ uri: templateStyles.logo }}
              style={content.logo as ImageStyle}
            />
            : null}
        </View>
      </TopBar>
      <Header
        text={strings.header}
        template={props.template}
        style={{ marginTop: 0 }}
      />
      <View style={content.wrapper}>
        {centerSection}
      </View>
      <SecretTap />
      {props.showQudiniLogo ? (
        <View style={content.qudiniLogoView}>
          <Image
            source={require("../../../assets/images/logo-qudini.png")}
            style={content.qudiniLogo as ImageStyle}
          />
        </View>
      ) : null}
      {templateBackground.image.url ? (
        <Image
          resizeMode="contain"
          style={content.backgroundImage as ImageStyle}
          source={{ cache: "force-cache", uri: templateBackground.image.url }}
        />
      ) : null}
    </View>
  )
}

const mapStateToProps = (state: RootState): ConfirmationScreenProps => ({
    customerInQueue: state.kiosk.customerInQueue,
    showQudiniLogo: selectors.showQudiniLogo(state),
    template: state.kiosk.settings && state.kiosk.settings.template,
    url: state.kiosk.fields.url,
    mobileNumber: state.kiosk.customer.mobileNumberForConfirmationScreen
})

const mapDispatchToProps = (dispatch: Dispatch<Action>): ConfirmationScreenDispatchProps => ({
  goInitialScreen: () => dispatch(goToInitialScreen()),
  enableQuestionButton: () => dispatch({type: ADD_CUSTOMER_TO_QUEUE_STOP}),
})

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ConfirmationScreen));
