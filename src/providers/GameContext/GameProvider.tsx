import { useState } from "react";
import { GameContext, type Letter, type LetterState } from "./GameContext";
import { names } from "../../name";
import { useToastContext } from "../ToastContext/ToastContext";

const TARGET_WORD = "ENZO";
const TARGET_LETTERS = TARGET_WORD.split("");
const MAX_GUESSES = 6;

export const GameContextProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { setShowToast } = useToastContext();

  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [guesses, setGuesses] = useState<Letter[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [animatingGuess, setAnimatingGuess] = useState<number | null>(null);
  const [usedLetters, setUsedLetters] = useState<Record<string, LetterState>>(
    {}
  );

  const checkGuess = (guess: string): Letter[] => {
    const result: Letter[] = [];
    const guessLetters = guess.split("");

    // First pass: mark correct positions
    const targetUsed = new Array(4).fill(false);
    const guessProcessed = new Array(4).fill(false);

    for (let i = 0; i < 4; i++) {
      if (guessLetters[i] === TARGET_LETTERS[i]) {
        result[i] = { char: guessLetters[i], state: "correct" };
        targetUsed[i] = true;
        guessProcessed[i] = true;
      }
    }

    // Second pass: mark wrong positions
    for (let i = 0; i < 4; i++) {
      if (!guessProcessed[i]) {
        const foundIndex = TARGET_LETTERS.findIndex(
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

  const submitGuess = (guess: string) => {
    if (gameWon || gameLost || currentRowIndex >= MAX_GUESSES) return;
    
    const upperGuess = guess.toUpperCase();
    if (!names.includes(upperGuess)) {
      setShowToast(true);
      return;
    }

    const guessResult = checkGuess(upperGuess);
    const isWinningGuess = upperGuess === TARGET_WORD;
    
    // Start animation for current row
    setAnimatingGuess(currentRowIndex);
    
    // Update guesses array at the current row index
    setGuesses((prev) => {
      const newGuesses = [...prev];
      newGuesses[currentRowIndex] = guessResult;
      return newGuesses;
    });
    
    setCurrentGuess("");

    // Update used letters and check for win/loss after animation completes
    setTimeout(() => {
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

      if (isWinningGuess) {
        setGameWon(true);
      } else if (currentRowIndex >= MAX_GUESSES - 1) {
        setGameLost(true);
      } else {
        setCurrentRowIndex(currentRowIndex + 1);
      }

      setAnimatingGuess(null);
    }, 1400); // Last letter starts at 450ms + 800ms animation + 150ms buffer
  };

  const updateCurrentGuess = (guess: string) => {
    setCurrentGuess(guess);
  };

  return (
    <GameContext.Provider
      value={{ gameWon, gameLost, guesses, currentGuess, currentRowIndex, animatingGuess, usedLetters, submitGuess, updateCurrentGuess }}
    >
      {children}
    </GameContext.Provider>
  );
};
