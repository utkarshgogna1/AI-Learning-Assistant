import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware function runs on every request
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for public routes and static assets
  if (
    // Public routes
    pathname === '/' || // Home page
    pathname.startsWith('/login') || 
    pathname.startsWith('/register') || 
    pathname.startsWith('/auth/') ||
    pathname === '/api/auth/callback' ||
    
    // Static assets and API routes that don't need auth
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/')
  ) {
    // Allow access to public routes
    return response;
  }

  try {
    // For protected routes, we'll check for authentication in client components
    // This simplifies the middleware to avoid server-side auth checks
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of error, still let the request through to avoid blocking the user
    return response;
  }
}

// Configure middleware to run on all paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 