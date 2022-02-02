import React from "react"
import renderer from "react-test-renderer"
import PhoneNumberTextInput from "../../../src/shared/components/PhoneNumberTextInput"

describe(`the <PhoneNumberTextInput /> component`, () => {
    it(`renders correctly`, () => {
        // When
        const tree = renderer.create(<PhoneNumberTextInput />).toJSON()

        // Then
        expect(tree).toMatchSnapshot()
    })
})

