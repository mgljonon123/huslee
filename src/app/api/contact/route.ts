import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    });
    
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact message' },
      { status: 500 }
    );
  }
}
export async function GET(request: NextRequest) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse.status !== 200) return authResponse;
    
    const adminResponse = await adminMiddleware(request);
    if (adminResponse.status !== 200) return adminResponse;
    
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
} 