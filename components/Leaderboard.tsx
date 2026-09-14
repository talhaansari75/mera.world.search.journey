import React, { useEffect, useState } from 'react';

interface LeaderboardEntry {
  userId: string;
  score: number;
  level: number;
  timestamp: number;
}

export default function Leaderboard() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        if (data.success) {
          setScores(data.data);
        }
      } catch (error) {
        console.error('Failed to load leaderboard', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="leaderboard-container p-4 bg-slate-800 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Top Players</h2>
      <ul>
        {scores.map((entry, index) => (
          <li key={entry.userId} className="flex justify-between py-2 border-b border-slate-700">
            <span>{index + 1}. {entry.userId}</span>
            <span>Score: {entry.score} (Level {entry.level})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
