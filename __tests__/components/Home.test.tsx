import React from "react"
import { Image } from "react-native"
import { Provider } from "react-redux"
import { mount } from "enzyme"
import mockStore from "redux-mock-store"
import Home from "../../src/components/Home"
import Setup from "../../src/components/setup"
import Welcome from "../../src/components/welcome"
import { createState } from "../fixtures"

describe("Home test", () => {

  it("should render Home component successfully", () => {
    const state = createState()
    state.kiosk.kioskId = undefined
    const store = mockStore()(state)
    const wrapper = mount(
      <Provider store={store}>
        <Home />
      </Provider>
    )
    expect(wrapper.find(Setup)).toHaveLength(1)
  })

  it("should render Home component with background image", () => {
    const state = createState()
    state.kiosk.settings!.template = {
      ...state.kiosk.settings!.template,
      backgroundImageIsEnabled: true,
      backgroundImageUrl: "https://qa.qudini.com/static/image.png",
    }
    state.kiosk.fields = {
      ...state.kiosk.fields,
      url: "https://qa.qudini.com",
      kioskIdentifier: "",
    }
    const store = mockStore()(state)
    const wrapper = mount(
      <Provider store={store}>
        <Home />
      </Provider>
    ).find("Home")
    expect(wrapper.prop("host")).toBe("https://qa.qudini.com")
    expect(wrapper.find(Image).length).toBe(2)
    expect(wrapper.find(Setup).length).toBe(0)
    expect(wrapper.find(Welcome).length).toBe(1)
  })

})
