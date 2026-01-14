import { useState, useEffect, useCallback } from "react";

// Difficulty levels with grid sizes
const DIFFICULTY_LEVELS = {
  easy: { size: 3, name: "Easy", emoji: "🟢" },
  medium: { size: 5, name: "Medium", emoji: "🟡" },
  hard: { size: 7, name: "Hard", emoji: "🔴" }
};

export default function LightsOut({ onGameOver, onGameStart }) {
  const [difficulty, setDifficulty] = useState("medium");
  const [board, setBoard] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const gridSize = DIFFICULTY_LEVELS[difficulty].size;

  // Initialize a random board with at least one light ON
  const initializeBoard = useCallback(() => {
    let newBoard;
    do {
      newBoard = Array(gridSize).fill().map(() =>
        Array(gridSize).fill(false)
      );

      // Randomly toggle some cells to create a solvable puzzle
      const numToggles = Math.floor(Math.random() * (gridSize * gridSize / 2)) + gridSize;
      for (let i = 0; i < numToggles; i++) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        toggleCellInBoard(newBoard, row, col);
      }
    } while (isBoardSolved(newBoard)); // Ensure at least one light is ON

    return newBoard;
  }, [gridSize]);

  // Toggle a cell and its neighbors in the given board
  const toggleCellInBoard = (board, row, col) => {
    // Toggle the clicked cell
    board[row][col] = !board[row][col];

    // Toggle adjacent cells (up, down, left, right)
    const directions = [
      [-1, 0], // up
      [1, 0],  // down
      [0, -1], // left
      [0, 1]   // right
    ];

    directions.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
        board[newRow][newCol] = !board[newRow][newCol];
      }
    });
  };

  // Check if the board is solved (all lights OFF)
  const isBoardSolved = (board) => {
    return board.every(row => row.every(cell => !cell));
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (gameWon) return;

    // Call onGameStart for the first move
    if (moves === 0 && onGameStart) {
      onGameStart();
    }

    // Start timer on first move
    if (moves === 0) {
      setStartTime(Date.now());
    }

    // Create a copy of the board and toggle the cell
    const newBoard = board.map(row => [...row]);
    toggleCellInBoard(newBoard, row, col);

    setBoard(newBoard);
    setMoves(prev => prev + 1);

    // Check for win condition
    if (isBoardSolved(newBoard)) {
      setGameWon(true);
      const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      const score = calculateScore(moves, timeTaken, gridSize);
      onGameOver(score);
    }

    // Play sound effect
    playToggleSound();
  };

  // Calculate score based on moves, time, and difficulty
  const calculateScore = (moves, timeTaken, gridSize) => {
    // Base score decreases with more moves and time
    const baseScore = 1000;
    const movePenalty = moves * 10;
    const timePenalty = timeTaken * 5;
    const difficultyBonus = gridSize * 50; // Larger grids give more points

    return Math.max(0, baseScore + difficultyBonus - movePenalty - timePenalty);
  };

  // Reset the game
  const resetGame = () => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setMoves(0);
    setGameWon(false);
    setStartTime(null);
  };

  // Change difficulty
  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  // Initialize board when component mounts or difficulty changes
  useEffect(() => {
    resetGame();
  }, [difficulty, initializeBoard]);

  // Sound effect function
  const playToggleSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently fail if Web Audio API is not supported
      console.log("Sound not supported");
    }
  };

  return (
    <div className="text-center">
      {/* Difficulty Selection */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">💡 Lights Out</h2>
        <div className="flex justify-center space-x-4 mb-4">
          {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
            <button
              key={key}
              onClick={() => changeDifficulty(key)}
              disabled={gameWon}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${difficulty === key
                ? `bg-${key === 'easy' ? 'green' : key === 'medium' ? 'yellow' : 'red'}-600 text-white shadow-lg`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {level.emoji} {level.name} ({level.size}×{level.size})
            </button>
          ))}
        </div>
      </div>

      {/* Game Stats */}
      <div className="mb-4 flex justify-center space-x-8 text-sm">
        <div>Moves: <span className="text-blue-400 font-bold">{moves}</span></div>
        {startTime && (
          <div>Time: <span className="text-yellow-400 font-bold">
            {Math.floor((Date.now() - startTime) / 1000)}s
          </span></div>
        )}
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-4 md:mb-6">
        <div
          className="grid gap-1 md:gap-2 p-3 md:p-4 bg-gray-800 rounded-lg shadow-lg"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            maxWidth: gridSize <= 3 ? '240px' : gridSize <= 4 ? '300px' : '360px',
            margin: '0 auto'
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={gameWon}
                className={`
                  w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-md md:rounded-lg border-2 transition-all duration-300 transform
                  ${cell
                    ? 'bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/50 hover:scale-105'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:scale-105'
                  }
                  ${gameWon ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-lg'}
                  active:scale-95
                `}
              >
                {cell && (
                  <div className="w-full h-full rounded-md bg-gradient-to-br from-yellow-200 to-yellow-500 shadow-inner flex items-center justify-center">
                    <div className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-white to-yellow-200 rounded-full shadow-lg opacity-80"></div>
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          🔄 Reset Game
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-blue-400 mb-2">🎯 How to Play</h3>
        <ul className="text-sm text-gray-300 space-y-1 text-left">
          <li>• Click a cell to toggle it and its neighbors</li>
          <li>• Goal: Turn off all the lights (make all cells dark)</li>
          <li>• Yellow cells are ON, gray cells are OFF</li>
          <li>• Use the fewest moves possible for a better score</li>
        </ul>
      </div>

      {/* Win Message */}
      {gameWon && (
        <div className="bg-green-600 text-white p-6 rounded-xl max-w-md mx-auto animate-bounce">
          <h2 className="text-2xl font-bold mb-2">🎉 You Win!</h2>
          <p className="text-lg mb-4">All lights are OFF!</p>
          <div className="text-sm space-y-1">
            <div>Moves taken: <span className="font-bold">{moves}</span></div>
            {startTime && (
              <div>Time: <span className="font-bold">{Math.floor((Date.now() - startTime) / 1000)}s</span></div>
            )}
            <div>Score: <span className="font-bold text-yellow-300">
              {calculateScore(moves, startTime ? Math.floor((Date.now() - startTime) / 1000) : 0, gridSize)}
            </span></div>
          </div>
        </div>
      )}
    </div>
  );
}
