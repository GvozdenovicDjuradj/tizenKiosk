import React from "react";
import { Image, ImageStyle, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import HTMLView from "react-native-htmlview";
import Header from "../Header";
import { KioskTemplate, RootState, AppScreens } from "../../interfaces";
import {
  getLocaleString,
  getTemplateBackground,
  getTemplateStyles,
} from "../../utils";
import styles from "./styles";
import LanguageSelector from "../LanguageSelector";

interface Props {
  newLanguage: string;
  initialScreen: AppScreens;
  host: string;
  template?: KioskTemplate;
}

const QueueUnderCapacity = (props: Props) => {
  const templateStyles = getTemplateStyles(props.template, props.host);
  const templateBackgroundStyles = getTemplateBackground(
    props.template,
    props.host
  );
  const stylesheet = StyleSheet.create({
    body: {
      color: props.template && props.template.secondaryTextColor,
      fontSize: 32,
      textAlign: "center",
    },
  });

  const getHeader = () =>
    React.useMemo(() => getLocaleString("underOccupancyScreen.header"), [
      props.newLanguage,
    ]);
  const getLineText = () =>
    React.useMemo(() => getLocaleString("underOccupancyScreen.lineText"), [
      props.newLanguage,
    ]);

  return (
    <View style={[styles.view, templateBackgroundStyles.color]}>
      <Header text={getHeader()} template={props.template} />
      <View style={styles.content}>
        <HTMLView
          value={`<body>${getLineText()}</body>`}
          stylesheet={stylesheet}
        />
      </View>
      {templateBackgroundStyles.image.url ? (
        <Image
          resizeMode="contain"
          style={styles.backgroundImage as ImageStyle}
          source={{
            cache: "force-cache",
            uri: templateBackgroundStyles.image.url,
          }}
        />
      ) : null}
      <View style={styles.bottomView}>
        <View style={{ flex: 1 }}>
          {props.initialScreen === AppScreens.CUSTOMER_DETAILS && (
            <LanguageSelector
              languages={templateStyles.languages}
              show={templateStyles.showLangSelect}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: RootState) => ({
  newLanguage: state.kiosk.language?.languageIsoCode,
  initialScreen: state.app.initialScreen,
  host: state.kiosk.fields.url,
  template: state.kiosk.settings && state.kiosk.settings.template,
});

export default connect(mapStateToProps, null)(QueueUnderCapacity);
