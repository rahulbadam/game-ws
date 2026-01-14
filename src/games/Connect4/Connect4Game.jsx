import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../login/AuthContext";
import { doc, setDoc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

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

  // Game state
  const [board, setBoard] = useState(Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER1);
  const [gameStatus, setGameStatus] = useState('connecting'); // connecting, waiting, playing, finished
  const [winner, setWinner] = useState(null);
  const [roomId, setRoomId] = useState('connect4_global_room');
  const [playerRole, setPlayerRole] = useState(null); // player1 or player2
  const [opponent, setOpponent] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState(null);

  // Generate unique player ID (works with or without auth)
  const playerId = user?.uid || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const playerName = user?.displayName || user?.email?.split('@')[0] || `Player_${Math.floor(Math.random() * 1000)}`;

  // Join/create game - Simplified for demo
  const joinGame = useCallback(() => {
    console.log('Joining Connect 4 game (simplified mode)...');
    console.log('Player ID:', playerId);
    console.log('Player Name:', playerName);

    // For demo purposes, always set as player 1 waiting for opponent
    // In a real implementation, this would use Firebase for cross-device multiplayer
    setPlayerRole('player1');
    setGameStatus('waiting');
    console.log('Set as player 1, waiting for opponent');
  }, [playerId, playerName]);

  // Set up real-time listener
  useEffect(() => {
    if (!roomId) return;

    console.log('Setting up real-time listener for room:', roomId);
    const gameRef = doc(db, 'connect4_games', roomId);

    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        const gameData = doc.data();
        console.log('Received game update:', gameData);

        setBoard(gameData.board || Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)));
        setCurrentPlayer(gameData.currentPlayer || PLAYER1);
        setGameStatus(gameData.gameStatus || 'waiting');
        setWinner(gameData.winner || null);

        // Update opponent info
        if (playerRole === 'player1' && gameData.players.player2) {
          setOpponent(gameData.players.player2);
        } else if (playerRole === 'player2' && gameData.players.player1) {
          setOpponent(gameData.players.player1);
        }

        // Check if it's my turn
        const myColor = playerRole === 'player1' ? PLAYER1 : PLAYER2;
        setIsMyTurn(gameData.currentPlayer === myColor && gameData.gameStatus === 'playing');

        // Handle game end
        if (gameData.gameStatus === 'finished' && gameData.winner) {
          const score = gameData.winner === myColor ? 20 : -10;
          onGameOver(score);
        }
      } else {
        console.log('Game document does not exist');
      }
    }, (error) => {
      console.error('Snapshot error:', error);
    });

    return () => {
      console.log('Unsubscribing from game listener');
      unsubscribe();
    };
  }, [roomId, playerRole, onGameOver]);

  // Initialize game
  useEffect(() => {
    joinGame();
  }, [joinGame]);

  // Drop disc in column
  const dropDisc = async (col) => {
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

    try {
      const gameRef = doc(db, 'connect4_games', roomId);
      await updateDoc(gameRef, {
        board: newBoard,
        currentPlayer: gameWinner ? currentPlayer : nextPlayer,
        gameStatus: gameWinner ? 'finished' : 'playing',
        winner: gameWinner,
        lastMove: new Date()
      });
      console.log('Move made successfully');
    } catch (error) {
      console.error('Error making move:', error);
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
    // Reset local state
    setBoard(Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)));
    setCurrentPlayer(PLAYER1);
    setGameStatus('waiting');
    setWinner(null);
    setPlayerRole(null);
    setOpponent(null);
    setIsMyTurn(false);
    setHoveredColumn(null);

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
      return playerRole === 'player1' ? '⏳ Waiting for human opponent...' : '🔄 Joining game...';
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
              <li>• <strong>Current limitation:</strong> Multiplayer requires Firebase setup</li>
              <li>• For demo purposes, this shows single-player mode</li>
              <li>• <strong>To enable cross-device multiplayer:</strong></li>
              <li className="ml-2">• Configure Firebase Firestore security rules</li>
              <li className="ml-2">• Allow unauthenticated read/write access</li>
              <li className="ml-2">• Or implement WebSocket server</li>
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
