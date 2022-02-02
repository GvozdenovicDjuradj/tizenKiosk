import React from "react"
import renderer from "react-test-renderer"
import CircleButton from "../../src/components/CircleButton"

describe("Circle button test", () => {

  it("CircleButton should render successfully", () => {
    const text = ["Some", "text"]
    const wrapper = renderer.create(<CircleButton text={text} />)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

})
