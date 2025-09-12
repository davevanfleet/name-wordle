import { createContext, useContext } from "react";

export type LetterState =
  | "correct"
  | "wrong-position"
  | "not-in-word"
  | "empty";

export interface Letter {
  char: string;
  state: LetterState;
}

type GameContextType = {
  gameWon: boolean;
  gameLost: boolean;
  guesses: Letter[][];
  currentGuess: string;
  currentRowIndex: number;
  animatingGuess: number | null;
  usedLetters: Record<string, LetterState>;
  submitGuess: (guess: string) => void;
  updateCurrentGuess: (guess: string) => void;
};

export const GameContext = createContext<GameContextType>({
  gameWon: false,
  gameLost: false,
  guesses: [],
  currentGuess: "",
  currentRowIndex: 0,
  animatingGuess: null,
  usedLetters: {},
  submitGuess: () => {},
  updateCurrentGuess: () => {},
});

export const useGameContext = () => useContext(GameContext);
