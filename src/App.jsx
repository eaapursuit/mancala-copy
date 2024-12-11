// App.js
import React, { useState } from "react";
import Gameboard from "./Gameboard";


function App() {
  const [state, setState] = useState({
    pits: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
    currentPlayer: 1,
  });

  return <Gameboard state={state} setState={setState} />;
}

export default App;