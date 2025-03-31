'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
        quizId: mockQuiz.id,
        score: finalScore,
        answers: selectedAnswers,
        gaps: newKnowledgeGaps,
        timestamp: new Date().toISOString()
      });
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
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading assessment...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">{mockQuiz.title} - Results</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Score: {score.toFixed(1)}%</h2>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className="bg-blue-600 h-4 rounded-full" 
              style={{ width: `${score}%` }}
            ></div>
          </div>
          
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
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleRestartQuiz}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Take Assessment Again
            </button>
            <Link
              href="/assessments"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Back to Assessments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted && !showResults) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Assessment Complete!</h2>
          <p className="mb-4">You have completed the {mockQuiz.title} assessment.</p>
          <p className="mb-6">Click below to view your results and see how you performed.</p>
          
          <button
            onClick={handleViewResults}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{mockQuiz.title}</h1>
        <p className="text-gray-600">{mockQuiz.description}</p>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {mockQuiz.questions.length}</span>
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
        
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleAnswerSelection(index)}
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
          {!showExplanation && selectedAnswers[currentQuestionIndex] !== null && (
            <button 
              onClick={handleShowExplanation}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              Show Explanation
            </button>
          )}
          
          <button 
            onClick={handleNextQuestion}
            disabled={selectedAnswers[currentQuestionIndex] === null}
            className={`ml-auto px-4 py-2 rounded ${
              selectedAnswers[currentQuestionIndex] === null
                ? 'bg-blue-300 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentQuestionIndex < mockQuiz.questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
} 