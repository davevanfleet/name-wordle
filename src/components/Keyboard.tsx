import { useGameContext } from "../providers/GameContext/GameContext";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export const Keyboard = () => {
  const { gameWon, gameLost, currentGuess, animatingGuess, usedLetters, submitGuess, updateCurrentGuess } = useGameContext();

  const handleKeyPress = (key: string) => {
    if (gameWon || gameLost || animatingGuess !== null) return;

    if (key === "ENTER") {
      if (currentGuess.length !== 4) return;
      submitGuess(currentGuess);
    } else if (key === "BACKSPACE") {
      updateCurrentGuess(currentGuess.slice(0, -1));
    } else if (key.length === 1 && currentGuess.length < 4) {
      updateCurrentGuess(currentGuess + key);
    }
  };

  const getKeyClass = (key: string) => {
    if (key === "ENTER" || key === "BACKSPACE") return "key key-wide";
    const state = usedLetters[key];
    if (state) return `key key-${state}`;
    return "key";
  };
  return (
    <div className="keyboard-container">
      <div className="keyboard">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                className={getKeyClass(key)}
                onClick={() => handleKeyPress(key)}
                disabled={gameWon || gameLost || animatingGuess !== null}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
