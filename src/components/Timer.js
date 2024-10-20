import { useEffect } from "react";
import { useQuiz } from "../contexts/QuizContext";

//Whole app re-redners every second, becaouse of state update every second in all-parent App component --performance issues
function Timer() {
  const { dispatch, timeLeft } = useQuiz();

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(Math.floor(timeLeft % 60)).padStart(2, "0");

  useEffect(() => {
    const id = setInterval(() => dispatch({ type: "tick" }), 1000);

    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <div className="timer">
      {mins}:{secs}
    </div>
  );
}

export default Timer;
