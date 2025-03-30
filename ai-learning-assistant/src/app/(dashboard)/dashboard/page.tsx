'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  BookOpen, 
  BarChart3, 
  PieChart, 
  MessageSquare, 
  Lightbulb, 
  GraduationCap,
  ListChecks,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const [userName, setUserName] = useState<string>('User');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        console.log('Dashboard: Loading user data...');
        // Get user session
        const { data } = await supabase.auth.getSession();
        console.log('Dashboard: Session data:', data);
        
        if (data.session) {
          console.log('Dashboard: User authenticated, ID:', data.session.user.id);
          // Get user profile if session exists
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', data.session.user.id)
              .single();
            
            if (profile) {
              console.log('Dashboard: User profile found', profile);
              setUserName(profile.full_name || data.session.user.email);
            } else {
              console.log('Dashboard: No profile found, using email');
              setUserName(data.session.user.email);
            }
          } catch (profileError) {
            console.error('Dashboard: Error fetching profile', profileError);
            setUserName(data.session.user.email || 'User');
          }
        } else {
          console.log('Dashboard: No authenticated session, using default name');
        }
      } catch (error) {
        console.error('Dashboard: Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, [supabase]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading your dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {userName}!</h1>
        <p className="text-gray-600">
          AI Learning Assistant helps you create personalized learning paths based on your skills and goals.
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/assessments" className="no-underline">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <PieChart className="h-10 w-10 mb-3 text-primary" />
                <h3 className="font-medium">Take an Assessment</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/chat" className="no-underline">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <MessageSquare className="h-10 w-10 mb-3 text-primary" />
                <h3 className="font-medium">Ask the AI</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/learning-plans" className="no-underline">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <BookOpen className="h-10 w-10 mb-3 text-primary" />
                <h3 className="font-medium">View Learning Plans</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/progress" className="no-underline">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <BarChart3 className="h-10 w-10 mb-3 text-primary" />
                <h3 className="font-medium">Track Progress</h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Main Feature Cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle>Smart Assessments</CardTitle>
            </div>
            <CardDescription>
              Take interactive quizzes that adapt to your knowledge level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <GraduationCap className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Quiz questions generated based on topic and difficulty</span>
              </li>
              <li className="flex items-start">
                <Lightbulb className="h-5 w-5 mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Immediate explanations to help you understand concepts</span>
              </li>
              <li className="flex items-start">
                <ListChecks className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Knowledge gap identification and learning recommendations</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/assessments">
              <Button className="w-full">
                Take an Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>RAG-Powered AI Chat</CardTitle>
            </div>
            <CardDescription>
              Ask questions and get cited answers backed by authoritative sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Lightbulb className="h-5 w-5 mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Get immediate answers to your programming questions</span>
              </li>
              <li className="flex items-start">
                <BookOpen className="h-5 w-5 mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>Responses include citations to authoritative documentation</span>
              </li>
              <li className="flex items-start">
                <GraduationCap className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Switch between programming languages and topics</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/chat">
              <Button className="w-full">
                Chat with AI
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Personalized Learning Plans</CardTitle>
            </div>
            <CardDescription>
              Custom learning plans generated based on your skills and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Lightbulb className="h-5 w-5 mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>AI-generated learning paths based on assessment results</span>
              </li>
              <li className="flex items-start">
                <ListChecks className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Curated resources including articles, videos, and exercises</span>
              </li>
              <li className="flex items-start">
                <BarChart3 className="h-5 w-5 mr-2 text-violet-600 flex-shrink-0 mt-0.5" />
                <span>Track completion and progress through resources</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/learning-plans">
              <Button className="w-full">
                View Learning Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Progress Tracking</CardTitle>
            </div>
            <CardDescription>
              Monitor your learning journey and visualize your improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <BarChart3 className="h-5 w-5 mr-2 text-violet-600 flex-shrink-0 mt-0.5" />
                <span>Visualize your improvement across different skills</span>
              </li>
              <li className="flex items-start">
                <GraduationCap className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Track completed assessments and learning resources</span>
              </li>
              <li className="flex items-start">
                <Lightbulb className="h-5 w-5 mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Get insights on strengths and areas for improvement</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/progress">
              <Button className="w-full">
                Track Progress
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 