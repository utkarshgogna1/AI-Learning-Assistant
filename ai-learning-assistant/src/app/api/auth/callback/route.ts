import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createServerComponentClient<Database>({
      cookies,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://axcaglzfrxhbfsnifwjn.supabase.co',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4Y2FnbHpmcnhoYmZzbmlmd2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyODA2NjIsImV4cCI6MjA1ODg1NjY2Mn0.RTlu8fzwgEwlpVz1n6uaTcomF8gTi6m1VZAqODa1uFs',
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(requestUrl.origin + '/dashboard');
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(requestUrl.origin + '/auth-error');
} 