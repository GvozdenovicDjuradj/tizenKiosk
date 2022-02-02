import React from "react"
import renderer from "react-test-renderer"
import Popup from "../../../src/shared/components/Popup"

describe(`the <Popup /> component`, () => {
    it(`renders correctly`, () => {
        // When
        const tree = renderer.create(<Popup isOpen={true} message="Example Message..." />).toJSON()

        // Then
        expect(tree).toMatchSnapshot()
    })
})
