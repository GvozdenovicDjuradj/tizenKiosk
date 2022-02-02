import { showSecretSettings } from "../../src/sagas/kioskSettings"
import { put, select } from "redux-saga/effects"
import { KIOSK_SETTINGS_FORM, MODAL } from "../../src/actions/types"
import { selectors } from "../../src/utils"

describe("the showSecretSettings saga", () => {
    it("it should put MODAL.SHOW.REQUEST", () => {
        // Given
        const generator = showSecretSettings()
        const expectedSelectEffect = select(selectors.getKioskFieldsSelector)
        const expectedInitialValuesPutEffect = put({
            type: KIOSK_SETTINGS_FORM.SET_INITIAL_VALUES.SUCCESS
        })
        const expectedShowRequestEffect = put({
            type: MODAL.SHOW.REQUEST,
            componentName: "settings"
        })

        // When
        const selectResult = generator.next().value
        const initialValuesPutEffectResult = generator.next().value
        const showRequestPutEffectResult = generator.next().value

        // Then
        expect(selectResult).toEqual(expectedSelectEffect)
        expect(initialValuesPutEffectResult).toEqual(expectedInitialValuesPutEffect)
        expect(showRequestPutEffectResult).toEqual(expectedShowRequestEffect)
    })
})
