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

    // Check karein ke username pehle se exist toh nahi karta
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Yeh username pehle se maujood hai' },
        { status: 400 }
      );
    }

    // Naya user create karein
    const newUser = await prisma.user.create({
      data: {
        username,
        password, // Note: Production ke liye bcrypt se hash karna behtar hai
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account kamyabi se ban gaya hai',
      userId: newUser.id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}