import { saveScore, getTopScores } from "../services/leaderboard";
import { updateGlobalScore, getGlobalScore } from "../services/globalScore";
import { useState, useEffect, lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import Leaderboard from "../components/Leaderboard";

import { useAuth } from "../login/AuthContext";
import { getUserProfile } from "../login/userService";

// Lazy loaded games
const SnakeGame = lazy(() => import("../games/Snake/SnakeGame"));
const TicTacToe = lazy(() => import("../games/TicTacToe/TicTacToe"));
const RockPaperScissors = lazy(() => import("../games/RockPaperScissors/RockPaperScissors"));
const MemoryMatch = lazy(() => import("../games/MemoryMatch/MemoryMatch"));
const WhackAMole = lazy(() => import("../games/WhackAMole/WhackAMole"));

export default function PlayGame() {
  const { gameId } = useParams(); // ✅ correct routing
  const { user } = useAuth();     // ✅ logged-in or guest user

  const [userProfile, setUserProfile] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [gameOverScore, setGameOverScore] = useState(null);
  const [scores, setScores] = useState([]);
  const [gameKey, setGameKey] = useState(0);
  const [globalScore, setGlobalScore] = useState(0);

  // Load global score
  useEffect(() => {
    setGlobalScore(getGlobalScore());
  }, []);

  // Load user profile and set consistent username
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      // Load username from localStorage for anonymous users
      const savedUsername = localStorage.getItem('gamews_username');
      setCurrentUsername(savedUsername || null);
      return;
    }

    getUserProfile(user.uid).then(profile => {
      setUserProfile(profile);
      // Set consistent username for this session
      const username = profile?.username || (user.isAnonymous ? "Guest" : "Player");
      setCurrentUsername(username);
      // Save to localStorage for consistency
      localStorage.setItem('gamews_username', username);
      console.log("User profile loaded:", profile, "Username:", username);
    }).catch(error => {
      console.error("Failed to load user profile:", error);
      setUserProfile(null);
      // Still set a username for anonymous users
      const username = user.isAnonymous ? "Guest" : "Player";
      setCurrentUsername(username);
      localStorage.setItem('gamews_username', username);
    });
  }, [user]);

  const handleGameOver = async (score) => {
    setGameOverScore(score);

    const newGlobalScore = updateGlobalScore(score);
    setGlobalScore(newGlobalScore);

    // Use consistent username for this session
    const username = currentUsername || (user?.isAnonymous ? "Guest" : "Player");

    try {
      console.log("Saving score:", { gameId, userId: user?.uid, username, score });
      await saveScore(gameId, user?.uid || "anonymous", username, score);
      console.log("Score saved successfully");
    } catch (error) {
      console.error("Failed to save score:", error);
    }

    try {
      const topScores = await getTopScores(gameId);
      console.log("Top scores fetched:", topScores);
      setScores(topScores);
    } catch (error) {
      console.error("Failed to fetch top scores:", error);
    }
  };

  const playAgain = () => {
    setGameOverScore(null);
    setScores([]);
    setGameKey(prev => prev + 1);
  };

  const renderGame = () => {
    switch (gameId) {
      case "snake":
        return <SnakeGame key={gameKey} onGameOver={handleGameOver} />;
      case "tic-tac-toe":
        return <TicTacToe key={gameKey} onGameOver={handleGameOver} />;
      case "rock-paper-scissors":
        return <RockPaperScissors key={gameKey} onGameOver={handleGameOver} />;
      case "memory-match":
        return <MemoryMatch key={gameKey} onGameOver={handleGameOver} />;
      case "whack-a-mole":
        return <WhackAMole key={gameKey} onGameOver={handleGameOver} />;
      default:
        return <p>Game not found</p>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Play {gameId?.replace("-", " ")} | GameWS</title>
      </Helmet>

      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">

        {/* Back Button */}
        <Link
          to="/"
          className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 p-3 rounded-full"
        >
          ←
        </Link>

        {gameOverScore === null ? (
          <Suspense
            fallback={
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                <p className="text-gray-400 mt-2">Loading game...</p>
              </div>
            }
          >
            {renderGame()}
          </Suspense>
        ) : (
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-sm mx-auto">
            <h2 className="text-xl mb-2">Game Over</h2>

            <p className="mb-2 text-green-400 font-bold">
              Score: {gameOverScore}
            </p>

            <p className="mb-2 text-yellow-400 font-bold">
              Total Score: {globalScore}
            </p>

            <h3 className="font-bold mt-4 mb-2">🏆 Leaderboard</h3>
            {scores.map((s, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{s.username}</span>
                <span>{s.score}</span>
              </div>
            ))}

            <button
              onClick={playAgain}
              className="mt-4 w-full bg-green-600 py-2 rounded"
            >
              Play Again
            </button>
          </div>
        )}

        {/* ✅ Dynamic leaderboard */}
        <Leaderboard gameId={gameId} />

        <Footer />
      </div>
    </>
  );
}
