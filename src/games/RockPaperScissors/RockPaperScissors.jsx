import { useState } from "react";

const choices = ["Rock", "Paper", "Scissors"];

export default function RockPaperScissors({ onGameOver }) {
  const [result, setResult] = useState("");

  const play = (choice) => {
    const computer = choices[Math.floor(Math.random() * 3)];

    if (choice === computer) setResult("Draw");
    else if (
      (choice === "Rock" && computer === "Scissors") ||
      (choice === "Paper" && computer === "Rock") ||
      (choice === "Scissors" && computer === "Paper")
    ) {
      setResult("You Win!");
      onGameOver(10);
    } else {
      setResult("You Lose!");
      onGameOver(2);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-lg md:text-xl mb-4">Choose One</h2>
      <div className="flex gap-2 md:gap-4 justify-center flex-wrap">
        {choices.map(c => (
          <button
            key={c}
            onClick={() => play(c)}
            className="bg-gray-800 px-3 py-2 md:px-4 md:py-2 rounded text-sm md:text-base hover:bg-gray-700"
          >
            {c}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm md:text-base">{result}</p>
    </div>
  );
}
