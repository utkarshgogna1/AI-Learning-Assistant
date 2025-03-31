'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse query parameters
  const topic = searchParams.get('topic') || 'python';
  const rawDifficulty = searchParams.get('difficulty') || 'mixed';
  
  // Map between different difficulty naming conventions
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
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Fetch quiz questions
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      try {
        // Use mock data for demonstration
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
        setLoading(false);
      } catch (err) {
        setError("Failed to load quiz questions.");
        setLoading(false);
      }
    }, 1000); // Fake 1-second loading for demo
  }, [topic, difficulty, questionCount]);
  
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => router.push('/assessments')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Assessments
        </button>
      </div>
    );
  }

  if (showResults) {
    const { score, total, percentage } = calculateScore();
    
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
          <p className="text-lg mb-4">Topic: <span className="font-semibold">{topic}</span></p>
          
          <div className="mb-6">
            <p className="text-lg">Your score: <span className="font-bold">{score}/{total} ({percentage}%)</span></p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div 
                className="bg-blue-600 h-4 rounded-full" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/assessments" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Back to Assessments
            </Link>
            <Link 
              href={`/assessments/quiz?topic=${topic}&difficulty=${difficulty}`} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Take Another Quiz
            </Link>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Question Review</h2>
          {questions.map((question, index) => (
            <div 
              key={question.id} 
              className="bg-white rounded-lg shadow-md p-6 mb-4"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedAnswers[index] === question.correctAnswer
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedAnswers[index] === question.correctAnswer ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              
              <p className="mb-4">{question.question}</p>
              
              <div className="space-y-2 mb-4">
                {question.options.map((option, optionIndex) => (
                  <div 
                    key={optionIndex} 
                    className={`p-3 rounded border ${
                      optionIndex === question.correctAnswer
                        ? 'bg-green-50 border-green-200'
                        : optionIndex === selectedAnswers[index] && optionIndex !== question.correctAnswer
                          ? 'bg-red-50 border-red-200'
                          : 'border-gray-200'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="font-semibold">Explanation:</p>
                <p>{question.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quiz: {topic}</h1>
        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {difficulty === 'easy' ? 'Beginner' : 
             difficulty === 'medium' ? 'Intermediate' : 
             difficulty === 'hard' ? 'Advanced' : 'Mixed'}
          </span>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
        
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`p-4 rounded border cursor-pointer hover:bg-gray-50 ${
                selectedAnswers[currentQuestionIndex] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 flex items-center justify-center rounded-full border mr-3 ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-400'
                }`}>
                  {selectedAnswers[currentQuestionIndex] === index && (
                    <span className="text-xs">✓</span>
                  )}
                </div>
                {option}
              </div>
            </div>
          ))}
        </div>
        
        {showExplanation && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="font-semibold">Explanation:</p>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
        
        <div className="flex justify-between">
          <button 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {!showExplanation && selectedAnswers[currentQuestionIndex] !== -1 && (
            <button 
              onClick={() => setShowExplanation(true)}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              Show Explanation
            </button>
          )}
          
          <button 
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === -1}
            className={`px-4 py-2 rounded ${
              selectedAnswers[currentQuestionIndex] === -1
                ? 'bg-blue-300 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 