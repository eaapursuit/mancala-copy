import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import Gameboard from "./Gameboard";  

function App() {
  const [state, setState] = useState({
    pits: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
    currentPlayer: 1,
  });


  return (
    <Router>
      <div
        className="app"
      >
        
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element= {<Gameboard state={state} setState={setState}/>}
            />
            {/* <Route path="/game" element={<Gameboard state={state} setState={setState}/>} /> */}
            {/* <Route path="/history" element={<History />} /> */}
            {/* <Route path="/rules" element={<Rules />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
