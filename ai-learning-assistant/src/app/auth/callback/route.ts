import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect') || '/dashboard';
  
  console.log('Auth callback received. Code exists:', !!code, 'Redirect to:', redirectTo);
  
  // If there is no code, redirect to login
  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }
    
    console.log('Successfully exchanged code for session, redirecting to:', redirectTo);
    
    // Redirect to the specified path or dashboard as default
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    console.error('Error in auth callback:', error);
    return NextResponse.redirect(
      new URL('/login?error=Authentication%20failed', request.url)
    );
  }
} 