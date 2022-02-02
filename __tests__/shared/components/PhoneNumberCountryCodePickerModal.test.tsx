import React from "react"
import renderer from "react-test-renderer"
import PhoneNumberCountryCodePickerModal,
        { Props } from "../../../src/shared/components/PhoneNumberCountryCodePickerModal"

describe(`the <Phone /> component`, () => {
    it(`renders correctly`, () => {
        // Given
        const props: Props = {
            isOpen: true,
            onClose: jest.fn(),
            onSelect: jest.fn(),
        }

        // When
        const tree = renderer.create(<PhoneNumberCountryCodePickerModal {...props} />).toJSON()

        // Then
        expect(tree).toMatchSnapshot()
    })
})
