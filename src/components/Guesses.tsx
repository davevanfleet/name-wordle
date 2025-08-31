import {
  useGameContext,
  type LetterState,
} from "../providers/GameContext/GameContext";

const getLetterClass = (state: LetterState) => {
  switch (state) {
    case "correct":
      return "letter-correct";
    case "wrong-position":
      return "letter-wrong-position";
    case "not-in-word":
      return "letter-not-in-word";
    default:
      return "letter-empty";
  }
};

export const Guesses = () => {
  const { guesses, gameWon } = useGameContext();

  return (
    <div className="game-content">
      {" "}
      <div className="scrollable-content">
        <div className="game-grid">
          {guesses.map((guess, guessIndex) => (
            <div key={guessIndex} className="guess-row">
              {guess.map((letter, letterIndex) => (
                <div
                  key={letterIndex}
                  className={`letter ${getLetterClass(letter.state)}`}
                >
                  {letter.char}
                </div>
              ))}
            </div>
          ))}
        </div>

        {gameWon && (
          <div className="game-over">
            <h2>Congratulations!</h2>
          </div>
        )}
      </div>
    </div>
  );
};
