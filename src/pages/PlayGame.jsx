import SnakeGame from "../games/Snake/SnakeGame";
import TicTacToe from "../games/TicTacToe/TicTacToe";
import { saveScore, getTopScores } from "../services/leaderboard";
import { useState } from "react";
import Footer from "../components/Footer";
import RockPaperScissors from "../games/RockPaperScissors/RockPaperScissors";
import MemoryMatch from "../games/MemoryMatch/MemoryMatch";
import WhackAMole from "../games/WhackAMole/WhackAMole";


export default function PlayGame() {
  const [gameOverScore, setGameOverScore] = useState(null);
  const [scores, setScores] = useState([]);

  const handleGameOver = async (game, score) => {
    setGameOverScore(score);
    await saveScore(game, "Guest", score);
    const topScores = await getTopScores(game);
    setScores(topScores);
  };

  const renderGame = () => {
    let gameId = window.location.pathname.split("/").pop();
    switch (gameId) {
      case "snake":
        return (
          <SnakeGame
            onGameOver={(score) => handleGameOver("snake", score)}
          />
        );

      case "tic-tac-toe":
        return (
          <TicTacToe
            onGameOver={(score) => handleGameOver("tic-tac-toe", score)}
          />
        );

      case "rock-paper-scissors":
        return (
          <RockPaperScissors
            onGameOver={(score) => handleGameOver("rock-paper-scissors", score)}
          />
        );

      case "memory-match":
        return (
          <MemoryMatch
            onGameOver={(score) => handleGameOver("memory-match", score)}
          />
        );

      case "whack-a-mole":
        return (
          <WhackAMole
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
        {gameOverScore === null && (
          renderGame()
        )}

        {gameOverScore !== null && (
          <div className="bg-gray-900 p-6 rounded-xl w-80">
            <h2 className="text-xl mb-2">Game Over</h2>
            <p className="mb-2">Score: {gameOverScore}</p>

            <h3 className="font-bold mb-2">🏆 Leaderboard</h3>
            {scores.map((s, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{s.player}</span>
                <span>{s.score}</span>
              </div>
            ))}
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}
