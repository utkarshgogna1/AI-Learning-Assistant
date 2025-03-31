import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware function runs on every request
export async function middleware(request: NextRequest) {
  // Simply pass through all requests without any authentication checks
  // This will be handled by client components instead
  return NextResponse.next();
}

// Configure middleware to run on specific paths only
export const config = {
  matcher: [
    /*
     * Match all protected routes that require authentication
     * Exclude static files, api routes, etc.
     */
    '/dashboard/:path*',
    '/assessments/:path*',
    '/learning-plans/:path*',
    '/progress/:path*',
    '/chat/:path*',
    '/profile/:path*',
  ],
} 