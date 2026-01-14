import { updateGlobalScore, getGlobalTopScores, getUserGlobalScore } from "../services/leaderboard";
import { useState, useEffect, lazy, Suspense } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import Leaderboard from "../components/Leaderboard";

import { useAuth } from "../login/AuthContext";
import { getUserProfile } from "../login/userService";
import { games } from "../data/games";

// Lazy loaded games
const SnakeGame = lazy(() => import("../games/Snake/SnakeGame"));
const TicTacToe = lazy(() => import("../games/TicTacToe/TicTacToe"));
const RockPaperScissors = lazy(() => import("../games/RockPaperScissors/RockPaperScissors"));
const MemoryMatch = lazy(() => import("../games/MemoryMatch/MemoryMatch"));
const WhackAMole = lazy(() => import("../games/WhackAMole/WhackAMole"));
const TowerOfHanoi = lazy(() => import("../games/TowerOfHanoi/TowerOfHanoi"));
const LightsOut = lazy(() => import("../games/LightsOut/LightsOut"));

export default function PlayGame() {
  const { gameId } = useParams(); // ✅ correct routing
  const { user } = useAuth();     // ✅ logged-in or guest user
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [gameOverScore, setGameOverScore] = useState(null);
  const [scores, setScores] = useState([]);
  const [gameKey, setGameKey] = useState(0);
  const [canAccessGame, setCanAccessGame] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  // Get current game data
  const currentGame = games.find(g => g.id === gameId);

  // Check if user can access this game
  useEffect(() => {
    const checkGameAccess = async () => {
      if (!currentGame) {
        setCanAccessGame(false);
        setCheckingAccess(false);
        return;
      }

      // Snake is always accessible, even with negative scores
      if (currentGame.id === 'snake') {
        setCanAccessGame(true);
        setCheckingAccess(false);
        return;
      }

      // If game doesn't require coins, allow access
      if (!currentGame.requiresCoins) {
        setCanAccessGame(true);
        setCheckingAccess(false);
        return;
      }

      // If user is not logged in, deny access
      if (!user) {
        setCanAccessGame(false);
        setCheckingAccess(false);
        return;
      }

      // Check user's coin balance
      try {
        const scoreData = await getUserGlobalScore(user.uid);
        const userCoins = scoreData.score || 0;
        setCanAccessGame(userCoins >= currentGame.entryFee);
      } catch (error) {
        console.error("Failed to check user coins:", error);
        setCanAccessGame(false);
      }

      setCheckingAccess(false);
    };

    checkGameAccess();
  }, [currentGame, user]);

  // Redirect if user can't access game
  useEffect(() => {
    if (!checkingAccess && !canAccessGame && currentGame) {
      // Show error message and redirect
      setTimeout(() => {
        if (window.snackbarContext) {
          window.snackbarContext.showError(`Not enough coins! Need ${currentGame.entryFee} coins to play ${currentGame.name}.`);
        }
        navigate('/');
      }, 1000);
    }
  }, [checkingAccess, canAccessGame, currentGame, navigate]);

  // Load user profile and set consistent username
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setCurrentUsername(null);
      return;
    }

    getUserProfile(user.uid).then(profile => {
      setUserProfile(profile);
      // Set consistent username for this session
      const username = profile?.username || (user.isAnonymous ? "Guest" : "Player");
      setCurrentUsername(username);
      console.log("User profile loaded:", profile, "Username:", username);
    }).catch(error => {
      console.error("Failed to load user profile:", error);
      setUserProfile(null);
      // Still set a username for anonymous users
      const username = user.isAnonymous ? "Guest" : "Player";
      setCurrentUsername(username);
    });
  }, [user]);

  const handleGameOver = async (result) => {
    // result can be: { type: 'win' | 'loss', score: number } or just a score number
    const score = typeof result === 'object' ? result.score : result;
    const isWin = typeof result === 'object' ? result.type === 'win' : score > 0;
    const gameResult = isWin ? 'win' : 'loss';

    setGameOverScore(score);

    if (user) {
      // Use consistent username for this session
      const username = currentUsername || (user.isAnonymous ? "Guest" : "Player");

      try {
        console.log("Updating global score:", { gameId, userId: user.uid, username, gameResult });

        // Update global score with win/loss penalty system
        await updateGlobalScore(user.uid, username, {
          type: gameResult,
          countAsGame: true // This counts as a game played
        });

        console.log("Global score updated successfully");
      } catch (error) {
        console.error("Failed to update global score:", error);
      }
    }

    // Get updated global leaderboard
    try {
      const topScores = await getGlobalTopScores();
      console.log("Global leaderboard fetched:", topScores);
      setScores(topScores);
    } catch (error) {
      console.error("Failed to fetch global leaderboard:", error);
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
      case "tower-of-hanoi":
        return <TowerOfHanoi key={gameKey} onGameOver={handleGameOver} />;
      case "lights-out":
        return <LightsOut key={gameKey} onGameOver={handleGameOver} />;
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

        {checkingAccess ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="text-gray-400 mt-2">Checking access...</p>
          </div>
        ) : !canAccessGame ? (
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-400 mb-6">
              You need {currentGame?.entryFee} coins to play {currentGame?.name}.
            </p>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Return to Games
            </Link>
          </div>
        ) : gameOverScore === null ? (
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

            <p className="mb-4 text-green-400 font-bold">
              Score: {gameOverScore}
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
