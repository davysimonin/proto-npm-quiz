import React, { useState, useEffect, SetStateAction } from 'react';
import QuestionView from './models/QuestionView';
import { Observable, Subject } from 'rxjs';

export default ({ data, userAction, viewState$, tracking }: {
  data: QuestionView,
  userAction: Subject<{ verb: string, value?: string }>,
  viewState$: Observable<{ state: string, answer?: string }>,
  tracking: Subject<string>
}) => {
  const [quizAnswer, setQuizAnswer] = useState<number>(1);
  const [isCorrect, setIsCorrect] = useState<boolean>(null);

  useEffect(() => {
    const sub = viewState$.subscribe((state: { state: string, answer?: string }) => {
      console.log("change state", state);
      if (state.state === "correct") setIsCorrect(true);
      else if (state.state === "incorrect") {
        setIsCorrect(false);
        setQuizAnswer(+state.answer);
      }
      else if (state.state === "untouched") setIsCorrect(null);
    })

    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    tracking.next(`Sélectionne valeur ${quizAnswer}`)
  }, [quizAnswer]);

  useEffect(() => {
    setQuizAnswer(1);
    setIsCorrect(null);
  }, [data])

  return (
    <div style={{ border: "2px solid red" }}>
      <h2>{data.question}</h2>
      <select value={quizAnswer} onChange={e => setQuizAnswer(+e.currentTarget.value)}>
        {data.answers.map((answer, index) => (
          <option key={index} value={index + 1}>{answer}</option>
        ))}
      </select>
      {isCorrect
        ? <p>{data.messageForCorrectAnswer}</p>
        : isCorrect === false
          ? <p>{data.messageForIncorrectAnswer}</p>
          : <button onClick={() => userAction.next({
            verb: "validate",
            value: "" + quizAnswer
          })}>Send</button>
      }
    </div>
  )
}