import React, { useState } from "react";

function GameBoard({ state, setState }) {
  const {
    player1Pits,
    player2Pits,
    player1Store,
    player2Store,
    currentPlayer,
  } = state;

  const handlePitClick = (player, index) => {
    console.log(player1Store, player2Store);
    if (currentPlayer !== player) {
      alert("It's not your turn!");
      return;
    }

    const pits = player === 1 ? [...player1Pits] : [...player2Pits];
    const opponentPits = player === 1 ? [...player2Pits] : [...player1Pits];
    let newPlayer1Store = player1Store;
    let newPlayer2Store = player2Store;

    let stones = pits[index];
    if (stones === 0) {
      alert("You can't start from an empty pit!");
      return;
    }

    pits[index] = 0; // Empty the selected pit
    let currentIndex = index;

    // Distribute stones
    while (stones > 0) {
      currentIndex++;
      if (currentIndex < pits.length) {
        // Add to current player's pits
        pits[currentIndex]++;
      } else if (currentIndex === pits.length) {
        // Add to store if it's the current player's turn
        if (player === 1) {
          newPlayer1Store++;
        } else {
          newPlayer2Store++;
        }
        currentIndex = -1; // Reset index to start on opponent's side
      } else if (currentIndex < pits.length * 2 + 1) {
        // Add to opponent's pits
        opponentPits[currentIndex - pits.length - 1]++;
      } else {
        // Reset index to start on current player's side
        currentIndex = -1;
      }
      stones--;
    }

    if (player === 1) {
      setState({
        ...state,
        player1Pits: pits,
        player2Pits: opponentPits,
        player1Store: newPlayer1Store,
        currentPlayer: 2,
      });
    } else {
      setState({
        ...state,
        player1Pits: opponentPits,
        player2Pits: pits,
        player2Store: newPlayer2Store,
        currentPlayer: 1,
      });
    }
  };

  return (
    <div className="mancala-board">
      <div className="mancala player2">{player2Store}</div>
      <div className="pits">
        {player2Pits.map((stones, index) => (
          <button
            key={index}
            className={`pit ${currentPlayer === 2 ? "active" : ""}`}
            onClick={() => handlePitClick(2, index)}
          >
            {stones}
          </button>
        ))}
      </div>
      <div className="pits">
        {player1Pits.map((stones, index) => (
          <button
            key={index}
            className={`pit ${currentPlayer === 1 ? "active" : ""}`}
            onClick={() => handlePitClick(1, index)}
          >
            {stones}
          </button>
        ))}
      </div>
      <div className="mancala player1">{player1Store}</div>
    </div>
  );
}

export default GameBoard;
