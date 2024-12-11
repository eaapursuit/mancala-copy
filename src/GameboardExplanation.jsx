

function GameBoard({ state, setState }) {
  // DETAILED EXPLANATION: GAME STATE MANAGEMENT
  
  // Think of these as the game's memory and interaction trackers
  // 'hint' is like a helpful friend whispering strategy tips
  // 'highlightedPit' is like putting a spotlight on a specific game area
  // useState is a special React tool that lets us create and update these memory spots
  
  // This hint will store any strategic advice for the player
  // Imagine it like a little coach giving you tips during the game
  const [hint, setHint] = useState("");
  
  // This tracks which pit (game area) should be visually highlighted
  // It's like pointing a laser pointer at a specific part of the game board
  // When null, no pit is highlighted
  const [highlightedPit, setHighlightedPit] = useState(null);
  
  // This is a developer's helper - like leaving breadcrumbs to understand what's happening
  // It prints out the entire game state every time something changes
  // Super useful for debugging and understanding game flow
  console.log("Gameboard state:", state);

  // COMPREHENSIVE GAME RESET FUNCTION
  // Think of this like a big red "START OVER" button that totally resets everything
  const resetGame = () => {
    // DEEP DIVE: ARRAY CREATION
    // Array(14).fill(4) is like creating 14 identical boxes, each with 4 marbles
    // Imagine setting up a game board where every pit starts with exactly 4 stones
    const initialPits = Array(14).fill(4);
    
    // SPECIAL STORE SETUP
    // In Mancala, players have a special "store" to collect their won stones
    // These are the only pits that start empty
    // Indexes 6 and 13 are the stores for Player 1 and Player 2
    initialPits[6] = 0;   // Player 1's empty store (on the right side)
    initialPits[13] = 0;  // Player 2's empty store (on the left side)

    // RESETTING THE ENTIRE GAME STATE
    // This is like pushing the big reset button on the entire game
    setState({
      pits: initialPits,        // Reset all game pits to starting condition
      currentPlayer: 1,          // Always restart with Player 1's turn
    });

    // CLEARING ADDITIONAL GAME HELPERS
    // Remove any existing hints or visual highlights
    setHint("");
    setHighlightedPit(null); 
  };

  // MASSIVE EXPLANATION: THE CORE GAME LOGIC FUNCTION
  // This function is the HEART of the Mancala game
  // It runs every single time a player clicks on a pit
  const handlePitClick = (player, index) => {
    // FIRST: HIGHLIGHT MANAGEMENT
    // If the player clicks the same pit that's already highlighted, un-highlight it
    // This is like a toggle switch for the pit's visual indicator
    if (highlightedPit === index) setHighlightedPit(null);

    // PLAYER SIDE IDENTIFICATION
    // Determines which side of the board the current player is on
    // In Mancala, each player can only move stones from their own side
    const isPlayer1 = player === 1;
    
    // CREATING A COPY OF THE GAME STATE
    // We make a copy so we can modify the game state without breaking the original
    // Think of this like making a draft before writing the final essay
    const pits = [...state.pits];
    
    // DEFINING PLAYER BOUNDARIES
    // These variables create "guardrails" to ensure players only play in their own area
    const playerStartIndex = isPlayer1 ? 0 : 7;    // First pit of player's side
    const playerEndIndex = isPlayer1 ? 5 : 12;     // Last pit of player's side
    const storeIndex = isPlayer1 ? 6 : 13;         // Player's special stone collection area

    // TURN AND MOVE VALIDATION
    // These are like the referees of the game, making sure everyone follows the rules
    
    // Rule 1: You can only play during your own turn
    if (state.currentPlayer !== player) {
      alert("It's not your turn!");
      return;
    }
    
    // Rule 2: You can only select pits on your side of the board
    if (index < playerStartIndex || index > playerEndIndex) {
      alert("You can only pick from your pits!");
      return;
    }
    
    // Rule 3: You can't select an empty pit
    if (pits[index] === 0) {
      alert("You can't start from an empty pit!");
      return;
    }

    // STONE DISTRIBUTION LOGIC
    // This is where the magic happens - moving stones around the board
    
    // Take ALL stones from the selected pit
    let stones = pits[index];
    pits[index] = 0;  // Empty the selected pit completely
    
    // Keep track of current position as we distribute stones
    let currentIndex = index;
    
    // Track whether the last stone lands in the player's store
    let lastLandedInStore = false;

    // COMPLEX STONE DISTRIBUTION LOOP
    // This is like a intricate dance of moving stones around the board
    // It handles multiple complex scenarios of stone distribution
    while (
      stones > 0 ||  // Continue while stones remain to be distributed
      (stones === 0 && currentIndex !== storeIndex && pits[currentIndex] > 1)
    ) {
      // SPECIAL CAPTURE MECHANISM
      // If no stones left, but current pit has multiple stones, transfer them
      if (
        stones === 0 &&
        currentIndex !== storeIndex &&
        pits[currentIndex] > 1
      ) {
        stones += pits[currentIndex];
        pits[currentIndex] = 0;
      }

      
 //Stone Distribution and Game Logic Mechanism
 //
 // This section manages the core game mechanics of Mancala, including:
 // - Distributing stones across the board
 // - Handling special capture scenarios
 // - Determining game progression and turn changes
 

 //Circular index navigation through board pits
 //Uses modulo to wrap around board length, preventing index out of bounds 
    currentIndex = (currentIndex + 1) % pits.length;

    // Skip opponent's store during stone distribution
    // Ensures stones are only distributed in the current player's valid pits
    if (isPlayer1 && currentIndex === 13) continue;
    if (!isPlayer1 && currentIndex === 6) continue;

    // Stone distribution logic
    // Incrementally place stones in each pit while tracking remaining stones
    pits[currentIndex]++;
    stones--;

    /**
 * Track the landing location of the last stone
 * 
 * Determines turn progression:
 * - If last stone lands in player's store, same player continues
 * - Otherwise, switch to opponent
 */
    if (currentIndex === storeIndex) {
  lastLandedInStore = true;
    } else {
  lastLandedInStore = false;
    }

    /**
 * Mancala Capture Mechanism
 * 
 * Strategic capture rules:
 * 1. Last stone must not land in store
 * 2. Last stone must land on player's side
 * 3. Specific conditions for stone capture from opposite pit
 */
if (
  !lastLandedInStore &&
  currentIndex >= playerStartIndex &&
  currentIndex <= playerEndIndex
) {
  // Calculate the corresponding pit on opponent's side
  const oppositeIndex = 12 - currentIndex;

  // If current pit has multiple stones, clear it
  // Prepares for potential capture
  if (pits[currentIndex] > 1) {
    stones = pits[currentIndex];
    pits[currentIndex] = 0;
  }

  // Special capture condition:
  // If last stone lands in empty pit with stones in opposite pit
  if (pits[currentIndex] === 1 && pits[oppositeIndex] > 0) {
    // Move all stones from opposite pit plus landing stone to player's store
    pits[storeIndex] += pits[oppositeIndex] + 1;
    pits[oppositeIndex] = 0;
    pits[currentIndex] = 0;
  }
}

//
 /* Game Completion Check
 * 
 * Determines if game has ended by checking if either player's side is empty
 * When game ends:
 * - Collect remaining stones
 * - Calculate final scores
 * - Determine winner
 */
const player1Empty = pits.slice(0, 6).every((stones) => stones === 0);
const player2Empty = pits.slice(7, 13).every((stones) => stones === 0);

if (player1Empty || player2Empty) {
  // Collect remaining stones to respective stores
  pits[6] += pits.slice(0, 6).reduce((a, b) => a + b, 0);
  pits[13] += pits.slice(7, 13).reduce((a, b) => a + b, 0);

  // Clear all game pits
  for (let i = 0; i < 6; i++) pits[i] = 0;
  for (let i = 7; i < 13; i++) pits[i] = 0;

  // Stop the game
  setState({ pits, currentPlayer: null });

  // Calculate and display final scores
  const player1Score = pits[6];
  const player2Score = pits[13];

  // Determine winner based on stone count
  if (player1Score > player2Score) {
    alert(
      `Game over! Player 1 wins with ${player1Score} stones vs ${player2Score} stones!`
    );
  } else if (player2Score > player1Score) {
    alert(
      `Game over! Player 2 wins with ${player2Score} stones vs ${player1Score} stones!`
    );
  } else {
    alert(`Game over! It's a tie with ${player1Score} stones each!`);
  }
  return;
}

/**
 * Next Player Determination
 * 
 * Decides which player takes the next turn based on:
 * - Whether last stone landed in player's store
 * - Current player's turn
 */
const nextPlayer = lastLandedInStore ? player : player === 1 ? 2 : 1;
setState({ pits, currentPlayer: nextPlayer });
setHint("");
    }}
// Debug logging for highlighted pit (potential development/debugging feature)
console.log("Highlighted pit:", highlightedPit);
/**
 * Mancala Game Board Rendering
 * 
 * This component manages the visual representation of the Mancala game board,
 * including:
 * - Player 2's pit row (top row)
 * - Player 1's pit row (bottom row)
 * - Player stores (scoring areas)
 * - Game state indicators
 * - Interactive game controls
 */
return (
    <div className="mancala-board">
      {/* Player 2's Store (Right-side Mancala) 
       * Displays the total number of stones collected by Player 2
       * Located at index 13 in the game state's pit array
       */}
      <div className="mancala player2">{state.pits[13]}</div>
  
      {/* Player 2's Pit Row
       * Rendering logic:
       * 1. Slice pits 7-13 (Player 2's pits)
       * 2. Reverse the order for correct visual layout
       * 3. Map each pit to a button with interactive capabilities
       */}
      <div className="pits">
        {state.pits
          .slice(7, 13)
          .reverse()
          .map((stones, reverseIndex) => {
            // Corrects index mapping due to reversal
            const index = 12 - reverseIndex;
  
            // Generate marble elements for each stone in the pit
            // Creates visual representation of stones using <Marble> component
            const marbleElements = Array(stones)
              .fill()
              .map((_, idx) => (
                <Marble key={`${index}-${idx}`} className="stone"/>
              ));
  
            return (
              <button
                key={index}
                // Dynamic class management:
                // - 'active' when it's Player 2's turn
                // - 'highlighted' when suggested by AI hint
                className={`pit ${state.currentPlayer === 2 ? "active" : ""} ${
                  highlightedPit === index ? "highlighted" : ""
                }`}
                // Handle pit selection with player and index information
                onClick={() => handlePitClick(2, index)}
              >
                {/* Container for stone elements */}
                <div className="stones-container">{marbleElements}</div>
              </button>
            );
          })}
      </div>
  
      {/* Player 1's Pit Row
       * Similar rendering logic to Player 2's row
       * Key difference: Uses react-spring useTransition for stone animations
       */}
      <div className="pits">
        {state.pits.slice(0, 6).map((stones, index) => {
          // Stone animation configuration using react-spring
          // Creates smooth scale and opacity transitions for stones
          const transitions = useTransition(Array(stones).fill(), {
            from: { opacity: 0, transform: "scale(0)" },
            enter: { opacity: 1, transform: "scale(1)" },
            leave: { opacity: 0, transform: "scale(0)" },
            keys: (item, idx) => `${index}-${idx}`,
          });
  
          return (
            <button
              key={index}
              // Dynamic class management for Player 1
              className={`pit ${state.currentPlayer === 1 ? "active" : ""} ${
                highlightedPit === index ? "highlighted" : ""
              }`}
              onClick={() => handlePitClick(1, index)}
            >
              {/* Animated stone rendering using react-spring transitions */}
              <div className="stones-container">
                {transitions((style, _, idx) => (
                  <animated.div key={idx} style={style} className="stone">
                    <Marble/>
                  </animated.div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
  
      {/* Player 1's Store (Left-side Mancala)
       * Displays the total number of stones collected by Player 1
       * Located at index 6 in the game state's pit array
       */}
      <div className="mancala player1">{state.pits[6]}</div>
  
      {/* Player Store Labels */}
      <div className="mancala-player-store">
        <h2>Player 2 Store</h2>
      </div>
  
      {/* Current Player Turn Indicator 
       * Dynamically shows which player's turn it currently is
       */}
      <div className="mancala-player-turn">
        <h1>Player {state.currentPlayer}'s turn</h1>
      </div>
  
      <div className="mancala-player-store">
        <h2>Player 1 Store</h2>
      </div>
  
      {/* AI Hint Container
       * Provides strategic suggestions for the current player
       * Uses AI_hint component to generate and display hints
       */}
      <div className="hint-container">
        <div className="hint-card">
          <AI_hint
            state={state}
            setHighlightedPit={setHighlightedPit}
            hint={hint}
            setHint={setHint}
          />
        </div>
      </div>
  
      {/* Game Reset Functionality
       * Allows players to start a new game at any point
       * Calls resetGame function to reinitialize game state
       */}
      <div className="reset-container">
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      </div>
    </div>
  );
}
