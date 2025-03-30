import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase';

export async function GET() {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  return NextResponse.json({ 
    authenticated: !!session,
    userId: session?.user?.id || null,
    email: session?.user?.email || null,
  });
} 