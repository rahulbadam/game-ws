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
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-4xl font-extrabold mb-2">
          🎮 Play Simple Games
        </h1>
        <p className="text-gray-400 mb-8">
          Free browser games. No downloads.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
}
