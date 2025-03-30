'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Mock data for now - would be fetched from the API
const mockQuiz = {
  id: 'python-basics',
  title: 'Python Programming Basics',
  description: 'Test your knowledge of Python programming fundamentals',
  questions: [
    {
      id: 1,
      question: 'What is the correct way to create a variable named "age" with the value 25?',
      options: ['age = 25', 'var age = 25', 'int age = 25', '$age = 25'],
      correctAnswer: 0,
      explanation: 'In Python, you create variables by simply assigning a value with the equals sign. No type declaration or special syntax is needed.',
      difficulty: 'easy'
    },
    {
      id: 2,
      question: 'Which of the following is the correct way to create a list in Python?',
      options: ['array(1, 2, 3)', '{1, 2, 3}', '[1, 2, 3]', '(1, 2, 3)'],
      correctAnswer: 2,
      explanation: 'Python lists are created using square brackets [].',
      difficulty: 'easy'
    },
    {
      id: 3,
      question: 'What does the following code print? \n\nx = 10\ndef func():\n    global x\n    x = 5\nfunc()\nprint(x)',
      options: ['10', '5', 'Error', 'None'],
      correctAnswer: 1,
      explanation: 'The "global" keyword is used to modify a variable outside of the current scope. When the function is called, it changes the global x to 5.',
      difficulty: 'medium'
    },
    {
      id: 4,
      question: 'What is the time complexity of accessing an element in a Python dictionary?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      correctAnswer: 0,
      explanation: 'Python dictionaries are implemented as hash tables, which provide O(1) average-case complexity for lookups.',
      difficulty: 'hard'
    },
    {
      id: 5,
      question: 'Which of these is NOT a mutable data type in Python?',
      options: ['List', 'Dictionary', 'Set', 'Tuple'],
      correctAnswer: 3,
      explanation: 'Tuples are immutable in Python, meaning they cannot be changed after creation. Lists, dictionaries, and sets are all mutable.',
      difficulty: 'medium'
    }
  ]
};

export default function TakeAssessmentPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userId, setUserId] = useState<string>('guest-user');
  const [score, setScore] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Knowledge gap tracking
  const [knowledgeGaps, setKnowledgeGaps] = useState<{
    easy: number,
    medium: number,
    hard: number
  }>({ easy: 0, medium: 0, hard: 0 });

  useEffect(() => {
    // Initialize selectedAnswers array with null values for each question
    setSelectedAnswers(new Array(mockQuiz.questions.length).fill(null));
    
    // Set loading to false immediately
    setIsLoading(false);
  }, []);

  const currentQuestion = mockQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mockQuiz.questions.length) * 100;

  function handleAnswerSelection(answer: number) {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newSelectedAnswers);
  }

  function handleNextQuestion() {
    setShowExplanation(false);
    
    if (currentQuestionIndex < mockQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score and identify knowledge gaps
      let correctCount = 0;
      const newKnowledgeGaps = { easy: 0, medium: 0, hard: 0 };
      
      mockQuiz.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswer) {
          correctCount++;
        } else {
          // Track knowledge gaps by difficulty
          newKnowledgeGaps[question.difficulty as keyof typeof newKnowledgeGaps]++;
        }
      });
      
      const finalScore = (correctCount / mockQuiz.questions.length) * 100;
      setScore(finalScore);
      setKnowledgeGaps(newKnowledgeGaps);
      setQuizCompleted(true);
      
      // Just log results for now
      console.log('Quiz completed:', {
        userId,
        quizId: mockQuiz.id,
        score: finalScore,
        answers: selectedAnswers,
        gaps: newKnowledgeGaps,
        timestamp: new Date().toISOString()
      });
    }
  }

  async function saveResults(
    userId: string, 
    quizId: string, 
    score: number, 
    answers: (number | null)[], 
    gaps: { easy: number, medium: number, hard: number }
  ) {
    try {
      // In a real app, this would be an API call
      // For now, we'll just log the data
      console.log('Saving assessment results:', {
        userId,
        quizId,
        score,
        answers,
        gaps,
        timestamp: new Date().toISOString()
      });
      
      // This would normally be an API call
      /* 
      const response = await fetch('/api/assessments/save-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          quizId,
          score,
          answers,
          gaps,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save results');
      }
      */
    } catch (err) {
      console.error('Error saving assessment results:', err);
      setError('Failed to save your results. Please try again.');
    }
  }

  function handleViewResults() {
    setShowResults(true);
  }

  function handleRestartQuiz() {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(mockQuiz.questions.length).fill(null));
    setQuizCompleted(false);
    setShowResults(false);
    setShowExplanation(false);
  }

  function handleShowExplanation() {
    setShowExplanation(true);
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading assessment...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">{mockQuiz.title} - Results</h1>
        
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Score: {score.toFixed(1)}%</h2>
          <Progress value={score} className="h-3 mb-6" />
          
          <div className="space-y-6">
            {mockQuiz.questions.map((question, index) => {
              const isCorrect = selectedAnswers[index] === question.correctAnswer;
              
              return (
                <div key={index} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="font-medium mb-2">Question {index + 1}: {question.question}</p>
                  <div className="grid gap-2 mb-4">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center">
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                          optIndex === question.correctAnswer ? 'bg-green-500 text-white' : 
                          optIndex === selectedAnswers[index] ? 'bg-red-500 text-white' : 'bg-gray-200'
                        }`}>
                          {optIndex === question.correctAnswer ? '✓' : optIndex === selectedAnswers[index] ? '✗' : ''}
                        </div>
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm mt-2 italic">{question.explanation}</p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">Knowledge Gap Analysis</h3>
            <p className="mb-4">Based on your answers, here are areas you should focus on:</p>
            
            <div className="space-y-2 mb-6">
              {knowledgeGaps.easy > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="font-medium">Basic Concepts: {knowledgeGaps.easy} questions missed</p>
                  <p className="text-sm">Focus on strengthening your foundation</p>
                </div>
              )}
              
              {knowledgeGaps.medium > 0 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                  <p className="font-medium">Intermediate Concepts: {knowledgeGaps.medium} questions missed</p>
                  <p className="text-sm">Work on building your problem-solving skills</p>
                </div>
              )}
              
              {knowledgeGaps.hard > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="font-medium">Advanced Concepts: {knowledgeGaps.hard} questions missed</p>
                  <p className="text-sm">Deep dive into complex topics</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button onClick={handleRestartQuiz} variant="outline">
              Retake Quiz
            </Button>
            <Button onClick={() => window.location.href = '/learning-plans'}>
              Get Learning Plan
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Assessment Completed!</h2>
          <p className="text-lg mb-6">
            You've completed the {mockQuiz.title} assessment.
          </p>
          <p className="text-3xl font-bold mb-8">Your Score: {score.toFixed(1)}%</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handleViewResults} size="lg">
              View Detailed Results
            </Button>
            <Button onClick={() => window.location.href = '/learning-plans'} variant="outline" size="lg">
              Get Learning Plan
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{mockQuiz.title}</h1>
        <p className="text-gray-600 mb-4">{mockQuiz.description}</p>
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {mockQuiz.questions.length}
          </span>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 whitespace-pre-line">{currentQuestion.question}</h2>
          
          <RadioGroup
            value={selectedAnswers[currentQuestionIndex]?.toString() || ""}
            onValueChange={(value) => handleAnswerSelection(parseInt(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {showExplanation && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-1">Explanation</h3>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-between">
          {!showExplanation && selectedAnswers[currentQuestionIndex] !== null && (
            <Button onClick={handleShowExplanation} variant="outline">
              Show Explanation
            </Button>
          )}
          <div className="ml-auto">
            <Button 
              onClick={handleNextQuestion} 
              disabled={selectedAnswers[currentQuestionIndex] === null}
            >
              {currentQuestionIndex < mockQuiz.questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 