import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import Gameboard from "./landingPageComponents/Gameboard";
import History from "./landingPageComponents/History";
import Rules from "./landingPageComponents/Rules";
import LandingPage from "./landingPageComponents/LandingPage";

function App() {
  const [state, setState] = useState({
    pits: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
    currentPlayer: 1,
  });

  return (
    <Router>
      <div className="app">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/gameboard"
              element={<Gameboard state={state} setState={setState} />}
            />
            <Route
              path="/game"
              element={<Gameboard state={state} setState={setState} />}
            />
            <Route path="/history" element={<History />} />
            <Route path="/rules" element={<Rules />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
