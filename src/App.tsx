import { useState, useEffect } from "react";
import { names } from "./name";
import "./App.css";

type LetterState = "correct" | "wrong-position" | "not-in-word" | "empty";

interface Letter {
  char: string;
  state: LetterState;
}

function App() {
  const targetWord = "ENZO";
  const [guesses, setGuesses] = useState<Letter[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [usedLetters, setUsedLetters] = useState<Record<string, LetterState>>(
    {}
  );

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const checkGuess = (guess: string): Letter[] => {
    const result: Letter[] = [];
    const targetLetters = targetWord.split("");
    const guessLetters = guess.split("");

    // First pass: mark correct positions
    const targetUsed = new Array(4).fill(false);
    const guessProcessed = new Array(4).fill(false);

    for (let i = 0; i < 4; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = { char: guessLetters[i], state: "correct" };
        targetUsed[i] = true;
        guessProcessed[i] = true;
      }
    }

    // Second pass: mark wrong positions
    for (let i = 0; i < 4; i++) {
      if (!guessProcessed[i]) {
        const foundIndex = targetLetters.findIndex(
          (letter, idx) => letter === guessLetters[i] && !targetUsed[idx]
        );

        if (foundIndex !== -1) {
          result[i] = { char: guessLetters[i], state: "wrong-position" };
          targetUsed[foundIndex] = true;
        } else {
          result[i] = { char: guessLetters[i], state: "not-in-word" };
        }
      }
    }

    return result;
  };

  const handleKeyPress = (key: string) => {
    if (gameWon) return;

    if (key === "ENTER") {
      if (currentGuess.length !== 4) return;

      const upperGuess = currentGuess.toUpperCase();
      if (!names.includes(upperGuess)) {
        setShowToast(true);
        return;
      }

      const guessResult = checkGuess(upperGuess);
      setGuesses((prev) => [...prev, guessResult]);

      // Update used letters
      const newUsedLetters = { ...usedLetters };
      guessResult.forEach((letter) => {
        const currentState = newUsedLetters[letter.char];
        if (
          !currentState ||
          (currentState !== "correct" && letter.state === "correct") ||
          (currentState === "not-in-word" && letter.state === "wrong-position")
        ) {
          newUsedLetters[letter.char] = letter.state;
        }
      });
      setUsedLetters(newUsedLetters);

      if (upperGuess === targetWord) {
        setGameWon(true);
      }

      setCurrentGuess("");
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (key.length === 1 && currentGuess.length < 4) {
      setCurrentGuess((prev) => prev + key);
    }
  };

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

  const getKeyClass = (key: string) => {
    if (key === "ENTER" || key === "BACKSPACE") return "key key-wide";
    const state = usedLetters[key];
    if (state) return `key key-${state}`;
    return "key";
  };

  return (
    <div className="wordle-game">
      <header className="game-header">
        <h1>Name Wordle</h1>
        {showToast && <div className="toast">Not a valid name!</div>}
      </header>

      <div className="game-content">
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
              <h2>Congratulations! You guessed {targetWord}!</h2>
            </div>
          )}

          <div className="game-info">
            <p>Guesses: {guesses.length}</p>
          </div>
        </div>
      </div>

      {!gameWon && (
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
      )}

      <div className="keyboard-container">
        <div className="keyboard">
          {keyboardRows.map((row, rowIndex) => (
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
    </div>
  );
}

export default App;
