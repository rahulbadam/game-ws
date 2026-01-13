import { useState, useEffect, useRef } from "react";

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

export default function TicTacToe({ onGameOver }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // X = Player, O = AI
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const timeoutRef = useRef(null);
  const playerMovesRef = useRef([]); // track player's X move order
  const aiMovesRef = useRef([]); // track AI's O move order

  /* ---------- WIN CHECK ---------- */
  const checkWinner = (b) => {
    for (let combo of winningCombos) {
      const [a, b1, c] = combo;
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return { player: b[a], combo };
      }
    }
    return null;
  };

  /* ---------- MINIMAX AI ---------- */
  const minimax = (b, isMaximizing) => {
    const result = checkWinner(b);
    if (result?.player === "O") return 10;
    if (result?.player === "X") return -10;
    if (!b.includes(null)) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      b.forEach((cell, i) => {
        if (!cell) {
          b[i] = "O";
          best = Math.max(best, minimax(b, false));
          b[i] = null;
        }
      });
      return best;
    } else {
      let best = Infinity;
      b.forEach((cell, i) => {
        if (!cell) {
          b[i] = "X";
          best = Math.min(best, minimax(b, true));
          b[i] = null;
        }
      });
      return best;
    }
  };

  const getBestMove = (b) => {
    let bestScore = -Infinity;
    let move;

    b.forEach((cell, i) => {
      if (!cell) {
        b[i] = "O";
        const score = minimax(b, false);
        b[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    });
    return move;
  };

  /* ---------- PLAYER CLICK ---------- */
  const handleClick = (index) => {
    if (board[index] || gameOver || !isXNext) return;

    const newBoard = [...board];

    // If player already has 3 Xs, remove the oldest placed X first
    const q = playerMovesRef.current;
    if (q.length >= 3) {
      const oldest = q.shift();
      if (oldest !== undefined) {
        newBoard[oldest] = null;
      }
    }

    newBoard[index] = "X";
    q.push(index);
    playerMovesRef.current = q;

    setBoard(newBoard);
    setIsXNext(false);

    const foundWinner = checkWinner(newBoard);
    if (foundWinner) return endGame(foundWinner);
    if (!newBoard.includes(null)) return endDraw();
  };

  /* ---------- AI MOVE ---------- */
  useEffect(() => {
    if (!isXNext && !gameOver) {
      timeoutRef.current = setTimeout(() => {
        const move = getBestMove([...board]);
        if (move === undefined) return;

        const newBoard = [...board];

        // If AI already has 3 Os, remove the oldest placed O first
        const q = aiMovesRef.current;
        if (q.length >= 3) {
          const oldest = q.shift();
          if (oldest !== undefined) {
            newBoard[oldest] = null;
          }
        }

        newBoard[move] = "O";
        q.push(move);
        aiMovesRef.current = q;

        setBoard(newBoard);
        setIsXNext(true);

        const foundWinner = checkWinner(newBoard);
        if (foundWinner) endGame(foundWinner);
        else if (!newBoard.includes(null)) endDraw();
      }, 500);
    }
  }, [isXNext, board, gameOver]);

  /* ---------- GAME END ---------- */
  const endGame = (foundWinner) => {
    setWinner(foundWinner);
    setGameOver(true);

    timeoutRef.current = setTimeout(() => {
      onGameOver(foundWinner.player === "X" ? -10 : 10);
    }, 1000);
  };

  const endDraw = () => {
    setGameOver(true);
    timeoutRef.current = setTimeout(() => {
      onGameOver(0);
    }, 1000);
  };

  /* ---------- RESTART ---------- */
  const handleRestart = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGameOver(false);
    playerMovesRef.current = [];
    aiMovesRef.current = [];
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const status = winner
    ? `Winner: ${winner.player === "X" ? "You" : "AI"}`
    : gameOver
    ? "Draw"
    : isXNext
    ? "Your Turn (X)"
    : "AI Thinking...";

  return (
    <div>
      <div className="mb-4 text-lg font-semibold">{status}</div>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => {
          const highlight =
            winner?.combo?.includes(i) ? "bg-green-600" : "";
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`w-20 h-20 bg-gray-800 text-3xl font-bold rounded hover:bg-gray-700 ${highlight}`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          Restart
        </button>
      </div>
    </div>
  );
}
