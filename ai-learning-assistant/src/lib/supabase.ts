import { createClient } from '@supabase/supabase-js';

// These environment variables are set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://axcaglzfrxhbfsnifwjn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4Y2FnbHpmcnhoYmZzbmlmd2puIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzI4MDY2MiwiZXhwIjoyMDU4ODU2NjYyfQ.Cva4nutndaw_TNnY8i8rz8zbBQCFWrImelJk3LEkhFM';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4Y2FnbHpmcnhoYmZzbmlmd2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyODA2NjIsImV4cCI6MjA1ODg1NjY2Mn0.RTlu8fzwgEwlpVz1n6uaTcomF8gTi6m1VZAqODa1uFs';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Create a service role client for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
});

// Type definitions for our database schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
          name: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
          name?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
          name?: string | null;
        };
      };
      assessments: {
        Row: {
          id: string;
          title: string;
          description: string;
          created_at: string;
          updated_at: string;
          subject: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          created_at?: string;
          updated_at?: string;
          subject: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
          subject?: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
        };
      };
      questions: {
        Row: {
          id: string;
          assessment_id: string;
          question: string;
          options: string[];
          correct_answer: string;
          explanation: string;
          created_at: string;
          updated_at: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
        };
        Insert: {
          id?: string;
          assessment_id: string;
          question: string;
          options: string[];
          correct_answer: string;
          explanation: string;
          created_at?: string;
          updated_at?: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
        };
        Update: {
          id?: string;
          assessment_id?: string;
          question?: string;
          options?: string[];
          correct_answer?: string;
          explanation?: string;
          created_at?: string;
          updated_at?: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
        };
      };
      responses: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          assessment_id: string;
          answered_option: string;
          is_correct: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          assessment_id: string;
          answered_option: string;
          is_correct: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          assessment_id?: string;
          answered_option?: string;
          is_correct?: boolean;
          created_at?: string;
        };
      };
      learning_plans: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          plan_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic: string;
          plan_data: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic?: string;
          plan_data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_type: string;
          achievement_data: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_type: string;
          achievement_data: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_type?: string;
          achievement_data?: any;
          created_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          assessment_id: string;
          progress: number;
          score: number;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assessment_id: string;
          progress: number;
          score: number;
          completed: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          assessment_id?: string;
          progress?: number;
          score?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };

}; 