import "./App.css";
import { Header } from "./components/Header";
import { Guesses } from "./components/Guesses";
import { Keyboard } from "./components/Keyboard";
import { GameContextProvider } from "./providers/GameContext/GameProvider";
import { ToastContextProvider } from "./providers/ToastContext/ToastProvider";

function App() {
  return (
    <div className="wordle-game">
      <ToastContextProvider>
        <GameContextProvider>
          <Header />
          <Guesses />
          <Keyboard />
        </GameContextProvider>
      </ToastContextProvider>
    </div>
  );
}

export default App;
