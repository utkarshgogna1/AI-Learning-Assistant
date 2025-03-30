import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the user's session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    if (!session) {
      return NextResponse.json({ 
        authenticated: false, 
        message: 'User is not authenticated',
        timestamp: new Date().toISOString() 
      });
    }
    
    // Return user details
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        created_at: session.user.created_at
      },
      session: {
        expires_at: session.expires_at,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking user authentication:', error);
    return NextResponse.json({ 
      authenticated: false, 
      error: 'Error checking authentication',
      timestamp: new Date().toISOString() 
    }, { status: 500 });
  }
} 