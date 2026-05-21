# What changed & where to put it

## Drop-in replacements
Copy each file to the path shown — no other files need to change.

| File in this folder                              | Replace in your project                                      |
|--------------------------------------------------|--------------------------------------------------------------|
| src/App.jsx                                      | src/App.jsx                                                  |
| src/index.css                                    | src/index.css                                                |
| src/landingPageComponents/Gameboard.jsx          | src/landingPageComponents/Gameboard.jsx                      |
| src/landingPageComponents/Gameboard.css          | src/landingPageComponents/Gameboard.css                      |
| src/landingPageComponents/AI_hint.jsx            | src/landingPageComponents/AI_hint.jsx                        |
| src/components/ThreeScene.jsx                    | src/components/ThreeScene.jsx                                |
| netlify/functions/ai-hint.js                     | netlify/functions/ai-hint.js  ← new file, create the folder |

All other files (boardSetup, pitSetup, stoneSetup, updatePits, sceneSetup,
LandingPage, History, Rules) are unchanged.

---

## One required step: move your API key

1. Delete VITE_OPENAI_API_KEY from your .env.local (or wherever it lives).
2. In your Netlify dashboard → Site settings → Environment variables,
   add OPENAI_API_KEY = <your key>.

The Netlify function reads it from the server environment.
It is never bundled into your client JavaScript.

---

## What each file does differently

### Gameboard.jsx
- alert() removed everywhere — invalid moves show a toast, game over shows a modal
- Stone animation: computes the full move path upfront, passes it to ThreeScene
  via a ref, updates React state only once when animation finishes (no more
  setState-per-stone via setInterval)
- AI_hint is now imported and rendered in the game view
- Nav bar with ← Menu and Reset buttons
- Score bar with live progress fill between player scores
- Duplicate stonesList state removed (was passed to ThreeScene but never used there)

### Gameboard.css
- Full rewrite — the original was 100% commented out
- Matches the existing linen/brown color palette from LandingPage.css

### ThreeScene.jsx
- forwardRef + useImperativeHandle exposes playMoveAnimation(fromIndex, path, onComplete)
  so Gameboard can trigger animations imperatively
- animateStoneToPosition from stoneSetup.jsx is now actually called
- Canvas is height: 100% (fills .canvas-wrapper which is flex: 1) instead of hardcoded 400px
- Touch events added (touchend) for mobile support
- stonesList prop removed (was unused)

### AI_hint.jsx
- Calls /.netlify/functions/ai-hint (your new backend proxy) instead of OpenAI directly
- No API key on the client
- Switched model from gpt-4 to gpt-4o-mini (same quality for hints, ~30x cheaper)

### App.jsx
- Removed duplicate /gameboard route (kept /game)
- INITIAL_STATE extracted as a constant

### netlify/functions/ai-hint.js
- New file. Reads OPENAI_API_KEY from server env, proxies to OpenAI, returns hint text.
- Install note: if you don't already have Netlify Functions set up, add
  [functions] directory = "netlify/functions" to your netlify.toml.

---

## prop-types missing from package.json

Run: npm install prop-types
