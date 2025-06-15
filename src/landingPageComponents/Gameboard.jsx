import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Gameboard.css";
import ThreeScene from "../components/ThreeScene";


function generateInitialStones(pits) {
  return pits.flatMap((count, pitIndex) =>
    Array.from({ length: count }, (_, i) => ({
      id: `${pitIndex}-${i}`,
      pitIndex,
    }))
  );
}

function GameOverlay({ currentPlayer, pits }) {
  const scoreA = pits[6];
  const scoreB = pits[13];

  return (
    <div className="game-overlay">
      <div className="turn-indicator">
        Turn: {currentPlayer === 1 ? "Player 1" : "Player 2"}
      </div>
      <div className="score-board">
        Player 1 Score: {scoreA} - Player 2 Score: {scoreB}{" "}
      </div>
    </div>
  );
}

GameOverlay.propTypes = {
  currentPlayer: PropTypes.number.isRequired,
  pits: PropTypes.arrayOf(PropTypes.number).isRequired,
};

function animateDistribution(
  pits,
  fromIndex,
  stones,
  isPlayer1,
  setState,
  onFinish,
  stonesList,
  setStonesList
) {
  let currentIndex = fromIndex;
  let stonesLeft = stones;
  const newPits = [...pits];
  
  const stonesToMove = stonesList.filter(s => s.pitIndex === fromIndex)
  let stoneIndex = 0;
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

    if(stoneIndex < stonesToMove.length) {
      stonesToMove[stoneIndex].pitIndex = currentIndex;
      stoneIndex++;
    }

    // Partial update so we can see each stone appear
    setState((prev) => ({
      ...prev,
      pits: newPits,
    }));
    setStonesList(prevStones => [...prevStones]);
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

export default function GameBoard({ state, setState }) {
  const [previewPath, setPreviewPath] = useState([]);
  const [stonesList, setStonesList] = useState(() =>
    generateInitialStones(state.pits)
  );

  useEffect(() => {
    const total = state.pits.reduce((sum, v) => sum + v, 0);
    if (stonesList.length !== total) {
      setStonesList(generateInitialStones(state.pits));
    }
  }, [state.pits, stonesList.length]);

  // Compute distribution path without mutating state
  function computePreview(startIndex) {
    const { pits, currentPlayer } = state;
    let count = pits[startIndex];
    if (count === 0) return [];
    let idx = startIndex;
    const path = [];
    while (count > 0) {
      idx = (idx + 1) % pits.length;
      // skip opponent store
      if (currentPlayer === 1 && idx === 13) continue;
      if (currentPlayer === 2 && idx === 6) continue;
      path.push(idx);
      count--;
    }
    return path;
  }

  // When hovering over a pit, show the preview path
  function handleHoverPit(player, pitIndex) {
    if (player !== state.currentPlayer) return;
    setPreviewPath(computePreview(pitIndex));
  }
  function handleHoverOut() {
    setPreviewPath([]);
  }

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
      }, stonesList, setStonesList
    );
  }

  // Pass these handlers into threeScene
  return (
    <div style={{ position: "relative" }}>
      <GameOverlay currentPlayer={state.currentPlayer} pits={state.pits} />
      <ThreeScene
        state={state}
        stonesList={stonesList}
        setState={setState}
        previewPath={previewPath}
        onPitHover={handleHoverPit}
        onPitOut={handleHoverOut}
        onPitClick={handlePitClick}
      />
    </div>
  );
}

GameBoard.propTypes = {
  state: PropTypes.shape({
    pits: PropTypes.arrayOf(PropTypes.number).isRequired,
    currentPlayer: PropTypes.number,
  }).isRequired,

  setState: PropTypes.func.isRequired,
};
