import QuestionView from "./QuestionView"

export default interface Question {
  "answerSelectionType": string,
  "correctAnswer": string,
  "explanation": string,
  "point": string,
  "viewData": QuestionView
}