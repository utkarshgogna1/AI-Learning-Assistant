'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, BookOpen, Award, Clock, Zap, Calendar } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ProgressData {
  userId: string;
  stats: {
    assessmentsTaken: number;
    assessmentsCompleted: number;
    averageScore: number;
    totalQuestions: number;
    correctAnswers: number;
    plansCreated: number;
    resourcesCompleted: number;
    totalResources: number;
    studyTimeMinutes: number;
    learningStreak: number;
  };
  recentAssessments: Array<{
    id: string;
    title: string;
    date: string;
    score: number;
    knowledgeGaps: string[];
  }>;
  skills: Array<{
    name: string;
    proficiency: number;
    lastPracticed: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedOn: string | null;
    progress: number;
    maxProgress: number;
  }>;
}

// Mock data for progress
const mockProgressData: ProgressData = {
  userId: 'guest-user',
  stats: {
    assessmentsTaken: 5,
    assessmentsCompleted: 4,
    averageScore: 72,
    totalQuestions: 25,
    correctAnswers: 18,
    plansCreated: 2,
    resourcesCompleted: 8,
    totalResources: 15,
    studyTimeMinutes: 120,
    learningStreak: 3
  },
  recentAssessments: [
    {
      id: 'python-basics',
      title: 'Python Programming Basics',
      date: '2023-06-01T10:30:00Z',
      score: 80,
      knowledgeGaps: ['Lists and Tuples', 'Exception Handling']
    },
    {
      id: 'js-async',
      title: 'JavaScript Asynchronous Programming',
      date: '2023-05-28T14:15:00Z',
      score: 65,
      knowledgeGaps: ['Promises', 'Async/Await', 'Error Handling']
    }
  ],
  skills: [
    {
      name: 'Python',
      proficiency: 75,
      lastPracticed: '2023-06-01T10:30:00Z'
    },
    {
      name: 'JavaScript',
      proficiency: 60,
      lastPracticed: '2023-05-28T14:15:00Z'
    },
    {
      name: 'HTML/CSS',
      proficiency: 85,
      lastPracticed: '2023-05-20T09:45:00Z'
    },
    {
      name: 'React',
      proficiency: 40,
      lastPracticed: '2023-05-15T16:20:00Z'
    }
  ],
  achievements: [
    {
      id: 'first-assessment',
      title: 'First Steps',
      description: 'Complete your first assessment',
      icon: '🎯',
      earnedOn: '2023-05-15T10:30:00Z',
      progress: 1,
      maxProgress: 1
    },
    {
      id: 'learning-streak',
      title: 'Consistent Learner',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      earnedOn: null,
      progress: 3,
      maxProgress: 7
    },
    {
      id: 'resource-master',
      title: 'Resource Master',
      description: 'Complete 20 learning resources',
      icon: '📚',
      earnedOn: null,
      progress: 8,
      maxProgress: 20
    },
    {
      id: 'perfect-score',
      title: 'Perfect Score',
      description: 'Get 100% on an assessment',
      icon: '🏆',
      earnedOn: null,
      progress: 0,
      maxProgress: 1
    }
  ]
};

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For demo, use mock data
    setProgressData(mockProgressData);
    setIsLoading(false);
  }, []);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  function formatStudyTime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
  
  function getProficiencyColor(proficiency: number) {
    if (proficiency >= 80) return 'bg-green-500';
    if (proficiency >= 60) return 'bg-blue-500';
    if (proficiency >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }
  
  if (isLoading) {
    return <div className="container mx-auto p-6 text-center">Loading progress data...</div>;
  }
  
  if (!progressData) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Progress Data</h2>
          <p className="text-gray-600 mb-6">
            You need to take some assessments and use learning plans to generate progress data.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.href = '/assessments'}>
              Take an Assessment
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/learning-plans'}>
              View Learning Plans
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Learning Progress</h1>
        <p className="text-gray-600">
          Track your learning journey and see how you're improving over time.
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Assessments Completed</p>
              <p className="text-2xl font-bold">{progressData.stats.assessmentsCompleted}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progressData.stats.assessmentsTaken} assessments taken
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold">{progressData.stats.averageScore}%</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Award className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progressData.stats.correctAnswers} of {progressData.stats.totalQuestions} questions correct
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Resources Completed</p>
              <p className="text-2xl font-bold">{progressData.stats.resourcesCompleted}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progressData.stats.resourcesCompleted} of {progressData.stats.totalResources} resources
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Study Time</p>
              <p className="text-2xl font-bold">{formatStudyTime(progressData.stats.studyTimeMinutes)}</p>
            </div>
            <div className="bg-amber-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progressData.stats.learningStreak}-day learning streak
          </p>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Skills */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
          <div className="space-y-4">
            {progressData.skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-gray-500">
                    Last practiced: {formatDate(skill.lastPracticed)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={skill.proficiency} 
                    className="h-2 flex-grow" 
                    indicatorClassName={getProficiencyColor(skill.proficiency)}
                  />
                  <span className="text-sm font-medium w-8 text-right">
                    {skill.proficiency}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6">
            Take a Skill Assessment
          </Button>
        </Card>
        
        {/* Recent Assessments */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Assessments</h2>
          <div className="space-y-4">
            {progressData.recentAssessments.map((assessment) => (
              <div key={assessment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{assessment.title}</h3>
                  <Badge className={assessment.score >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {assessment.score}%
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  Taken on {formatDate(assessment.date)}
                </p>
                {assessment.knowledgeGaps.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Knowledge gaps:</p>
                    <div className="flex flex-wrap gap-1">
                      {assessment.knowledgeGaps.map((gap, i) => (
                        <Badge key={i} variant="outline" className="bg-gray-100">
                          {gap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6" onClick={() => window.location.href = '/assessments'}>
            View All Assessments
          </Button>
        </Card>
      </div>
      
      {/* Achievements */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {progressData.achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`border rounded-lg p-4 flex flex-col items-center text-center ${
                achievement.earnedOn ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="font-medium mb-1">{achievement.title}</h3>
              <p className="text-xs text-gray-600 mb-3">{achievement.description}</p>
              
              {achievement.earnedOn ? (
                <Badge className="bg-green-100 text-green-800">
                  Earned on {formatDate(achievement.earnedOn)}
                </Badge>
              ) : (
                <div className="w-full">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100} 
                    className="h-1"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 