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
      onGameOver(score);
    }, 10000);

    return () => clearInterval(interval);
  }, [score, onGameOver]);

  return (
    <div className="grid grid-cols-3 gap-2">
      {[...Array(9)].map((_, i) => (
        <button
          key={i}
          onClick={() => {
            if (i === mole) setScore(score + 1);
          }}
          className="w-20 h-20 bg-gray-800 rounded"
        >
          {i === mole ? "🐹" : ""}
        </button>
      ))}
      <p className="col-span-3 text-center mt-2">Score: {score}</p>
    </div>
  );
}
