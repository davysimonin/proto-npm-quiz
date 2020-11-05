import React, { CSSProperties, useEffect, useState } from 'react'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import Question from './models/Question';
import QuizVue from "./QuizVue";

const _viewStateBSubject: BehaviorSubject<{ state: string, answer?: string }> = new BehaviorSubject({ state: "untouched" });
const viewState$: Observable<{ state: string, answer?: string }> = _viewStateBSubject.asObservable();
const userAction: Subject<{ verb: string, value?: string }> = new Subject();
const userAction$: Observable<{ verb: string, value?: string }> = userAction.asObservable();

export default ({ data, useSubscribe }: { data: Question, useSubscribe: any }) => {
  const [validate, setValidate] = useState<(userInput: string) => void>(undefined);
  const { tracking, questionComplete, questionSkip$, feedback } = useSubscribe();

  const validateMaker = (correctAnswer: string, explanation: string) => {
    return (userAnswer: string) => {
      console.log("validate", userAnswer);
      if (userAnswer) {
        questionComplete.next(userAnswer === correctAnswer);
        feedback.next(explanation);
        _viewStateBSubject.next(userAnswer === correctAnswer
          ? { state: "correct" }
          : { state: "incorrect", answer: correctAnswer }
        );
      }
    }
  };

  useEffect(() => {
    const sub = questionSkip$.subscribe(() => {
      questionComplete.next(undefined);
    })

    return () => sub.unsubscribe();
  }, [])

  useEffect(() => {
    setValidate(() => validateMaker(data.correctAnswer, data.explanation));
    _viewStateBSubject.next({ state: "untouched" });
    tracking.next("Commence nouvelle question");
  }, [data])

  useEffect(() => {
    console.log("change validate", validate)
    if (validate) {
      const sub = userAction$.subscribe(({ verb, value }) => {
        console.log("user action", verb);
        console.log("validate on action", validate);
        if (verb === "validate") {
          validate(value);
        }
      })
      return () => sub.unsubscribe();
    }

  }, [validate])

  return (
    <div style={quizStyle}>
      <h1>Quiz</h1>
      <div>
        <QuizVue
          data={data.viewData}
          userAction={userAction}
          viewState$={viewState$}
          tracking={tracking}
        />
      </div>
    </div>

  )
}

const quizStyle: CSSProperties = {
  border: "2px solid black",
  padding: "20px",
  flexBasis: "0",
  flexGrow: 2
}