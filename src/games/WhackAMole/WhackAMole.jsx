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
    <div>
      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4 text-center">
        <h3 className="text-lg font-bold text-yellow-400 mb-2">🐹 Whack a Mole – How to Play</h3>
        <ul className="text-sm text-gray-300 space-y-1 text-left max-w-md mx-auto">
          <li>• Click on the mole (🐹) when it appears in the holes</li>
          <li>• Each successful hit scores points</li>
          <li>• Game lasts for 10 seconds - try to get the highest score!</li>
        </ul>
        <p className="text-xs text-gray-400 mt-2 italic">
          Whack a Mole is a fast-paced arcade game that tests your reflexes and hand-eye coordination.
        </p>
      </div>

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
    </div>
  );
}
