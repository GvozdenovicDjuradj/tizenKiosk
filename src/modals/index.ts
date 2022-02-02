
interface ModalRegistry {
    [modalName: string]: any
}
const _modalRegistry: ModalRegistry = {
}

import ModalLayout from "./ModalLayout"

export const registerModal = (modalName: string, component: any) => {
    _modalRegistry[modalName] = component
}

export const getRegisteredComponent = (modalName: string): any => {
    if (!modalName) {
        return undefined
    }
    if (!_modalRegistry[modalName]) {
        throw new Error(`modal with name "${modalName} not registered`)
    }
    return _modalRegistry[modalName]
}

import SettingsModal from "../components/SettingsModal"
registerModal("settings", SettingsModal)

export default ModalLayout
