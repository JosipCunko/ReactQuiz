function NextButton({
  dispatch = undefined,
  answer = undefined,
  index = undefined,
  numQuestions = undefined,
  status = "active",
}) {
  //Do this instead of className "hidden" - it will show the button component only if ther is a answer
  if (answer === null) return null;

  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );

  if (index === 14)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finished" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
