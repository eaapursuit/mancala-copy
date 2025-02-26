import React, { useState, useRef, useEffect } from "react";
// import { useTransition, animated } from "@react-spring/web";
// import AI_hint from "./AI_hint";
import "./Gameboard.css";
import ThreeScene from "./components/ThreeScene";

function animateDistribution(
  pits,
  fromIndex,
  stones,
  isPlayer1,
  setState,
  onFinish
) {
  let currentIndex = fromIndex;
  let stonesLeft = stones;
  const newPits = [...pits];

  const intervalId = setInterval(() => {
    //Are we done placing all the stones?
    if (stonesLeft <= 0) {
      clearInterval(intervalId);
      onFinish(currentIndex, newPits);
      return;
    }

    //Go to the next pit
    currentIndex = (currentIndex + 1) % newPits.length;

    //Slip opponent's store
    if (isPlayer1 && currentIndex === 13) return;
    if (!isPlayer1 && currentIndex === 6) return;

    // Place 1 Stone here
    newPits[currentIndex]++;
    stonesLeft--;

    // Partial update so we can see each stone appear
    setState((prev) => ({
      ...prev,
      pits: newPits,
    }));
  }, 400); //time between placing stones
}

function finalizeMove(currentIndex, pits, isPlayer1, setState) {
  const storeIndex = isPlayer1 ? 6 : 13;
  let lastLandedInStore = currentIndex === storeIndex;

  // Capture logic
  const playerStartIndex = isPlayer1 ? 0 : 7;
  const playerEndIndex = isPlayer1 ? 5 : 12;

  if (
    !lastLandedInStore &&
    currentIndex >= playerStartIndex &&
    currentIndex <= playerEndIndex &&
    pits[currentIndex] === 1
  ) {
    const oppositeIndex = 12 - currentIndex;
    if (pits[oppositeIndex] > 0) {
      pits[storeIndex] += pits[oppositeIndex] + 1;
      pits[oppositeIndex] = 0;
      pits[currentIndex] = 0;
    }
  }

  // Check if one side is empty => game over
  const player1Empty = pits.slice(0, 6).every((s) => s === 0);
  const player2Empty = pits.slice(7, 13).every((s) => s === 0);

  if (player1Empty || player2Empty) {
    // Move remaining stones to the appropriate stores
    pits[6] += pits.slice(0, 6).reduce((a, b) => a + b, 0);
    pits[13] += pits.slice(7, 13).reduce((a, b) => a + b, 0);

    for (let i = 0; i < 6; i++) pits[i] = 0;
    for (let i = 7; i < 13; i++) pits[i] = 0;

    // No currentPlayer for next turn
    setState({ pits, currentPlayer: null });

    // Show winner
    const player1Score = pits[6];
    const player2Score = pits[13];
    if (player1Score > player2Score) {
      alert(
        `Game over! Player 1 wins with ${player1Score} stones vs Player 2 with ${player2Score} stones!`
      );
    } else if (player2Score > player1Score) {
      alert(
        `Game over! Player 2 wins with ${player2Score} stones vs Player 1 with ${player1Score} stones!`
      );
    } else {
      alert(`Game over! It's a tie with ${player1Score} stones each!`);
    }
    return;
  }

  //Determine the next player
  const nextPlayer = lastLandedInStore
    ? isPlayer1
      ? 1
      : 2
    : isPlayer1
    ? 2
    : 1;

  // Set the updated state
  setState({ pits, currentPlayer: nextPlayer });
  // setHint("");
}

function GameBoard({ state, setState }) {
  const [hint, setHint] = useState("");
  console.log("Gameboard state:", state); // Debug log

  useEffect(() => {
    console.log("Gameboard mounted");
    console.log("Initial state", state);

    //check for WebGL support
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.error("WebGL is not supported in this browser");
    }
  }, []);

  const resetGame = () => {
    const initialPits = Array(14).fill(4); // Set 4 stones in each pit
    initialPits[6] = 0; // Player 1's store
    initialPits[13] = 0; // Player 2's store

    setState({
      pits: initialPits,
      currentPlayer: 1, // Reset to Player 1's turn
    });

    setHint(""); // Clear any hints
  };

  function handlePitClick(player, index) {
    const isPlayer1 = player === 1;
    const pits = [...state.pits];
    const storeIndex = isPlayer1 ? 6 : 13;

    if (state.currentPlayer !== player) return alert("It's not your turn!");
    if (pits[index] === 0) return alert("You can't start from an empty pit!");

    //Take stones from chosen pit
    let stones = pits[index];
    pits[index] = 0;

    // Partial update sp that the pit is now empty
    setState({
      ...state,
      pits,
    });

    animateDistribution(
      pits,
      index,
      stones,
      isPlayer1,
      setState,
      (lastIndex, finalPits) => {
        //This runs when all stones are placed
        const lastLandedInStore = lastIndex === storeIndex;

        const nextPlayer = lastLandedInStore ? player : player === 1 ? 2 : 1;

        setState({
          pits: finalPits,
          currentPlayer: nextPlayer,
        });
        finalizeMove(lastIndex, finalPits, isPlayer1, setState);
      }
    );
  }

  return (
    <div className="mancala-board">
      <ThreeScene state={state} onPitClick={handlePitClick} />{" "}
      {/* Include ThreeScene*/}
    </div>
  );
}

export default GameBoard;
