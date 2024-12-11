import { useState } from "react";
import GameBoard from "./Gameboard";
function App() {
  const [state, setState] = useState({
    pits: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0], // Combined array for both players' pits and stores
    currentPlayer: 1, // Track whose turn it is (1 or 2)
  });
  return <GameBoard state={state} setState={setState} />;
}
export default App;