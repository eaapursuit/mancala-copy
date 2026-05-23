// import React, { useState } from "react";
// import "./AI_hint.css";

// /**
//  * AI_hint — requests a move suggestion from the backend proxy.
//  * No API key is ever sent to or stored on the client.
//  */
// const AI_hint = ({ state, setHighlightedPit, hint, setHint }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchHint = async () => {
//     if (isLoading) return;
//     if (!state.currentPlayer) return; // game is over

//     setIsLoading(true);
//     setHint("");
//     setHighlightedPit(null);

//     try {
//       const response = await fetch("/.netlify/functions/ai-hint", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           pits: state.pits,
//           currentPlayer: state.currentPlayer,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       const data = await response.json();
//       const hintText = data.hint ?? "No hint available.";
//       setHint(hintText);

//       // Parse the pit index out of "The pit index is X"
//       const match = hintText.match(/pit index is (\d+)/i);
//       if (match) {
//         setHighlightedPit(parseInt(match[1], 10));
//       }
//     } catch (err) {
//       console.error("Error fetching hint:", err);
//       setHint("Unable to get a hint right now. Try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="mancala_hint_bot">
//       <h1 onClick={fetchHint} className="greeting">
//         {isLoading ? "Thinking…" : "Ask for hint"}
//       </h1>

//       {hint && (
//         <div className="hint-card">
//           <p>{hint}</p>
//         </div>
//       )}

//       {!hint && !isLoading && (
//         <p className="loading" style={{ margin: 0 }}>
//           Click to see a suggestion.
//         </p>
//       )}
//     </div>
//   );
// };

// export default AI_hint;
