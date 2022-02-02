import { delay, SagaIterator } from "redux-saga"
import {
  call,
  put,
  race,
  select,
  takeLatest,
} from "redux-saga/effects"
import callApi, { HTTPMethod } from "./api"
import { AlertError, selectors } from "../utils"
import { QUESTIONS } from "../actions/types"
import {
  CustomerInQueuePayload,
  Question,
  QuestionAnswer,
  RootState,
  AnyProduct,
} from "../interfaces"
import {
  REQUEST_TIMEOUT,
  SLOW_NETWORK,
  TRY_AGAIN,
} from "./index"

export function* getQuestions(): SagaIterator {
  try {
    const { url } = (yield select(selectors.getKioskFieldsSelector)) as any
    const kioskId = (yield select(selectors.kioskIdSelector)) as any
    const serial = (yield select(selectors.serialSelector)) as any
    const { product, subProduct }: {
      product?: AnyProduct,
      subProduct?: AnyProduct
    } = (yield select((state: RootState) => ({
      product: state.kiosk.product,
      subProduct: state.kiosk.subProduct,
    }))) as any
    let id: number
    if (product && product.id) {
      id = product.id
    } else if (subProduct && subProduct.id) {
      id = subProduct.id
    } else {
      throw new Error("No product selected, skipping load questions")
    }
    const { response, timeout } = (yield race({
      response: call(
        callApi,
        `${url}/api/kiosks/${kioskId}/questions?serial=${serial}&productId=${id}`,
      ),
      timeout: delay(REQUEST_TIMEOUT),
    }) as any) as any
    if (timeout) {
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }
    let payload = response.data
    if (payload.error) {
      if (response.status === 404) { // no questions assigned
        payload = []
      } else {
        throw new Error(response.data.error.description)
      }
    } else {
      payload = payload.filter((q: Question) => q.askedType === "WHEN_JOINING")
    }
    yield put({
      payload,
      type: QUESTIONS.SUCCESS,
    })
  } catch (e) {
    let payload
    if (e instanceof AlertError) {
      const { message, title } = e
      payload = { message, title }
    } else {
      payload = e.message
    }
    yield put({
      payload,
      type: QUESTIONS.FAILURE,
    })
  }
}

export function* postAnswers(action: CustomerInQueuePayload) {
  try {
    if (!action) {
      throw new Error(`No "customerId" provided, not sending answers`)
    }
    const { payload } = action
    const { id: customerId } = payload.customerInQueue.customer
    const { url } = yield select(selectors.getKioskFieldsSelector)
    const kioskId = yield select(selectors.kioskIdSelector)
    const serial = yield select(selectors.serialSelector)
    const answers: QuestionAnswer[] = yield select((state: RootState) => state.answers)
    const data = answers.map(({ questionId, text }) => ({
      customerId, questionId, text,
    }))
    const { response, timeout } = yield race({
      response: call(
        callApi,
        `${url}/api/kiosks/${kioskId}/questions/answers?serial=${serial}`,
        { method: HTTPMethod.POST, data }
      ),
      timeout: delay(REQUEST_TIMEOUT)
    })
    if (timeout) {
      throw new AlertError(TRY_AGAIN, SLOW_NETWORK)
    }
    if (response.data.error) {
      throw new Error(response.data.error.description)
    }
    yield put({
      payload: response.data,
      type: QUESTIONS.POST_ANSWERS.SUCCESS,
    })
  } catch (e) {
    let payload
    if (e instanceof AlertError) {
      const { message, title } = e
      payload = { message, title }
    } else {
      payload = e.message
    }
    yield put({
      payload,
      type: QUESTIONS.POST_ANSWERS.FAILURE,
    })
  }
}

export const questionsSagas = [
  takeLatest(QUESTIONS.REQUEST, getQuestions),
  takeLatest(QUESTIONS.POST_ANSWERS.REQUEST, postAnswers),
]
