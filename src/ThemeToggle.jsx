// import React, { useState, useEffect } from "react";

// function ThemeToggle() {
//   const [theme, setTheme] = useState("light");
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ThemeToggle.css";

function ThemeToggle() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

//   useEffect(() => {
//     document.body.className = `theme-${theme}`;
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

//   return (
//     <button onClick={toggleTheme} className="theme-toggle">
//       Switch to {theme === "light" ? "Dark" : "Light"}
//     </button>
//   );
// }

  return (
    <>
      <select
        value={theme}
        onChange={toggleTheme}
        className="theme-toggle"
        aria-label="Select color theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </>
  );
}

// export default ThemeToggle;
