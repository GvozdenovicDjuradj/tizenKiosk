import React from "react"
import ShallowRenderer from "react-test-renderer/shallow";
import { SettingsModal, SettingsModalProps } from "../../src/components/SettingsModal"

describe("SettingsModal component test", () => {
    it("should render SettingsModal successfully", () => {
        // Given
        const renderer = new ShallowRenderer();
        const props: SettingsModalProps = {
            canSaveChanges: true,
            canValidateSettings: true,
            checkNetwork: () => {},
            deactivate: () => {},
            dismiss: () => {},
            form: {
                diagnosticMessages: [],
                kioskIdentifier: "",
                printerUrl: "",
                hasPrinter: true,
                hasKioskModeEnable: true,
                url: "",
            },
            saveChanges: () => {},
            updateField: () => {},
            validateSettings: () => {},
            deviceImei: "IMEI",
            getPhoneStatePermission: () => {},
        }

        // When
        renderer.render(
            <SettingsModal {...props} />
        )

        // Then
        expect(renderer.getRenderOutput()).toMatchSnapshot()
    })
})
