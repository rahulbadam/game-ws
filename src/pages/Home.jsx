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
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        {/* Authentication Section */}
        {!user && (
          <div className="text-center mb-8 animate-fade-in">
            <div className="bg-gray-900 rounded-2xl p-6 md:p-8 max-w-md mx-auto shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">👤 Welcome to GameWS</h2>
              <p className="text-gray-300 mb-6">
                Sign up for a free account to save your progress and compete on leaderboards!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  📝 Sign Up Free
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  🔐 Log In
                </Link>
              </div>
            </div>
          </div>
        )}



        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            🎮 Play Simple Games
          </h1>
          <p className="text-gray-400 mb-6 md:mb-8 text-lg">
            Free browser games. No downloads.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3">
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
