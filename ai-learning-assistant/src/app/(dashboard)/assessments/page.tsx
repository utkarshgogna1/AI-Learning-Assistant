'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AssessmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const assessments = [
    {
      id: 'python-basics',
      title: 'Python Programming Basics',
      description: 'Test your knowledge of Python programming fundamentals.',
      difficulty: 'Beginner',
    },
    {
      id: 'javascript',
      title: 'JavaScript Fundamentals',
      description: 'Evaluate your understanding of JavaScript basics.',
      difficulty: 'Beginner',
    },
    {
      id: 'machine-learning',
      title: 'Introduction to Machine Learning',
      description: 'Test your knowledge of basic machine learning concepts.',
      difficulty: 'Intermediate',
    },
  ];

  const filteredAssessments = assessments.filter(assessment => 
    assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    assessment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assessments</h1>
        <p className="text-gray-600">
          Take assessments to evaluate your knowledge and get personalized learning plans.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="search"
          placeholder="Search assessments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {/* Assessment Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssessments.map((assessment) => (
          <div 
            key={assessment.id} 
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{assessment.title}</h2>
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {assessment.difficulty}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>
              
              <Link href={`/assessments/quiz?id=${assessment.id}`}>
                <span className="inline-block w-full px-4 py-2 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Start Assessment
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No matching assessments found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
} 