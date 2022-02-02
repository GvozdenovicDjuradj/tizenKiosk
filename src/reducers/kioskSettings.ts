import {
    KioskFields,
    KioskSettingsFieldUpdate,
} from "../interfaces"
import { APP, KIOSK, KIOSK_SETTINGS_FORM } from "../actions/types"
import { Reducer } from "redux"

export interface KioskSettingsForm extends KioskFields {
    diagnosticMessages: string[]
}

export const initialState: KioskSettingsForm = {
    kioskIdentifier: "",
    hasPrinter: false,
    hasKioskModeEnable: false,
    printerUrl: "",
    url: "",
    diagnosticMessages: []
}

const reducer: Reducer<KioskSettingsForm> = (state = initialState, action) => {
    switch (action.type) {
        case KIOSK_SETTINGS_FORM.SET_INITIAL_VALUES.SUCCESS:
            return {
                ...state,
                kioskIdentifier: action.kioskIdentifier,
                hasPrinter: action.hasPrinter,
                printerUrl: action.printerUrl,
                url: action.url,
                diagnosticMessages: []
            }
        case KIOSK.REGISTER.REQUEST:
            return {
                ...state,
                hasPrinter: action.hasPrinter
            }
        case KIOSK_SETTINGS_FORM.FIELD_UPDATE.REQUEST: {
            const { payload } = action as KioskSettingsFieldUpdate
            return {
                ...state,
                [payload.name]: payload.value
            }
        }
        case KIOSK_SETTINGS_FORM.VALIDATE.SUCCESS:
        case KIOSK_SETTINGS_FORM.VALIDATE.FAILURE:
        case KIOSK_SETTINGS_FORM.CHECK_NETWORK.SUCCESS:
            return {
                ...state,
                diagnosticMessages: action.messages
            }
        case APP.RESET.SUCCESS: return initialState
        default:
            return state
    }
}

export default reducer
