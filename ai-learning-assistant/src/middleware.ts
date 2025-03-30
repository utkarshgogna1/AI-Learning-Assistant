import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware function runs on every request
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  
  console.log(`Middleware processing path: ${pathname}`);

  // Skip middleware for public routes and static assets
  if (
    // Public routes
    pathname === '/' || // Home page
    pathname.startsWith('/login') || 
    pathname.startsWith('/register') || 
    pathname.startsWith('/auth/') ||
    pathname === '/api/auth/callback' ||
    // Dashboard and main app features are now accessible without auth
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/assessments') ||
    pathname.startsWith('/learning-plans') ||
    pathname.startsWith('/progress') ||
    pathname.startsWith('/chat') ||
    
    // Static assets and API routes that don't need auth
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/')
  ) {
    console.log(`Skipping middleware for public path: ${pathname}`);
    return response;
  }

  // Handle remaining protected routes - anything not explicitly public
  try {
    // Create supabase middleware client
    const supabase = createMiddlewareClient({ req: request, res: response });
    
    // Check for session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log(`Middleware: Valid session found for user ${session.user.id}, allowing access to: ${pathname}`);
      return response;
    }
    
    // If no session, redirect to login
    console.log(`No session found in middleware, redirecting ${pathname} to login`);
    
    // Include original URL as a redirect parameter to return after login
    const url = new URL('/login', request.url);
    // Prevent redirect loops by not adding the redirect parameter if we're already on a login page
    if (!pathname.includes('/login')) {
      url.searchParams.set('redirect', pathname);
    }
    
    return NextResponse.redirect(url);
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