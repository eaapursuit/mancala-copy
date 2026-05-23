// /**
//  * netlify/functions/ai-hint.js
//  *
//  * Secure backend proxy for the OpenAI hint endpoint.
//  * Set OPENAI_API_KEY in your Netlify environment variables (not in .env.local).
//  *
//  * Usage from the client:
//  *   fetch('/.netlify/functions/ai-hint', {
//  *     method: 'POST',
//  *     headers: { 'Content-Type': 'application/json' },
//  *     body: JSON.stringify({ pits, currentPlayer }),
//  *   })
//  */

// export const handler = async (event) => {
//   if (event.httpMethod !== "POST") {
//     return { statusCode: 405, body: "Method Not Allowed" };
//   }

//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) {
//     console.error("OPENAI_API_KEY environment variable is not set.");
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "AI hint service is not configured." }),
//     };
//   }

//   let body;
//   try {
//     body = JSON.parse(event.body);
//   } catch {
//     return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body." }) };
//   }

//   const { pits, currentPlayer } = body;
//   if (!pits || !currentPlayer) {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ error: "Missing pits or currentPlayer in request body." }),
//     };
//   }

//   try {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini", // cheaper than gpt-4, plenty capable for this
//         max_tokens: 150,
//         temperature: 0.3,
//         messages: [
//           {
//             role: "system",
//             content: `
//               You are a Mancala strategy expert. Suggest the best move for the current player.
//               Rules:
//               - Maximize stones in the current player's store.
//               - Aim for extra turns by landing the last stone in the store.
//               - Capture opponent's stones when the last stone lands in an empty pit on the player's side.
//               - Never suggest a pit with zero stones.
//               - Player 1's pits are indices 0-5, store at index 6.
//               - Player 2's pits are indices 7-12, store at index 13.
//               - Use plain language: "Choose the pit at index X from your left."
//               - End every response with exactly: "The pit index is X" (X = the integer pit index).
//             `.trim(),
//           },
//           {
//             role: "user",
//             content: `Current player: ${currentPlayer}\nPits: ${JSON.stringify(pits)}\nSuggest the best move.`,
//           },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       const errText = await response.text();
//       console.error("OpenAI error:", errText);
//       return {
//         statusCode: response.status,
//         body: JSON.stringify({ error: "OpenAI request failed." }),
//       };
//     }

//     const data = await response.json();
//     const hintText = data?.choices?.[0]?.message?.content ?? "No hint available.";

//     return {
//       statusCode: 200,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ hint: hintText }),
//     };
//   } catch (err) {
//     console.error("ai-hint function error:", err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "Internal server error." }),
//     };
//   }
// };
