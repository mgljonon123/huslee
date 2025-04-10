import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export async function GET() {
  try {
    let about = await prisma.about.findFirst();
    
    if (!about) {
      // Create a default About record if none exists
      about = await prisma.about.create({
        data: {
          bio: 'Welcome to my portfolio! I am a passionate developer with expertise in web technologies.',
          profileImage: '/profile-placeholder.svg',
          email: 'your.email@example.com',
          location: 'Your Location',
          resumeUrl: '',
          socialLinks: {},
        },
      });
      
      console.log('Created default About record:', about);
    }
    
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about information' },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse.status !== 200) return authResponse;
    
    const adminResponse = await adminMiddleware(request);
    if (adminResponse.status !== 200) return adminResponse;
    
    const data = await request.json();
    if (!data.bio || !data.profileImage || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const existingAbout = await prisma.about.findFirst();
    
    if (existingAbout) {
      const updatedAbout = await prisma.about.update({
        where: { id: existingAbout.id },
        data: {
          bio: data.bio,
          profileImage: data.profileImage,
          resumeUrl: data.resumeUrl,
          email: data.email,
          location: data.location,
          socialLinks: data.socialLinks,
        },
      });
      
      return NextResponse.json(updatedAbout);
    } else {
      const newAbout = await prisma.about.create({
        data: {
          bio: data.bio,
          profileImage: data.profileImage,
          resumeUrl: data.resumeUrl,
          email: data.email,
          location: data.location,
          socialLinks: data.socialLinks,
        },
      });
      
      return NextResponse.json(newAbout, { status: 201 });
    }
  } catch (error) {
    console.error('Error updating about information:', error);
    return NextResponse.json(
      { error: 'Failed to update about information' },
      { status: 500 }
    );
  }
} 