import { useState } from "react";

// Game configuration for both modes
const GAME_MODES = {
  easy: {
    name: "Easy Mode",
    choices: ["Rock", "Paper", "Scissors"],
    rules: {
      Rock: ["Scissors"],
      Paper: ["Rock"],
      Scissors: ["Paper"]
    },
    description: "Classic Rock Paper Scissors",
    color: "green",
    emoji: "🎮"
  },
  hard: {
    name: "Hard Mode",
    choices: ["Rock", "Paper", "Scissors", "Lizard", "Spock"],
    rules: {
      Rock: ["Scissors", "Lizard"],
      Paper: ["Rock", "Spock"],
      Scissors: ["Paper", "Lizard"],
      Lizard: ["Paper", "Spock"],
      Spock: ["Rock", "Scissors"]
    },
    description: "Rock Paper Scissors Lizard Spock",
    color: "red",
    emoji: "🚀"
  }
};

// Choice icons/emojis
const CHOICE_ICONS = {
  Rock: "🪨",
  Paper: "📄",
  Scissors: "✂️",
  Lizard: "🦎",
  Spock: "🖖"
};

export default function RockPaperScissors({ onGameOver, onGameStart }) {
  const [mode, setMode] = useState("easy");
  const [result, setResult] = useState("");
  const [playerChoice, setPlayerChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [showRules, setShowRules] = useState(false);

  const currentMode = GAME_MODES[mode];

  const determineWinner = (player, computer) => {
    if (player === computer) return "draw";

    // Check if player's choice beats computer's choice
    if (currentMode.rules[player].includes(computer)) {
      return "win";
    }

    return "lose";
  };

  const play = (choice) => {
    // Call onGameStart for the first move
    if (!playerChoice && onGameStart) {
      onGameStart();
    }

    const computer = currentMode.choices[Math.floor(Math.random() * currentMode.choices.length)];
    const gameResult = determineWinner(choice, computer);

    setPlayerChoice(choice);
    setComputerChoice(computer);

    let score = 0;
    let resultText = "";

    if (gameResult === "win") {
      resultText = "You Win!";
      score = 10;
    } else if (gameResult === "lose") {
      resultText = "You Lose!";
      score = -10;
    } else {
      resultText = "It's a Draw!";
      score = 0;
    }

    setResult(resultText);
    onGameOver(score);
  };

  const resetGame = () => {
    setResult("");
    setPlayerChoice("");
    setComputerChoice("");
  };

  return (
    <div className="text-center">
      {/* Mode Selection */}
      <div className="mb-6">
        <div className="flex justify-center space-x-4 mb-4">
          {Object.entries(GAME_MODES).map(([key, modeData]) => (
            <button
              key={key}
              onClick={() => {
                setMode(key);
                resetGame();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${mode === key
                ? `bg-${modeData.color}-600 text-white shadow-lg`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {modeData.emoji} {modeData.name}
            </button>
          ))}
        </div>

        {/* Mode Badge */}
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${mode === 'hard' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}>
          {currentMode.name}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-bold text-blue-400 mb-2">
          {currentMode.emoji} {currentMode.description}
        </h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p className="text-left max-w-md mx-auto">
            {mode === 'easy' ? (
              <>
                <strong>Rules:</strong><br />
                • Rock beats Scissors<br />
                • Scissors beats Paper<br />
                • Paper beats Rock
              </>
            ) : (
              <>
                <strong>Rules:</strong><br />
                • Rock beats Scissors & Lizard<br />
                • Paper beats Rock & Spock<br />
                • Scissors beats Paper & Lizard<br />
                • Lizard beats Paper & Spock<br />
                • Spock beats Rock & Scissors
              </>
            )}
          </p>
          <button
            onClick={() => setShowRules(!showRules)}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            {showRules ? 'Hide' : 'Show'} detailed rules
          </button>
        </div>

        {showRules && mode === 'hard' && (
          <div className="mt-4 p-3 bg-gray-700 rounded text-xs text-left max-w-md mx-auto">
            <p className="text-yellow-400 font-semibold mb-2">🤔 Why Lizard & Spock?</p>
            <p className="text-gray-300">
              This expanded version was popularized by The Big Bang Theory.
              It eliminates the "rock-paper-scissors-rock" loop that can occur
              in the classic version, making the game more balanced.
            </p>
          </div>
        )}
      </div>

      {/* Game Choices */}
      <div className="mb-6">
        <h2 className="text-base md:text-lg lg:text-xl mb-3 md:mb-4">Choose Your Move</h2>
        <div className={`grid gap-2 md:gap-3 justify-center ${currentMode.choices.length === 3 ? 'grid-cols-3 max-w-xs md:max-w-sm' :
            currentMode.choices.length === 5 ? 'grid-cols-3 max-w-sm md:max-w-md' : 'grid-cols-4'
          }`}>
          {currentMode.choices.map(choice => (
            <button
              key={choice}
              onClick={() => play(choice)}
              className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 px-2 py-3 md:px-3 md:py-4 rounded-lg transition-all duration-200 hover:scale-105 flex flex-col items-center space-y-1 min-h-[60px] md:min-h-[70px]"
              disabled={result !== ""}
            >
              <span className="text-xl md:text-2xl">{CHOICE_ICONS[choice]}</span>
              <span className="text-xs md:text-sm font-medium leading-tight">{choice}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Game Result */}
      {result && (
        <div className="bg-gray-800 rounded-lg p-6 mb-4 animate-fade-in">
          <h3 className="text-xl font-bold mb-4">{result}</h3>

          <div className="flex justify-center items-center space-x-8 mb-4">
            <div className="text-center">
              <div className="text-4xl mb-2">{CHOICE_ICONS[playerChoice]}</div>
              <p className="text-sm text-blue-400 font-medium">You</p>
              <p className="text-xs text-gray-400">{playerChoice}</p>
            </div>

            <div className="text-2xl text-gray-500">VS</div>

            <div className="text-center">
              <div className="text-4xl mb-2">{CHOICE_ICONS[computerChoice]}</div>
              <p className="text-sm text-red-400 font-medium">Computer</p>
              <p className="text-xs text-gray-400">{computerChoice}</p>
            </div>
          </div>

          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Score Info */}
      <div className="text-xs text-gray-400 mt-4">
        <p>Win: +10 points • Lose: -10 points • Draw: 0 points</p>
      </div>
    </div>
  );
}
