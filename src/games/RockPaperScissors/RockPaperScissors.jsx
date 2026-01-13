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
      <h2 className="text-xl mb-4">Choose One</h2>
      <div className="flex gap-4 justify-center">
        {choices.map(c => (
          <button
            key={c}
            onClick={() => play(c)}
            className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
          >
            {c}
          </button>
        ))}
      </div>
      <p className="mt-4">{result}</p>
    </div>
  );
}
