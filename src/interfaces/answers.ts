import { Action } from "redux"
import { Question } from "./question"

export interface QuestionAnswer {
  questionId: Question["id"];
  showOther?: boolean;
  text?: string;
}

export interface QuestionAnswerPayload extends Action {
  payload: QuestionAnswer;
}
