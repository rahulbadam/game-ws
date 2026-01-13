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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      {gameOverScore === null && (
        <>
          if (gameId === "snake")
          return <SnakeGame onGameOver={(score) => handleGameOver("snake", score)} />

          if (gameId === "tic-tac-toe")
          return <TicTacToe
            onGameOver={(score) =>
              handleGameOver("tic-tac-toe", score)
            }
          />

          if (gameId === "rock-paper-scissors")
          return <RockPaperScissors onGameOver={(s) => handleGameOver(gameId, s)} />;

          if (gameId === "memory-match")
          return <MemoryMatch onGameOver={(s) => handleGameOver(gameId, s)} />;

          if (gameId === "whack-a-mole")
          return <WhackAMole onGameOver={(s) => handleGameOver(gameId, s)} />;

        </>
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
  );
}
