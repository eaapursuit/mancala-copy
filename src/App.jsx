import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Gameboard from "./landingPageComponents/Gameboard";
import History from "./landingPageComponents/History";
import Rules from "./landingPageComponents/Rules";
import LandingPage from "./landingPageComponents/LandingPage";

const INITIAL_STATE = {
  pits: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
  currentPlayer: 1,
};

function App() {
  const [state, setState] = useState(INITIAL_STATE);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/game"
          element={<Gameboard state={state} setState={setState} />}
        />
        <Route path="/history" element={<History />} />
        <Route path="/rules" element={<Rules />} />
      </Routes>
    </Router>
  );
}

export default App;
