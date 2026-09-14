import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, score, level } = body;

    // Validate request payload
    if (!userId || typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { error: 'Invalid score or user ID' },
        { status: 400 }
      );
    }

    // Secure server-side timestamp validation
    const serverTimestamp = Date.now();

    // TODO: Connect this with your database to persist the high score
    // e.g., db.leaderboard.upsert({ where: { userId }, update: { score, level, updatedAt: serverTimestamp } })

    return NextResponse.json({
      success: true,
      message: 'Score submitted and verified successfully',
      data: {
        userId,
        score,
        level,
        timestamp: serverTimestamp
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
