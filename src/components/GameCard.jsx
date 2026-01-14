import { Link } from "react-router-dom";
import { useAuth } from "../login/AuthContext";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function GameCard({ game }) {
  const { user } = useAuth();
  const [userScore, setUserScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = null;

    if (user) {
      // Set up real-time listener for user's global score
      const scoreRef = doc(db, "global_scores", user.uid);
      unsubscribe = onSnapshot(scoreRef, (doc) => {
        if (doc.exists()) {
          const scoreData = doc.data();
          setUserScore(scoreData.score || 0);
        } else {
          setUserScore(0);
        }
        setLoading(false);
      }, (error) => {
        console.error("Failed to listen to score changes:", error);
        setUserScore(0);
        setLoading(false);
      });
    } else {
      setUserScore(0);
      setLoading(false);
    }

    // Cleanup listener on unmount or user change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const hasEnoughCoins = !game.requiresCoins || userScore >= game.entryFee;
  const isDisabled = loading || !hasEnoughCoins;
  const isSnake = game.id === 'snake'; // Snake is always accessible

  const cardContent = (
    <div className={`
      bg-gradient-to-br ${game.color}
      rounded-2xl p-4 md:p-5 h-40 md:h-48
      transform transition-all duration-500 ease-out
      ${!isDisabled ? 'hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-2 cursor-pointer' : 'cursor-not-allowed opacity-60'}
      relative overflow-hidden
      group
    `}>
      {/* Shimmer effect on hover (only if not disabled) */}
      {!isDisabled && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-shimmer transition-opacity duration-300"></div>
      )}

      <div className="relative z-10 h-full">
        {/* Top right play button - absolutely positioned */}
        <div className="absolute top-3 right-3 z-20">
          {loading ? (
            <span className="text-gray-200 bg-gray-800/90 px-2 py-1 rounded text-xs md:text-sm font-medium shadow-lg">
              Loading...
            </span>
          ) : hasEnoughCoins ? (
            <span className={`text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg text-xs md:text-sm font-bold ${!isDisabled ? 'group-hover:scale-110 group-hover:bg-black/90 transform' : ''}`}>
              ▶ Play Now
            </span>
          ) : (
            <span className="text-red-300 font-bold bg-red-900/90 px-2 py-1 rounded text-xs md:text-sm shadow-lg">
              🔒 Need {game.entryFee - userScore} more
            </span>
          )}
        </div>

        {/* Main content - full width, no padding */}
        <div>
          <div className="text-3xl md:text-4xl mb-2 md:mb-3">{game.thumbnail}</div>
          <h2 className={`text-lg md:text-xl font-bold transition-colors duration-300 ${!isDisabled ? 'group-hover:text-white' : 'text-gray-300'
            }`}>
            {game.name}
          </h2>
          <p className={`text-xs md:text-sm mt-1 transition-opacity duration-300 ${!isDisabled ? 'opacity-80 group-hover:opacity-100' : 'opacity-60'
            }`}>
            {game.description}
          </p>

          {/* Entry Fee Display */}
          {game.entryFee > 0 && (
            <div className="mt-2 flex items-center space-x-1">
              <span className="text-yellow-400 text-sm">💰</span>
              <span className={`text-xs font-bold ${hasEnoughCoins ? 'text-yellow-300' : 'text-red-400'
                }`}>
                Entry: {game.entryFee} coins
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Glow effect (only if not disabled) */}
      {!isDisabled && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow pointer-events-none"></div>
      )}

      {/* Disabled overlay */}
      {isDisabled && !loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <span className="text-white text-2xl">🔒</span>
            <p className="text-white text-xs mt-1 font-bold">
              {game.entryFee - userScore} coins needed
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return hasEnoughCoins ? (
    <Link to={`/play/${game.id}`}>
      {cardContent}
    </Link>
  ) : (
    <div onClick={() => {/* Do nothing - disabled */ }}>
      {cardContent}
    </div>
  );
}
