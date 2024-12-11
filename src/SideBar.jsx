import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ currentTheme, setCurrentTheme, themes }) {
  const handleRandomTheme = () => {
    const randomThemes = Object.keys(themes);
    const newTheme =
      randomThemes[Math.floor(Math.random() * randomThemes.length)];
    setCurrentTheme(newTheme);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2>{}</h2>
        <select
          value={currentTheme}
          onChange={(e) => setCurrentTheme(e.target.value)}
          className="theme-selector"
        >
          {Object.keys(themes).map((theme) => (
            <option key={theme} value={theme}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </option>
          ))}
        </select>
        <button className="random-theme-button" onClick={handleRandomTheme}>
          Theme Me!!!
        </button>
        <nav>
          <Link to="/">Gameboard</Link>
          <Link to="/history">History</Link>
          <Link to="/rules">Rules</Link>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
