import { Link } from "react-router-dom";

export default function GameCard({ game }) {
  return (
    <Link to={`/play/${game.id}`}>
      <div className={`
        bg-gradient-to-br ${game.color}
        rounded-2xl p-4 md:p-5 h-40 md:h-48
        transform transition-all duration-300
        hover:scale-105 hover:shadow-2xl
        hover:-translate-y-2
        cursor-pointer
      `}>
        <div className="text-3xl md:text-4xl mb-2 md:mb-3">{game.thumbnail}</div>
        <h2 className="text-lg md:text-xl font-bold">{game.name}</h2>
        <p className="text-xs md:text-sm opacity-80 mt-1">{game.description}</p>

        <div className="mt-3 md:mt-4 text-xs md:text-sm opacity-90">
          ▶ Play Now
        </div>
      </div>
    </Link>
  );
}
