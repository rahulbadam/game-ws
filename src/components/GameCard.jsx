import { Link } from "react-router-dom";

export default function GameCard({ game }) {
  return (
    <Link to={`/play/${game.id}`}>
      <div className={`
        bg-gradient-to-br ${game.color}
        rounded-2xl p-5 h-48
        transform transition-all duration-300
        hover:scale-105 hover:shadow-2xl
        hover:-translate-y-2
        cursor-pointer
      `}>
        <div className="text-4xl mb-3">{game.thumbnail}</div>
        <h2 className="text-xl font-bold">{game.name}</h2>
        <p className="text-sm opacity-80 mt-1">{game.description}</p>

        <div className="mt-4 text-sm opacity-90">
          ▶ Play Now
        </div>
      </div>
    </Link>
  );
}
