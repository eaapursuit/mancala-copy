import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Gameboard from "./Gameboard";
import History from "./History";
import Rules from "./Rules";
import Sidebar from "./SideBar";
import familyPlaying from "./assets/americas/family playing Small.jpeg";
import mancalaOnTheFloor from "./assets/americas/mancala on the floor Small.jpeg";
import mancala from "./assets/americas/mancala Small.jpeg";
import smallbuilding from "./assets/asia/building Small.jpeg";
import congkak from "./assets/asia/congkak mancala Small.jpeg";
import family from "./assets/asia/family play Small.jpeg";
import india from "./assets/asia/india mancala Small.jpeg";
import indonesia from "./assets/asia/indonesia mancala Small.jpeg";
import smallmancala from "./assets/asia/mancala Small.jpeg";
import mulitplegames from "./assets/asia/multiple games Small.jpeg";
import oarinwater from "./assets/asia/oar in water Small.jpeg";
import ancient from "./assets/africa/ancient kemet mancala.jpg";
import animal from "./assets/africa/animals grazing.jpg";
import antigua from "./assets/africa/antigua.jpg";
import baobab from "./assets/africa/baobab mancala.jpg";
import beautiful from "./assets/africa/beautiful board.jpg";
import cheetah from "./assets/africa/cheetah.jpg";
import circle from "./assets/africa/circle mancala.jpeg";
import east from "./assets/africa/east-africa-mancala.jpg";
import elephant from "./assets/africa/elephants.jpg";
import ethiopia from "./assets/africa/ethiopia.jpg";
import fog from "./assets/africa/fog.jpg";
import four from "./assets/africa/four board mancala.jpeg";
import giraffes from "./assets/africa/giraffes.jpg";
import hippos from "./assets/africa/hippos.jpg";
import kemet from "./assets/africa/kemet mancala.png";
import malawi from "./assets/africa/malawi mancala.png";
import close from "./assets/africa/mancala close up .jpg";
import dirt from "./assets/africa/mancala in dirt.jpg";
import metal from "./assets/africa/metal mancala.jpeg";
import oware from "./assets/africa/oware mancala.jpg";
import sand from "./assets/africa/sand mancala.png";
import zanzibar from "./assets/africa/zanzibar.jpg";
import zebra from "./assets/africa/zebra in forefront_.jpg";
import forest from "./assets/africa/zebras in forest.jpg";

const themes = {
  africa: [
    ancient,
    animal,
    antigua,
    baobab,
    beautiful,
    cheetah,
    circle,
    east,
    elephant,
    ethiopia,
    fog,
    four,
    giraffes,
    hippos,
    kemet,
    malawi,
    close,
    dirt,
    metal,
    oware,
    sand,
    zanzibar,
    zebra,
    forest,
  ],
  americas: [familyPlaying, mancalaOnTheFloor, mancala],
  asia: [
    smallbuilding,
    congkak,
    family,
    india,
    indonesia,
    smallmancala,
    mulitplegames,
    oarinwater,
  ],
};

function getRandomImage(theme) {
  const images = themes[theme];
  if (!images || images.length === 0) {
    console.warn(`No images found for theme: ${theme}`);
    return ""; // Fallback to a default or empty string
  }
  return images[Math.floor(Math.random() * images.length)];
}

function App() {
  const [state, setState] = useState({
    pits: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
    currentPlayer: 1,
  });

  const [currentTheme, setCurrentTheme] = useState("africa"); // Default theme
  const [backgroundImage, setBackgroundImage] = useState(
    getRandomImage("africa")
  );

  // Update the background whenever the theme changes
  useEffect(() => {
    setBackgroundImage(getRandomImage(currentTheme));
  }, [currentTheme]);

  return (
    <Router>
      <div
        className="app"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "repeat", // Repeat the image in both directions
          backgroundSize: "50% 50%", // Scale the image to fit four times (2x2 grid)
          backgroundPosition: "center", // Center the pattern
          height: "100vh",
          width: "100vw",
        }}
      >
        <Sidebar
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          themes={themes}
        />
        <div className="main-content">
          <Routes>
            <Route
              path="/"
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
