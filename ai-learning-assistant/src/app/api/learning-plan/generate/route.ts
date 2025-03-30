import { NextResponse } from 'next/server';

interface KnowledgeGap {
  topic: string;
  confidence: number; // 0-100
  questionIds: string[];
}

interface AssessmentResult {
  userId: string;
  quizId: string;
  quizTitle: string;
  topic: string;
  score: number; // 0-100
  correctAnswers: number;
  totalQuestions: number;
  knowledgeGaps: KnowledgeGap[];
  completedAt: string;
}

interface LearningResource {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'tutorial' | 'exercise' | 'project';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  description: string;
  topics: string[];
}

interface LearningPlanTopic {
  name: string;
  resources: LearningResource[];
  completed: boolean;
  progress: number; // 0-100
}

interface LearningPlan {
  id: string;
  title: string;
  description: string;
  topics: LearningPlanTopic[];
  estimatedTotalTime: number; // in minutes
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
  assessmentId?: string;
  userId: string;
}

// Comprehensive database of real learning resources
const learningResourcesDB: Record<string, LearningResource[]> = {
  'python-basics': [
    {
      id: 'py-basics-1',
      title: 'Python Official Documentation - The Python Tutorial',
      url: 'https://docs.python.org/3/tutorial/index.html',
      type: 'tutorial',
      difficulty: 'beginner',
      estimatedTime: 180,
      description: 'The official Python tutorial that walks you through the language basics with clear explanations and examples.',
      topics: ['syntax', 'variables', 'control flow', 'data structures', 'modules']
    },
    {
      id: 'py-basics-2',
      title: 'Python Programming - Full Course for Beginners',
      url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
      type: 'video',
      difficulty: 'beginner',
      estimatedTime: 240,
      description: 'A comprehensive YouTube tutorial covering Python fundamentals from basic syntax to file operations.',
      topics: ['syntax', 'variables', 'data types', 'functions', 'loops']
    },
    {
      id: 'py-basics-3',
      title: 'Python Basics - W3Schools',
      url: 'https://www.w3schools.com/python/',
      type: 'tutorial',
      difficulty: 'beginner',
      estimatedTime: 120,
      description: 'Interactive tutorial with examples, exercises, and quizzes to reinforce basic Python concepts.',
      topics: ['syntax', 'variables', 'data types', 'operators']
    },
    {
      id: 'py-basics-4',
      title: 'Automate the Boring Stuff with Python - Chapter 1',
      url: 'https://automatetheboringstuff.com/2e/chapter1/',
      type: 'article',
      difficulty: 'beginner',
      estimatedTime: 60,
      description: 'First chapter of Al Sweigart\'s popular book, covering Python basics in a practical context.',
      topics: ['syntax', 'expressions', 'variables', 'control flow']
    },
    {
      id: 'py-basics-5',
      title: 'Python - Basic Syntax Exercises',
      url: 'https://www.w3resource.com/python-exercises/python-basic-exercises.php',
      type: 'exercise',
      difficulty: 'beginner',
      estimatedTime: 90,
      description: 'A collection of exercises to practice basic Python syntax and operations.',
      topics: ['syntax', 'variables', 'operators', 'basic programs']
    }
  ],
  'python-data-structures': [
    {
      id: 'py-ds-1',
      title: 'Python Data Structures - RealPython',
      url: 'https://realpython.com/python-data-structures/',
      type: 'article',
      difficulty: 'beginner',
      estimatedTime: 60,
      description: 'Comprehensive guide to Python\'s built-in data structures with clear examples.',
      topics: ['lists', 'tuples', 'sets', 'dictionaries']
    },
    {
      id: 'py-ds-2',
      title: 'Python Lists and List Manipulation',
      url: 'https://developers.google.com/edu/python/lists',
      type: 'tutorial',
      difficulty: 'beginner',
      estimatedTime: 45,
      description: 'Google\'s Python Class tutorial on list operations and manipulation.',
      topics: ['lists', 'indexing', 'slicing', 'methods']
    },
    {
      id: 'py-ds-3',
      title: 'Python Dictionary Tutorial with Examples',
      url: 'https://www.programiz.com/python-programming/dictionary',
      type: 'tutorial',
      difficulty: 'beginner',
      estimatedTime: 40,
      description: 'Complete guide to creating, accessing, and manipulating Python dictionaries.',
      topics: ['dictionaries', 'key-value pairs', 'methods']
    },
    {
      id: 'py-ds-4',
      title: 'Working with Python Lists - Interactive Practice',
      url: 'https://www.codecademy.com/courses/learn-python-3/lessons/python-lists/exercises/what-is-a-list',
      type: 'exercise',
      difficulty: 'beginner',
      estimatedTime: 60,
      description: 'Hands-on exercises for working with Python lists on Codecademy.',
      topics: ['lists', 'indexing', 'methods', 'operations']
    },
    {
      id: 'py-ds-5',
      title: 'Python Collections Module - Beyond Basic Data Structures',
      url: 'https://realpython.com/python-collections-module/',
      type: 'article',
      difficulty: 'intermediate',
      estimatedTime: 75,
      description: 'Explore specialized container datatypes in the collections module for more complex use cases.',
      topics: ['counter', 'defaultdict', 'namedtuple', 'deque', 'collections']
    }
  ],
  'python-functions': [
    {
      id: 'py-func-1',
      title: 'Defining Your Own Python Function',
      url: 'https://realpython.com/defining-your-own-python-function/',
      type: 'tutorial',
      difficulty: 'beginner',
      estimatedTime: 90,
      description: 'Comprehensive guide to creating, using, and understanding Python functions.',
      topics: ['functions', 'arguments', 'return values', 'scope']
    },
    {
      id: 'py-func-2',
      title: 'Python Lambda Functions',
      url: 'https://www.w3schools.com/python/python_lambda.asp',
      type: 'article',
      difficulty: 'intermediate',
      estimatedTime: 30,
      description: 'Learn how to create and use anonymous lambda functions in Python.',
      topics: ['lambda', 'anonymous functions', 'functional programming']
    },
    {
      id: 'py-func-3',
      title: '5 Python Function Projects for Beginners',
      url: 'https://realpython.com/python-projects-for-beginners/#python-functions-project-ideas',
      type: 'project',
      difficulty: 'beginner',
      estimatedTime: 120,
      description: 'Practice creating and using functions with these beginner-friendly Python projects.',
      topics: ['functions', 'project', 'applications']
    },
    {
      id: 'py-func-4',
      title: 'Python *args and **kwargs - RealPython',
      url: 'https://realpython.com/python-kwargs-and-args/',
      type: 'article',
      difficulty: 'intermediate',
      estimatedTime: 45,
      description: 'Understand how to use *args and **kwargs for flexible function parameters.',
      topics: ['functions', 'arguments', 'parameters', 'args', 'kwargs']
    }
  ],
  'python-oop': [
    {
      id: 'py-oop-1',
      title: 'Object-Oriented Programming in Python 3',
      url: 'https://realpython.com/python3-object-oriented-programming/',
      type: 'tutorial',
      difficulty: 'intermediate',
      estimatedTime: 120,
      description: 'Comprehensive tutorial on object-oriented programming concepts in Python.',
      topics: ['classes', 'objects', 'inheritance', 'encapsulation']
    },
    {
      id: 'py-oop-2',
      title: 'Python Classes and Objects',
      url: 'https://www.w3schools.com/python/python_classes.asp',
      type: 'tutorial',
      difficulty: 'beginner',
      estimatedTime: 60,
      description: 'Introduction to creating and using classes and objects in Python with examples.',
      topics: ['classes', 'objects', 'methods', 'properties']
    },
    {
      id: 'py-oop-3',
      title: 'Python OOP Exercises and Solutions',
      url: 'https://pynative.com/python-object-oriented-programming-exercise/',
      type: 'exercise',
      difficulty: 'intermediate',
      estimatedTime: 90,
      description: 'Practice object-oriented programming in Python with these exercises and solutions.',
      topics: ['classes', 'objects', 'inheritance', 'methods']
    },
    {
      id: 'py-oop-4',
      title: 'Inheritance and Composition in Python',
      url: 'https://realpython.com/inheritance-composition-python/',
      type: 'article',
      difficulty: 'advanced',
      estimatedTime: 75,
      description: 'Understand when to use inheritance vs. composition in your Python classes.',
      topics: ['inheritance', 'composition', 'design patterns']
    }
  ],
  'python-modules': [
    {
      id: 'py-mod-1',
      title: 'Python Modules and Packages',
      url: 'https://realpython.com/python-modules-packages/',
      type: 'tutorial',
      difficulty: 'intermediate',
      estimatedTime: 90,
      description: 'Learn how to organize your Python code using modules and packages.',
      topics: ['modules', 'packages', 'imports', 'namespaces']
    },
    {
      id: 'py-mod-2',
      title: 'Creating and Using Python Packages',
      url: 'https://packaging.python.org/tutorials/packaging-projects/',
      type: 'tutorial',
      difficulty: 'intermediate',
      estimatedTime: 120,
      description: 'Official Python Packaging Authority guide to creating and distributing packages.',
      topics: ['packages', 'setuptools', 'distribution']
    }
  ],
  'javascript-basics': [
    {
      id: 'js-basics-1',
      title: 'JavaScript Basics - MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics',
      type: 'tutorial',
      difficulty: 'beginner',
      estimatedTime: 90,
      description: 'Mozilla\'s introduction to JavaScript fundamentals with interactive examples.',
      topics: ['syntax', 'variables', 'operators', 'control flow']
    },
    {
      id: 'js-basics-2',
      title: 'Introduction to JavaScript - Codecademy',
      url: 'https://www.codecademy.com/learn/introduction-to-javascript',
      type: 'tutorial',
      difficulty: 'beginner',
      estimatedTime: 240,
      description: 'Interactive course introducing JavaScript syntax, functions, and basic concepts.',
      topics: ['syntax', 'variables', 'functions', 'loops', 'conditionals']
    },
    {
      id: 'js-basics-3',
      title: 'JavaScript - The Complete Guide (Beginner to Advanced)',
      url: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/',
      type: 'video',
      difficulty: 'beginner',
      estimatedTime: 600,
      description: 'Comprehensive video course covering all aspects of modern JavaScript.',
      topics: ['syntax', 'dom', 'events', 'objects', 'arrays', 'async']
    }
  ],
  'javascript-arrays': [
    {
      id: 'js-arrays-1',
      title: 'JavaScript Arrays - MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
      type: 'article',
      difficulty: 'beginner',
      estimatedTime: 60,
      description: 'Official documentation on JavaScript arrays with methods and examples.',
      topics: ['arrays', 'methods', 'iteration']
    },
    {
      id: 'js-arrays-2',
      title: 'JavaScript Array Methods Tutorial',
      url: 'https://www.freecodecamp.org/news/complete-introduction-to-the-most-useful-javascript-array-methods/',
      type: 'tutorial',
      difficulty: 'intermediate',
      estimatedTime: 75,
      description: 'FreeCodeCamp tutorial on the most useful array methods with practical examples.',
      topics: ['arrays', 'map', 'filter', 'reduce', 'methods']
    }
  ],
  'javascript-async': [
    {
      id: 'js-async-1',
      title: 'Asynchronous JavaScript - MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous',
      type: 'tutorial',
      difficulty: 'intermediate',
      estimatedTime: 150,
      description: 'Mozilla\'s guide to asynchronous programming concepts in JavaScript.',
      topics: ['async', 'promises', 'callbacks', 'async/await']
    },
    {
      id: 'js-async-2',
      title: 'JavaScript Promises: An Introduction',
      url: 'https://web.dev/articles/promises',
      type: 'article',
      difficulty: 'intermediate',
      estimatedTime: 60,
      description: 'Google Developers guide to understanding and using JavaScript Promises.',
      topics: ['promises', 'async', 'then', 'catch']
    },
    {
      id: 'js-async-3',
      title: 'Async/Await in JavaScript - Ultimate Guide',
      url: 'https://blog.bitsrc.io/understanding-javascript-async-and-await-with-examples-a010b03926ea',
      type: 'article',
      difficulty: 'intermediate',
      estimatedTime: 45,
      description: 'Comprehensive guide to async/await syntax with practical examples.',
      topics: ['async/await', 'promises', 'error handling']
    }
  ]
};

// Map from quiz questions to relevant learning topics
const questionTopicMap: Record<string, string[]> = {
  // Python questions
  'py-b-1': ['python-basics'], // Variables
  'py-b-2': ['python-basics'], // Comments
  'py-b-3': ['python-basics'], // Operators
  'py-b-4': ['python-data-structures'], // Lists
  'py-b-5': ['python-basics', 'python-data-structures'], // Strings
  'py-b-6': ['python-data-structures'], // Sets
  'py-b-7': ['python-basics'], // Booleans
  'py-b-8': ['python-functions'], // Function definition
  'py-i-1': ['python-data-structures'], // Lists and references
  'py-i-2': ['python-data-structures'], // List comprehensions
  'py-i-3': ['python-basics'], // Exception handling
  'py-i-4': ['python-functions'], // Function parameters
  'py-i-5': ['python-oop'], // __init__ method
  'py-a-1': ['python-oop'], // Metaclasses
  'py-a-2': ['python-data-structures'], // Dictionary time complexity
  'py-a-3': ['python-modules'], // asyncio
  
  // JavaScript questions
  'js-b-1': ['javascript-basics'], // Variables
  'js-b-2': ['javascript-basics'], // Types
  'js-b-3': ['javascript-basics'], // Function declaration
  'js-b-4': ['javascript-basics'], // Type coercion
  'js-b-5': ['javascript-arrays'], // Array methods
  'js-i-1': ['javascript-basics'], // Type coercion and evaluation
  'js-i-2': ['javascript-basics'], // Closures
  'js-i-3': ['javascript-async'], // Promises
  'js-i-4': ['javascript-basics'], // 'this' keyword
  'js-a-1': ['javascript-basics'], // Object comparison
  'js-a-2': ['javascript-basics'], // Closures
  'js-a-3': ['javascript-async'] // Event loop
};

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    
    if (!requestData.assessmentResult) {
      return NextResponse.json(
        { error: 'Assessment result is required' },
        { status: 400 }
      );
    }
    
    const assessmentResult: AssessmentResult = requestData.assessmentResult;
    
    // Generate a learning plan
    const learningPlan = generateLearningPlan(assessmentResult);
    
    return NextResponse.json(learningPlan);
  } catch (error) {
    console.error('Error generating learning plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate learning plan' },
      { status: 500 }
    );
  }
}

function generateLearningPlan(assessmentResult: AssessmentResult): LearningPlan {
  const { userId, quizId, quizTitle, topic, score, knowledgeGaps } = assessmentResult;
  
  // Identify topics to focus on based on knowledge gaps
  const topicsToLearn: Set<string> = new Set();
  
  // Add topics based on incorrect answers
  knowledgeGaps.forEach(gap => {
    gap.questionIds.forEach(questionId => {
      const relatedTopics = questionTopicMap[questionId] || [];
      relatedTopics.forEach(topic => topicsToLearn.add(topic));
    });
  });
  
  // If no specific topics identified or very few, add general topics for the subject
  if (topicsToLearn.size < 2) {
    if (topic.toLowerCase().includes('python')) {
      topicsToLearn.add('python-basics');
      topicsToLearn.add('python-data-structures');
    } else if (topic.toLowerCase().includes('javascript')) {
      topicsToLearn.add('javascript-basics');
      topicsToLearn.add('javascript-arrays');
    }
  }
  
  // Determine user skill level based on score
  const skillLevel = getSkillLevel(score);
  
  // Create learning topics with resources
  const learningTopics: LearningPlanTopic[] = Array.from(topicsToLearn).map(topic => {
    // Get resources for this topic
    const topicResources = learningResourcesDB[topic] || [];
    
    // Filter and sort resources based on user's skill level
    let filteredResources = topicResources.filter(resource => {
      if (skillLevel === 'beginner') {
        return resource.difficulty === 'beginner';
      } else if (skillLevel === 'intermediate') {
        return resource.difficulty === 'beginner' || resource.difficulty === 'intermediate';
      } else {
        return true; // Include all for advanced users
      }
    });
    
    // Limit to 3-5 resources per topic
    filteredResources = filteredResources.slice(0, skillLevel === 'advanced' ? 5 : 3);
    
    return {
      name: formatTopicName(topic),
      resources: filteredResources,
      completed: false,
      progress: 0
    };
  });
  
  // Calculate total estimated time
  const estimatedTotalTime = learningTopics.reduce(
    (total, topic) => total + topic.resources.reduce(
      (topicTotal, resource) => topicTotal + resource.estimatedTime, 0
    ), 0
  );
  
  // Create the learning plan
  return {
    id: `lp-${userId}-${Date.now()}`,
    title: `${formatTopicName(topic)} Learning Plan`,
    description: `Personalized learning plan based on your ${formatAssessmentTitle(quizTitle)} performance.`,
    topics: learningTopics,
    estimatedTotalTime,
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assessmentId: quizId,
    userId
  };
}

function getSkillLevel(score: number): 'beginner' | 'intermediate' | 'advanced' {
  if (score < 40) {
    return 'beginner';
  } else if (score < 75) {
    return 'intermediate';
  } else {
    return 'advanced';
  }
}

function formatTopicName(topic: string): string {
  return topic
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatAssessmentTitle(title: string): string {
  return title || 'Assessment';
} 