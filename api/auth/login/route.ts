import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username aur password dena lazmi hai' },
        { status: 400 }
      );
    }

    // User ko database mein talash karein
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Ghalat username ya password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login kamyabi se ho gaya hai',
      userId: user.id,
      username: user.username,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}