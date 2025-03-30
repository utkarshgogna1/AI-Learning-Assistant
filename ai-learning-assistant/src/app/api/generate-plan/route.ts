import { NextResponse } from 'next/server';

interface PlanRequest {
  question: string;
  userId?: string;
}

interface LearningStep {
  title: string;
  description: string;
  resources: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'tutorial' | 'exercise' | 'project';
    description: string;
  }[];
}

interface LearningPlan {
  title: string;
  description: string;
  steps: LearningStep[];
  additionalResources: {
    title: string;
    url: string;
    description: string;
  }[];
}

// Database of topics with related resources and learning steps
const learningPlansDB: Record<string, {
  title: string;
  description: string;
  steps: Array<{
    title: string;
    description: string;
    resources: Array<{
      title: string;
      url: string;
      type: 'article' | 'video' | 'tutorial' | 'exercise' | 'project';
      description: string;
    }>
  }>;
  additionalResources: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}> = {
  'python': {
    title: 'Python Programming Learning Path',
    description: 'A comprehensive learning path to master Python programming from basics to advanced concepts.',
    steps: [
      {
        title: 'Python Basics and Syntax',
        description: 'Start with Python fundamentals, syntax, and basic programming concepts.',
        resources: [
          {
            title: 'Python for Beginners - Learn Python Programming',
            url: 'https://www.python.org/about/gettingstarted/',
            type: 'tutorial',
            description: 'Official Python getting started guide with installation instructions and basic concepts.'
          },
          {
            title: 'Python Basics Tutorial',
            url: 'https://www.w3schools.com/python/',
            type: 'tutorial',
            description: 'Interactive tutorial with examples covering Python syntax, variables, data types, and basic operations.'
          },
          {
            title: 'Python Crash Course - Introduction',
            url: 'https://nostarch.com/python-crash-course-3rd-edition',
            type: 'article',
            description: 'First chapter of the popular Python Crash Course book, covering basic syntax and programming concepts.'
          }
        ]
      },
      {
        title: 'Data Structures in Python',
        description: 'Learn about Python\'s built-in data structures like lists, dictionaries, sets, and tuples.',
        resources: [
          {
            title: 'Python Data Structures Tutorial',
            url: 'https://realpython.com/python-data-structures/',
            type: 'article',
            description: 'Comprehensive guide to Python\'s built-in data structures with examples and use cases.'
          },
          {
            title: 'Python Data Structures - Video Course',
            url: 'https://www.youtube.com/watch?v=R-HLU9Fl5ug',
            type: 'video',
            description: 'Visual explanation of Python data structures with practical examples and performance considerations.'
          },
          {
            title: 'Python Collections - Practice Exercises',
            url: 'https://pynative.com/python-data-structure-exercise-for-beginners/',
            type: 'exercise',
            description: 'Hands-on exercises to practice working with Python data structures and solve common problems.'
          }
        ]
      },
      {
        title: 'Functions and Modules',
        description: 'Create reusable code with functions, understand scope, and organize code with modules.',
        resources: [
          {
            title: 'Python Functions Tutorial',
            url: 'https://www.programiz.com/python-programming/function',
            type: 'tutorial',
            description: 'Learn how to define and use functions in Python, including parameters, return values, and scope.'
          },
          {
            title: 'Python Modules and Packages',
            url: 'https://realpython.com/python-modules-packages/',
            type: 'article',
            description: 'In-depth guide to creating, importing, and using modules and packages to organize Python code.'
          },
          {
            title: 'Function Practice Project: Temperature Converter',
            url: 'https://thepythoncode.com/article/build-temperature-converter-app-in-python',
            type: 'project',
            description: 'Apply your knowledge of functions by building a practical temperature conversion application.'
          }
        ]
      },
      {
        title: 'Object-Oriented Programming in Python',
        description: 'Master classes, objects, inheritance, and other OOP concepts in Python.',
        resources: [
          {
            title: 'Python OOP Tutorial',
            url: 'https://realpython.com/python3-object-oriented-programming/',
            type: 'tutorial',
            description: 'Comprehensive guide to object-oriented programming in Python with practical examples.'
          },
          {
            title: 'Classes and Objects - Video Course',
            url: 'https://www.youtube.com/watch?v=-pEs-Bss8Wc',
            type: 'video',
            description: 'Visual explanation of classes, objects, inheritance, and polymorphism in Python.'
          },
          {
            title: 'OOP Project: Banking System',
            url: 'https://thepythoncode.com/article/create-a-banking-system-using-oop-in-python',
            type: 'project',
            description: 'Build a simple banking system to practice OOP concepts like classes, inheritance, and encapsulation.'
          }
        ]
      }
    ],
    additionalResources: [
      {
        title: 'Python Documentation',
        url: 'https://docs.python.org/3/',
        description: 'Official Python documentation with comprehensive references for all language features.'
      },
      {
        title: 'Python Cookbook: Recipes for Mastering Python 3',
        url: 'https://www.oreilly.com/library/view/python-cookbook-3rd/9781449357337/',
        description: 'Collection of practical recipes for solving common Python programming problems.'
      },
      {
        title: 'Real Python',
        url: 'https://realpython.com/',
        description: 'Website with tutorials, articles, and courses covering a wide range of Python topics from basics to advanced.'
      }
    ]
  },
  'javascript': {
    title: 'JavaScript Development Learning Path',
    description: 'Master JavaScript from fundamentals to advanced concepts for web development.',
    steps: [
      {
        title: 'JavaScript Basics',
        description: 'Learn JavaScript syntax, variables, data types, and control structures.',
        resources: [
          {
            title: 'JavaScript Basics - MDN Web Docs',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics',
            type: 'tutorial',
            description: 'Mozilla\'s beginner-friendly introduction to JavaScript with interactive examples.'
          },
          {
            title: 'JavaScript Fundamentals',
            url: 'https://javascript.info/first-steps',
            type: 'tutorial',
            description: 'Modern JavaScript tutorial covering language fundamentals with clear explanations.'
          },
          {
            title: 'Intro to JavaScript - Video Course',
            url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            type: 'video',
            description: 'One-hour crash course covering essential JavaScript concepts for beginners.'
          }
        ]
      },
      {
        title: 'Functions and Objects',
        description: 'Master JavaScript functions, objects, and this keyword.',
        resources: [
          {
            title: 'JavaScript Functions - MDN',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
            type: 'article',
            description: 'Comprehensive guide to functions, parameters, and scope in JavaScript.'
          },
          {
            title: 'JavaScript Objects In Detail',
            url: 'https://www.javascripttutorial.net/javascript-objects/',
            type: 'tutorial',
            description: 'Learn to create, access, and manipulate objects in JavaScript.'
          },
          {
            title: 'Understanding This in JavaScript',
            url: 'https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/',
            type: 'article',
            description: 'Detailed explanation of how the "this" keyword works in different contexts.'
          }
        ]
      },
      {
        title: 'DOM Manipulation',
        description: 'Learn to interact with web pages by manipulating the Document Object Model.',
        resources: [
          {
            title: 'DOM Manipulation - MDN',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents',
            type: 'tutorial',
            description: 'Mozilla\'s guide to selecting elements and manipulating web page content with JavaScript.'
          },
          {
            title: 'JavaScript DOM Manipulation - Video Course',
            url: 'https://www.youtube.com/watch?v=5fb2aPlgoys',
            type: 'video',
            description: 'Video series demonstrating how to select, modify, and create HTML elements with JavaScript.'
          },
          {
            title: 'Interactive Dashboard Project',
            url: 'https://www.freecodecamp.org/news/javascript-projects-for-beginners/#data-dashboard-project',
            type: 'project',
            description: 'Build a simple data dashboard to practice DOM manipulation and event handling.'
          }
        ]
      },
      {
        title: 'Asynchronous JavaScript',
        description: 'Master async programming with callbacks, promises, and async/await.',
        resources: [
          {
            title: 'Asynchronous JavaScript - MDN',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous',
            type: 'tutorial',
            description: 'Mozilla\'s guide to asynchronous programming concepts in JavaScript.'
          },
          {
            title: 'JavaScript Promises and Async/Await',
            url: 'https://javascript.info/async',
            type: 'article',
            description: 'In-depth explanation of promises, async/await, and error handling.'
          },
          {
            title: 'Weather App Project',
            url: 'https://www.theodinproject.com/lessons/node-path-javascript-weather-app',
            type: 'project',
            description: 'Build a weather app that fetches data from an API using async JavaScript.'
          }
        ]
      }
    ],
    additionalResources: [
      {
        title: 'JavaScript - MDN Web Docs',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        description: 'Mozilla\'s comprehensive JavaScript documentation with tutorials and references.'
      },
      {
        title: 'Eloquent JavaScript',
        url: 'https://eloquentjavascript.net/',
        description: 'Free online book covering JavaScript from basics to advanced concepts.'
      },
      {
        title: 'JavaScript.info',
        url: 'https://javascript.info/',
        description: 'Modern JavaScript tutorial with clear explanations and interactive examples.'
      }
    ]
  },
  'react': {
    title: 'React Development Learning Path',
    description: 'Master React for building modern user interfaces and web applications.',
    steps: [
      {
        title: 'React Fundamentals',
        description: 'Learn the basics of React, components, and JSX syntax.',
        resources: [
          {
            title: 'React Official Tutorial',
            url: 'https://react.dev/learn',
            type: 'tutorial',
            description: 'Official React tutorial covering the fundamentals of React development.'
          },
          {
            title: 'React Beginner\'s Guide',
            url: 'https://www.freecodecamp.org/news/react-beginners-guide/',
            type: 'article',
            description: 'Comprehensive beginner\'s guide to React with practical examples.'
          },
          {
            title: 'React Crash Course',
            url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            type: 'video',
            description: 'Free video course covering React fundamentals in a hands-on manner.'
          }
        ]
      },
      {
        title: 'State Management in React',
        description: 'Learn to manage state in React with hooks, context, and state libraries.',
        resources: [
          {
            title: 'React Hooks Tutorial',
            url: 'https://react.dev/reference/react',
            type: 'tutorial',
            description: 'Official guide to using React hooks like useState, useEffect, and useContext.'
          },
          {
            title: 'State Management in React',
            url: 'https://kentcdodds.com/blog/application-state-management-with-react',
            type: 'article',
            description: 'In-depth article on approaches to state management in React applications.'
          },
          {
            title: 'Todo App with React Hooks',
            url: 'https://www.digitalocean.com/community/tutorials/how-to-build-a-react-to-do-app-with-react-hooks',
            type: 'project',
            description: 'Build a todo application to practice state management with React hooks.'
          }
        ]
      },
      {
        title: 'React Routing and Navigation',
        description: 'Implement navigation in single-page React applications.',
        resources: [
          {
            title: 'React Router Tutorial',
            url: 'https://reactrouter.com/en/main/start/tutorial',
            type: 'tutorial',
            description: 'Official React Router tutorial for handling navigation in React applications.'
          },
          {
            title: 'Navigation for SPAs',
            url: 'https://ui.dev/react-router-tutorial',
            type: 'article',
            description: 'Comprehensive guide to implementing navigation in single-page applications.'
          },
          {
            title: 'Multi-page React Application',
            url: 'https://www.freecodecamp.org/news/react-router-in-5-minutes/',
            type: 'exercise',
            description: 'Hands-on exercise to practice implementing routing in a React application.'
          }
        ]
      },
      {
        title: 'API Integration and Data Fetching',
        description: 'Learn to fetch and display data from APIs in React applications.',
        resources: [
          {
            title: 'Fetching Data in React',
            url: 'https://www.robinwieruch.de/react-hooks-fetch-data/',
            type: 'tutorial',
            description: 'Tutorial on using React hooks to fetch and display data from APIs.'
          },
          {
            title: 'React Query Guide',
            url: 'https://tanstack.com/query/latest/docs/react/overview',
            type: 'article',
            description: 'Introduction to React Query for efficient data fetching and state management.'
          },
          {
            title: 'Recipe App Project',
            url: 'https://www.freecodecamp.org/news/create-a-recipe-app-with-react/',
            type: 'project',
            description: 'Build a recipe application that fetches and displays data from a food API.'
          }
        ]
      }
    ],
    additionalResources: [
      {
        title: 'React Documentation',
        url: 'https://react.dev/',
        description: 'Official React documentation with comprehensive guides and API references.'
      },
      {
        title: 'React Patterns',
        url: 'https://reactpatterns.com/',
        description: 'Collection of common design patterns and best practices for React development.'
      },
      {
        title: 'The Road to React',
        url: 'https://www.roadtoreact.com/',
        description: 'Book covering React fundamentals and advanced concepts with practical examples.'
      }
    ]
  },
  'web-development': {
    title: 'Web Development Learning Path',
    description: 'Master the fundamentals of web development, including HTML, CSS, and JavaScript.',
    steps: [
      {
        title: 'HTML and CSS Fundamentals',
        description: 'Learn the building blocks of web pages: HTML for structure and CSS for styling.',
        resources: [
          {
            title: 'HTML & CSS Basics - MDN',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web',
            type: 'tutorial',
            description: 'Mozilla\'s beginner-friendly introduction to HTML and CSS.'
          },
          {
            title: 'HTML & CSS Crash Course',
            url: 'https://www.youtube.com/watch?v=916GWv2Qs08',
            type: 'video',
            description: 'Quick video introduction to HTML and CSS fundamentals.'
          },
          {
            title: 'Build Your First Website',
            url: 'https://www.freecodecamp.org/news/html-css-tutorial-build-a-recipe-website/',
            type: 'project',
            description: 'Practice HTML and CSS by building a simple recipe website.'
          }
        ]
      },
      {
        title: 'JavaScript Basics',
        description: 'Add interactivity to web pages with JavaScript fundamentals.',
        resources: [
          {
            title: 'JavaScript Basics - MDN',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps',
            type: 'tutorial',
            description: 'Mozilla\'s introduction to JavaScript for web development.'
          },
          {
            title: 'JavaScript for Web Development',
            url: 'https://javascript.info/document',
            type: 'article',
            description: 'Guide to using JavaScript to manipulate web pages and handle user interactions.'
          },
          {
            title: 'Interactive Form Validation',
            url: 'https://www.freecodecamp.org/news/form-validation-with-html5-and-javascript/',
            type: 'exercise',
            description: 'Practice JavaScript by implementing form validation on a web page.'
          }
        ]
      },
      {
        title: 'Responsive Web Design',
        description: 'Make websites that work well on all devices and screen sizes.',
        resources: [
          {
            title: 'Responsive Web Design Fundamentals',
            url: 'https://web.dev/responsive-web-design-basics/',
            type: 'tutorial',
            description: 'Google\'s guide to creating websites that work well on mobile, tablet, and desktop.'
          },
          {
            title: 'CSS Flexbox and Grid',
            url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
            type: 'article',
            description: 'Visual guide to CSS Flexbox and Grid layouts for responsive designs.'
          },
          {
            title: 'Responsive Portfolio Project',
            url: 'https://www.freecodecamp.org/news/how-to-create-a-portfolio-website-using-html-css-javascript-and-bootstrap/',
            type: 'project',
            description: 'Build a responsive portfolio website to showcase your work.'
          }
        ]
      },
      {
        title: 'Frontend Frameworks',
        description: 'Learn a modern frontend framework like React, Vue, or Angular.',
        resources: [
          {
            title: 'React Fundamentals',
            url: 'https://react.dev/learn/tutorial-tic-tac-toe',
            type: 'tutorial',
            description: 'Official React tutorial building a simple game application.'
          },
          {
            title: 'Vue.js Guide',
            url: 'https://vuejs.org/guide/introduction.html',
            type: 'tutorial',
            description: 'Official Vue.js guide for building interactive web interfaces.'
          },
          {
            title: 'Angular Tour of Heroes',
            url: 'https://angular.io/tutorial',
            type: 'tutorial',
            description: 'Official Angular tutorial building a complete application.'
          }
        ]
      }
    ],
    additionalResources: [
      {
        title: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/',
        description: 'Comprehensive documentation for web technologies including HTML, CSS, and JavaScript.'
      },
      {
        title: 'Frontend Masters',
        url: 'https://frontendmasters.com/',
        description: 'Advanced courses on all aspects of frontend web development.'
      },
      {
        title: 'CSS-Tricks',
        url: 'https://css-tricks.com/',
        description: 'Website with articles, tutorials, and guides on CSS and frontend development.'
      }
    ]
  },
  'data-science': {
    title: 'Data Science Learning Path',
    description: 'Master the essential skills for data science and analytics.',
    steps: [
      {
        title: 'Python for Data Science',
        description: 'Learn Python programming fundamentals with a focus on data analysis.',
        resources: [
          {
            title: 'Python for Data Science Handbook',
            url: 'https://jakevdp.github.io/PythonDataScienceHandbook/',
            type: 'tutorial',
            description: 'Comprehensive free book covering Python basics for data science applications.'
          },
          {
            title: 'Introduction to Python for Data Science',
            url: 'https://www.datacamp.com/courses/intro-to-python-for-data-science',
            type: 'tutorial',
            description: 'Interactive course introducing Python specifically for data science applications.'
          },
          {
            title: 'NumPy and Pandas Crash Course',
            url: 'https://www.youtube.com/watch?v=vmEHCJofslg',
            type: 'video',
            description: 'Video tutorial on NumPy and Pandas, the essential libraries for data manipulation in Python.'
          }
        ]
      },
      {
        title: 'Data Visualization',
        description: 'Learn to create compelling visualizations to communicate data insights.',
        resources: [
          {
            title: 'Data Visualization with Matplotlib and Seaborn',
            url: 'https://www.kaggle.com/learn/data-visualization',
            type: 'tutorial',
            description: 'Kaggle\'s tutorial on creating effective data visualizations with Python libraries.'
          },
          {
            title: 'Visualization Best Practices',
            url: 'https://www.tableau.com/learn/articles/data-visualization-tips',
            type: 'article',
            description: 'Guide to best practices for creating clear and effective data visualizations.'
          },
          {
            title: 'Dashboard Creation Project',
            url: 'https://www.analyticsvidhya.com/blog/2020/12/build-powerful-dashboards-using-plotly-dash/',
            type: 'project',
            description: 'Build an interactive dashboard to visualize and explore a dataset of your choice.'
          }
        ]
      },
      {
        title: 'Statistical Analysis',
        description: 'Master statistical concepts and techniques for data analysis.',
        resources: [
          {
            title: 'Statistics for Data Science',
            url: 'https://www.coursera.org/learn/statistics-for-data-science-python',
            type: 'tutorial',
            description: 'Course covering statistical concepts fundamental to data science.'
          },
          {
            title: 'Practical Statistics for Data Scientists',
            url: 'https://www.oreilly.com/library/view/practical-statistics-for/9781491952955/',
            type: 'article',
            description: 'Book focusing on statistical methods specifically relevant to data science.'
          },
          {
            title: 'A/B Testing Project',
            url: 'https://www.kaggle.com/code/tammyrotem/ab-tests-with-python',
            type: 'exercise',
            description: 'Practice designing and analyzing A/B tests to make data-driven decisions.'
          }
        ]
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Learn the basics of machine learning algorithms and their applications.',
        resources: [
          {
            title: 'Machine Learning Crash Course',
            url: 'https://developers.google.com/machine-learning/crash-course',
            type: 'tutorial',
            description: 'Google\'s comprehensive introduction to machine learning concepts.'
          },
          {
            title: 'Scikit-Learn Tutorial',
            url: 'https://scikit-learn.org/stable/tutorial/index.html',
            type: 'tutorial',
            description: 'Official tutorial for Scikit-Learn, the most popular Python machine learning library.'
          },
          {
            title: 'Titanic Machine Learning Project',
            url: 'https://www.kaggle.com/competitions/titanic/overview',
            type: 'project',
            description: 'Classic machine learning project to predict Titanic passenger survival.'
          }
        ]
      }
    ],
    additionalResources: [
      {
        title: 'Kaggle',
        url: 'https://www.kaggle.com/',
        description: 'Platform with datasets, competitions, and tutorials for data science and machine learning.'
      },
      {
        title: 'Towards Data Science',
        url: 'https://towardsdatascience.com/',
        description: 'Publication with articles on all aspects of data science from industry practitioners.'
      },
      {
        title: 'Data Science Stack Exchange',
        url: 'https://datascience.stackexchange.com/',
        description: 'Q&A site for data science professionals and enthusiasts.'
      }
    ]
  }
};

export async function POST(req: Request) {
  try {
    const requestData: PlanRequest = await req.json();
    
    if (!requestData.question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }
    
    // Generate a learning plan
    const learningPlan = generateLearningPlan(requestData.question, requestData.userId || 'guest-user');
    
    return NextResponse.json(learningPlan);
  } catch (error) {
    console.error('Error generating learning plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate learning plan' },
      { status: 500 }
    );
  }
}

function generateLearningPlan(question: string, userId: string): LearningPlan {
  // In a real app, this would use NLP to analyze the question
  // and generate a custom learning plan
  
  // Simplified approach: match keywords in the question to predefined learning plans
  const lowerQuestion = question.toLowerCase();
  let selectedPlan = 'python'; // Default plan
  
  // Check for language/topic keywords
  if (lowerQuestion.includes('javascript') || lowerQuestion.includes('js')) {
    selectedPlan = 'javascript';
  } else if (lowerQuestion.includes('react') || lowerQuestion.includes('frontend framework')) {
    selectedPlan = 'react';
  } else if (
    lowerQuestion.includes('web') || 
    lowerQuestion.includes('html') || 
    lowerQuestion.includes('css') ||
    lowerQuestion.includes('frontend')
  ) {
    selectedPlan = 'web-development';
  } else if (
    lowerQuestion.includes('data science') || 
    lowerQuestion.includes('machine learning') || 
    lowerQuestion.includes('data analysis') ||
    lowerQuestion.includes('statistics')
  ) {
    selectedPlan = 'data-science';
  }
  
  // Get the plan from our database
  const plan = learningPlansDB[selectedPlan];
  
  // Customize the title and description based on the question
  let customTitle = plan.title;
  let customDescription = `Learning plan for: "${question}"\n\n${plan.description}`;
  
  // Additional customization based on question specifics
  if (lowerQuestion.includes('beginner') || lowerQuestion.includes('start') || lowerQuestion.includes('new to')) {
    customTitle = `Beginner's Guide to ${customTitle}`;
    // For beginners, we might want to focus on the first couple of steps
  } else if (lowerQuestion.includes('advanced') || lowerQuestion.includes('expert')) {
    customTitle = `Advanced ${customTitle}`;
    // For advanced users, we might want to skip the beginner content
  }
  
  // Return the plan with customizations
  return {
    title: customTitle,
    description: customDescription,
    steps: plan.steps,
    additionalResources: plan.additionalResources
  };
} 