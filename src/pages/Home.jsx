import GameCard from "../components/GameCard";
import { games } from "../data/games";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "../login/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Play Free Online Games | Simple Browser Games</title>
        <meta
          name="description"
          content="Play free online browser games including Snake, Tic Tac Toe, Memory Match and more. No download required."
        />
      </Helmet>
      <div className="min-h-screen bg-black text-white p-3 md:p-8">
        {/* Authentication Section */}
        {!user && (
          <div className="text-center mb-6 md:mb-8 animate-fade-in">
            <div className="bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-8 max-w-sm md:max-w-md mx-auto shadow-2xl">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-blue-400">👤 Welcome to GameWS</h2>
              <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
                Sign up for a free account to save your progress and compete on leaderboards!
              </p>
              <div className="flex flex-col gap-3 md:gap-4">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm md:text-base"
                >
                  📝 Sign Up Free
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 hover:scale-105 text-sm md:text-base"
                >
                  🔐 Log In
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2">
            🎮 Play Simple Games
          </h1>
          <p className="text-gray-400 mb-4 md:mb-6 md:mb-8 text-base md:text-lg px-2">
            Free browser games. No downloads.
          </p>
        </div>

        <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`animate-scale-in animate-stagger-${(index % 5) + 1}`}
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
}
