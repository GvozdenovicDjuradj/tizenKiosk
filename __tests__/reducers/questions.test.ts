import { OTHER_ACTION, QUESTIONS } from "../../src/actions/types"
import questionsReducer, { initialState } from "../../src/reducers/questions"
import { Question } from "../../src/interfaces"

const question: Question = {
  answerType: "DATE",
  askedType: "WHEN_JOINING",
  customerTypeList: ["QUEUING_CUSTOMERS_BY_STAFF", "QUEUING_CUSTOMERS_BY_SELF"],
  id: 0,
  isAnswerMandatory: true,
  isOptionForOther: false,
  merchant: { id: 0, name: "Merchant test" },
  orderId: null,
  ordering: null,
  orderList: [],
  productList: [],
  questionInfoText: null,
  ratingScale: 5,
  selectAnswerList: ["Yes", "No"],
  text: "Test text",
  venueList: [{ id: 0, name: "Venue test" }],
}
const payload: Question[] = [question]
const error = "Test error"

describe("Customer questions answers reducer tests", () => {

  it("should not change initial state", () => {
    expect(questionsReducer(initialState, { type: OTHER_ACTION }))
      .toEqual(initialState)
  })

  it(`should switch "isFetching" flag and clear error
      (get questions)`, () => {
    expect(questionsReducer({ ...initialState, error: "test" }, {
      type: QUESTIONS.REQUEST,
    })).toEqual({ ...initialState, error: undefined, isFetching: true })
  })

  it(`should switch "isFetching" flag and clear error
      (post answers)`, () => {
    expect(questionsReducer({ ...initialState, error: "test" }, {
      type: QUESTIONS.POST_ANSWERS.REQUEST,
    })).toEqual({ ...initialState, error: undefined, isFetching: true })
  })

  it(`should switch "isFetching" flag and set error
      (get question failure)`, () => {
    expect(questionsReducer(
      { ...initialState, isFetching: true },
      { type: QUESTIONS.FAILURE, payload: error }
    )).toEqual({ ...initialState, error })
  })

  it(`should switch "isFetching" flag and set error
      (post answers failure)`, () => {
    expect(questionsReducer(
      { ...initialState, isFetching: true },
      { type: QUESTIONS.FAILURE, payload: error }
    )).toEqual({ ...initialState, error })
  })

  it("should set current question index", () => {
    expect(questionsReducer(initialState,
      { type: QUESTIONS.SET_CURRENT, payload: 3 }
    )).toEqual({ ...initialState, current: 3 })
  })

  it(`should increment current question index`, () => {
    expect(questionsReducer(
      { ...initialState, questions: [question, question] },
      { type: QUESTIONS.NEXT }
    )).toEqual({
      ...initialState,
      current: 1,
      questions: [question, question]
    })
  })

  it("should drop current question index to zero", () => {
    expect(questionsReducer(
      { ...initialState, current: 1, questions: payload },
      { type: QUESTIONS.NEXT }
    )).toEqual({ ...initialState, current: 0, questions: payload })
  })

  it(`should switch "isFetching" flag and save questions`, () => {
    expect(questionsReducer(
      { ...initialState, isFetching: true },
      { type: QUESTIONS.SUCCESS, payload }
    )).toEqual({ ...initialState, questions: payload })
  })

  it("should reset state", () => {
    expect(questionsReducer(
      { ...initialState, error: "test", isFetching: true },
      { type: QUESTIONS.RESET }
    )).toEqual(initialState)
  })

  it("should reset state upon adding customer to queue", () => {
    expect(questionsReducer(
      { ...initialState, error: "test", questions: payload },
      { type: QUESTIONS.RESET }
    )).toEqual(initialState)
  })

})
