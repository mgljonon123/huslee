import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DecodedToken {
  userId: string;
  role: string;
}

export function generateToken(userId: string, role: string) {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch {
    return null;
  }
}

export async function authMiddleware(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-role', decoded.role || 'admin');
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

export async function adminMiddleware() {
  try {
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      { error: 'Authorization failed' },
      { status: 403 }
    );
  }
} 