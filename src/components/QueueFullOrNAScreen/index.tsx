import React from "react"
import { StyleSheet, View } from "react-native"
import { connect } from "react-redux"
import styled from "styled-components/native"
import HTMLView from "react-native-htmlview"

import Header from "../Header"
import Button from "../Button"
import TopBar from "../TopBar"
import { KioskTemplate, RootState } from "../../interfaces"
import { goToInitialScreen } from "../../actions"
import {
  getLocaleString,
  getTemplateBackground,
  getTemplateStyles,
  metrics
} from "../../utils"
import { Dispatch, Action } from 'redux'
import { ADD_CUSTOMER_TO_QUEUE_STOP } from '../../actions/types'
import { NavigationInjectedProps } from 'react-navigation'

interface Props {
  goToInitialScreen: () => void;
  enableQuestionButton: () => void;
  host: string;
  template?: KioskTemplate;
}

const Wrapper = styled.View`
  align-items: center;
  flex: 1;
`

const NavView = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`

const Logo = styled.Image`
  height: 60px;
  width: 300px;
  zIndex: 0;
`

const Content = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
  width: 100%;
`

const QueueIsFullImage = styled.Image`
  height: ${metrics.minSize(metrics.scaleSize(200), 200)}px;
  margin: ${metrics.minSize(metrics.scaleSize(50), 50)}px 0;
  width: ${metrics.minSize(metrics.scaleSize(200), 200)}px;
`

const BackgroundImage = styled.Image`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: -1;
`

const QueueFullOrNA = ({ goToInitialScreen: goToHome, host, template, ...props }: Props & NavigationInjectedProps) => {
  if (!template) {
    return null
  }
  const templateStyles = getTemplateStyles(template, host)
  const templateBackground = getTemplateBackground(template, host)
  const buttonStyle = {
    backgroundColor: templateStyles.circle.backgroundColor,
    marginTop: metrics.minSize(metrics.scaleSize(30), 30),
    paddingHorizontal: 15,
    paddingVertical: 12,
  }
  const stylesheet = StyleSheet.create({
    body: {
      color: template.secondaryTextColor,
      fontFamily: templateStyles.text.fontFamily,
      fontSize: metrics.minSize(metrics.scaleSize(32), 32),
      textAlign: "center",
    }
  })

  React.useEffect(() => {
    const navigationListener = props.navigation.addListener('didFocus', () => {
      props.enableQuestionButton();
    });
    return () => { navigationListener.remove() };
  }, []);

  const screenText = getLocaleString("queueErrorScreen.error.queue.noAvailable")
  /*
      The screenText was updated to sit under a different key with the change to the way this value
      is provided within the settings screen, merchants which have not yet provided a value with this change
      will be presented with 'undefined'. This change allows for graceful fallback until the following
      continuous improvement ticket is implemented: (https://jira.qudini.com/browse/QSERVER-10533)
      as I advocate against storing a data-interchange format in the RDBMS unless it is really required in document
      format.

      The buttonText will also fallback to Go back if no value is found.
   */
  const oldScreenText = (getLocaleString("notificationMessages.error.queue.noAvailable") ||
      "Sorry, the queue is full or has no availability")
  const buttonText = getLocaleString("queueErrorScreen.error.queue.returnToWelcomePage") || "Go back"
  return (
    <Wrapper style={templateBackground.color}>
      <TopBar>
        <NavView>
          <View style={{ flex: 1 }} />
          {templateStyles.logo ? (
            <Logo resizeMode="contain" source={{ uri: templateStyles.logo }} />
          ) : null}
          <View style={{ flex: 1 }} />
        </NavView>
      </TopBar>
      <Header text={" "} template={template} style={{ marginTop: 0 }} />
      <Content>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <HTMLView
            stylesheet={stylesheet}
            value={`<body>${screenText || oldScreenText}</body>`}
          />
          {templateStyles.queueIsFullUrl ? (
            <QueueIsFullImage
              resizeMode="contain"
              source={{ uri: templateStyles.queueIsFullUrl }}
            />
          ) : null}
        </View>
        <Button
          style={buttonStyle}
          text={buttonText}
          textColor={template.buttonTextColor}
          textSize={metrics.minSize(metrics.scaleSize(32), 32)}
          onPress={goToHome}
          textFont={template && template.font}
        />
      </Content>
      {templateBackground.image.url ? (
        <BackgroundImage
          resizeMode="contain"
          source={{ cache: "force-cache", uri: templateBackground.image.url }}
        />
      ) : null}
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  host: state.kiosk.fields.url,
  template: state.kiosk.settings && state.kiosk.settings.template,
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>  ({ 
  goToInitialScreen: () => dispatch(goToInitialScreen()),
  enableQuestionButton: () => dispatch({type: ADD_CUSTOMER_TO_QUEUE_STOP}),
})

export default connect(mapStateToProps, mapDispatchToProps)(QueueFullOrNA)
