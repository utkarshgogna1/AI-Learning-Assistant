'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { MessageSquare, BookOpen, BarChart3, PieChart, Home, User, LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userName, setUserName] = useState('Guest User');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated

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
            setUserName(profile.full_name || data.session.user.email);
          } else {
            setUserName(data.session.user.email);
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
      await supabase.auth.signOut();
      setUserName('Guest User');
    } catch (error) {
      console.error('Sign out error:', error);
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
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold">
              AI Learning Assistant
            </Link>
            
            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/assessments" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                <span>Assessments</span>
              </Link>
              <Link href="/learning-plans" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Learning Plans</span>
              </Link>
              <Link href="/progress" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>Progress</span>
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>AI Chat</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm">
              Hello, {userName}
            </div>
            <div className="flex gap-2">
              <Link href="/profile">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation (shown at bottom on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="grid grid-cols-5 gap-1">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-xs text-gray-700">
            <Home className="h-5 w-5 mb-1" />
            <span>Home</span>
          </Link>
          <Link href="/assessments" className="flex flex-col items-center py-2 text-xs text-gray-700">
            <PieChart className="h-5 w-5 mb-1" />
            <span>Assess</span>
          </Link>
          <Link href="/learning-plans" className="flex flex-col items-center py-2 text-xs text-gray-700">
            <BookOpen className="h-5 w-5 mb-1" />
            <span>Plans</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center py-2 text-xs text-gray-700">
            <BarChart3 className="h-5 w-5 mb-1" />
            <span>Progress</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center py-2 text-xs text-gray-700">
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