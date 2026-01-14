import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../login/AuthContext";

// Simple local multiplayer for demo (works across browser tabs)
const useLocalMultiplayer = () => {
  const [gameData, setGameData] = useState(null);
  const [playerId] = useState(() => `player_${Date.now()}_${Math.random()}`);

  // Load game from localStorage
  const loadGame = useCallback(() => {
    try {
      const stored = localStorage.getItem('connect4_demo_game');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  // Save game to localStorage
  const saveGame = useCallback((data) => {
    try {
      localStorage.setItem('connect4_demo_game', JSON.stringify(data));
      setGameData(data);
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'connect4_demo_game',
        newValue: JSON.stringify(data)
      }));
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }, []);

  // Listen for storage changes (other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'connect4_demo_game' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          setGameData(data);
        } catch (error) {
          console.error('Failed to parse game data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Load initial game
    setGameData(loadGame());

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadGame]);

  return { gameData, saveGame, playerId };
};

const ROWS = 6;
const COLS = 7;
const EMPTY = null;
const PLAYER1 = 'red';
const PLAYER2 = 'yellow';

// Cell component for individual grid cells
const Cell = ({ value, onClick, isHovered }) => (
  <div
    className={`
      w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gray-600
      flex items-center justify-center cursor-pointer transition-all duration-300
      ${isHovered ? 'border-blue-400 bg-blue-100/20' : 'border-gray-500'}
      ${value === PLAYER1 ? 'bg-red-500 border-red-600' : ''}
      ${value === PLAYER2 ? 'bg-yellow-400 border-yellow-600' : ''}
      hover:scale-105
    `}
    onClick={onClick}
  >
    {value && (
      <div className={`
        w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg
        ${value === PLAYER1 ? 'bg-gradient-to-br from-red-400 to-red-600' : ''}
        ${value === PLAYER2 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : ''}
      `} />
    )}
  </div>
);

export default function Connect4Game({ onGameOver }) {
  const { user } = useAuth();
  const { gameData, saveGame, playerId } = useLocalMultiplayer();

  // Derive state from gameData
  const board = gameData?.board || Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));
  const currentPlayer = gameData?.currentPlayer || PLAYER1;
  const gameStatus = gameData?.gameStatus || 'waiting';
  const winner = gameData?.winner || null;
  const playerRole = gameData?.players?.player1?.uid === playerId ? 'player1' :
    gameData?.players?.player2?.uid === playerId ? 'player2' : null;
  const opponent = playerRole === 'player1' ? gameData?.players?.player2 :
    playerRole === 'player2' ? gameData?.players?.player1 : null;
  const isMyTurn = playerRole && currentPlayer === (playerRole === 'player1' ? PLAYER1 : PLAYER2) && gameStatus === 'playing';

  const [hoveredColumn, setHoveredColumn] = useState(null);

  // Join/create game using local multiplayer
  const joinGame = useCallback(() => {
    console.log('Joining game with local multiplayer');

    const playerName = user?.displayName || user?.email?.split('@')[0] || `Player_${Math.floor(Math.random() * 1000)}`;

    if (!gameData) {
      // No game exists, create one as player 1
      console.log('Creating new game as player 1');
      const newGameData = {
        board: Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)),
        currentPlayer: PLAYER1,
        gameStatus: 'waiting',
        winner: null,
        players: {
          player1: { uid: playerId, displayName: playerName },
          player2: null
        },
        createdAt: new Date(),
        lastMove: new Date()
      };
      saveGame(newGameData);
      console.log('Game created, waiting for opponent');
    } else if (!gameData.players.player2 && gameData.players.player1.uid !== playerId) {
      // Game exists but no player 2, join as player 2
      console.log('Joining as player 2');
      const updatedGameData = {
        ...gameData,
        players: {
          ...gameData.players,
          player2: { uid: playerId, displayName: playerName }
        },
        gameStatus: 'playing',
        lastMove: new Date()
      };
      saveGame(updatedGameData);
      console.log('Joined as player 2, game started');
    } else {
      // Game exists and we're already a player, or room is full
      console.log('Already in game or room full');
    }
  }, [user, gameData, saveGame, playerId]);



  // Initialize game
  useEffect(() => {
    // Always try to join game, even without authentication for demo
    joinGame();
  }, [joinGame]);

  // Drop disc in column
  const dropDisc = (col) => {
    if (!isMyTurn || gameStatus !== 'playing') return;

    const newBoard = board.map(row => [...row]);

    // Find the lowest empty row in this column
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] === EMPTY) {
        newBoard[row][col] = currentPlayer;
        break;
      }
    }

    // Check for winner
    const gameWinner = checkWinner(newBoard);
    const nextPlayer = currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;

    const updatedGameData = {
      ...gameData,
      board: newBoard,
      currentPlayer: gameWinner ? currentPlayer : nextPlayer,
      gameStatus: gameWinner ? 'finished' : 'playing',
      winner: gameWinner,
      lastMove: new Date()
    };

    saveGame(updatedGameData);

    // Handle game end
    if (gameWinner) {
      const score = gameWinner === (playerRole === 'player1' ? PLAYER1 : PLAYER2) ? 20 : -10;
      onGameOver(score);
    }
  };

  // Check for winner
  const checkWinner = (board) => {
    // Check horizontal, vertical, and diagonal
    const directions = [
      [0, 1],  // horizontal
      [1, 0],  // vertical
      [1, 1],  // diagonal \
      [1, -1]  // diagonal /
    ];

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (board[row][col] !== EMPTY) {
          const player = board[row][col];

          for (const [dRow, dCol] of directions) {
            let count = 1;

            for (let i = 1; i < 4; i++) {
              const newRow = row + dRow * i;
              const newCol = col + dCol * i;

              if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS &&
                board[newRow][newCol] === player) {
                count++;
              } else {
                break;
              }
            }

            if (count >= 4) {
              return player;
            }
          }
        }
      }
    }

    return null;
  };

  // Check if board is full
  const isBoardFull = (board) => {
    return board[0].every(cell => cell !== EMPTY);
  };

  const resetGame = () => {
    // Clear localStorage to reset the game
    try {
      localStorage.removeItem('connect4_demo_game');
    } catch (error) {
      console.error('Failed to clear game data:', error);
    }

    // Rejoin game
    setTimeout(() => {
      joinGame();
    }, 100);
  };

  const getStatusMessage = () => {
    // If we don't have a player role yet, show connecting message
    if (!playerRole) {
      return '🔗 Connecting to game...';
    }

    if (gameStatus === 'waiting') {
      return playerRole === 'player1' ? '⏳ Waiting for opponent...' : '🔄 Joining game...';
    }
    if (gameStatus === 'finished') {
      if (winner === (playerRole === 'player1' ? PLAYER1 : PLAYER2)) {
        return '🎉 You Win!';
      } else if (winner) {
        return '😔 You Lose!';
      } else {
        return '🤝 Draw!';
      }
    }
    if (isMyTurn) {
      return `🎯 Your turn (${playerRole === 'player1' ? 'Red' : 'Yellow'})`;
    } else {
      return `⏳ ${opponent?.displayName || 'Opponent'}'s turn`;
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">🔴🟡 Connect 4</h2>

      {/* Game Status */}
      <div className="mb-4">
        <div className="text-lg font-semibold mb-2">{getStatusMessage()}</div>
        {opponent && (
          <div className="text-sm text-gray-400">
            Playing against: {opponent.displayName}
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-6">
        <div className="bg-blue-600 p-4 rounded-lg shadow-2xl">
          <div className="grid grid-cols-7 gap-1">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="flex flex-col items-center">
                  {/* Column hover indicator */}
                  {rowIndex === 0 && (
                    <div
                      className={`w-12 h-4 md:w-14 md:h-4 mb-1 rounded-full transition-colors ${hoveredColumn === colIndex && isMyTurn ? 'bg-blue-300' : 'bg-transparent'
                        }`}
                    />
                  )}

                  {/* Cell */}
                  <Cell
                    value={cell}
                    isHovered={hoveredColumn === colIndex && rowIndex === 0 && isMyTurn}
                    onClick={() => dropDisc(colIndex)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Column hover handlers */}
      <div
        className="absolute inset-0 pointer-events-none"
        onMouseMove={(e) => {
          if (!isMyTurn) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const colWidth = rect.width / COLS;
          const col = Math.floor(x / colWidth);
          setHoveredColumn(col >= 0 && col < COLS ? col : null);
        }}
        onMouseLeave={() => setHoveredColumn(null)}
      />

      {/* Game Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg"
        >
          🔄 New Game
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-4 mt-6 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-blue-400 mb-2">🎯 How to Play</h3>
        <div className="space-y-3 text-left">
          {/* Multiplayer Instructions */}
          <div>
            <h4 className="text-sm font-semibold text-green-400 mb-1">🔗 Multiplayer Setup</h4>
            <ul className="text-xs text-gray-300 space-y-0.5">
              <li>• Game automatically connects you to a shared room</li>
              <li>• <strong>First player</strong> becomes Red and waits for opponent</li>
              <li>• <strong>Second player</strong> joins as Yellow and starts the game</li>
              <li>• Share the game link with friends to play together</li>
            </ul>
          </div>

          {/* Gameplay Instructions */}
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-1">🎮 Game Rules</h4>
            <ul className="text-xs text-gray-300 space-y-0.5">
              <li>• Take turns dropping colored discs into columns</li>
              <li>• First to get 4 in a row wins (horizontal, vertical, or diagonal)</li>
              <li>• Red goes first, then Yellow alternates</li>
              <li>• Click any column to drop your disc</li>
            </ul>
          </div>

          {/* Status Guide */}
          <div>
            <h4 className="text-sm font-semibold text-yellow-400 mb-1">📊 Game Status</h4>
            <ul className="text-xs text-gray-300 space-y-0.5">
              <li>• <span className="text-cyan-400">"Connecting to game..."</span> - Establishing connection</li>
              <li>• <span className="text-orange-400">"Waiting for opponent..."</span> - Share link to invite someone</li>
              <li>• <span className="text-green-400">"Your turn"</span> - Click a column to make your move</li>
              <li>• <span className="text-blue-400">"Opponent's turn"</span> - Wait for other player</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
