import React from "react"
import { Text } from "react-native"
import { shallow } from "enzyme"
import TopBar from "../../src/components/TopBar"

describe("TopBar tests", () => {

  it("renders TopBar and it's children successfully", () => {
    const Children = () => <Text>Test</Text>
    const wrapper = shallow(<TopBar><Children /></TopBar>)
    expect(wrapper.prop("children")).toEqual(<Children />)
  })

})
