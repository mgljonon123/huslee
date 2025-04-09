import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  console.log('Middleware triggered for path:', request.nextUrl.pathname);

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname === '/admin/register') {
      console.log('Middleware: Allowing access to login/register page.');
      return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;
    console.log('Middleware: Read token from cookie:', token);

    if (!token) {
      console.log('Middleware: Token not found, redirecting to login.');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jose.jwtVerify(token, secretKey);
      console.log('Middleware: Token verified successfully with jose!');
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware: Token verification FAILED with jose:', error);
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.set('token', '', { expires: new Date(0), path: '/' });
      return response;
    }
  }

  console.log('Middleware: Path does not start with /admin, allowing.');
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}; 