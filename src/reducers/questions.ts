import { Reducer } from "redux"
import { Action, APP, QUESTIONS, KIOSK, } from "../actions/types"
import {
  NumberPayload,
  QuestionsPayload,
  QuestionsReducer,
  StringPayload,
} from "../interfaces"

export const initialState: QuestionsReducer = {
  current: 0,
  error: undefined,
  isFetching: false,
  questions: [],
}

const reducer: Reducer<QuestionsReducer> = (state = initialState, action: Action) => {
  switch (action.type) {
    case QUESTIONS.REQUEST:
    case QUESTIONS.POST_ANSWERS.REQUEST: {
      return { ...state, error: undefined, isFetching: true }
    }
    case QUESTIONS.SUCCESS: {
      const { payload: questions } = action as QuestionsPayload
      return { ...state, isFetching: false, questions }
    }
    case QUESTIONS.FAILURE:
    case QUESTIONS.POST_ANSWERS.FAILURE: {
      const { payload: error } = action as StringPayload
      return { ...state, error, isFetching: false }
    }
    case QUESTIONS.SET_CURRENT: {
      const { payload: current } = action as NumberPayload
      return { ...state, current }
    }
    case QUESTIONS.NEXT: {
      if (state.current + 1 < state.questions.length) {
        return { ...state, current: state.current + 1 }
      } else {
        return { ...state, current: 0 }
      }
    }
    case QUESTIONS.RESET:
    case KIOSK.CUSTOMER.ADD_TO_QUEUE.RESET:
    case QUESTIONS.POST_ANSWERS.SUCCESS:
    case APP.RESET.SUCCESS:
      return initialState;
    default:
      return state
  }
}

export default reducer
