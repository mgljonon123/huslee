import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware, adminMiddleware } from '@/lib/auth';

export async function GET() {
  try {
    // Allow public access to skills data
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse.status !== 200) return authResponse;
    
    const adminResponse = await adminMiddleware();
    if (adminResponse.status !== 200) return adminResponse;
    
    const data = await request.json();
    if (!data.name || !data.icon || !data.level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    if (data.level < 1 || data.level > 5) {
      return NextResponse.json(
        { error: 'Level must be between 1 and 5' },
        { status: 400 }
      );
    }
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        icon: data.icon,
        level: data.level,
        category: data.category || 'other',
        order: data.order || 0,
      },
    });
    
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
} 