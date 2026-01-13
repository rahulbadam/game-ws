import { useEffect, useState } from "react";

export default function WhackAMole({ onGameOver }) {
  const [mole, setMole] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMole(Math.floor(Math.random() * 9));
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      onGameOver(10); // +10 for completing the game
    }, 10000);

    return () => clearInterval(interval);
  }, [score, onGameOver]);

  return (
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
      {[...Array(9)].map((_, i) => (
        <button
          key={i}
          onClick={() => {
            if (i === mole) setScore(score + 1);
          }}
          className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded text-xl md:text-2xl"
        >
          {i === mole ? "🐹" : ""}
        </button>
      ))}
      <p className="col-span-3 text-center mt-2 text-sm md:text-base">Score: {score}</p>
    </div>
  );
}
