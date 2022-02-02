import React from "react"
import renderer from "react-test-renderer"
import { Provider } from "react-redux"
import mockStore from "redux-mock-store"
import Setup from "../../src/components/setup"
import ListItem, { RegistrationStepItem } from "../../src/components/setup/ListItem"
import { AppScreens } from "../../src/interfaces"

describe("Setup component tests", () => {

  it("should render Setup component successfully", () => {
    const state = {
      kiosk: {
        fields: {
          kioskIdentifier: "1",
          printerUrl: "",
          hasPrinter: false,
          url: "",
        }
      },
      printer: {
        connectedPrinters: []
      },
      validation: { [AppScreens.HOME]: { url: { error: [] } } }
    }
    const wrapper = renderer.create(
      <Provider store={mockStore()(state)}>
        <Setup />
      </Provider>
    )
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it("should render Setup ListItem component successfully", () => {
    const item: RegistrationStepItem = {
      key: "1",
      title: "title1",
      children: [{
        key: "1.1",
        title: "title1.1"
      }, {
        key: "1.2",
        title: "title1.2"
      }]
    }
    const wrapper = renderer.create(<ListItem item={item} />)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

})
