'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

interface QuizProps {
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  questionCount?: number;
}

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  // Parse query parameters
  const topic = searchParams.get('topic') || 'python';
  const rawDifficulty = searchParams.get('difficulty') || 'mixed';
  
  // Map between the different difficulty naming conventions
  // Our Assessment interface uses: 'beginner', 'intermediate', 'advanced'
  // The quiz component uses: 'easy', 'medium', 'hard', 'mixed'
  // The API expects: 'beginner', 'intermediate', 'advanced'
  const difficulty = rawDifficulty === 'beginner' ? 'easy' :
                     rawDifficulty === 'intermediate' ? 'medium' :
                     rawDifficulty === 'advanced' ? 'hard' : 
                     rawDifficulty as 'easy' | 'medium' | 'hard' | 'mixed';
                     
  const questionCount = parseInt(searchParams.get('count') || '5', 10);
  
  // State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Load user information
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
      }
    };
    
    fetchUser();
  }, [supabase]);
  
  // Fetch quiz questions
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/quiz/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic,
            // Map back to what the API expects
            difficulty: difficulty === 'easy' ? 'beginner' :
                        difficulty === 'medium' ? 'intermediate' :
                        difficulty === 'hard' ? 'advanced' : 'beginner',
            questionCount,
            userId,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch quiz questions');
        }
        
        const data = await response.json();
        // Check if data contains questions directly or in a 'questions' property
        const questions = data.questions || data.quiz || [];
        
        if (!questions || questions.length === 0) {
          throw new Error('No questions received from the API');
        }
        
        // Transform questions if needed to match our QuizQuestion interface
        const formattedQuestions = questions.map((q: any, index: number) => ({
          id: q.id || index + 1,
          question: q.question,
          options: q.options,
          correctAnswer: typeof q.correctAnswer === 'string' 
            ? q.options.indexOf(q.correctAnswer) 
            : q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty === 'beginner' ? 'easy' :
                      q.difficulty === 'intermediate' ? 'medium' :
                      q.difficulty === 'advanced' ? 'hard' : q.difficulty,
          topic: q.topic || topic
        }));
        
        setQuestions(formattedQuestions);
        setSelectedAnswers(new Array(formattedQuestions.length).fill(-1));
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz questions. Please try again later.');
        
        // For development - use mock data if API fails
        if (process.env.NODE_ENV === 'development') {
          const mockQuestions: QuizQuestion[] = [
            {
              id: 1,
              question: 'What is Python primarily used for?',
              options: [
                'Web development only',
                'Data analysis, AI, web development, automation, and more',
                'Mobile app development only',
                'Game development only'
              ],
              correctAnswer: 1,
              explanation: 'Python is a versatile language used for many purposes including data analysis, AI/ML, web development with frameworks like Django and Flask, automation, and more.',
              difficulty: 'easy',
              topic: 'python'
            },
            {
              id: 2,
              question: 'What is a Python list comprehension?',
              options: [
                'A way to create dictionaries',
                'A concise way to create lists based on existing lists',
                'A type of function',
                'A method to import modules'
              ],
              correctAnswer: 1,
              explanation: 'List comprehensions provide a concise way to create lists based on existing lists or other iterables.',
              difficulty: 'medium',
              topic: 'python'
            },
            {
              id: 3,
              question: 'What does the "self" parameter in Python class methods represent?',
              options: [
                'A keyword required by the Python interpreter',
                'A module that must be imported',
                'A reference to the current instance of the class',
                'A way to make methods static'
              ],
              correctAnswer: 2,
              explanation: 'In Python class methods, "self" is a reference to the current instance of the class, allowing access to the instance\'s attributes and methods.',
              difficulty: 'medium',
              topic: 'python'
            }
          ];
          
          setQuestions(mockQuestions);
          setSelectedAnswers(new Array(mockQuestions.length).fill(-1));
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [topic, difficulty, questionCount, userId]);
  
  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };
  
  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };
  
  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };
  
  // Calculate score
  const calculateScore = () => {
    let correctCount = 0;
    
    selectedAnswers.forEach((selected, index) => {
      if (selected === questions[index].correctAnswer) {
        correctCount++;
      }
    });
    
    return {
      score: correctCount,
      total: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100)
    };
  };
  
  // Analyze knowledge gaps
  const analyzeKnowledgeGaps = () => {
    const incorrectQuestions = questions.filter((_, index) => 
      selectedAnswers[index] !== questions[index].correctAnswer
    );
    
    // Group by topic
    const topicGaps: Record<string, { count: number, questions: QuizQuestion[] }> = {};
    
    incorrectQuestions.forEach(question => {
      if (!topicGaps[question.topic]) {
        topicGaps[question.topic] = { count: 0, questions: [] };
      }
      
      topicGaps[question.topic].count += 1;
      topicGaps[question.topic].questions.push(question);
    });
    
    return Object.entries(topicGaps)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([topic, data]) => ({
        topic,
        count: data.count,
        questions: data.questions
      }));
  };
  
  // Save quiz results
  const saveQuizResults = async () => {
    if (!userId) {
      console.log('No user ID found, using default guest-user');
    }
    
    const scoreData = calculateScore();
    const gaps = analyzeKnowledgeGaps();
    
    // Log the data we're going to use
    console.log('Quiz results data:', {
      userId: userId || 'guest-user',
      topic,
      difficulty,
      score: scoreData.score,
      total: scoreData.total,
      percentage: scoreData.percentage,
      completedAt: new Date().toISOString(),
      knowledgeGaps: gaps.map(gap => gap.topic)
    });
    
    // Construct the URL with parameters
    const learningPlanUrl = `/learning-plans?topic=${encodeURIComponent(topic)}&source=quiz&score=${scoreData.percentage}`;
    console.log('Navigating to URL:', learningPlanUrl);
    
    // Use direct window location for navigation
    window.location.href = learningPlanUrl;
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <Spinner size="lg" />
        <p className="mt-4 text-lg text-gray-600">Loading quiz questions...</p>
      </div>
    );
  }
  
  // Render error message
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => window.location.href = '/assessments'}>
            Return to Assessments
          </Button>
        </div>
      </div>
    );
  }
  
  // Render quiz results
  if (showResults) {
    const scoreData = calculateScore();
    const gaps = analyzeKnowledgeGaps();
    
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Quiz Results: {topic.charAt(0).toUpperCase() + topic.slice(1)}</CardTitle>
            <CardDescription>
              You scored {scoreData.score} out of {scoreData.total} ({scoreData.percentage}%)
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Your Score</h3>
              <Progress value={scoreData.percentage} className="h-3 mb-2" />
              <p className="text-sm text-gray-500">
                {scoreData.percentage >= 80 
                  ? 'Excellent! You have a strong understanding of this topic.' 
                  : scoreData.percentage >= 60 
                    ? 'Good job! You have a decent understanding, but there\'s room for improvement.' 
                    : 'You might need more practice with this topic.'}
              </p>
            </div>
            
            {gaps.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Knowledge Gaps</h3>
                <div className="space-y-4">
                  {gaps.map((gap, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <h4 className="font-medium">
                        {gap.topic.charAt(0).toUpperCase() + gap.topic.slice(1)}
                        <Badge className="ml-2 bg-orange-100 text-orange-800">
                          {gap.count} {gap.count === 1 ? 'question' : 'questions'} missed
                        </Badge>
                      </h4>
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                        {gap.questions.map((q, i) => (
                          <li key={i}>{q.question}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Recommended Next Steps</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Review the questions you got wrong and their explanations</li>
                <li>Generate a personalized learning plan based on your quiz results</li>
                <li>Practice with more quizzes after studying the suggested materials</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between flex-wrap gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/assessments'}>
              Back to Assessments
            </Button>
            <div className="flex gap-2">
              <Button onClick={saveQuizResults}>
                Generate Learning Plan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  const scoreData = calculateScore();
                  const directUrl = `/learning-plans?topic=${encodeURIComponent(topic)}&source=quiz&score=${scoreData.percentage}`;
                  window.open(directUrl, '_blank');
                }}
              >
                Open Plan in New Tab
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Render current question
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <Badge className={`text-xs ${getDifficultyColor(currentQuestion?.difficulty)}`}>
              {currentQuestion?.difficulty}
            </Badge>
          </div>
          <Badge variant="outline">
            {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </Badge>
        </div>
        <Progress 
          value={((currentQuestionIndex + 1) / questions.length) * 100} 
          className="h-2"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion?.question}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <RadioGroup
            value={selectedAnswers[currentQuestionIndex].toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value, 10))}
          >
            {currentQuestion?.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 py-2">
                <RadioGroupItem 
                  value={index.toString()} 
                  id={`option-${index}`}
                />
                <Label 
                  htmlFor={`option-${index}`}
                  className="flex-grow cursor-pointer py-2"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {showExplanation && (
            <div className="mt-6">
              <Alert className="bg-blue-50">
                <AlertTitle>Explanation</AlertTitle>
                <AlertDescription>
                  {currentQuestion?.explanation}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between flex-wrap gap-4">
          <div>
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {!showExplanation && selectedAnswers[currentQuestionIndex] !== -1 && (
              <Button
                variant="ghost"
                className="ml-2"
                onClick={() => setShowExplanation(true)}
              >
                Show Explanation
              </Button>
            )}
          </div>
          
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === -1}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish Quiz'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizPage; 