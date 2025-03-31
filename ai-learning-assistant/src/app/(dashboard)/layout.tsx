'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { MessageSquare, BookOpen, BarChart3, PieChart, Home, User, LogOut } from 'lucide-react';
import { supabase as supabaseClient } from '@/lib/supabase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = supabaseClient;
  const [userName, setUserName] = useState('Guest User');
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated

  // Function to check if a link is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Function to get the appropriate styling for a nav link
  const getLinkStyle = (path: string) => {
    return isActive(path) 
      ? "text-blue-600 font-medium border-b-2 border-blue-600 pb-2 whitespace-nowrap"
      : "text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-2 whitespace-nowrap";
  };

  useEffect(() => {
    // Set loading to false immediately to show content
    setIsLoading(false);
    
    // Optional: We can still try to get the user if they're logged in
    async function checkUser() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // If we have a session, use the real user name
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', data.session.user.id)
            .single();
          
          if (profile) {
            setUserName(profile.full_name || profile.email || 'User');
          } else {
            setUserName(data.session.user.email || 'User');
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
        // Continue as guest user if there's an error
      }
    }
    
    checkUser();
  }, [supabase]);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // After sign out, redirect to home page
      router.push('/');
      router.refresh(); // Force a refresh of the page
    } catch (error) {
      console.error('Sign out error:', error);
      setIsSigningOut(false);
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p>Please wait while we set up your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b shadow bg-white sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center flex-shrink-0">
            <Link href="/dashboard" className="text-xl font-bold whitespace-nowrap mr-6">
              AI Learning Assistant
            </Link>
            
            <nav className="hidden md:flex items-center flex-nowrap overflow-x-auto scrollbar-hide">
              <Link href="/dashboard" className={`flex items-center gap-1 mx-3 ${getLinkStyle('/dashboard')}`}>
                <Home className="h-4 w-4 flex-shrink-0" />
                <span>Dashboard</span>
              </Link>
              <Link href="/assessments" className={`flex items-center gap-1 mx-3 ${getLinkStyle('/assessments')}`}>
                <PieChart className="h-4 w-4 flex-shrink-0" />
                <span>Assessments</span>
              </Link>
              <Link href="/learning-plans" className={`flex items-center gap-1 mx-3 ${getLinkStyle('/learning-plans')}`}>
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <span>Learning Plans</span>
              </Link>
              <Link href="/progress" className={`flex items-center gap-1 mx-3 ${getLinkStyle('/progress')}`}>
                <BarChart3 className="h-4 w-4 flex-shrink-0" />
                <span>Progress</span>
              </Link>
              <Link href="/chat" className={`flex items-center gap-1 mx-3 ${getLinkStyle('/chat')}`}>
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span>AI Chat</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-sm whitespace-nowrap">
              Hello, {userName}
            </div>
            <div className="flex gap-1">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-gray-100 h-9 px-2 md:px-3">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap">Profile</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut} 
                disabled={isSigningOut}
                className="flex items-center gap-1 hover:bg-gray-100 hover:text-red-600 h-9 px-2 md:px-3"
              >
                {isSigningOut ? (
                  <>
                    <div className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                    <span className="hidden sm:inline whitespace-nowrap">Signing out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">Sign Out</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation (shown at bottom on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="grid grid-cols-5 gap-1">
          <Link href="/dashboard" className={`flex flex-col items-center py-2 text-xs ${isActive('/dashboard') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
            <Home className="h-5 w-5 mb-1" />
            <span>Home</span>
          </Link>
          <Link href="/assessments" className={`flex flex-col items-center py-2 text-xs ${isActive('/assessments') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
            <PieChart className="h-5 w-5 mb-1" />
            <span>Assess</span>
          </Link>
          <Link href="/learning-plans" className={`flex flex-col items-center py-2 text-xs ${isActive('/learning-plans') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
            <BookOpen className="h-5 w-5 mb-1" />
            <span>Plans</span>
          </Link>
          <Link href="/progress" className={`flex flex-col items-center py-2 text-xs ${isActive('/progress') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
            <BarChart3 className="h-5 w-5 mb-1" />
            <span>Progress</span>
          </Link>
          <Link href="/chat" className={`flex flex-col items-center py-2 text-xs ${isActive('/chat') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
            <MessageSquare className="h-5 w-5 mb-1" />
            <span>Chat</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 pb-16 md:pb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-4 hidden md:block">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} AI Learning Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 