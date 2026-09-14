import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, lastClaimedTimestamp, currentCoins } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = Date.now();
    const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

    if (lastClaimedTimestamp && now - lastClaimedTimestamp < COOLDOWN_MS) {
      const remainingTime = COOLDOWN_MS - (now - lastClaimedTimestamp);
      return NextResponse.json(
        { error: "Reward not ready yet", remainingTime },
        { status: 400 }
      );
    }

    // Server-side reward calculation (e.g., 100 coins + 5 gems)
    const rewardCoins = 100;
    const rewardGems = 5;

    return NextResponse.json({
      success: true,
      claimedAt: now,
      reward: {
        coins: rewardCoins,
        gems: rewardGems,
      },
      updatedCoins: (currentCoins || 0) + rewardCoins,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
