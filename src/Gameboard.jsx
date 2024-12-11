import React, { useState } from "react";
import { useTransition, animated } from "@react-spring/web";

import "./Gameboard.css";
// import AI_hint from "./AI_hint";
function GameBoard({ state, setState }) {
  const handlePitClick = (player, index) => {
    const isPlayer1 = player === 1;
    const pits = [...state.pits]; // Copy pits array
    const playerStartIndex = isPlayer1 ? 0 : 7; // Starting index for the player's pits
    const playerEndIndex = isPlayer1 ? 5 : 12; // Ending index for the player's pits
    const storeIndex = isPlayer1 ? 6 : 13; // Index of the player's store
    // Check if the pit is valid
    if (state.currentPlayer !== player) {
      alert("It's not your turn!");
      return;
    }
    if (index < playerStartIndex || index > playerEndIndex) {
      alert("You can only pick from your pits!");
      return;
    }
    if (pits[index] === 0) {
      alert("You can't start from an empty pit!");
      return;
    }
    // Distribute stones
    let stones = pits[index];
    pits[index] = 0; // Empty the selected pit
    let currentIndex = index;
    let lastLandedInStore = false;
    while (
      stones > 0 ||
      (stones === 0 && currentIndex !== storeIndex && pits[currentIndex] > 1)
    ) {
      // If stones == 0 but the current pit has stones, grab them and continue
      if (
        stones === 0 &&
        currentIndex !== storeIndex &&
        pits[currentIndex] > 1
      ) {
        stones += pits[currentIndex];
        pits[currentIndex] = 0;
      }
      currentIndex = (currentIndex + 1) % pits.length; // Circular increment
      // Skip opponent's store
      if (isPlayer1 && currentIndex === 13) continue;
      if (!isPlayer1 && currentIndex === 6) continue;
      pits[currentIndex]++;
      stones--;
      // Check if the last stone lands in the player's store
      if (currentIndex === storeIndex) {
        lastLandedInStore = true;
      } else {
        lastLandedInStore = false;
      }
    }
    // Capture logic and continuation rule
    if (
      !lastLandedInStore &&
      currentIndex >= playerStartIndex &&
      currentIndex <= playerEndIndex
    ) {
      const oppositeIndex = 12 - currentIndex;
      // If landing in non-empty pit on player's side, continue distributing
      if (pits[currentIndex] > 1) {
        stones = pits[currentIndex];
        pits[currentIndex] = 0;
        // continue;
      }
      // Capture rule: last stone in empty pit with stones opposite
      if (pits[currentIndex] === 1 && pits[oppositeIndex] > 0) {
        pits[storeIndex] += pits[oppositeIndex] + 1; // Add captured stones + last stone to store
        pits[oppositeIndex] = 0;
        pits[currentIndex] = 0;
      }
    }
    console.log(lastLandedInStore);
    console.log(currentIndex);
    // Check for game over
    const player1Empty = pits.slice(0, 6).every((stones) => stones === 0);
    const player2Empty = pits.slice(7, 13).every((stones) => stones === 0);
    if (player1Empty || player2Empty) {
      // Add remaining stones to the respective player's store
      pits[6] += pits.slice(0, 6).reduce((a, b) => a + b, 0);
      pits[13] += pits.slice(7, 13).reduce((a, b) => a + b, 0);
      // Clear all pits
      for (let i = 0; i < 6; i++) pits[i] = 0;
      for (let i = 7; i < 13; i++) pits[i] = 0;
      setState({ pits, currentPlayer: null }); // Game over
      const player1Score = pits[6];
      const player2Score = pits[13];
      if (player1Score > player2Score) {
        alert(
          `Game over! Player 1 wins with ${player1Score} stones vs ${player2Score} stones!`
        );
      } else if (player2Score > player1Score) {
        alert(
          `Game over! Player 2 wins with ${player2Score} stones vs ${player1Score} stones!`
        );
      } else {
        alert(`Game over! It's a tie with ${player1Score} stones each!`);
      }
      return;
    }
    // Switch turns if the last stone did not land in the store
    const nextPlayer = lastLandedInStore ? player : player === 1 ? 2 : 1;
    setState({ pits, currentPlayer: nextPlayer });
  };
  return (
    <div className="mancala-board">
      {/* Opponent's store */}
      <div className="mancala player2">{state.pits[13]}</div>
      {/* Opponent's pits (reverse order: 12 to 7) */}
      <div className="pits">
        {state.pits
          .slice(7, 13)
          .reverse()
          .map((stones, reverseIndex) => {
            const index = 12 - reverseIndex; // Map reverse index to actual index

            //Generate stones as JSX elements
            const stoneElements = Array(stones)
              .fill()
              .map((_, idx) => (
                <div key={`${index}-${idx}`} className="stone"></div>
              ));

            return (
              <button
                key={index}
                className={`pit ${state.currentPlayer === 2 ? "active" : ""}`}
                onClick={() => handlePitClick(2, index)}
              >
                <div className="stones-container">{stoneElements}</div>
              </button>
            );
          })}
      </div>
      {/* Player's pits (0 to 5) */}
      <div className="pits">
        {state.pits.slice(0, 6).map((stones, index) => {
          const transitions = useTransition(Array(stones).fill(), {
            from: { opacity: 0, transform: "scale(0)" },
            enter: { opacity: 1, transform: "scale(1)" },
            leave: { opacity: 0, transform: "scale(0)" },
            keys: (item, idx) => `${index}-${idx}`,
          });

          return (
            <button
              key={index}
              className={`pit ${state.currentPlayer === 1 ? "active" : ""}`}
              onClick={() => handlePitClick(1, index)}
            >
              {/* {Render stones} */}
              <div className="stones-container">
                {transitions((style, _, idx) => (
                  <animated.div key={idx} style={style} className="stone" />
                ))}
              </div>
            </button>
          );
        })}
      </div>
      {/* Player's store */}
      <div className="mancala player1">{state.pits[6]}</div>
      {/* Hint Container */}
      {/* <div className="hint-container">
        <div className="hint-card">
          <AI_hint state={state} />
        </div>
      </div> */}
    </div>
  );
}
export default GameBoard;
