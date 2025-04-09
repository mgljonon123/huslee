import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
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
    if (!data.title || !data.description || !data.image || !data.technologies || !data.githubUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        technologies: data.technologies,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        featured: data.featured || false,
        order: data.order || 0,
      },
    });
    
    revalidateTag('projects');
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 