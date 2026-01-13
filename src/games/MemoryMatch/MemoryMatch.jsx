import { useState } from "react";

const symbols = ["🍎","🍌","🍇","🍒"];

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
        if (matched.length + 1 === symbols.length) onGameOver(20);
      }
      setTimeout(() => setFlipped([]), 700);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {cards.map((c, i) => (
        <button
          key={i}
          onClick={() => flip(i)}
          className="w-16 h-16 bg-gray-800 text-2xl rounded"
        >
          {flipped.includes(i) || matched.includes(c) ? c : "❓"}
        </button>
      ))}
    </div>
  );
}
