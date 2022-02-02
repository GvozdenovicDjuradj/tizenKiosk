import { KIOSK, OTHER_ACTION, QUESTIONS } from "../../src/actions/types"
import answersReducer, { initialState } from "../../src/reducers/answers"
import { QuestionAnswer } from "../../src/interfaces"

describe("Customer questions answers reducer tests", () => {
  const payload: QuestionAnswer = {
    questionId: 1,
    text: "answer"
  }

  it("should not change initial state", () => {
    expect(answersReducer(initialState, { type: OTHER_ACTION }))
      .toEqual(initialState)
  })

  it("should set answer", () => {
    expect(answersReducer(initialState, {
      type: QUESTIONS.ANSWERED,
      payload
    })).toEqual([ ...initialState, payload ])
  })

  it("should update answer", () => {
    const update: QuestionAnswer = {
      questionId: 1,
      text: "answer updated"
    }
    expect(answersReducer([payload], {
      type: QUESTIONS.ANSWERED,
      payload: update
    })).toEqual([update])
  })

  it("should reset state", () => {
    expect(answersReducer([payload],
      { type: QUESTIONS.ANSWERS.RESET }
    )).toEqual(initialState)
  })

  it("should reset state upon adding customer to queue", () => {
    expect(answersReducer([payload],
      { type: KIOSK.CUSTOMER.ADD_TO_QUEUE.RESET }
    )).toEqual(initialState)
  })

})
