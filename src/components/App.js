import { useEffect, useReducer } from "react";

import Header from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Question from "./Question.js";
import NextButton from "./NextButton.js";
import Progress from "./Progress.js";
import FinishScreen from "./FinishScreen.js";
import Footer from "./Footer.js";
import Timer from "./Timer.js";

const SECS_PER_QUESTION = 10;
const initialState = {
  questions: [],

  //"loading","error","ready","active","finished"
  status: "loading",
  index: 0,
  answer: null,
  score: 0,
  highScore: 0,
  timeLeft: null,
};
function reducer(curState, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...curState, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...curState, status: "error" };
    case "start":
      return {
        ...curState,
        status: "active",
        timeLeft: curState.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = curState.questions.at(curState.index);

      return {
        ...curState,
        answer: action.payload,
        score:
          action.payload === question.correctOption
            ? curState.score + question.points
            : curState.score,
      };
    case "nextQuestion":
      return { ...curState, index: curState.index + 1, answer: null };
    case "finished":
      return {
        ...curState,
        status: "finished",
        highScore:
          curState.score > curState.highScore
            ? curState.score
            : curState.highScore,
      };
    case "restart":
      return {
        ...initialState,
        questions: curState.questions,
        highScore: curState.highScore,
        status: "ready",
      };
    case "tick":
      return {
        ...curState,
        timeLeft: curState.timeLeft - 1,
        status: curState.timeLeft === 0 ? "finished" : curState.status,
      };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, score, highScore, timeLeft },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxScore = questions.reduce((acc, q) => acc + q.points, 0);

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((_) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen dispatch={dispatch} numQuestions={numQuestions} />
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              score={score}
              maxScore={maxScore}
              answer={answer}
            />
            <Question
              dispatch={dispatch}
              answer={answer}
              question={questions[index]}
            />
            <Footer>
              <Timer timeLeft={timeLeft} dispatch={dispatch} />
              <NextButton
                answer={answer}
                dispatch={dispatch}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            maxScore={maxScore}
            score={score}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
