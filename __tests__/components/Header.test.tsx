import React from "react"
import { shallow } from "enzyme"
import Header from "../../src/components/Header"
import { createTemplate } from "../fixtures"

describe("Header tests", () => {

  it("should render Header successfully applying styles from template provided", () => {
    const template = createTemplate()
    const text = "Header text"
    const wrapper = shallow(
      <Header template={template} text={text} />
    )
    expect(wrapper.prop("style")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: template.welcomeButtonColor
        })
      ])
    )
    expect(wrapper.dive()).toMatchSnapshot()
  })

  it("should render Header successfully without template", () => {
    const text = "Header text"
    const wrapper = shallow(
      <Header text={text} />
    )
    expect(wrapper.dive()).toMatchSnapshot()
  })

})
