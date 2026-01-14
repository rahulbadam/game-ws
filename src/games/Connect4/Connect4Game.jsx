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
  const [board, setBoard] = useState(Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER1);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, finished
  const [winner, setWinner] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [playerRole, setPlayerRole] = useState(null); // player1 or player2
  const [opponent, setOpponent] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);

  // Generate room ID and join/create game
  const joinGame = useCallback(async () => {
    if (!user) return;

    // Use a fixed demo room ID so multiple players can join the same game
    const gameRoomId = 'connect4_demo_room';
    setRoomId(gameRoomId);

    const gameRef = doc(db, 'connect4_games', gameRoomId);

    try {
      const gameSnap = await getDoc(gameRef);

      if (!gameSnap.exists()) {
        // Create new game as player 1
        await setDoc(gameRef, {
          board: Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)),
          currentPlayer: PLAYER1,
          gameStatus: 'waiting',
          winner: null,
          players: {
            player1: { uid: user.uid, displayName: user.displayName || 'Player 1' },
            player2: null
          },
          createdAt: new Date(),
          lastMove: new Date()
        });
        setPlayerRole('player1');
        setGameStatus('waiting');
      } else {
        const gameData = gameSnap.data();

        if (!gameData.players.player2 && gameData.players.player1.uid !== user.uid) {
          // Join as player 2
          await updateDoc(gameRef, {
            players: {
              ...gameData.players,
              player2: { uid: user.uid, displayName: user.displayName || 'Player 2' }
            },
            gameStatus: 'playing',
            lastMove: new Date()
          });
          setPlayerRole('player2');
          setGameStatus('playing');
          setOpponent(gameData.players.player1);
        } else if (gameData.players.player1.uid === user.uid) {
          // Rejoining as player 1
          setPlayerRole('player1');
          setOpponent(gameData.players.player2);
          setGameStatus(gameData.gameStatus);
        } else if (gameData.players.player2?.uid === user.uid) {
          // Rejoining as player 2
          setPlayerRole('player2');
          setOpponent(gameData.players.player1);
          setGameStatus(gameData.gameStatus);
        }
      }
    } catch (error) {
      console.error('Error joining game:', error);
    }
  }, [user]);

  // Set up real-time listener
  useEffect(() => {
    if (!roomId) return;

    const gameRef = doc(db, 'connect4_games', roomId);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        const gameData = doc.data();
        setBoard(gameData.board);
        setCurrentPlayer(gameData.currentPlayer);
        setGameStatus(gameData.gameStatus);
        setWinner(gameData.winner);

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
      }
    });

    return () => unsubscribe();
  }, [roomId, playerRole, onGameOver]);

  // Initialize game
  useEffect(() => {
    if (user) {
      joinGame();
    }
  }, [user, joinGame]);

  // Drop disc in column
  const dropDisc = async (col) => {
    if (!isMyTurn || gameStatus !== 'playing') return;

    const gameRef = doc(db, 'connect4_games', roomId);
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
      await updateDoc(gameRef, {
        board: newBoard,
        currentPlayer: gameWinner ? currentPlayer : nextPlayer,
        gameStatus: gameWinner ? 'finished' : 'playing',
        winner: gameWinner,
        lastMove: new Date()
      });
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
    setBoard(Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)));
    setCurrentPlayer(PLAYER1);
    setGameStatus('waiting');
    setWinner(null);
    setOpponent(null);
    setPlayerRole(null);
    setRoomId(null);
    setHoveredColumn(null);
    setIsMyTurn(false);

    // Rejoin game
    if (user) {
      joinGame();
    }
  };

  const getStatusMessage = () => {
    if (gameStatus === 'waiting') {
      return playerRole === 'player1' ? 'Waiting for opponent...' : 'Joining game...';
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
