import SnakeGame from "../games/Snake/SnakeGame";
import TicTacToe from "../games/TicTacToe/TicTacToe";
import { saveScore, getTopScores } from "../services/leaderboard";
import { updateGlobalScore, getGlobalScore } from "../services/globalScore";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import RockPaperScissors from "../games/RockPaperScissors/RockPaperScissors";
import MemoryMatch from "../games/MemoryMatch/MemoryMatch";
import WhackAMole from "../games/WhackAMole/WhackAMole";
import { Helmet } from "react-helmet-async";

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

      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        {gameOverScore === null ? (
          renderGame()
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
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-once"
            >
              🔄 Play Again
            </button>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}
