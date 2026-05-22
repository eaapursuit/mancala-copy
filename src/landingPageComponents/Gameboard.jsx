import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./Gameboard.css";
import ThreeScene from "../components/ThreeScene";
import AI_hint from "./AI_hint";

// ─── Pure game logic ──────────────────────────────────────────────────────────

/**
 * Computes the full distribution path and resulting pit array for a move.
 * Returns { path, finalPits, lastIndex } — no side effects.
 */
function computeMove(pits, fromIndex, isPlayer1) {
  const newPits = [...pits];
  let stones = newPits[fromIndex];
  newPits[fromIndex] = 0;
  let currentIndex = fromIndex;
  const path = [];

  while (stones > 0) {
    currentIndex = (currentIndex + 1) % 14;
    if (isPlayer1 && currentIndex === 13) continue;
    if (!isPlayer1 && currentIndex === 6) continue;
    newPits[currentIndex]++;
    path.push(currentIndex);
    stones--;
  }

  return { path, finalPits: newPits, lastIndex: currentIndex };
}

/**
 * Applies capture and game-over logic after distribution.
 * Returns the new full state object — no side effects.
 */
function applyFinalize(lastIndex, pits, isPlayer1) {
  const storeIndex = isPlayer1 ? 6 : 13;
  const playerStart = isPlayer1 ? 0 : 7;
  const playerEnd = isPlayer1 ? 5 : 12;
  const lastLandedInStore = lastIndex === storeIndex;
  const result = [...pits];

  // Capture rule
  if (
    !lastLandedInStore &&
    lastIndex >= playerStart &&
    lastIndex <= playerEnd &&
    result[lastIndex] === 1
  ) {
    const oppositeIndex = 12 - lastIndex;
    if (result[oppositeIndex] > 0) {
      result[storeIndex] += result[oppositeIndex] + 1;
      result[oppositeIndex] = 0;
      result[lastIndex] = 0;
    }
  }

  // Game over
  const p1Empty = result.slice(0, 6).every((s) => s === 0);
  const p2Empty = result.slice(7, 13).every((s) => s === 0);

  if (p1Empty || p2Empty) {
    result[6] += result.slice(0, 6).reduce((a, b) => a + b, 0);
    result[13] += result.slice(7, 13).reduce((a, b) => a + b, 0);
    for (let i = 0; i < 6; i++) result[i] = 0;
    for (let i = 7; i < 13; i++) result[i] = 0;
    return {
      pits: result,
      currentPlayer: null,
      gameOver: { score1: result[6], score2: result[13] },
    };
  }

  const nextPlayer = lastLandedInStore
    ? isPlayer1
      ? 1
      : 2
    : isPlayer1
      ? 2
      : 1;

  return { pits: result, currentPlayer: nextPlayer, gameOver: null };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GameOverModal({ score1, score2, onRematch, onMenu }) {
  const winner =
    score1 > score2
      ? `Player 1 wins!`
      : score2 > score1
        ? `Player 2 wins!`
        : `It's a tie!`;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2 className="modal-title">{winner}</h2>
        <div className="modal-scores">
          <div className="modal-score">
            <span className="modal-score-label">Player 1</span>
            <span className="modal-score-value">{score1}</span>
          </div>
          <div className="modal-score">
            <span className="modal-score-label">Player 2</span>
            <span className="modal-score-value">{score2}</span>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onRematch}>
            Play again
          </button>
          <button className="btn-secondary" onClick={onMenu}>
            Main menu
          </button>
        </div>
      </div>
    </div>
  );
}

GameOverModal.propTypes = {
  score1: PropTypes.number.isRequired,
  score2: PropTypes.number.isRequired,
  onRematch: PropTypes.func.isRequired,
  onMenu: PropTypes.func.isRequired,
};

function ErrorToast({ message }) {
  if (!message) return null;
  return <div className="error-toast">{message}</div>;
}

ErrorToast.propTypes = { message: PropTypes.string };

function ScoreBar({ pits, currentPlayer, isAnimating }) {
  const score1 = pits[6];
  const score2 = pits[13];
  const total = score1 + score2 || 1;

  return (
    <div className="score-bar">
      <div className={`player-tag ${currentPlayer === 1 ? "active" : ""}`}>
        <span className="player-label">Player 1</span>
        <span className="player-score">{score1}</span>
      </div>
      <div className="score-track">
        <div
          className="score-fill"
          style={{ width: `${(score1 / total) * 100}%` }}
        />
      </div>
      <div
        className={`player-tag right ${currentPlayer === 2 ? "active" : ""}`}
      >
        <span className="player-score">{score2}</span>
        <span className="player-label">Player 2</span>
      </div>
      {isAnimating && <div className="animating-badge">Moving…</div>}
    </div>
  );
}

ScoreBar.propTypes = {
  pits: PropTypes.arrayOf(PropTypes.number).isRequired,
  currentPlayer: PropTypes.number,
  isAnimating: PropTypes.bool,
};

// ─── Main component ───────────────────────────────────────────────────────────

const INITIAL_PITS = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];

export default function GameBoard({ state, setState }) {
  const navigate = useNavigate();
  const threeSceneRef = useRef(null);
  const [previewPath, setPreviewPath] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [gameOver, setGameOver] = useState(null);
  const [hint, setHint] = useState("");
  const [highlightedPit, setHighlightedPit] = useState(null);
  const errorTimerRef = useRef(null);

  // Show an error toast that auto-clears after 2 s
  const showError = useCallback((msg) => {
    setErrorMsg(msg);
    clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setErrorMsg(""), 2000);
  }, []);

  useEffect(() => () => clearTimeout(errorTimerRef.current), []);

  // Hover preview path
  function computePreview(startIndex) {
    const { pits, currentPlayer } = state;
    let count = pits[startIndex];
    if (count === 0) return [];
    let idx = startIndex;
    const path = [];
    while (count > 0) {
      idx = (idx + 1) % 14;
      if (currentPlayer === 1 && idx === 13) continue;
      if (currentPlayer === 2 && idx === 6) continue;
      path.push(idx);
      count--;
    }
    return path;
  }

  function handleHoverPit(player, pitIndex) {
    if (player !== state.currentPlayer || isAnimating) {
      setPreviewPath([]);
      return;
    }
    setPreviewPath(computePreview(pitIndex));
  }

  function handleHoverOut() {
    setPreviewPath([]);
  }

  // ─── Core move handler ────────────────────────────────────────────────────

  function handlePitClick(player, index) {
    if (isAnimating) return;
    if (state.currentPlayer !== player) {
      showError("It's not your turn!");
      return;
    }
    if (state.pits[index] === 0) {
      showError("That pit is empty!");
      return;
    }

    const isPlayer1 = player === 1;
    const { path, finalPits, lastIndex } = computeMove(
      state.pits,
      index,
      isPlayer1,
    );

    // Visually empty the source pit immediately
    setState((prev) => {
      const pits = [...prev.pits];
      pits[index] = 0;
      return { ...prev, pits };
    });

    setIsAnimating(true);
    setPreviewPath([]);
    setHint("");
    setHighlightedPit(null);

    console.log("threeSceneRef:", threeSceneRef.current);

    // Run the Three.js stone animation, then apply final state
    threeSceneRef.current?.playMoveAnimation(index, path, () => {
      const result = applyFinalize(lastIndex, finalPits, isPlayer1);
      setState({ pits: result.pits, currentPlayer: result.currentPlayer });
      if (result.gameOver) {
        setGameOver(result.gameOver);
      }
      setIsAnimating(false);
    });
  }

  // ─── Game controls ────────────────────────────────────────────────────────

  function handleReset() {
    setState({ pits: [...INITIAL_PITS], currentPlayer: 1 });
    setGameOver(null);
    setHint("");
    setHighlightedPit(null);
    setIsAnimating(false);
  }

  function handleMenu() {
    navigate("/");
  }

  // Hint pit highlighted on top of normal preview
  const hintHighlight = highlightedPit !== null ? [highlightedPit] : [];
  const combinedPreview = [...new Set([...previewPath, ...hintHighlight])];

  return (
    <div className="game-page">
      {/* Nav bar */}
      <header className="game-nav">
        <button className="nav-btn" onClick={handleMenu}>
          ← Menu
        </button>
        <span className="nav-title">Mancala</span>
        <button className="nav-btn" onClick={handleReset}>
          Reset
        </button>
      </header>

      {/* Score bar */}
      <ScoreBar
        pits={state.pits}
        currentPlayer={state.currentPlayer}
        isAnimating={isAnimating}
      />

      {/* Error toast */}
      <ErrorToast message={errorMsg} />

      {/* Three.js board */}
      <div className="canvas-wrapper">
        <ThreeScene
          ref={threeSceneRef}
          state={state}
          previewPath={combinedPreview}
          onPitHover={handleHoverPit}
          onPitOut={handleHoverOut}
          onPitClick={handlePitClick}
        />
      </div>

      {/* AI hint panel */}
      <div className="hint-panel">
        <AI_hint
          state={state}
          setHighlightedPit={setHighlightedPit}
          hint={hint}
          setHint={setHint}
        />
      </div>

      {/* Game-over modal */}
      {gameOver && (
        <GameOverModal
          score1={gameOver.score1}
          score2={gameOver.score2}
          onRematch={handleReset}
          onMenu={handleMenu}
        />
      )}
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
