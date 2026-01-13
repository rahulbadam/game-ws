import { Link } from "react-router-dom";

export default function GameCard({ game }) {
  return (
    <Link to={`/play/${game.id}`}>
      <div className={`
        bg-gradient-to-br ${game.color}
        rounded-2xl p-4 md:p-5 h-40 md:h-48
        transform transition-all duration-500 ease-out
        hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25
        hover:-translate-y-2
        cursor-pointer
        relative overflow-hidden
        group
      `}>
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-shimmer transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="text-3xl md:text-4xl mb-2 md:mb-3">{game.thumbnail}</div>
          <h2 className="text-lg md:text-xl font-bold group-hover:text-white transition-colors duration-300">
            {game.name}
          </h2>
          <p className="text-xs md:text-sm opacity-80 mt-1 group-hover:opacity-100 transition-opacity duration-300">
            {game.description}
          </p>

          <div className="mt-3 md:mt-4 text-xs md:text-sm opacity-90 font-medium group-hover:scale-110 transform transition-all duration-300 inline-block">
            ▶ Play Now
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow pointer-events-none"></div>
      </div>
    </Link>
  );
}
