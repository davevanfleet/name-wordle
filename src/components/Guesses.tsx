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

const getLetterClassWithAnimation = (
  state: LetterState,
  guessIndex: number,
  letterIndex: number,
  animatingGuess: number | null
) => {
  const isAnimating = animatingGuess === guessIndex;
  
  if (isAnimating) {
    // During animation, use letter-current as base and add animation class
    switch (state) {
      case "correct":
        return "letter-current letter-flipping-correct";
      case "wrong-position":
        return "letter-current letter-flipping-wrong-position";
      case "not-in-word":
        return "letter-current letter-flipping-not-in-word";
      default:
        return "letter-current";
    }
  } else {
    // After animation or no animation, use final colors
    return getLetterClass(state);
  }
};

const getAnimationStyle = (
  guessIndex: number,
  letterIndex: number,
  animatingGuess: number | null
) => {
  if (animatingGuess === guessIndex) {
    return {
      animationDelay: `${letterIndex * 150}ms`,
    };
  }
  return {};
};

export const Guesses = () => {
  const { guesses, currentGuess, animatingGuess, gameWon } = useGameContext();

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
                  className={`letter ${getLetterClassWithAnimation(letter.state, guessIndex, letterIndex, animatingGuess)}`}
                  style={getAnimationStyle(guessIndex, letterIndex, animatingGuess)}
                >
                  {letter.char}
                </div>
              ))}
            </div>
          ))}
          {!gameWon && animatingGuess === null && (
            <div className="guess-row">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`letter ${currentGuess[index] ? "letter-current" : "letter-empty"}`}
                >
                  {currentGuess[index] || ""}
                </div>
              ))}
            </div>
          )}
        </div>

        {gameWon && animatingGuess === null && (
          <div className="game-over">
            <h2>Congratulations!</h2>
          </div>
        )}
      </div>
    </div>
  );
};
