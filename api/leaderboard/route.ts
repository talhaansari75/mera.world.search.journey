import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Database se top scores fetch karein (highest score sabse upar honge)
    const leaderboard = await prisma.leaderboardEntry.findMany({
      orderBy: {
        score: 'desc',
      },
      take: 10, // Top 10 entries
    });

    return NextResponse.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
