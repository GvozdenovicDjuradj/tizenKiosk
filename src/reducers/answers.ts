import { Reducer } from "redux"
import { Action, APP, KIOSK, QUESTIONS } from "../actions/types"
import { QuestionAnswer, QuestionAnswerPayload } from "../interfaces"

export const initialState: QuestionAnswer[] = []

const reducer: Reducer<QuestionAnswer[]> = (state = initialState, action: Action) => {
  switch (action.type) {
    case QUESTIONS.ANSWERED: {
      const { payload } = action as QuestionAnswerPayload
      const update = state.findIndex((q) => q.questionId === payload.questionId)
      const newState = state.slice()
      if (update > -1) {
        newState[update] = payload
      } else {
        newState.push(payload)
      }
      return newState
    }
    case QUESTIONS.TOGGLE_OTHER: {
      const { payload } = action as QuestionAnswerPayload
      const index = state.findIndex((q) => q.questionId === payload.questionId)
      const newState = state.slice()
      if (index === -1) {
        newState.push({
          questionId: payload.questionId,
          showOther: true,
          text: ""
        })
      } else {
        const answer = newState[index]
        newState[index] = {
          questionId: answer.questionId,
          showOther: !answer.showOther,
          text: "",
        }
      }
      return newState
    }
    case QUESTIONS.ANSWERS.RESET:
    case KIOSK.CUSTOMER.ADD_TO_QUEUE.RESET:
    case QUESTIONS.POST_ANSWERS.SUCCESS:
    case APP.RESET.SUCCESS:
      return initialState
    default:
      return state
  }
}

export default reducer
