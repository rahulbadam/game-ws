import { useState } from "react";

const symbols = ["🍎", "🍌", "🍇", "🍒", "🍑", "🍊"];

export default function MemoryMatch({ onGameOver }) {
  const shuffled = [...symbols, ...symbols].sort(() => 0.5 - Math.random());
  const [cards, setCards] = useState(shuffled);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  const flip = (i) => {
    if (flipped.length === 2 || flipped.includes(i)) return;
    const newFlipped = [...flipped, i];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (cards[a] === cards[b]) {
        setMatched([...matched, cards[a]]);
        if (matched.length + 1 === symbols.length) onGameOver(10);
      }
      setTimeout(() => setFlipped([]), 700);
    }
  };

  return (
    <div>
      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4 text-center">
        <h3 className="text-lg font-bold text-purple-400 mb-2">🧠 Memory Match – How to Play</h3>
        <ul className="text-sm text-gray-300 space-y-1 text-left max-w-md mx-auto">
          <li>• Click cards to flip them and reveal fruits</li>
          <li>• Find matching pairs of identical fruits</li>
          <li>• Match all pairs to complete the game</li>
        </ul>
        <p className="text-xs text-gray-400 mt-2 italic">
          Memory Match is a challenging puzzle game that tests and improves your memory and concentration skills.
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-w-xs mx-auto">
        {cards.map((c, i) => (
          <button
            key={i}
            onClick={() => flip(i)}
            className="w-14 h-14 md:w-16 md:h-16 bg-gray-800 text-xl md:text-2xl rounded"
          >
            {flipped.includes(i) || matched.includes(c) ? c : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
}
