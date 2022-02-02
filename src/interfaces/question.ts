export interface QueueInProductList {
  id: number;
  name: string;
  venue: {
    id: number;
    name: string;
  }
}

export interface ProductInList {
  id: number;
  name: string;
  queue: QueueInProductList | null;
}

export type ANSWER_TYPE =
  "CHECK_BOX" |
  "DATE" |
  "DROPDOWN" |
  "FREE_TEXT" |
  "MULTIPLE_CHOICE" |
  "NUMBER" |
  "RATING"

export type ASKED_TYPE =
  "WHEN_JOINING" |
  "AFTER_JOINING" |
  "AFTER_SERVICE_BY_STAFF" |
  "AFTER_SERVICE_BY_CUSTOMER"

interface TextTranslation {
  languageCode: string,
  translation: string
}

export interface Question {
  answerType: ANSWER_TYPE,
  askedType: ASKED_TYPE,
  customerTypeList: [
    "QUEUING_CUSTOMERS_BY_STAFF",
    "QUEUING_CUSTOMERS_BY_SELF"
  ],
  id: number,
  isAnswerMandatory: boolean,
  isOptionForOther: boolean,
  merchant: {
    id: number,
    name: string
  },
  orderId: null,
  orderList: any[], // update when will get info on this
  ordering: null,
  productList: ProductInList[],
  questionInfoText: null,
  ratingScale: number,
  selectAnswerList: string[],
  text: string,
  venueList: Array<{
    id: number;
    name: string
  }>,
  questionTranslations?: TextTranslation[],
  multipleChoiceAnswers?: Array<{text: string, answerTranslations: TextTranslation[]}>
}

export interface QuestionsReducer {
  current: number;
  error?: string;
  isFetching: boolean;
  questions: Question[];
}
