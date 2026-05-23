import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Rules.css";

function Rules() {
  const [step, setStep] = useState(0);

  // The step-by-step states for our mini 2D demo board
  const demoSteps = [
    {
      title: "The Board",
      text: "Welcome to Mancala! The board consists of 6 small pits for each player and 1 large store (Mancala) on the right side.",
      p2Pits: [4, 4, 4, 4, 4, 4],
      p1Pits: [4, 4, 4, 4, 4, 4],
      p1Store: 0,
      p2Store: 0,
      highlight: null,
    },
    {
      title: "Moving Stones",
      text: "On your turn, pick up all stones from one of your pits. Let's say Player 1 picks up the 4 stones from their 3rd pit.",
      p2Pits: [4, 4, 4, 4, 4, 4],
      p1Pits: [4, 4, 0, 4, 4, 4], 
      p1Store: 0,
      p2Store: 0,
      highlight: 2, 
    },
    {
      title: "Sowing",
      text: "Drop one stone into each pit counter-clockwise. Notice how the stones are distributed, including one in your store!",
      p2Pits: [4, 4, 4, 4, 4, 4],
      p1Pits: [4, 4, 0, 5, 5, 5],
      p1Store: 1,
      p2Store: 0,
      highlight: "distribute", 
    },
    {
      title: "Free Turn Rule",
      text: "If your LAST stone lands in your own store, you get to go again! (You skip your opponent's store when going around the board).",
      p2Pits: [4, 4, 4, 4, 4, 4],
      p1Pits: [4, 4, 0, 5, 5, 5],
      p1Store: 1,
      p2Store: 0,
      highlight: "store",
    },
    {
      title: "Capture Rule",
      text: "If your LAST stone lands in an empty pit on your side, you capture that stone PLUS all the stones in the opposite pit! They all go to your store.",
      p2Pits: [4, 0, 4, 4, 4, 4], 
      p1Pits: [4, 4, 0, 5, 5, 0], 
      p1Store: 6, 
      p2Store: 0,
      highlight: "capture",
    }
  ];

  const currentDemo = demoSteps[step];

  const handleNext = () => {
    if (step < demoSteps.length - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="rules-wrapper">
      <div className="rules-container">
        <h1>How To Play</h1>
        
        <div className="demo-section">
          <h2>{currentDemo.title}</h2>
          <p className="demo-text">{currentDemo.text}</p>

          {/* Mini 2D Board */}
          <div className="demo-board">
            <div className="demo-store p2-store">
              {currentDemo.p2Store}
            </div>
            
            <div className="demo-pits-container">
              <div className="demo-row">
                {currentDemo.p2Pits.map((stones, idx) => (
                  <div key={`p2-${idx}`} className="demo-pit p2-pit">
                    {stones}
                  </div>
                ))}
              </div>
              <div className="demo-row">
                {currentDemo.p1Pits.map((stones, idx) => (
                  <div 
                    key={`p1-${idx}`} 
                    className={`demo-pit p1-pit ${currentDemo.highlight === idx ? 'highlight-pickup' : ''} ${currentDemo.highlight === 'distribute' && idx > 2 ? 'highlight-drop' : ''} ${currentDemo.highlight === 'capture' && idx === 5 ? 'highlight-drop' : ''}`}
                  >
                    {stones}
                  </div>
                ))}
              </div>
            </div>

            <div className={`demo-store p1-store ${currentDemo.highlight === 'store' || currentDemo.highlight === 'capture' ? 'highlight-drop' : ''}`}>
              {currentDemo.p1Store}
            </div>
          </div>

          <div className="demo-controls">
            <button disabled={step === 0} onClick={handlePrev}>Previous</button>
            <span>Step {step + 1} of {demoSteps.length}</span>
            <button disabled={step === demoSteps.length - 1} onClick={handleNext}>Next</button>
          </div>
        </div>

        <Link to="/" className="back-link">Back to Home</Link>
      </div>
    </div>
  );
}

export default Rules;