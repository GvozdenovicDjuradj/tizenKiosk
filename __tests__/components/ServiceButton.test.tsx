import React from "react"
import renderer from "react-test-renderer"
import { mount } from "enzyme"
import { Provider } from "react-redux"
import { TouchableOpacity } from "react-native"
import mockStore from "redux-mock-store"
import ServiceButton from "../../src/components/serviceSelection/ServiceButton"
import { AnyProduct } from "../../src/interfaces"
import { createOnPressEvent } from "../fixtures"

describe("Service button tests", () => {
  const store = mockStore()({
    kiosk: {
      settings: {
        template: {
          buttonTextColor: "#ffffff",
          serviceButtonColor: "#ff0000",
        }
      }
    }
  })

  it("Should render ServiceButton component successfully", () => {
    const product: AnyProduct = {
      name: "product"
    }
    const pressFn = () => ({ })
    const tree = renderer.create(
      <Provider store={store}>
        <ServiceButton onProductPress={pressFn} product={product} />
      </Provider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Should pass props to ServiceButton successfully", () => {
    const product: AnyProduct = {
      waitTime: 4455,
      title: "product tile",
    }
    const pressFn = jest.fn()
    const tree = renderer.create(
      <Provider store={store}>
        <ServiceButton
          onProductPress={pressFn}
          product={product}
          showWaitTime
          withIcon
        />
      </Provider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Should call function passed", () => {
    const product: AnyProduct = {
      name: "product"
    }
    const pressFn = jest.fn()
    const wrapper = mount(
      <Provider store={store}>
        <ServiceButton onProductPress={pressFn} product={product} />
      </Provider>
    )
    const props = wrapper.find(TouchableOpacity).at(0).props()
    if (props.onPress) {
      props.onPress(createOnPressEvent())
    }
    expect(pressFn).toBeCalledWith(product)
  })

})
