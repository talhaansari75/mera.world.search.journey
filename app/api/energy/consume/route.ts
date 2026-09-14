import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, currentEnergy, cost = 1 } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentEnergy < cost) {
      return NextResponse.json(
        { error: "Insufficient energy", currentEnergy },
        { status: 400 }
      );
    }

    const updatedEnergy = currentEnergy - cost;
    const serverTimestamp = Date.now();

    return NextResponse.json({
      success: true,
      energy: updatedEnergy,
      timestamp: serverTimestamp,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
