import { useLeaderboard } from "../useLeaderboard";

export default function Leaderboard({ gameId }) {
  const scores = useLeaderboard(gameId);

  return (
    <div className="leaderboard">
      <h2>Top Scores</h2>
      <ol>
        {scores.map((s, i) => (
          <li>
            {s.username} {s.isGuest && "(Guest)"} — <strong>{s.score}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}
