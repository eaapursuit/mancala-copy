import React, { useState } from "react";
import "./AI_hint.css";

const AI_hint = ({ state, setHighlightedPit, hint, setHint }) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchHint = async () => {
    setIsLoading(true);

    const apiKey =
      import.meta.env.VITE_OPENAI_API_KEY || "your_openai_api_key_here";
    if (!apiKey) {
      console.error("API key is missing! Check your configuration.");
      setHint("Sorry, the service is unavailable right now.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `
                  You are a Mancala strategy expert. Your goal is to suggest the best move for the current player in a game of Mancala.
                  - Maximize stones in the current player's store.
                  - Aim for extra turns by landing the last stone in the store.
                  - Capture opponent's stones if the last stone lands in an empty pit on the player's side.
                  - Never suggest a move that has zero stones left in the pit.
                  - Remember player 2's store is at index 13 and player 1's store is at index 6.
                  - Remember player 2's pit start from from index 12 to 7 and player 1's pit start from from index 0 to 5.
                  - Remember player 2's store is left of pattern 13, 12, 11, 10, 9, 8, 7.
                  - Avoid moves that lead to immediate capture by the opponent.
                  - Avoid moves that benefit the opponent.
                  - Use specific language like 'Choose the such and such pit from your left or right.'
                  Always include a sentence that says what "the pit index is x" at the end.
                `,
              },
              {
                role: "user",
                content: `Game state:
                  - Current player: ${state.currentPlayer}
                  - Pits: ${JSON.stringify(state.pits)}
                  Suggest the best move for the current player.`,
              },
            ],
            max_tokens: 150,
            temperature: 0.3,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const hintText =
        data?.choices?.[0]?.message?.content || "No hint available.";
      console.log("AI Response:", hintText); // Log the full response
      setHint(hintText);

      // Debug: Verify if the pit index can be extracted
      const pitIndexMatch = hintText.match(/pit index is (\d+)/); // Updated regex
      if (pitIndexMatch) {
        const pitIndex = parseInt(pitIndexMatch[1], 10);
        console.log("Suggested pit index:", pitIndex); // Debug log
        setHighlightedPit(pitIndex); // Set the highlighted pit
      } else {
        console.warn("No pit index found in AI response."); // Warn if index is missing
      }
    } catch (error) {
      console.error("Error fetching hint:", error);
      setHint("Sorry, unable to get a hint right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mancala_hint_bot">
      <h1 onClick={fetchHint} className="greeting">
        Ask for Hint
      </h1>

      {isLoading && <div className="loading">Loading hint...</div>}

      {hint ? (
        <div className="hint-card">
          <p>{hint}</p>
        </div>
      ) : (
        !isLoading && <p>Click to see a hint!</p>
      )}
    </div>
  );
};

export default AI_hint;
