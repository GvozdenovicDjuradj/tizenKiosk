import { Question } from "../../interfaces";

export const getQuestionText = (
  question: Question,
  languageCode?: string
): string =>
  (
    (languageCode && question.questionTranslations
      ? question.questionTranslations.find(
          (item) => item.languageCode === languageCode
        )
      : undefined) || { translation: question.text }
  ).translation;

export const getQuestionAnswerList = (
  question: Question,
  languageCode?: string
): string[] =>
  languageCode &&
  question.multipleChoiceAnswers &&
  question.multipleChoiceAnswers.length > 0
    ? question.multipleChoiceAnswers.map(({ text }) => text)
    : question.selectAnswerList;

export const getQuestionAnswerText = (
  question: Question,
  answerText: string,
  languageCode?: string
): string => {
  const answer =
    languageCode && question.multipleChoiceAnswers
      ? question.multipleChoiceAnswers.find((item) => item.text === answerText)
      : undefined;

  return answer
    ? (
        answer.answerTranslations.find(
          (item) => item.languageCode === languageCode
        ) || { translation: answerText }
      ).translation
    : answerText;
};
