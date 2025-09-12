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

const MAX_GUESSES = 6;

export const Guesses = () => {
  const {
    guesses,
    currentGuess,
    currentRowIndex,
    animatingGuess,
    gameWon,
    gameLost,
  } = useGameContext();

  const renderRow = (rowIndex: number) => {
    const guess = guesses[rowIndex];
    const isCurrentRow = rowIndex === currentRowIndex;
    const isCompletedRow = guess && guess.length > 0;

    if (isCompletedRow) {
      // Render completed guess
      return (
        <div key={rowIndex} className="guess-row">
          {guess.map((letter, letterIndex) => (
            <div
              key={letterIndex}
              className={`letter ${getLetterClassWithAnimation(
                letter.state,
                rowIndex,
                animatingGuess
              )}`}
              style={getAnimationStyle(rowIndex, letterIndex, animatingGuess)}
            >
              {letter.char}
            </div>
          ))}
        </div>
      );
    } else if (
      isCurrentRow &&
      !gameWon &&
      !gameLost &&
      animatingGuess === null
    ) {
      return (
        <div key={rowIndex} className="guess-row guess-row-current">
          {Array.from({ length: 4 }).map((_, letterIndex) => (
            <div
              key={letterIndex}
              className={`letter ${
                currentGuess[letterIndex] ? "letter-current" : "letter-empty"
              }`}
            >
              {currentGuess[letterIndex] || ""}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div key={rowIndex} className="guess-row">
          {Array.from({ length: 4 }).map((_, letterIndex) => (
            <div key={letterIndex} className="letter letter-empty">
              {""}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="game-content">
      <div className="scrollable-content">
        <div className="game-grid">
          {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) =>
            renderRow(rowIndex)
          )}
        </div>

        {(gameWon || gameLost) && animatingGuess === null && (
          <div className="game-over">
            <h2>
              {gameWon
                ? "Congratulations!"
                : "Game over! Refresh to keep guessing"}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};
