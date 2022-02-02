import React from "react"
import { TouchableOpacity } from "react-native"
import { Provider } from "react-redux"
import mockStore from "redux-mock-store"
import { mount } from "enzyme"
import LanguageSelector from "../../src/components/LanguageSelector"
import { Language, TemplateLanguages } from "../../src/interfaces"
import { changeLanguage } from "../../src/actions"
import { createOnPressEvent } from "../fixtures"

describe("Language selector tests", () => {

  it("should successfully render Language selector", () => {
    const store = mockStore()()
    const languages: TemplateLanguages = {
      mainLanguage: {
        countryCallingCode: "+44",
        countryIsoCode: "GB",
        countryName: "United Kingdom",
        languageIsoCode: "en",
        languageName: "en"
      },
      otherLanguages: [],
      translations: {},
    }
    const wrapper = mount(
      <Provider store={store}>
        <LanguageSelector show={true} languages={languages} />
      </Provider>
    )
    expect(wrapper.find(TouchableOpacity)).toHaveLength(1)
  })

  it("should successfully NOT render Language selector", () => {
    const store = mockStore()()
    const languages: TemplateLanguages = {
      mainLanguage: { } as Language,
      otherLanguages: [],
      translations: {},
    }
    const wrapper = mount(
      <Provider store={store}>
      <LanguageSelector show={false} languages={languages} />
      </Provider>
    )
    expect(wrapper).toEqual({})
  })

  it("should trigger language change upon press on Language button", () => {
    const store = mockStore()()
    const languages: TemplateLanguages = {
      mainLanguage: {
        countryCallingCode: "+44",
        countryIsoCode: "GB",
        countryName: "United Kingdom",
        languageIsoCode: "en",
        languageName: "en"
      },
      otherLanguages: [{
        countryCallingCode: "+380",
        countryIsoCode: "UA",
        countryName: "Ukraine",
        languageIsoCode: "ua",
        languageName: "ua"
      }],
      translations: {},
    }
    const wrapper = mount(
      <Provider store={store}>
        <LanguageSelector show={true} languages={languages} />
      </Provider>
    )
    expect(wrapper.find(TouchableOpacity)).toHaveLength(2)
    const props = wrapper.find(TouchableOpacity).at(1).props()
    if (props.onPress) {
      props.onPress(createOnPressEvent())
    }
    expect(store.getActions()).toEqual([
      changeLanguage(languages.otherLanguages[0])
    ])
  })

})
