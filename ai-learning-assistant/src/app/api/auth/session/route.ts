import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase';

export async function GET() {
  const supabase = createRouteHandlerClient<Database>({ 
    cookies,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://axcaglzfrxhbfsnifwjn.supabase.co',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4Y2FnbHpmcnhoYmZzbmlmd2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyODA2NjIsImV4cCI6MjA1ODg1NjY2Mn0.RTlu8fzwgEwlpVz1n6uaTcomF8gTi6m1VZAqODa1uFs',
  });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  return NextResponse.json({ 
    authenticated: !!session,
    userId: session?.user?.id || null,
    email: session?.user?.email || null,
  });
} 