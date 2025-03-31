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
    const supabase = createMiddlewareClient({ 
      req: request, 
      res: response,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://axcaglzfrxhbfsnifwjn.supabase.co',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4Y2FnbHpmcnhoYmZzbmlmd2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyODA2NjIsImV4cCI6MjA1ODg1NjY2Mn0.RTlu8fzwgEwlpVz1n6uaTcomF8gTi6m1VZAqODa1uFs',
    });
    
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