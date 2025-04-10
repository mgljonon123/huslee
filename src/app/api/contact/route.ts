import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware, adminMiddleware } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    console.log('Received contact form submission');
    const body = await request.json();
    console.log('Form data:', body);
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save contact message to database
    console.log('Saving to database...');
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        message,
      },
    });
    console.log('Saved contact:', contact);

    return NextResponse.json(
      { message: 'Contact message sent successfully', contact },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching contact messages');
    const authResponse = await authMiddleware(request);
    if (authResponse.status !== 200) return authResponse;
    
    const adminResponse = await adminMiddleware(request);
    if (adminResponse.status !== 200) return adminResponse;
    
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log('Found contacts:', contacts);
    
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
} 