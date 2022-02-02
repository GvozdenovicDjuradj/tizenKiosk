import { Reducer, AnyAction } from "redux"
import { APP, MODAL } from "../actions/types"
import {
    ModalState
} from "../interfaces"

export const initialState: ModalState = {
    visible: false,
    title: "",
    componentName: ""
}

interface ShowModalAction extends AnyAction {
    title?: string
    componentName: string
}

interface HideModalAction extends AnyAction {
    title?: string
    componentName: string
}
type ModalActions = ShowModalAction
    | HideModalAction | AnyAction

const reducer: Reducer<ModalState> = (state = initialState, action: ModalActions) => {
  switch (action.type) {
    case MODAL.SHOW.REQUEST:
      return { ...state, title: action.title, componentName: action.componentName, visible: true }
    case MODAL.HIDE.REQUEST:
      return { ...state, title: "", componentName: "", visible: false }
    case APP.RESET.SUCCESS: return initialState
    default: return state
  }
}

export default reducer
