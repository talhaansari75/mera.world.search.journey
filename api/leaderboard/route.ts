import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Fetch top scores from your database, sorted by score descending
    const mockLeaderboard = [
      { userId: 'player_1', score: 1500, level: 5, timestamp: Date.now() },
      { userId: 'player_2', score: 1200, level: 4, timestamp: Date.now() },
    ];

    return NextResponse.json({
      success: true,
      data: mockLeaderboard,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
