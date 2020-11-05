export default interface QuestionView {
  question: string;
  questionType: string;
  questionPic?: string;
  answers: string[];
  messageForCorrectAnswer: string;
  messageForIncorrectAnswer: string;
}