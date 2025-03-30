'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, FileText, Code, GraduationCap, Clock } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  const supabase = createClientComponentClient();
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
    
    // For demo, we'll use the mock data
    setLearningPlans(mockPlans);
    
    if (mockPlans.length > 0) {
      setActivePlanId(mockPlans[0].id);
      setSelectedTopic(mockPlans[0].topics[0].id);
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
  
  function handleSelectPlan(planId: string) {
    setActivePlanId(planId);
    
    // Also select the first topic of this plan
    const plan = learningPlans.find(p => p.id === planId);
    if (plan && plan.topics.length > 0) {
      setSelectedTopic(plan.topics[0].id);
    }
  }
  
  async function generateLearningPlan(topic: string, score: number) {
    // For demo purposes, we'll just add a new plan to the list
    try {
      // In a real app, this would call an API endpoint
      console.log(`Generating learning plan for topic: ${topic} with score: ${score}`);
      
      // Simulate API call delay
      console.log('Simulating API delay...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Determine skill level and focus based on score
      const skillLevel = score > 70 ? 'advanced' : score > 40 ? 'intermediate' : 'beginner';
      console.log(`Determined skill level: ${skillLevel} based on score: ${score}`);
      
      // Create topics based on skill level
      let topics: LearningPlanTopic[] = [];
      
      if (topic === 'python') {
        if (skillLevel === 'beginner') {
          topics = [
            {
              id: `${topic}-basics`,
              title: 'Python Fundamentals',
              description: 'Learn the basics of Python programming including syntax, variables, and data types',
              progress: 0,
              resources: [
                {
                  title: 'Python for Beginners',
                  type: 'article',
                  url: 'https://docs.python.org/3/tutorial/index.html',
                  description: 'The official Python tutorial',
                  difficulty: 'beginner',
                  completed: false
                },
                {
                  title: 'Python Basics - Video Course',
                  type: 'video',
                  url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
                  description: 'Comprehensive Python introduction',
                  difficulty: 'beginner',
                  completed: false
                }
              ]
            },
            {
              id: `${topic}-control-flow`,
              title: 'Control Flow in Python',
              description: 'Master Python conditionals, loops, and control structures',
              progress: 0,
              resources: [
                {
                  title: 'Python Control Flow',
                  type: 'article',
                  url: 'https://docs.python.org/3/tutorial/controlflow.html',
                  description: 'Official documentation on control flow statements',
                  difficulty: 'beginner',
                  completed: false
                }
              ]
            }
          ];
        } else if (skillLevel === 'intermediate') {
          topics = [
            {
              id: `${topic}-data-structures`,
              title: 'Python Data Structures',
              description: 'Deep dive into Python data structures like lists, dictionaries, and sets',
              progress: 0,
              resources: [
                {
                  title: 'Python Data Structures Guide',
                  type: 'article',
                  url: 'https://docs.python.org/3/tutorial/datastructures.html',
                  description: 'Comprehensive guide to Python data structures',
                  difficulty: 'intermediate',
                  completed: false
                }
              ]
            }
          ];
        }
      } else if (topic === 'javascript') {
        if (skillLevel === 'beginner') {
          topics = [
            {
              id: `${topic}-basics`,
              title: 'JavaScript Fundamentals',
              description: 'Core JavaScript concepts and syntax',
              progress: 0,
              resources: [
                {
                  title: 'JavaScript Guide',
                  type: 'article',
                  url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
                  description: 'MDN JavaScript guide',
                  difficulty: 'beginner',
                  completed: false
                }
              ]
            }
          ];
        } else if (skillLevel === 'intermediate') {
          topics = [
            {
              id: `${topic}-async`,
              title: 'Asynchronous JavaScript',
              description: 'Master promises, async/await, and callbacks',
              progress: 0,
              resources: [
                {
                  title: 'JavaScript Promises',
                  type: 'article',
                  url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
                  description: 'Guide to using promises in JavaScript',
                  difficulty: 'intermediate',
                  completed: false
                }
              ]
            }
          ];
        }
      }
      
      // If no specific topics were created, use default
      if (topics.length === 0) {
        topics = [
          {
            id: `${topic}-basics`,
            title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Basics`,
            description: `Learn the fundamentals of ${topic}`,
            progress: 0,
            resources: [
              {
                title: `Introduction to ${topic}`,
                type: 'article',
                url: `https://example.com/${topic}/intro`,
                description: `A beginner-friendly introduction to ${topic}`,
                difficulty: 'beginner',
                completed: false
              },
              {
                title: `${topic} Tutorial for Beginners`,
                type: 'video',
                url: `https://example.com/${topic}/tutorial`,
                description: `Step-by-step guide to ${topic}`,
                difficulty: 'beginner',
                completed: false
              }
            ]
          }
        ];
      }
      
      // Create a new mock plan
      const newPlan: LearningPlan = {
        id: `${topic}-${Date.now()}`,
        title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Learning Path`,
        description: `A personalized learning plan for ${topic} based on your assessment results (Score: ${score}%).`,
        estimatedTime: '5 hours',
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
    // In a real app, this would open a form or redirect to a page
    // For demo, we'll just generate a random plan
    const topics = ['javascript', 'python', 'react', 'nodejs'];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const randomScore = Math.floor(Math.random() * 100);
    
    generateLearningPlan(randomTopic, randomScore);
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
    </div>
  );
} 