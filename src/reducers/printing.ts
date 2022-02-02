import { Reducer } from "redux"
import { PrintingAction } from "../actions/printing"
import { SET_PRINTER_CALLBACK } from "../constants/printing"
import { PrintingState } from "../interfaces/printing"

export const initialState: PrintingState = {
    callback: null
}

const reducer: Reducer<PrintingState> = (state = initialState, action: PrintingAction) => {
    if (action.type === SET_PRINTER_CALLBACK) {
        return {
            ...state,
            callback: action.payload.callback
        }
    }

    return state
}

export default reducer
