import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse.status !== 200) return authResponse;
    
    const adminResponse = await adminMiddleware(request);
    if (adminResponse.status !== 200) return adminResponse;
    
    const { id } = params;
    
    const contact = await prisma.contact.findUnique({
      where: { id },
    });
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error fetching contact message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact message' },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse.status !== 200) return authResponse;
    
    const adminResponse = await adminMiddleware(request);
    if (adminResponse.status !== 200) return adminResponse;
    
    const { id } = params;
    const data = await request.json();
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    });
    
    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        read: data.read,
      },
    });
    
    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to update contact message' },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse.status !== 200) return authResponse;
    
    const adminResponse = await adminMiddleware(request);
    if (adminResponse.status !== 200) return adminResponse;
    
    const { id } = params;
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    });
    
    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }
    await prisma.contact.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'Contact message deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact message' },
      { status: 500 }
    );
  }
} 