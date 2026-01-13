import { saveScore, getTopScores } from "../services/leaderboard";
import { updateGlobalScore, getGlobalScore } from "../services/globalScore";
import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

// Lazy load all game components
const SnakeGame = lazy(() => import("../games/Snake/SnakeGame"));
const TicTacToe = lazy(() => import("../games/TicTacToe/TicTacToe"));
const RockPaperScissors = lazy(() => import("../games/RockPaperScissors/RockPaperScissors"));
const MemoryMatch = lazy(() => import("../games/MemoryMatch/MemoryMatch"));
const WhackAMole = lazy(() => import("../games/WhackAMole/WhackAMole"));

export default function PlayGame() {
  const [gameOverScore, setGameOverScore] = useState(null);
  const [scores, setScores] = useState([]);
  const [gameKey, setGameKey] = useState(0); // Force re-render of game component
  const [globalScore, setGlobalScore] = useState(0);

  useEffect(() => {
    setGlobalScore(getGlobalScore());
  }, []);

  const handleGameOver = async (game, score) => {
    setGameOverScore(score);
    // Update global score
    const newGlobalScore = updateGlobalScore(score);
    setGlobalScore(newGlobalScore);

    await saveScore(game, "Guest", score);
    const topScores = await getTopScores(game);
    setScores(topScores);
  };

  const playAgain = () => {
    setGameOverScore(null);
    setScores([]);
    setGameKey(prev => prev + 1); // Force game component to reset
  };

  const renderGame = () => {
    let gameId = window.location.pathname.split("/").pop();
    switch (gameId) {
      case "snake":
        return (
          <SnakeGame
            key={gameKey}
            onGameOver={(score) => handleGameOver("snake", score)}
          />
        );

      case "tic-tac-toe":
        return (
          <TicTacToe
            key={gameKey}
            onGameOver={(score) => handleGameOver("tic-tac-toe", score)}
          />
        );

      case "rock-paper-scissors":
        return (
          <RockPaperScissors
            key={gameKey}
            onGameOver={(score) => handleGameOver("rock-paper-scissors", score)}
          />
        );

      case "memory-match":
        return (
          <MemoryMatch
            key={gameKey}
            onGameOver={(score) => handleGameOver("memory-match", score)}
          />
        );

      case "whack-a-mole":
        return (
          <WhackAMole
            key={gameKey}
            onGameOver={(score) => handleGameOver("whack-a-mole", score)}
          />
        );

      default:
        return null;
    }
  };


  return (
    <>
      <Helmet>
        <title>Play Game</title>
      </Helmet>

      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
        {/* Back Button - Fixed Position */}
        <Link
          to="/"
          className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-fade-in"
          title="Back to Home"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>

        {gameOverScore === null ? (
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              <p className="text-gray-400 animate-pulse">Loading game...</p>
            </div>
          }>
            {renderGame()}
          </Suspense>
        ) : (
          <div className="bg-gray-900 p-4 md:p-6 rounded-xl w-full max-w-sm mx-auto animate-fade-in">
            <h2 className="text-lg md:text-xl mb-2">Game Over</h2>
            <div className="mb-3">
              {gameOverScore > 0 && <p className="text-green-400 font-bold text-lg">🎉 You Won!</p>}
              {gameOverScore < 0 && <p className="text-red-400 font-bold text-lg">😞 You Lose!</p>}
              {gameOverScore === 0 && <p className="text-yellow-400 font-bold text-lg">🤝 Draw!</p>}
            </div>
            <p className="mb-1 text-sm md:text-base">Game Score: {gameOverScore}</p>
            <p className="mb-2 text-sm md:text-base font-bold text-yellow-400">🏆 Total Score: {globalScore}</p>

            <h3 className="font-bold mb-2 text-sm md:text-base">🏆 Leaderboard</h3>
            {scores.map((s, i) => (
              <div key={i} className="flex justify-between text-xs md:text-sm">
                <span>{s.player}</span>
                <span>{s.score}</span>
              </div>
            ))}

            <button
              onClick={playAgain}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transform transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-green-500/50 animate-bounce-gentle relative overflow-hidden group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-shimmer"></div>
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span className="animate-spin-once">🔄</span>
                <span>Play Again</span>
              </span>
            </button>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}
