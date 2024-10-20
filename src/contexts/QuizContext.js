import { createContext, useReducer, useContext, useEffect } from "react";

const QuizContext = createContext();

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

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, score, highscore, timeLeft },
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
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        score,
        highscore,
        timeLeft,
        numQuestions,
        maxScore,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside of QuizProvider");
  return context;
}

export { useQuiz, QuizProvider };
