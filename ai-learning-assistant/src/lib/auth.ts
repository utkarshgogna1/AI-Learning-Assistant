import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type Database } from './supabase';

// Create a Supabase client for server components
export function createClient() {
  return createServerComponentClient<Database>({
    cookies,
  });
}

// Get the current user or redirect to login
export async function getCurrentUser() {
  const supabase = createClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  return {
    ...session.user,
    profile: userProfile || null,
  };
}

// Check if a user is authenticated
export async function isAuthenticated() {
  const supabase = createClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  return !!session;
}

// Sign out a user
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

// Get user by ID
export async function getUserById(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Get user progress
export async function getUserProgress(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      assessments:assessment_id (
        title,
        subject,
        difficulty
      )
    `)
    .eq('user_id', userId);
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Get user achievements
export async function getUserAchievements(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Update user profile
export async function updateUserProfile(userId: string, updates: any) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
} 