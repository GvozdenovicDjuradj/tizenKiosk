import React from "react"
// import { Image, TouchableOpacity } from "react-native"
import { Provider } from "react-redux"
import renderer from "react-test-renderer"
import mockStore from "redux-mock-store"
import Welcome from "../../src/components/welcome"
// import Content from "../../src/components/welcome/Content"
// import LanguageSelector from "../../src/components/LanguageSelector"
// import CircleButton from "../../src/components/CircleButton"
import { AppScreens, KioskTemplate, Venue, PrivacyPolicy } from "../../src/interfaces"
import { createTemplate, createPrivacyPolicy } from "../fixtures"

jest.mock("../../src/utils/getRouteName", () => ({
  getRouteName: () => "HOME"
}))

describe("Welcome component tests", () => {
  let template: KioskTemplate
  let venue: Partial<Venue>
  let privacyPolicy: PrivacyPolicy
  const languages = {
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

  beforeEach(() => {
    template = createTemplate()
    template.languages = languages
    venue = {
      merchant: {
        featureSettings: {
          hasQudiniBrand: true
        },
        id: 123
      }
    }
    privacyPolicy = createPrivacyPolicy()
  })

  afterAll(() => {
    jest.unmock("../../src/utils/getRouteName")
  })

  it.skip("Should render Welcome component successfully", () => {
    const store = mockStore()({
      app: { initialScreen: undefined },
      kiosk: { fields: { url: "https://qa.qudini.com" } },
    })
    const tree = renderer.create(
      <Provider store={store}>
        <Welcome />
      </Provider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Should render Welcome component with backgound image and language selector", () => {
    const store = mockStore()({
      app: { initialScreen: AppScreens.HOME },
      kiosk: {
        fields: { url: "https://qa.qudini.com" },
        settings: { template, venue },
        privacyPolicy,
      },
    })
    const tree = renderer.create(
      <Provider store={store}>
        <Welcome />
      </Provider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  // it("Should dispatch secret tap action", () => {
  //   const store = mockStore()({
  //     app: { initialScreen: undefined },
  //     kiosk: { fields: { url: "https://qa.qudini.com" } },
  //   })
  //   const wrapper = shallow(
  //     <Welcome />,
  //     { context: { store } }
  //   )
  //   expect(wrapper.dive().find(TouchableOpacity).length).toBe(1)
  //   wrapper.dive().find(TouchableOpacity).simulate("press")
  //   expect(store.getActions()).toMatchSnapshot()
  // })

  // it(`Should dispatch "Go to service selection" navigation action`, () => {
  //   const store = mockStore()({
  //     app: { initialScreen: undefined },
  //     kiosk: {
  //       fields: { url: "https://qa.qudini.com" },
  //       settings: { template, venue },
  //     },
  //   })
  //   const wrapper = shallow(
  //     <Welcome />,
  //     { context: { store } }
  //   )
  //   expect(wrapper.dive().find(Content).length).toBe(1)
  //   const contentWrapper = wrapper.dive().find(Content)
  //   expect(contentWrapper.dive().find(CircleButton).length).toBe(1)
  //   contentWrapper.dive().find(CircleButton).at(0).simulate("press")
  //   expect(store.getActions()).toMatchSnapshot()
  // })

  // it(`Should dispatch "Go to check-in" navigation action`, () => {
  //   template.enableBookingCheckin = true
  //   const store = mockStore()({
  //     app: { initialScreen: undefined },
  //     kiosk: {
  //       fields: { url: "https://qa.qudini.com" },
  //       settings: { template, venue },
  //     },
  //   })
  //   const wrapper = shallow(
  //     <Welcome />,
  //     { context: { store } }
  //   )
  //   expect(wrapper.dive().find(Content).length).toBe(1)
  //   const contentWrapper = wrapper.dive().find(Content)
  //   expect(contentWrapper.dive().find(CircleButton).length).toBe(2)
  //   contentWrapper.dive().find(CircleButton).at(1).simulate("press")
  //   expect(store.getActions()).toMatchSnapshot()
  // })

  // it(`Should dispatch "Go to event check-in" navigation action`, () => {
  //   template.enableBookingCheckin = true
  //   template.enableEventCheckin = true
  //   const store = mockStore()({
  //     app: { initialScreen: undefined },
  //     kiosk: {
  //       fields: { url: "https://qa.qudini.com" },
  //       settings: { template, venue },
  //     },
  //   })
  //   const wrapper = shallow(
  //     <Welcome />,
  //     { context: { store } }
  //   )
  //   expect(wrapper.dive().find(Content).length).toBe(1)
  //   const contentWrapper = wrapper.dive().find(Content)
  //   expect(contentWrapper.dive().find(CircleButton).length).toBe(3)
  //   contentWrapper.dive().find(CircleButton).at(2).simulate("press")
  //   expect(store.getActions()).toMatchSnapshot()
  // })

})
