import { useState } from "react";
import { GameContext, type Letter, type LetterState } from "./GameContext";
import { names } from "../../name";
import { useToastContext } from "../ToastContext/ToastContext";

const TARGET_WORD = "ENZO";
const TARGET_LETTERS = TARGET_WORD.split("");

export const GameContextProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { setShowToast } = useToastContext();

  const [gameWon, setGameWon] = useState(false);
  const [guesses, setGuesses] = useState<Letter[][]>([]);
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
    const upperGuess = guess.toUpperCase();
    if (!names.includes(upperGuess)) {
      setShowToast(true);
      return;
    }

    const guessResult = checkGuess(upperGuess);
    setGuesses((prev) => [...prev, guessResult]);

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

    if (upperGuess === TARGET_WORD) {
      setGameWon(true);
    }
  };

  return (
    <GameContext.Provider
      value={{ gameWon, guesses, usedLetters, submitGuess }}
    >
      {children}
    </GameContext.Provider>
  );
};
