import GameCard from "../components/GameCard";
import { games } from "../data/games";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

export default function Home() {
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
