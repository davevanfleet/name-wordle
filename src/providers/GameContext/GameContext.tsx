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
  guesses: Letter[][];
  usedLetters: Record<string, LetterState>;
  submitGuess: (guess: string) => void;
};

export const GameContext = createContext<GameContextType>({
  gameWon: false,
  guesses: [],
  usedLetters: {},
  submitGuess: () => {},
});

export const useGameContext = () => useContext(GameContext);
