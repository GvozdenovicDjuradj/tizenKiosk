import React from "react"
import SecretTap from "../../src/components/secretTap"
import renderer from "react-test-renderer"
import { createState } from "../fixtures"
import { Provider} from "react-redux"
import mockStore from "redux-mock-store"

describe("Secret tap tests", () => {
  it("should render Secret tap area successfully without template", () => {
    const state = createState()
    const store = mockStore()(state)
    const wrapper = renderer.create(
      <Provider store={store}>
        <SecretTap />
      </Provider>
    )
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
