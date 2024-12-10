import { useState } from "react";
import "./App.css";
import GameBoard from "./Gameboard";

function App() {
  const [state, setState] = useState({
    player1Pits: [4, 4, 4, 4, 4, 4],
    player2Pits: [4, 4, 4, 4, 4, 4],
    player1Store: 0,
    player2Store: 0,
    currentPlayer: 1,
  });

  return <GameBoard state={state} setState={setState} />;
}

export default App;
