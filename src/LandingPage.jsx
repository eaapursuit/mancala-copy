import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.css";
import ThreeScene from "./components/ThreeScene";

function LandingPage() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/game");
  };

  return (
    <>
      <div className="landing">
        <h1 className="landing_title">MANCALA</h1>
        <nav className="landing_nav">
          <Link to="/history" className="landing_link">
            History
          </Link>
          <Link to="/rules" className="landing_link">
            How To Play
          </Link>
        </nav>
        <button className="landing_play_button" onClick={handleButtonClick}>Play Now</button>
      </div>
    </>
  );
}

export default LandingPage;
