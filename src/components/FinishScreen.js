import { useQuiz } from "../contexts/QuizContext";

function FinishScreen() {
  const { score, maxScore, highScore, dispatch } = useQuiz();

  const percentage = Math.ceil((score / maxScore) * 100);

  let emoji;
  if (percentage === 100) emoji = "🏆";
  if (percentage >= 80 && percentage < 100) emoji = "🏅";
  if (percentage >= 60 && percentage < 80) emoji = "🥳";
  if (percentage >= 40 && percentage < 60) emoji = "🧐";
  if (percentage < 20) emoji = "🤬";

  return (
    <>
      <p className="result">
        <span>{emoji}</span>You earned <strong>{score}</strong> out of{" "}
        {maxScore} points ({percentage}
        %).
      </p>
      <p className="highscore">(Highscore: {highScore} points)</p>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
