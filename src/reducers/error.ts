import { Reducer } from "redux"
import { ErrorAction } from "../actions"
import { ERROR_SHOW, ERROR_RESET } from "../actions/types"

const reducer: Reducer<string, ErrorAction> = (state = "", action) => {
  switch (action.type) {
    case ERROR_SHOW: return action.payload
    case ERROR_RESET: return ""
    default: return state
  }
}

export default reducer
