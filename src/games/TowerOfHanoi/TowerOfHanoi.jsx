import { useState, useEffect, useCallback } from "react";

const DIFFICULTY_LEVELS = {
  easy: { disks: 3, name: "Easy" },
  medium: { disks: 4, name: "Medium" },
  hard: { disks: 5, name: "Hard" }
};

const ROD_HEIGHT = 320;
const ROD_WIDTH = 24;
const BASE_HEIGHT = 25;
const DISK_HEIGHT = 28;

export default function TowerOfHanoi({ onGameOver, onGameStart }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [rods, setRods] = useState([]);
  const [selectedRod, setSelectedRod] = useState(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Initialize game with selected difficulty
  const initializeGame = useCallback((diff = difficulty) => {
    const numDisks = DIFFICULTY_LEVELS[diff].disks;
    // Create rods: [ [disks], [], [] ]
    const initialRods = [
      Array.from({ length: numDisks }, (_, i) => numDisks - i), // Largest to smallest
      [],
      []
    ];

    setRods(initialRods);
    setSelectedRod(null);
    setMoves(0);
    setStartTime(null);
    setGameComplete(false);
    setShowCompletionModal(false);
  }, [difficulty]);

  // Initialize game on mount and difficulty change
  useEffect(() => {
    initializeGame(difficulty);
  }, [difficulty, initializeGame]);

  // Check if game is complete (all disks on third rod)
  useEffect(() => {
    if (rods.length > 0 && rods[2].length === DIFFICULTY_LEVELS[difficulty].disks) {
      setGameComplete(true);
      setShowCompletionModal(true);
    }
  }, [rods, difficulty]);

  // Handle rod click
  const handleRodClick = (rodIndex) => {
    if (gameComplete) return;

    // If no rod is selected, select this rod (if it has disks)
    if (selectedRod === null) {
      if (rods[rodIndex].length > 0) {
        setSelectedRod(rodIndex);
      }
    } else {
      // If same rod clicked, deselect
      if (selectedRod === rodIndex) {
        setSelectedRod(null);
      } else {
        // Try to move disk from selected rod to this rod
        const diskToMove = rods[selectedRod][rods[selectedRod].length - 1];
        const targetTopDisk = rods[rodIndex][rods[rodIndex].length - 1];

        // Valid move: empty target rod OR disk is smaller than target top disk
        if (rods[rodIndex].length === 0 || diskToMove < targetTopDisk) {
          // Call onGameStart for the first move
          if (moves === 0 && onGameStart) {
            onGameStart();
          }
          moveDisk(selectedRod, rodIndex);
        } else {
          // Invalid move - could add visual feedback here
          console.log("Invalid move!");
        }
      }
      setSelectedRod(null);
    }
  };

  const moveDisk = (fromRod, toRod) => {
    setRods(prevRods => {
      const newRods = prevRods.map(rod => [...rod]);
      const disk = newRods[fromRod].pop();
      newRods[toRod].push(disk);
      return newRods;
    });

    setMoves(prev => {
      const newMoves = prev + 1;
      // Start timer on first move
      if (newMoves === 1) {
        setStartTime(Date.now());
      }
      return newMoves;
    });
  };

  // Calculate score
  const calculateScore = () => {
    const minMoves = Math.pow(2, DIFFICULTY_LEVELS[difficulty].disks) - 1;
    const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    const score = Math.max(0, 1000 - (moves - minMoves) * 20 - timeTaken);
    return { score, minMoves, timeTaken };
  };

  const handleGameComplete = () => {
    const { score, minMoves, timeTaken } = calculateScore();
    onGameOver(score); // Send score to parent component
  };

  const handleRestart = () => {
    initializeGame(difficulty);
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= 3) {
        handleRodClick(key - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedRod, rods, gameComplete]);

  return (
    <div className="text-center">
      {/* Difficulty Selection */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">🗼 Tower of Hanoi</h2>
        <div className="flex justify-center space-x-4 mb-4">
          {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
            <button
              key={key}
              onClick={() => handleDifficultyChange(key)}
              disabled={gameComplete}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${difficulty === key
                ? `bg-${key === 'easy' ? 'green' : key === 'medium' ? 'yellow' : 'red'}-600 text-white shadow-lg`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {level.name} ({level.disks} disks)
            </button>
          ))}
        </div>
      </div>

      {/* Game Stats */}
      <div className="mb-4 flex justify-center space-x-8 text-sm">
        <div>Moves: <span className="text-blue-400 font-bold">{moves}</span></div>
        <div>Min Moves: <span className="text-green-400 font-bold">{Math.pow(2, DIFFICULTY_LEVELS[difficulty].disks) - 1}</span></div>
        {startTime && (
          <div>Time: <span className="text-yellow-400 font-bold">
            {Math.floor((Date.now() - startTime) / 1000)}s
          </span></div>
        )}
      </div>

      {/* Game Board */}
      <div className="flex justify-center items-end space-x-8 mb-8 relative">
        {/* Wooden Table Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg shadow-2xl"
          style={{ width: '100%', height: ROD_HEIGHT + BASE_HEIGHT + 40, marginTop: -20 }} />

        {rods.map((rod, rodIndex) => (
          <div
            key={rodIndex}
            className={`relative cursor-pointer transition-all duration-200 ${selectedRod === rodIndex ? 'scale-110' : 'hover:scale-105'
              }`}
            onClick={() => handleRodClick(rodIndex)}
            style={{ width: ROD_WIDTH + 80, height: ROD_HEIGHT + BASE_HEIGHT }}
          >
            {/* Base - Wooden pedestal */}
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-amber-700 to-amber-900 border-4 border-amber-600 rounded-lg shadow-lg"
              style={{ width: ROD_WIDTH + 60, height: BASE_HEIGHT }}
            />
            {/* Base wood grain effect */}
            <div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-800/50 to-amber-600/50 rounded"
              style={{ width: ROD_WIDTH + 50, height: 3 }}
            />

            {/* Rod - Polished metal pole */}
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-slate-300 to-slate-500 border-2 rounded-t-full shadow-lg transition-all duration-300 ${selectedRod === rodIndex
                ? 'border-cyan-400 shadow-cyan-400/50 shadow-lg from-cyan-200 to-cyan-400'
                : 'border-slate-400 shadow-slate-600/30'
                }`}
              style={{ width: ROD_WIDTH, height: ROD_HEIGHT, borderRadius: `${ROD_WIDTH / 2}px ${ROD_WIDTH / 2}px 0 0` }}
            />
            {/* Rod highlight for realism */}
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full"
              style={{ width: ROD_WIDTH - 4, height: ROD_HEIGHT - 10, borderRadius: `${(ROD_WIDTH - 4) / 2}px ${(ROD_WIDTH - 4) / 2}px 0 0` }}
            />

            {/* Disks - Colorful wooden rings */}
            {rod.map((disk, diskIndex) => {
              const diskWidth = 50 + (disk * 18); // Larger disks are wider
              const bottomPosition = BASE_HEIGHT + (diskIndex * DISK_HEIGHT);
              const diskColors = [
                'from-red-400 to-red-600 border-red-500',      // Disk 1 - Red
                'from-orange-400 to-orange-600 border-orange-500', // Disk 2 - Orange
                'from-yellow-400 to-yellow-600 border-yellow-500', // Disk 3 - Yellow
                'from-green-400 to-green-600 border-green-500',   // Disk 4 - Green
                'from-blue-400 to-blue-600 border-blue-500'      // Disk 5 - Blue
              ];

              return (
                <div
                  key={`${disk}-${diskIndex}`}
                  className={`absolute left-1/2 transform -translate-x-1/2 border-3 rounded-lg transition-all duration-300 shadow-lg ${selectedRod === rodIndex && diskIndex === rod.length - 1
                    ? `bg-gradient-to-b ${diskColors[disk - 1]} border-yellow-300 scale-110 shadow-yellow-400/50`
                    : `bg-gradient-to-b ${diskColors[disk - 1]} border-gray-600 shadow-gray-800/50`
                    }`}
                  style={{
                    width: diskWidth,
                    height: DISK_HEIGHT - 2,
                    bottom: bottomPosition,
                    zIndex: diskIndex + 1,
                    boxShadow: selectedRod === rodIndex && diskIndex === rod.length - 1
                      ? '0 8px 25px rgba(255, 255, 0, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3)'
                      : '0 4px 15px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {/* Disk inner shadow for depth */}
                  <div className="absolute inset-1 bg-gradient-to-b from-transparent to-black/20 rounded-md" />
                  {/* Disk highlight for realism */}
                  <div className="absolute top-1 left-2 right-2 h-2 bg-white/30 rounded-full" />
                </div>
              );
            })}

            {/* Rod Label */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-sm font-bold text-white bg-gray-800 px-2 py-1 rounded shadow-lg">
              {rodIndex + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-blue-400 mb-2">🎯 How to Play</h3>
        <ul className="text-sm text-gray-300 space-y-1 text-left">
          <li>• Click a rod to select the top disk</li>
          <li>• Click another rod to place the disk</li>
          <li>• Larger disks cannot be placed on smaller ones</li>
          <li>• Move all disks to the rightmost rod</li>
          <li>• Use keyboard: Press 1, 2, 3 to select rods</li>
        </ul>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl max-w-md mx-4">
            <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 Congratulations!</h2>

            {(() => {
              const { score, minMoves, timeTaken } = calculateScore();
              return (
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span>Moves Taken:</span>
                    <span className="font-bold text-blue-400">{moves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Moves:</span>
                    <span className="font-bold text-green-400">{minMoves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Taken:</span>
                    <span className="font-bold text-yellow-400">{timeTaken}s</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3 mt-4">
                    <div className="flex justify-between text-xl">
                      <span>Final Score:</span>
                      <span className="font-bold text-purple-400">{score}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleRestart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                🔄 Restart
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                📊 View Stats
              </button>
            </div>

            <button
              onClick={() => {
                setShowCompletionModal(false);
                handleGameComplete();
              }}
              className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              ✅ Continue
            </button>
          </div>
        </div>
      )}

      {/* Game Complete Message */}
      {gameComplete && !showCompletionModal && (
        <div className="text-center">
          <div className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-bold animate-pulse">
            🎉 Game Complete! Check the completion modal for your score.
          </div>
        </div>
      )}
    </div>
  );
}
