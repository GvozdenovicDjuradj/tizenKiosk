import React from "react"
import { Image, ImageStyle, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Actions, changeLanguage } from "../actions"
import { Language, TemplateLanguages } from "../interfaces"
import flags from "../utils/flags"

const styles = StyleSheet.create({
  languageFlag: {
    height: 45,
    width: 60,
  },
  languageSelectorView: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    height: 80,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  languageView: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  }
})

interface PropsFromDispatch {
  changeLanguage: (lang: Language) => Actions;
}

interface Props extends PropsFromDispatch {
  languages: TemplateLanguages;
  show: boolean;
  style?: ViewStyle;
}

const flag = (langIsoCode = "") => flags[langIsoCode.toLowerCase()]

const getLanguageSelector = (languages: TemplateLanguages, handler: (lang: Language) => Actions) => {
  const result = [] as JSX.Element[]
  const mainLang = languages.mainLanguage
  result.push(
    <TouchableOpacity key={0} onPress={() => handler(mainLang)}>
      <View style={styles.languageView}>
        <Image
          source={flag(languages.mainLanguage.countryIsoCode)}
          style={styles.languageFlag as ImageStyle}
        />
        <Text>{languages.mainLanguage.localisedName || languages.mainLanguage.languageName}</Text>
      </View>
    </TouchableOpacity>
  )
  languages.otherLanguages.forEach((lang: Language, i: number) => {
    result.push(
      <TouchableOpacity key={i + 1} onPress={() => handler(lang)}>
        <View style={styles.languageView}>
          <Image
            source={flag(lang.countryIsoCode)}
            style={styles.languageFlag as ImageStyle}
          />
          <Text>{lang.localisedName || lang.languageName}</Text>
        </View>
      </TouchableOpacity>
    )
  })
  return result
}

const LanguageSelector = (props: Props) => props.show ? (
  <View style={[styles.languageSelectorView, props.style]}>
    {getLanguageSelector(props.languages, props.changeLanguage)}
  </View>
) : null

const mapDispatchToProps = (dispatch: Dispatch<Actions>): PropsFromDispatch => ({
  changeLanguage: (lang: Language) => dispatch(changeLanguage(lang))
})

export default connect(null, mapDispatchToProps)(LanguageSelector)
