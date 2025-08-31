import { useState } from "react";
import { useGameContext } from "../providers/GameContext/GameContext";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export const Keyboard = () => {
  const { gameWon, usedLetters, submitGuess } = useGameContext();
  const [currentGuess, setCurrentGuess] = useState("");

  const handleKeyPress = (key: string) => {
    if (gameWon) return;

    if (key === "ENTER") {
      if (currentGuess.length !== 4) return;
      submitGuess(currentGuess);

      setCurrentGuess("");
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (key.length === 1 && currentGuess.length < 4) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  const getKeyClass = (key: string) => {
    if (key === "ENTER" || key === "BACKSPACE") return "key key-wide";
    const state = usedLetters[key];
    if (state) return `key key-${state}`;
    return "key";
  };
  return (
    <>
      <div className="current-guess-container">
        <div className="current-guess-display">
          <div className="current-guess-row">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`current-letter ${
                  currentGuess[index] ? "filled" : ""
                }`}
              >
                {currentGuess[index] || ""}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="keyboard-container">
        <div className="keyboard">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map((key) => (
                <button
                  key={key}
                  className={getKeyClass(key)}
                  onClick={() => handleKeyPress(key)}
                  disabled={gameWon}
                >
                  {key === "BACKSPACE" ? "⌫" : key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
