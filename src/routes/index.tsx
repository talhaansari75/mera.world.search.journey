import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "@/components/game-app";
import Leaderboard from "@/components/Leaderboard";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Home,
});

function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <GameApp />
      <div className="mt-8 w-full max-w-md">
        <Leaderboard />
      </div>
    </main>
  );
}
