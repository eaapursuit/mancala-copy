# React Mancala Game 🎲

## Overview

This is a fully interactive Mancala game built with React, featuring a dynamic game board, smooth marble animations, and an AI hint system. Experience the classic African stone-counting strategy game with modern web technology!

## 🌟 Features

- Two-player Mancala gameplay
- Responsive game board with animated marble transitions
- Pit highlighting for improved user interaction
- AI-powered hint system to assist players
- Game state tracking and turn management
- Automatic win/loss/tie detection
- Game reset functionality

## 🎮 Game Rules

Mancala is a turn-based strategy game where players distribute stones across pits, aiming to collect the most stones in their store. Key rules include:

- Players can only select stones from their side of the board
- Stones are distributed counterclockwise
- Landing in your own store grants an extra turn
- Capturing opponent's stones by landing in an empty pit on your side
- Game ends when one player's side is empty, with remaining stones collected

## 🛠 Tech Stack

- React
- React Spring (for animations)
- CSS for styling

## 📦 Components

- `GameBoard`: Main game logic and rendering
- `Marble`: Individual stone/marble component
- `AI_hint`: Provides strategic suggestions

## 🚀 How to Play

1. Each player starts with 4 stones in their 6 pits
2. Choose a pit to distribute its stones
3. Follow Mancala rules to collect stones in your store
4. The player with the most stones at the end wins!

## 💡 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/react-mancala.git

# Navigate to project directory
cd react-mancala

# Install dependencies
npm install

# Start the development server
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source. Please check the LICENSE file for details.

## 🎨 Future Enhancements

- Multiplayer online support
- Difficulty levels for AI hints
- Responsive design improvements
- Sound effects
- Game history tracking

## 🙏 Acknowledgements

Inspired by the traditional African strategy game of Mancala.
