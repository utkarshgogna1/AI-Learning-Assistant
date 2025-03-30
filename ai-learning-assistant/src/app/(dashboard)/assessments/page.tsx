'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  questionCount: number;
  tags: string[];
  topicKey: string; // Key for the quiz generation API
}

// Topic mapping for the quiz API
const topicMapping: Record<string, string> = {
  'python-basics': 'python',
  'javascript-async': 'javascript',
  'machine-learning-basics': 'machine-learning',
  'data-structures': 'python', // We'll use Python examples for data structures
  'web-development': 'javascript' // Using JavaScript for web dev
};

// Difficulty mapping for the quiz API
const difficultyMapping: Record<string, 'easy' | 'medium' | 'hard' | 'mixed'> = {
  'beginner': 'easy',
  'intermediate': 'medium',
  'advanced': 'hard'
};

// Mock assessments - would be fetched from an API
const mockAssessments: Assessment[] = [
  {
    id: 'python-basics',
    title: 'Python Programming Basics',
    description: 'Test your knowledge of Python programming fundamentals including variables, data types, control structures, and functions.',
    category: 'Programming',
    difficulty: 'beginner',
    estimatedTime: '15 min',
    questionCount: 10,
    tags: ['Python', 'Programming', 'Basics'],
    topicKey: 'python'
  },
  {
    id: 'javascript-async',
    title: 'JavaScript Asynchronous Programming',
    description: 'Evaluate your understanding of asynchronous JavaScript, including Promises, async/await, and event handling.',
    category: 'Programming',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    questionCount: 12,
    tags: ['JavaScript', 'Async', 'Promises'],
    topicKey: 'javascript'
  },
  {
    id: 'machine-learning-basics',
    title: 'Introduction to Machine Learning',
    description: 'Test your knowledge of basic machine learning concepts, algorithms, and terminology.',
    category: 'Data Science',
    difficulty: 'intermediate',
    estimatedTime: '25 min',
    questionCount: 15,
    tags: ['Machine Learning', 'AI', 'Data Science'],
    topicKey: 'machine-learning'
  },
  {
    id: 'data-structures',
    title: 'Data Structures Fundamentals',
    description: 'Evaluate your understanding of common data structures like arrays, linked lists, stacks, queues, and trees.',
    category: 'Computer Science',
    difficulty: 'intermediate',
    estimatedTime: '30 min',
    questionCount: 20,
    tags: ['Data Structures', 'Algorithms', 'Computer Science'],
    topicKey: 'python'
  },
  {
    id: 'web-development',
    title: 'Web Development Fundamentals',
    description: 'Test your knowledge of HTML, CSS, and basic web concepts.',
    category: 'Web Development',
    difficulty: 'beginner',
    estimatedTime: '15 min',
    questionCount: 15,
    tags: ['HTML', 'CSS', 'Web'],
    topicKey: 'javascript'
  }
];

const categories = [...new Set(mockAssessments.map(a => a.category))];

export default function AssessmentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filteredAssessments = mockAssessments.filter(assessment => {
    // Search query filter
    const matchesSearch = 
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter
    const matchesCategory = !selectedCategory || assessment.category === selectedCategory;
    
    // Difficulty filter
    const matchesDifficulty = !selectedDifficulty || assessment.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  function getDifficultyColor(difficulty: string) {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const handleStartAssessment = (assessment: Assessment) => {
    // Create URLSearchParams for query string
    const quizParams = new URLSearchParams();
    quizParams.set('topic', assessment.topicKey);
    
    // Ensure the difficulty value matches what the API expects
    // The API expects difficulty to be beginner, intermediate, or advanced
    // which is already the format our Assessment interface uses
    quizParams.set('difficulty', assessment.difficulty);
    quizParams.set('count', assessment.questionCount.toString());
    
    // Use window.location for navigation to quiz page
    window.location.href = `/assessments/quiz?${quizParams.toString()}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assessments</h1>
        <p className="text-gray-600">
          Take assessments to evaluate your knowledge and get personalized learning plans.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 grid gap-4 md:flex md:items-center md:gap-6">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 md:flex md:gap-4">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={selectedDifficulty || ''}
            onChange={(e) => setSelectedDifficulty(e.target.value || null)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Assessment Cards */}
      {filteredAssessments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold line-clamp-2">{assessment.title}</h2>
                  <Badge className={getDifficultyColor(assessment.difficulty)} variant="outline">
                    {assessment.difficulty}
                  </Badge>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{assessment.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {assessment.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div>{assessment.questionCount} questions</div>
                  <div>{assessment.estimatedTime}</div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleStartAssessment(assessment)}
                >
                  Start Assessment
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No matching assessments found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
          <Button onClick={() => {
            setSearchQuery('');
            setSelectedCategory(null);
            setSelectedDifficulty(null);
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Quick Quiz Section */}
      <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Quick Quiz</h2>
            <p className="text-gray-600">
              Generate a custom quiz on any topic to test your knowledge
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full md:w-auto">
            <select 
              className="px-3 py-2 border rounded-md"
              defaultValue="python"
              id="quick-topic"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="machine-learning">Machine Learning</option>
            </select>
            
            <select 
              className="px-3 py-2 border rounded-md"
              defaultValue="mixed"
              id="quick-difficulty"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="mixed">Mixed</option>
            </select>
            
            <Button onClick={() => {
              const topic = (document.getElementById('quick-topic') as HTMLSelectElement).value;
              const difficulty = (document.getElementById('quick-difficulty') as HTMLSelectElement).value;
              
              // Map the difficulty values to what the API expects
              const mappedDifficulty = difficulty === 'easy' ? 'beginner' :
                                        difficulty === 'medium' ? 'intermediate' :
                                        difficulty === 'hard' ? 'advanced' : 'beginner';
                                        
              window.location.href = `/assessments/quiz?topic=${topic}&difficulty=${mappedDifficulty}&count=5`;
            }}>
              Generate Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 