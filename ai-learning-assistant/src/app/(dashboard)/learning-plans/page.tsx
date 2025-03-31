'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, FileText, Code, GraduationCap, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LearningResource {
  title: string;
  type: 'article' | 'video' | 'tutorial' | 'exercise' | 'project' | 'book';
  url: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed?: boolean;
}

interface LearningPlanTopic {
  id: string;
  title: string;
  description: string;
  resources: LearningResource[];
  progress?: number;
}

interface LearningPlan {
  id: string;
  title: string;
  description: string;
  topics: LearningPlanTopic[];
  estimatedTime: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  progress: number;
}

// Mock learning plans data
const mockPlans: LearningPlan[] = [
  {
    id: 'python-basics',
    title: 'Python Programming Fundamentals',
    description: 'A comprehensive plan to learn Python programming from the ground up, covering essential concepts for beginners.',
    estimatedTime: '4 hours',
    skillLevel: 'beginner',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 35,
    topics: [
      {
        id: 'variables',
        title: 'Variables and Data Types',
        description: 'Learn about Python variables, basic data types, and type conversion.',
        progress: 75,
        resources: [
          {
            title: 'Python Variables and Data Types',
            type: 'article',
            url: 'https://docs.python.org/3/tutorial/introduction.html',
            description: 'Official Python documentation on variables and data types',
            difficulty: 'beginner',
            completed: true
          },
          {
            title: 'Variables in Python - Video Tutorial',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=cQT33yu9pY8',
            description: 'A comprehensive video guide to variables in Python',
            difficulty: 'beginner',
            completed: true
          },
          {
            title: 'Python Data Types Practice',
            type: 'exercise',
            url: 'https://www.w3schools.com/python/python_datatypes.asp',
            description: 'Practice exercises to reinforce your understanding of Python data types',
            difficulty: 'beginner',
            completed: false
          }
        ]
      },
      {
        id: 'control-flow',
        title: 'Control Flow',
        description: 'Master conditionals and loops to control the flow of your Python programs.',
        progress: 0,
        resources: [
          {
            title: 'Python Control Flow Tools',
            type: 'article',
            url: 'https://docs.python.org/3/tutorial/controlflow.html',
            description: 'Official documentation on if statements, for loops, and other control flow tools',
            difficulty: 'beginner',
            completed: false
          },
          {
            title: 'Python Loops and Conditionals',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=5-5Mf_L0UKw',
            description: 'Visual explanation of Python loops and conditional statements',
            difficulty: 'beginner',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'js-async',
    title: 'JavaScript Asynchronous Programming',
    description: 'Learn how to write non-blocking JavaScript code using promises, async/await, and callbacks.',
    estimatedTime: '6 hours',
    skillLevel: 'intermediate',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 10,
    topics: [
      {
        id: 'callbacks',
        title: 'Callbacks',
        description: 'Understand JavaScript callbacks and their role in asynchronous programming.',
        progress: 50,
        resources: [
          {
            title: 'JavaScript Callbacks Explained',
            type: 'article',
            url: 'https://developer.mozilla.org/en-US/docs/Glossary/Callback_function',
            description: 'MDN documentation on callback functions',
            difficulty: 'intermediate',
            completed: true
          },
          {
            title: 'Callback Hell and How to Avoid It',
            type: 'tutorial',
            url: 'https://www.freecodecamp.org/news/how-to-deal-with-nested-callbacks-and-avoid-callback-hell-1bc8dc4a2012/',
            description: 'Learn strategies to avoid deeply nested callbacks',
            difficulty: 'intermediate',
            completed: false
          }
        ]
      },
      {
        id: 'promises',
        title: 'Promises',
        description: 'Learn how to use promises for cleaner asynchronous code.',
        progress: 0,
        resources: [
          {
            title: 'JavaScript Promises',
            type: 'article',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
            description: 'MDN documentation on JavaScript Promises',
            difficulty: 'intermediate',
            completed: false
          },
          {
            title: 'Promises in JavaScript',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=DHvZLI7Db8E',
            description: 'Deep dive into JavaScript promises',
            difficulty: 'intermediate',
            completed: false
          }
        ]
      },
      {
        id: 'async-await',
        title: 'Async/Await',
        description: 'Master the async/await syntax for handling asynchronous operations.',
        progress: 0,
        resources: [
          {
            title: 'Async/Await in JavaScript',
            type: 'article',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await',
            description: 'MDN guide to async and await',
            difficulty: 'intermediate',
            completed: false
          },
          {
            title: 'JavaScript Async/Await Tutorial',
            type: 'tutorial',
            url: 'https://javascript.info/async-await',
            description: 'Comprehensive tutorial on async/await',
            difficulty: 'advanced',
            completed: false
          }
        ]
      }
    ]
  }
];

export default function LearningPlansPage() {
  const [learningPlans, setLearningPlans] = useState<LearningPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlanData, setNewPlanData] = useState({
    topic: '',
    difficulty: 'beginner',
  });
  const userId = 'guest-user';
  
  // Get URL parameters
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');
  const sourceParam = searchParams.get('source');
  const scoreParam = searchParams.get('score');
  
  useEffect(() => {
    // Log received parameters for debugging
    console.log('URL Parameters received:', {
      topic: topicParam,
      source: sourceParam,
      score: scoreParam
    });
    
    // Load plans from localStorage first
    const savedPlans = localStorage.getItem('learningPlans');
    let loadedPlans = mockPlans;
    
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        if (Array.isArray(parsedPlans) && parsedPlans.length > 0) {
          loadedPlans = parsedPlans;
          console.log('Loaded saved learning plans from localStorage:', parsedPlans.length);
        }
      } catch (error) {
        console.error('Failed to parse saved learning plans:', error);
      }
    }
    
    setLearningPlans(loadedPlans);
    
    if (loadedPlans.length > 0) {
      setActivePlanId(loadedPlans[0].id);
      setSelectedTopic(loadedPlans[0].topics[0].id);
    }
    
    setIsLoading(false);
    
    // Use a flag ref to ensure we only generate a plan once
    const shouldGeneratePlan = topicParam && sourceParam === 'quiz' && scoreParam;
    
    if (shouldGeneratePlan) {
      console.log('Parameters detected, generating learning plan');
      const score = parseInt(scoreParam, 10);
      
      // Add a slight delay to ensure state is updated
      setTimeout(() => {
        generateLearningPlan(topicParam, score);
      }, 100);
    } else {
      console.log('Not generating plan - missing or invalid parameters');
    }
    
    // Empty dependency array to ensure this runs only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Save plans to localStorage whenever they change
  useEffect(() => {
    if (learningPlans.length > 0) {
      localStorage.setItem('learningPlans', JSON.stringify(learningPlans));
      console.log('Saved learning plans to localStorage:', learningPlans.length);
    }
  }, [learningPlans]);
  
  function handleSelectPlan(planId: string) {
    setActivePlanId(planId);
    
    // Also select the first topic of this plan
    const plan = learningPlans.find(p => p.id === planId);
    if (plan && plan.topics.length > 0) {
      setSelectedTopic(plan.topics[0].id);
    }
  }
  
  async function generateLearningPlan(topic: string, score: number, difficulty: string = 'beginner') {
    try {
      console.log(`Generating learning plan for ${topic} with difficulty ${difficulty}`);
      
      // Determine skill level based on difficulty
      const skillLevel = difficulty as 'beginner' | 'intermediate' | 'advanced';
      
      // Create topics based on the selected topic and difficulty
      let topics: LearningPlanTopic[] = [];
      
      if (topic.toLowerCase() === 'javascript') {
        if (difficulty === 'beginner') {
          topics = [
            {
              id: 'js-basics',
              title: 'JavaScript Basics',
              description: 'Learn the fundamentals of JavaScript including variables, data types, and operators.',
              resources: [
                {
                  title: 'JavaScript Basics - MDN',
                  type: 'article',
                  url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps',
                  description: 'MDN guide to JavaScript basics',
                  difficulty: 'beginner'
                },
                {
                  title: 'JavaScript Crash Course For Beginners',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
                  description: 'Comprehensive video covering JavaScript basics',
                  difficulty: 'beginner'
                },
                {
                  title: 'JavaScript Variables and Data Types',
                  type: 'tutorial',
                  url: 'https://javascript.info/variables',
                  description: 'In-depth tutorial on JavaScript variables',
                  difficulty: 'beginner'
                },
                {
                  title: 'JavaScript Basics Exercises',
                  type: 'exercise',
                  url: 'https://www.w3schools.com/js/exercise_js.asp?filename=exercise_js_variables1',
                  description: 'Interactive exercises to practice JavaScript basics',
                  difficulty: 'beginner'
                }
              ]
            },
            {
              id: 'js-functions',
              title: 'JavaScript Functions',
              description: 'Learn how to create and use functions in JavaScript.',
              resources: [
                {
                  title: 'JavaScript Functions - MDN',
                  type: 'article',
                  url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
                  description: 'MDN guide to JavaScript functions',
                  difficulty: 'beginner'
                },
                {
                  title: 'JavaScript Functions Tutorial',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=xUI5Tsl2JpY',
                  description: 'Video tutorial on JavaScript functions',
                  difficulty: 'beginner'
                },
                {
                  title: 'Function Practice Exercises',
                  type: 'exercise',
                  url: 'https://github.com/Asabeneh/30-Days-Of-JavaScript/blob/master/07_Day_Functions/07_day_functions.md',
                  description: 'GitHub repository with JavaScript function exercises',
                  difficulty: 'beginner'
                }
              ]
            },
            {
              id: 'js-dom',
              title: 'DOM Manipulation',
              description: 'Learn how to manipulate the DOM with JavaScript.',
              resources: [
                {
                  title: 'DOM Manipulation - MDN',
                  type: 'article',
                  url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents',
                  description: 'MDN guide to manipulating documents',
                  difficulty: 'beginner'
                },
                {
                  title: 'JavaScript DOM Manipulation Course',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=5fb2aPlgoys',
                  description: 'Video course on DOM manipulation',
                  difficulty: 'beginner'
                }
              ]
            }
          ];
        } else if (difficulty === 'intermediate') {
          topics = [
            {
              id: 'js-objects',
              title: 'JavaScript Objects and Prototypes',
              description: 'Master JavaScript objects and prototypes.',
              resources: [
                {
                  title: 'Working with Objects - MDN',
                  type: 'article',
                  url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects',
                  description: 'MDN guide to working with objects',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Object-Oriented JavaScript',
                  type: 'tutorial',
                  url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_programming',
                  description: 'Tutorial on object-oriented JavaScript',
                  difficulty: 'intermediate'
                },
                {
                  title: 'JavaScript Objects and Classes Tutorial',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=2ZphE5HcQPQ',
                  description: 'Video tutorial on JavaScript objects and classes',
                  difficulty: 'intermediate'
                }
              ]
            },
            {
              id: 'js-async',
              title: 'Asynchronous JavaScript',
              description: 'Learn about promises, async/await, and callbacks.',
              resources: [
                {
                  title: 'Async JavaScript - MDN',
                  type: 'tutorial',
                  url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous',
                  description: 'MDN tutorial on asynchronous JavaScript',
                  difficulty: 'intermediate'
                },
                {
                  title: 'JavaScript Promises In 10 Minutes',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=DHvZLI7Db8E',
                  description: 'Video tutorial on JavaScript promises',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Async/Await in JavaScript',
                  type: 'article',
                  url: 'https://javascript.info/async-await',
                  description: 'In-depth article on async/await',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Asynchronous JavaScript Exercises',
                  type: 'exercise',
                  url: 'https://github.com/sorrycc/awesome-javascript#promises',
                  description: 'Collection of resources and exercises for async JavaScript',
                  difficulty: 'intermediate'
                }
              ]
            }
          ];
        } else {
          topics = [
            {
              id: 'js-advanced-patterns',
              title: 'Advanced JavaScript Patterns',
              description: 'Master advanced JavaScript design patterns.',
              resources: [
                {
                  title: 'JavaScript Design Patterns',
                  type: 'book',
                  url: 'https://addyosmani.com/resources/essentialjsdesignpatterns/book/',
                  description: 'Essential JS design patterns book',
                  difficulty: 'advanced'
                },
                {
                  title: 'Functional Programming in JavaScript',
                  type: 'article',
                  url: 'https://opensource.com/article/17/6/functional-javascript',
                  description: 'Introduction to functional programming in JavaScript',
                  difficulty: 'advanced'
                },
                {
                  title: 'Advanced JavaScript Concepts',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=R9I85RhI7Cg',
                  description: 'Video course on advanced JavaScript concepts',
                  difficulty: 'advanced'
                }
              ]
            },
            {
              id: 'js-performance',
              title: 'JavaScript Performance Optimization',
              description: 'Learn advanced techniques to optimize JavaScript performance.',
              resources: [
                {
                  title: 'JavaScript Performance - MDN',
                  type: 'article',
                  url: 'https://developer.mozilla.org/en-US/docs/Learn/Performance/JavaScript',
                  description: 'MDN guide to JavaScript performance',
                  difficulty: 'advanced'
                },
                {
                  title: 'JavaScript Engine and Runtime',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
                  description: 'Video on how JavaScript works under the hood',
                  difficulty: 'advanced'
                }
              ]
            }
          ];
        }
      } else if (topic.toLowerCase() === 'python') {
        if (difficulty === 'beginner') {
          topics = [
            {
              id: 'python-basics',
              title: 'Python Basics',
              description: 'Learn the fundamentals of Python including variables, data types, and control structures.',
              resources: [
                {
                  title: 'Python Basics - Official Tutorial',
                  type: 'article',
                  url: 'https://docs.python.org/3/tutorial/introduction.html',
                  description: 'Official Python tutorial',
                  difficulty: 'beginner'
                },
                {
                  title: 'Python for Beginners - Full Course',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
                  description: 'Comprehensive Python course for beginners',
                  difficulty: 'beginner'
                },
                {
                  title: 'Python Basics Exercises',
                  type: 'exercise',
                  url: 'https://www.w3schools.com/python/exercise.asp',
                  description: 'Interactive exercises to practice Python',
                  difficulty: 'beginner'
                }
              ]
            },
            {
              id: 'python-data-structures',
              title: 'Python Data Structures',
              description: 'Learn about lists, dictionaries, sets, and tuples in Python.',
              resources: [
                {
                  title: 'Python Data Structures',
                  type: 'article',
                  url: 'https://docs.python.org/3/tutorial/datastructures.html',
                  description: 'Official Python documentation on data structures',
                  difficulty: 'beginner'
                },
                {
                  title: 'Python Lists, Tuples, Sets & Dictionaries',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=W8KRzm-HUcc',
                  description: 'Video tutorial on Python data structures',
                  difficulty: 'beginner'
                }
              ]
            }
          ];
        } else if (difficulty === 'intermediate') {
          topics = [
            {
              id: 'python-oop',
              title: 'Object-Oriented Python',
              description: 'Learn about classes, objects, and inheritance in Python.',
              resources: [
                {
                  title: 'OOP in Python',
                  type: 'tutorial',
                  url: 'https://realpython.com/python3-object-oriented-programming/',
                  description: 'Real Python tutorial on OOP',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Python OOP Tutorials',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM&list=PL-osiE80TeTsqhIuOqKhwlXsIBIdSeYtc',
                  description: 'Video series on object-oriented programming in Python',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Python OOP Exercises',
                  type: 'exercise',
                  url: 'https://pynative.com/python-object-oriented-programming-oop-exercise/',
                  description: 'Practice exercises for Python OOP',
                  difficulty: 'intermediate'
                }
              ]
            },
            {
              id: 'python-modules',
              title: 'Python Modules and Packages',
              description: 'Learn how to organize code with modules and packages.',
              resources: [
                {
                  title: 'Python Modules and Packages',
                  type: 'article',
                  url: 'https://realpython.com/python-modules-packages/',
                  description: 'Real Python guide to modules and packages',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Python Packages Tutorial',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=6tNS--WetLI',
                  description: 'Video tutorial on Python packages',
                  difficulty: 'intermediate'
                }
              ]
            }
          ];
        } else {
          topics = [
            {
              id: 'python-advanced',
              title: 'Advanced Python Concepts',
              description: 'Master advanced Python techniques like decorators, generators, and metaclasses.',
              resources: [
                {
                  title: 'Advanced Python Features',
                  type: 'article',
                  url: 'https://docs.python.org/3/howto/functional.html',
                  description: 'Python documentation on functional programming',
                  difficulty: 'advanced'
                },
                {
                  title: 'Python Decorators',
                  type: 'tutorial',
                  url: 'https://realpython.com/primer-on-python-decorators/',
                  description: 'Real Python tutorial on decorators',
                  difficulty: 'advanced'
                },
                {
                  title: 'Advanced Python - Metaclasses',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=NAQEj-c2CI8',
                  description: 'Video on Python metaclasses',
                  difficulty: 'advanced'
                }
              ]
            }
          ];
        }
      } else if (topic.toLowerCase() === 'react') {
        if (difficulty === 'beginner') {
          topics = [
            {
              id: 'react-basics',
              title: 'React Basics',
              description: 'Learn the fundamentals of React including components, props, and state.',
              resources: [
                {
                  title: 'React Main Concepts',
                  type: 'article',
                  url: 'https://reactjs.org/docs/hello-world.html',
                  description: 'Official React documentation',
                  difficulty: 'beginner'
                },
                {
                  title: 'React Tutorial for Beginners',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
                  description: 'Video tutorial covering React basics',
                  difficulty: 'beginner'
                },
                {
                  title: 'Build a React App',
                  type: 'project',
                  url: 'https://www.freecodecamp.org/news/react-beginner-handbook/',
                  description: 'Step-by-step guide to building a React app',
                  difficulty: 'beginner'
                }
              ]
            }
          ];
        } else if (difficulty === 'intermediate') {
          topics = [
            {
              id: 'react-hooks',
              title: 'React Hooks',
              description: 'Master React Hooks for state and side effects.',
              resources: [
                {
                  title: 'Hooks Introduction',
                  type: 'article',
                  url: 'https://reactjs.org/docs/hooks-intro.html',
                  description: 'Official React hooks documentation',
                  difficulty: 'intermediate'
                },
                {
                  title: 'React Hooks Tutorial',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=f687hBjwFcM',
                  description: 'Video tutorial on React hooks',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Building an App with React Hooks',
                  type: 'project',
                  url: 'https://www.digitalocean.com/community/tutorials/how-to-build-a-react-to-do-app-with-react-hooks',
                  description: 'Tutorial for building a todo app with hooks',
                  difficulty: 'intermediate'
                }
              ]
            }
          ];
        } else {
          topics = [
            {
              id: 'react-advanced',
              title: 'Advanced React Patterns',
              description: 'Learn advanced React patterns and optimization techniques.',
              resources: [
                {
                  title: 'Advanced React Patterns',
                  type: 'tutorial',
                  url: 'https://kentcdodds.com/blog/advanced-react-patterns',
                  description: 'Kent C. Dodds blog on advanced patterns',
                  difficulty: 'advanced'
                },
                {
                  title: 'React Performance Optimization',
                  type: 'article',
                  url: 'https://reactjs.org/docs/optimizing-performance.html',
                  description: 'Official documentation on React performance',
                  difficulty: 'advanced'
                },
                {
                  title: 'Advanced React Hooks',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=YKmiLcXiMMo',
                  description: 'Video on advanced usage of React hooks',
                  difficulty: 'advanced'
                }
              ]
            }
          ];
        }
      } else {
        // Generic topics for any other subject with direct links to actual resources
        // Use a resource database approach instead of search links
        const getResourcesForTopic = (topic: string, level: string) => {
          // Common learning platforms with topic-specific URLs
          const resourceMap: Record<string, any> = {
            // Programming Languages
            'java': {
              beginner: [
                {
                  title: 'Java Tutorial for Beginners',
                  type: 'tutorial',
                  url: 'https://docs.oracle.com/javase/tutorial/getStarted/index.html',
                  description: 'Official Oracle Java Getting Started tutorial',
                  difficulty: 'beginner'
                },
                {
                  title: 'Learn Java Programming',
                  type: 'article',
                  url: 'https://www.w3schools.com/java/',
                  description: 'W3Schools comprehensive Java tutorial',
                  difficulty: 'beginner'
                },
                {
                  title: 'Java Programming for Beginners',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=eIrMbAQSU34',
                  description: 'Comprehensive Java video course for beginners',
                  difficulty: 'beginner'
                }
              ],
              intermediate: [
                {
                  title: 'Java Collections Framework',
                  type: 'article',
                  url: 'https://docs.oracle.com/javase/tutorial/collections/index.html',
                  description: 'Oracle tutorial on Java Collections',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Java Design Patterns',
                  type: 'tutorial',
                  url: 'https://www.baeldung.com/design-patterns-series',
                  description: 'Comprehensive guide to design patterns in Java',
                  difficulty: 'intermediate'
                }
              ],
              advanced: [
                {
                  title: 'Advanced Java Programming',
                  type: 'article',
                  url: 'https://www.baeldung.com/java-advanced',
                  description: 'In-depth Java tutorials for advanced topics',
                  difficulty: 'advanced'
                },
                {
                  title: 'Java Concurrency in Practice',
                  type: 'book',
                  url: 'https://jcip.net/',
                  description: 'Essential resource on Java concurrency',
                  difficulty: 'advanced'
                }
              ]
            },
            'c++': {
              beginner: [
                {
                  title: 'C++ Tutorial for Beginners',
                  type: 'tutorial',
                  url: 'https://www.learncpp.com/',
                  description: 'Comprehensive C++ tutorial for beginners',
                  difficulty: 'beginner'
                },
                {
                  title: 'C++ Programming Course',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y',
                  description: 'Full C++ course for beginners',
                  difficulty: 'beginner'
                }
              ],
              intermediate: [
                {
                  title: 'C++ Templates and STL',
                  type: 'article',
                  url: 'https://en.cppreference.com/w/cpp/language/templates',
                  description: 'Guide to C++ templates and Standard Template Library',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Effective Modern C++',
                  type: 'book',
                  url: 'https://www.oreilly.com/library/view/effective-modern-c/9781491908419/',
                  description: 'Essential C++ techniques for modern C++ development',
                  difficulty: 'intermediate'
                }
              ],
              advanced: [
                {
                  title: 'Advanced C++ Programming',
                  type: 'tutorial',
                  url: 'https://isocpp.org/wiki/faq/cpp11',
                  description: 'Official ISO C++ FAQ on advanced C++ features',
                  difficulty: 'advanced'
                },
                {
                  title: 'CppCon Talks',
                  type: 'video',
                  url: 'https://www.youtube.com/user/CppCon',
                  description: 'Collection of expert C++ conference talks',
                  difficulty: 'advanced'
                }
              ]
            },
            // Data Science & ML topics
            'machine learning': {
              beginner: [
                {
                  title: 'Machine Learning Crash Course',
                  type: 'tutorial',
                  url: 'https://developers.google.com/machine-learning/crash-course',
                  description: 'Google\'s fast-paced practical introduction to machine learning',
                  difficulty: 'beginner'
                },
                {
                  title: 'Machine Learning for Beginners',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=jGwO_UgTS7I',
                  description: 'Comprehensive video tutorial on machine learning fundamentals',
                  difficulty: 'beginner'
                },
                {
                  title: 'Scikit-Learn Tutorials',
                  type: 'article',
                  url: 'https://scikit-learn.org/stable/tutorial/index.html',
                  description: 'Official tutorials for the popular Scikit-Learn library',
                  difficulty: 'beginner'
                }
              ],
              intermediate: [
                {
                  title: 'Deep Learning with PyTorch',
                  type: 'tutorial',
                  url: 'https://pytorch.org/tutorials/',
                  description: 'Official PyTorch tutorials for deep learning',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Hands-On Machine Learning Projects',
                  type: 'project',
                  url: 'https://www.kaggle.com/competitions',
                  description: 'Kaggle competitions for practical machine learning',
                  difficulty: 'intermediate'
                }
              ],
              advanced: [
                {
                  title: 'Deep Learning Specialization',
                  type: 'tutorial',
                  url: 'https://www.deeplearning.ai/',
                  description: 'Andrew Ng\'s comprehensive deep learning courses',
                  difficulty: 'advanced'
                },
                {
                  title: 'Research Papers in Machine Learning',
                  type: 'article',
                  url: 'https://paperswithcode.com/',
                  description: 'Machine learning papers with code implementations',
                  difficulty: 'advanced'
                }
              ]
            },
            'data science': {
              beginner: [
                {
                  title: 'Data Science for Beginners',
                  type: 'tutorial',
                  url: 'https://www.datacamp.com/courses/introduction-to-data-science-in-python',
                  description: 'DataCamp\'s introduction to data science with Python',
                  difficulty: 'beginner'
                },
                {
                  title: 'Pandas Documentation',
                  type: 'article',
                  url: 'https://pandas.pydata.org/docs/getting_started/index.html',
                  description: 'Official documentation for the Pandas data analysis library',
                  difficulty: 'beginner'
                }
              ],
              intermediate: [
                {
                  title: 'Data Visualization with Matplotlib and Seaborn',
                  type: 'tutorial',
                  url: 'https://www.kaggle.com/learn/data-visualization',
                  description: 'Kaggle\'s tutorial on data visualization',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Statistical Analysis in Python',
                  type: 'article',
                  url: 'https://scipy-lectures.org/packages/statistics/index.html',
                  description: 'Guide to statistical analysis with Python',
                  difficulty: 'intermediate'
                }
              ],
              advanced: [
                {
                  title: 'Advanced Data Science Techniques',
                  type: 'book',
                  url: 'https://www.oreilly.com/library/view/python-for-data/9781491957653/',
                  description: 'Python for Data Analysis book by Wes McKinney',
                  difficulty: 'advanced'
                },
                {
                  title: 'Data Science Research Papers',
                  type: 'article',
                  url: 'https://arxiv.org/list/stat.ML/recent',
                  description: 'Recent research papers in data science and machine learning',
                  difficulty: 'advanced'
                }
              ]
            },
            // Web Development
            'html': {
              beginner: [
                {
                  title: 'HTML Basics',
                  type: 'tutorial',
                  url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML',
                  description: 'MDN guide to HTML basics',
                  difficulty: 'beginner'
                },
                {
                  title: 'HTML Full Course',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
                  description: 'Comprehensive HTML video course',
                  difficulty: 'beginner'
                }
              ],
              intermediate: [
                {
                  title: 'HTML5 Features',
                  type: 'article',
                  url: 'https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5',
                  description: 'Guide to HTML5 features and APIs',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Semantic HTML',
                  type: 'tutorial',
                  url: 'https://www.semrush.com/blog/semantic-html5-guide/',
                  description: 'Guide to semantic HTML elements and best practices',
                  difficulty: 'intermediate'
                }
              ],
              advanced: [
                {
                  title: 'Advanced HTML Techniques',
                  type: 'article',
                  url: 'https://htmlreference.io/',
                  description: 'Comprehensive HTML reference with examples',
                  difficulty: 'advanced'
                },
                {
                  title: 'HTML Accessibility',
                  type: 'tutorial',
                  url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA',
                  description: 'Guide to making HTML accessible with ARIA',
                  difficulty: 'advanced'
                }
              ]
            },
            'css': {
              beginner: [
                {
                  title: 'CSS Basics',
                  type: 'tutorial',
                  url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps',
                  description: 'MDN guide to CSS basics',
                  difficulty: 'beginner'
                },
                {
                  title: 'CSS Crash Course',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
                  description: 'Quick CSS crash course for beginners',
                  difficulty: 'beginner'
                }
              ],
              intermediate: [
                {
                  title: 'CSS Flexbox Guide',
                  type: 'article',
                  url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
                  description: 'Comprehensive guide to CSS Flexbox',
                  difficulty: 'intermediate'
                },
                {
                  title: 'CSS Grid Tutorial',
                  type: 'tutorial',
                  url: 'https://cssgrid.io/',
                  description: 'Wes Bos CSS Grid course',
                  difficulty: 'intermediate'
                }
              ],
              advanced: [
                {
                  title: 'Advanced CSS Animations',
                  type: 'article',
                  url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations',
                  description: 'Guide to advanced CSS animations',
                  difficulty: 'advanced'
                },
                {
                  title: 'CSS Architecture',
                  type: 'tutorial',
                  url: 'https://www.smashingmagazine.com/2016/06/battling-bem-extended-edition-common-problems-and-how-to-avoid-them/',
                  description: 'BEM methodology for CSS architecture',
                  difficulty: 'advanced'
                }
              ]
            },
            // General courses for default fallback
            'default': {
              beginner: [
                {
                  title: 'Introduction to Programming',
                  type: 'tutorial',
                  url: 'https://www.freecodecamp.org/learn',
                  description: 'FreeCodeCamp\'s curriculum for beginners',
                  difficulty: 'beginner'
                },
                {
                  title: 'Khan Academy Computer Programming',
                  type: 'tutorial',
                  url: 'https://www.khanacademy.org/computing/computer-programming',
                  description: 'Khan Academy\'s free programming courses',
                  difficulty: 'beginner'
                }
              ],
              intermediate: [
                {
                  title: 'EdX Computer Science Courses',
                  type: 'tutorial',
                  url: 'https://www.edx.org/learn/computer-science',
                  description: 'Computer science courses from top universities',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Coursera Technology Learning',
                  type: 'tutorial',
                  url: 'https://www.coursera.org/browse/computer-science',
                  description: 'Technology courses from leading institutions',
                  difficulty: 'intermediate'
                }
              ],
              advanced: [
                {
                  title: 'MIT OpenCourseWare',
                  type: 'tutorial',
                  url: 'https://ocw.mit.edu/search/?d=Electrical%20Engineering%20and%20Computer%20Science',
                  description: 'Advanced computer science courses from MIT',
                  difficulty: 'advanced'
                },
                {
                  title: 'Stanford Online Courses',
                  type: 'tutorial',
                  url: 'https://online.stanford.edu/explore?type=course&field_topic_target_id=31',
                  description: 'Computer science courses from Stanford University',
                  difficulty: 'advanced'
                }
              ]
            }
          };
          
          // Normalize the topic name for lookup
          const normalizedTopic = topic.toLowerCase().trim();
          
          // Try to find specialized resources for the topic
          const topicResources = resourceMap[normalizedTopic] || resourceMap['default'];
          
          // Return resources based on difficulty level
          return topicResources[level.toLowerCase()] || topicResources['beginner'];
        };
        
        if (difficulty === 'beginner') {
          const fundamentalsResources = getResourcesForTopic(topic, 'beginner');
          
          topics = [
            {
              id: `${topic.toLowerCase()}-fundamentals`,
              title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Fundamentals`,
              description: `Learn the core concepts and basics of ${topic}.`,
              resources: fundamentalsResources
            },
            {
              id: `${topic.toLowerCase()}-concepts`,
              title: `Core ${topic.charAt(0).toUpperCase() + topic.slice(1)} Concepts`,
              description: `Understand the essential concepts in ${topic}.`,
              resources: [
                {
                  title: `${topic} Concepts Explained`,
                  type: 'article',
                  url: 'https://www.freecodecamp.org/news/',
                  description: `Articles explaining key ${topic} concepts on FreeCodeCamp`,
                  difficulty: 'beginner'
                },
                {
                  title: `Getting Started with ${topic}`,
                  type: 'tutorial',
                  url: 'https://www.w3schools.com/',
                  description: `W3Schools tutorials on ${topic}`,
                  difficulty: 'beginner'
                }
              ]
            }
          ];
        } else if (difficulty === 'intermediate') {
          const intermediateResources = getResourcesForTopic(topic, 'intermediate');
          
          topics = [
            {
              id: `${topic.toLowerCase()}-intermediate`,
              title: `Intermediate ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
              description: `Build upon your basic knowledge of ${topic} with more advanced concepts.`,
              resources: intermediateResources
            },
            {
              id: `${topic.toLowerCase()}-practical`,
              title: `Practical ${topic.charAt(0).toUpperCase() + topic.slice(1)} Applications`,
              description: `Learn how to apply ${topic} in practical scenarios.`,
              resources: [
                {
                  title: `${topic} Real-world Examples`,
                  type: 'project',
                  url: 'https://github.com/trending',
                  description: `Trending GitHub projects related to ${topic}`,
                  difficulty: 'intermediate'
                },
                {
                  title: `${topic} Case Studies`,
                  type: 'article',
                  url: 'https://medium.com/topic/technology',
                  description: `Medium articles on ${topic} technology`,
                  difficulty: 'intermediate'
                }
              ]
            }
          ];
        } else {
          const advancedResources = getResourcesForTopic(topic, 'advanced');
          
          topics = [
            {
              id: `${topic.toLowerCase()}-advanced`,
              title: `Advanced ${topic.charAt(0).toUpperCase() + topic.slice(1)} Techniques`,
              description: `Master advanced concepts and techniques in ${topic}.`,
              resources: advancedResources
            },
            {
              id: `${topic.toLowerCase()}-cutting-edge`,
              title: `Cutting-edge ${topic.charAt(0).toUpperCase() + topic.slice(1)} Developments`,
              description: `Stay updated with the latest developments in ${topic}.`,
              resources: [
                {
                  title: `${topic} Research Advances`,
                  type: 'article',
                  url: 'https://arxiv.org/search/?query=' + encodeURIComponent(topic) + '&searchtype=all',
                  description: `Research papers on ${topic} from arXiv`,
                  difficulty: 'advanced'
                },
                {
                  title: `Advanced ${topic} Techniques`,
                  type: 'tutorial',
                  url: 'https://www.udemy.com/courses/search/?src=ukw&q=' + encodeURIComponent(topic),
                  description: `Udemy advanced courses on ${topic}`,
                  difficulty: 'advanced'
                }
              ]
            }
          ];
        }
      }
      
      // Create a new plan
      const newPlan: LearningPlan = {
        id: `${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Learning Path`,
        description: `A personalized learning plan for ${topic} at ${difficulty} level.`,
        estimatedTime: difficulty === 'beginner' ? '5-10 hours' : (difficulty === 'intermediate' ? '10-20 hours' : '20-40 hours'),
        skillLevel: skillLevel,
        createdAt: new Date().toISOString(),
        progress: 0,
        topics: topics
      };
      
      console.log('Created new learning plan:', newPlan.title);
      
      // Add the new plan to the list
      setLearningPlans(prevPlans => [newPlan, ...prevPlans]);
      
      // Select the new plan
      setActivePlanId(newPlan.id);
      setSelectedTopic(newPlan.topics[0].id);
      
    } catch (error) {
      console.error('Error generating learning plan:', error);
    }
  }
  
  async function handleToggleResourceCompletion(topicId: string, resourceIndex: number) {
    if (!activePlanId) return;
    
    // Create a copy of the learning plans
    const updatedPlans = [...learningPlans];
    
    // Find the active plan
    const planIndex = updatedPlans.findIndex(p => p.id === activePlanId);
    if (planIndex === -1) return;
    
    // Find the topic
    const topicIndex = updatedPlans[planIndex].topics.findIndex(t => t.id === topicId);
    if (topicIndex === -1) return;
    
    // Toggle the resource completion status
    const resource = updatedPlans[planIndex].topics[topicIndex].resources[resourceIndex];
    resource.completed = !resource.completed;
    
    // Update topic progress
    const topic = updatedPlans[planIndex].topics[topicIndex];
    const completedResources = topic.resources.filter(r => r.completed).length;
    topic.progress = (completedResources / topic.resources.length) * 100;
    
    // Update overall plan progress
    const totalResources = updatedPlans[planIndex].topics.reduce(
      (sum, topic) => sum + topic.resources.length, 0
    );
    const totalCompleted = updatedPlans[planIndex].topics.reduce(
      (sum, topic) => sum + topic.resources.filter(r => r.completed).length, 0
    );
    updatedPlans[planIndex].progress = (totalCompleted / totalResources) * 100;
    
    // Update the state
    setLearningPlans(updatedPlans);
    
    // In a real app, we'd also update the database
    console.log(`Toggled completion for resource ${resource.title} in topic ${topicId}`);
  }
  
  function getResourceTypeIcon(type: string) {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'tutorial': return <BookOpen className="h-4 w-4" />;
      case 'exercise': return <Code className="h-4 w-4" />;
      case 'project': return <Code className="h-4 w-4" />;
      case 'book': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  }
  
  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  const handleCreatePlan = () => {
    setShowCreateModal(true);
  };
  
  const handleCreatePlanSubmit = () => {
    if (!newPlanData.topic.trim()) {
      return; // Don't submit if topic is empty
    }
    
    generateLearningPlan(newPlanData.topic.toLowerCase(), 0, newPlanData.difficulty);
    setShowCreateModal(false);
    
    // Reset form
    setNewPlanData({
      topic: '',
      difficulty: 'beginner'
    });
  };
  
  const handleResetPlans = () => {
    if (confirm('Are you sure you want to reset all your learning plans? This action cannot be undone.')) {
      localStorage.removeItem('learningPlans');
      setLearningPlans(mockPlans);
      
      if (mockPlans.length > 0) {
        setActivePlanId(mockPlans[0].id);
        setSelectedTopic(mockPlans[0].topics[0].id);
      } else {
        setActivePlanId(null);
        setSelectedTopic(null);
      }
    }
  };
  
  const activePlan = learningPlans.find(p => p.id === activePlanId);
  const activeTopic = activePlan?.topics.find(t => t.id === selectedTopic);
  
  if (isLoading) {
    return <div className="container mx-auto p-6 text-center">Loading learning plans...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning Plans</h1>
          <p className="text-gray-600">
            Personalized learning paths based on your skills and goals.
          </p>
        </div>
        
        <div className="flex gap-3">
          {topicParam && sourceParam === 'quiz' && scoreParam && (
            <Button 
              variant="outline"
              onClick={() => {
                const score = parseInt(scoreParam, 10);
                generateLearningPlan(topicParam, score);
              }}
            >
              Regenerate Plan from Quiz
            </Button>
          )}
          <Button onClick={handleCreatePlan}>
            Create New Plan
          </Button>
          {learningPlans.length > mockPlans.length && (
            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={handleResetPlans}>
              Reset Plans
            </Button>
          )}
        </div>
      </div>
      
      {learningPlans.length === 0 ? (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Learning Plans Yet</h2>
          <p className="text-gray-600 mb-6">
            Take an assessment to get a personalized learning plan or create one manually.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.href = '/assessments'}>
              Take Assessment
            </Button>
            <Button variant="outline" onClick={handleCreatePlan}>
              Create Plan Manually
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Learning Plans Sidebar */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Your Plans</h2>
            <div className="space-y-4">
              {learningPlans.map(plan => (
                <Card 
                  key={plan.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    activePlanId === plan.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  <h3 className="font-semibold text-lg">{plan.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-1 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {plan.estimatedTime}
                    </span>
                    <Badge className={getDifficultyColor(plan.skillLevel)}>
                      {plan.skillLevel}
                    </Badge>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round(plan.progress)}%</span>
                    </div>
                    <Progress value={plan.progress} className="h-2" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Learning Plan Content */}
          <div className="md:col-span-2">
            {activePlan ? (
              <div>
                <div className="bg-white rounded-lg border p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-2">{activePlan.title}</h2>
                  <p className="text-gray-600 mb-4">{activePlan.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 rounded p-3">
                      <div className="text-sm text-gray-500">Estimated Time</div>
                      <div className="font-semibold flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {activePlan.estimatedTime}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded p-3">
                      <div className="text-sm text-gray-500">Skill Level</div>
                      <div className="font-semibold flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" /> {activePlan.skillLevel.charAt(0).toUpperCase() + activePlan.skillLevel.slice(1)}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded p-3">
                      <div className="text-sm text-gray-500">Topics</div>
                      <div className="font-semibold">{activePlan.topics.length}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>{Math.round(activePlan.progress)}%</span>
                    </div>
                    <Progress value={activePlan.progress} className="h-2" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border p-6">
                  <Tabs defaultValue={activePlan.topics[0].id} value={selectedTopic || undefined} onValueChange={setSelectedTopic}>
                    <TabsList className="mb-6">
                      {activePlan.topics.map(topic => (
                        <TabsTrigger key={topic.id} value={topic.id}>
                          {topic.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {activePlan.topics.map(topic => (
                      <TabsContent key={topic.id} value={topic.id}>
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
                          <p className="text-gray-600">{topic.description}</p>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Topic Progress</span>
                            <span>{Math.round(topic.progress || 0)}%</span>
                          </div>
                          <Progress value={topic.progress || 0} className="h-2" />
                        </div>
                        
                        <h4 className="text-lg font-semibold mt-6 mb-4">Learning Resources</h4>
                        <div className="space-y-4">
                          {topic.resources.map((resource, index) => (
                            <div 
                              key={index} 
                              className={`border rounded-lg p-4 ${resource.completed ? 'bg-green-50 border-green-200' : ''}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getResourceTypeIcon(resource.type)}
                                    <a 
                                      href={resource.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="font-semibold hover:text-blue-600"
                                    >
                                      {resource.title}
                                    </a>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                                  <div className="flex gap-2">
                                    <Badge className={getDifficultyColor(resource.difficulty)}>
                                      {resource.difficulty}
                                    </Badge>
                                    <Badge variant="outline" className="bg-gray-100">
                                      {resource.type}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <Button 
                                    variant={resource.completed ? "default" : "outline"} 
                                    size="sm"
                                    onClick={() => handleToggleResourceCompletion(topic.id, index)}
                                  >
                                    {resource.completed ? 'Completed' : 'Mark as Done'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">No Plan Selected</h2>
                <p className="text-gray-600">
                  Please select a learning plan from the sidebar or create a new one.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Modal Implementation Instead of Dialog Component */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative p-4 w-full max-w-md h-auto">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                    Create New Learning Plan
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="topic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Topic
                      </label>
                      <input 
                        type="text" 
                        id="topic" 
                        value={newPlanData.topic}
                        onChange={(e) => setNewPlanData({...newPlanData, topic: e.target.value})}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="e.g. JavaScript, Python, Machine Learning"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="difficulty" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Difficulty Level
                      </label>
                      <select
                        id="difficulty"
                        value={newPlanData.difficulty}
                        onChange={(e) => setNewPlanData({...newPlanData, difficulty: e.target.value})}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => {
                    if (newPlanData.topic) {
                      generateLearningPlan(newPlanData.topic, 0, newPlanData.difficulty);
                      setShowCreateModal(false);
                      setNewPlanData({
                        topic: '',
                        difficulty: 'beginner'
                      });
                    }
                  }}
                >
                  Create Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 