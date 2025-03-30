import { NextResponse } from 'next/server';

interface QuizRequest {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  count?: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
}

interface QuizResponse {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
}

// Structured knowledge base for quiz questions
const quizKnowledgeBase: Record<string, QuizQuestion[]> = {
  'python': [
    // Beginner Python Questions
    {
      id: 'py-b-1',
      question: 'What is the correct way to create a variable named "age" with the value 25?',
      options: [
        'age = 25',
        'int age = 25',
        'var age = 25',
        'age := 25'
      ],
      correctAnswer: 'age = 25',
      explanation: 'In Python, variables are created by assigning a value to a name. There is no need to declare a type, as Python is dynamically typed. The correct syntax is "age = 25".',
      difficulty: 'beginner',
      topics: ['variables', 'syntax']
    },
    {
      id: 'py-b-2',
      question: 'Which of the following is a valid comment in Python?',
      options: [
        '// This is a comment',
        '/* This is a comment */',
        '# This is a comment',
        '<!-- This is a comment -->'
      ],
      correctAnswer: '# This is a comment',
      explanation: 'In Python, comments start with the # character and continue to the end of the line. Python does not support multi-line comment syntax like /* */ used in many other languages.',
      difficulty: 'beginner',
      topics: ['syntax', 'comments']
    },
    {
      id: 'py-b-3',
      question: 'What will the following code output?\n\nprint(2 + 3 * 4)',
      options: [
        '20',
        '14',
        '11',
        '24'
      ],
      correctAnswer: '14',
      explanation: 'Python follows the standard order of operations (PEMDAS). Multiplication happens before addition, so 3 * 4 = 12 is calculated first, then 2 + 12 = 14.',
      difficulty: 'beginner',
      topics: ['operators', 'arithmetic']
    },
    {
      id: 'py-b-4',
      question: 'How do you create a list in Python?',
      options: [
        'list = (1, 2, 3)',
        'list = [1, 2, 3]',
        'list = {1, 2, 3}',
        'array(1, 2, 3)'
      ],
      correctAnswer: 'list = [1, 2, 3]',
      explanation: 'In Python, lists are created using square brackets []. Parentheses () create tuples, and curly braces {} create dictionaries or sets.',
      difficulty: 'beginner',
      topics: ['lists', 'data structures']
    },
    {
      id: 'py-b-5',
      question: 'What is the output of the following code?\n\nprint("Hello"[1])',
      options: [
        'H',
        'e',
        'He',
        'Error'
      ],
      correctAnswer: 'e',
      explanation: 'In Python, strings are sequences of characters that can be accessed by index. Indexing starts at 0, so "Hello"[0] is "H" and "Hello"[1] is "e".',
      difficulty: 'beginner',
      topics: ['strings', 'indexing']
    },
    {
      id: 'py-b-6',
      question: 'Which Python data type is used to store a collection of unique elements?',
      options: [
        'List',
        'Tuple',
        'Set',
        'Dictionary'
      ],
      correctAnswer: 'Set',
      explanation: 'A set in Python is an unordered collection of unique elements. Sets are defined using curly braces {} or the set() constructor.',
      difficulty: 'beginner',
      topics: ['sets', 'data structures']
    },
    {
      id: 'py-b-7',
      question: 'What does the following code output?\n\nprint(bool(0))',
      options: [
        'True',
        'False',
        '0',
        'Error'
      ],
      correctAnswer: 'False',
      explanation: 'In Python, the number 0 is considered falsy. When converted to a boolean with bool(), it returns False. Other falsy values include empty strings, empty lists, and None.',
      difficulty: 'beginner',
      topics: ['booleans', 'type conversion']
    },
    {
      id: 'py-b-8',
      question: 'Which of the following is the correct way to define a function in Python?',
      options: [
        'function name(parameters):',
        'def name(parameters):',
        'define name(parameters):',
        'function name(parameters) {'
      ],
      correctAnswer: 'def name(parameters):',
      explanation: 'In Python, functions are defined using the "def" keyword followed by the function name, parameters in parentheses, and a colon. The function body is indented.',
      difficulty: 'beginner',
      topics: ['functions', 'syntax']
    },
    
    // Intermediate Python Questions
    {
      id: 'py-i-1',
      question: 'What is the output of the following code?\n\nlist1 = [1, 2, 3]\nlist2 = list1\nlist2.append(4)\nprint(list1)',
      options: [
        '[1, 2, 3]',
        '[1, 2, 3, 4]',
        '[4, 1, 2, 3]',
        'Error'
      ],
      correctAnswer: '[1, 2, 3, 4]',
      explanation: 'In Python, when you assign a list to another variable, both variables point to the same list object. This is called a reference. When list2.append(4) is called, the underlying list is modified, affecting both list1 and list2.',
      difficulty: 'intermediate',
      topics: ['lists', 'references', 'objects']
    },
    {
      id: 'py-i-2',
      question: 'What will the following list comprehension produce?\n\n[x**2 for x in range(5) if x % 2 == 0]',
      options: [
        '[0, 4, 16]',
        '[0, 1, 4, 9, 16]',
        '[0, 2, 4]',
        '[0, 4]'
      ],
      correctAnswer: '[0, 4, 16]',
      explanation: 'This list comprehension squares each value in range(5) (which is 0, 1, 2, 3, 4) but only includes values where x % 2 == 0 (even numbers). So it squares 0, 2, and 4, resulting in [0, 4, 16].',
      difficulty: 'intermediate',
      topics: ['list comprehensions', 'generators']
    },
    {
      id: 'py-i-3',
      question: 'Which of the following is a valid way to handle exceptions in Python?',
      options: [
        'try { code } catch (Exception e) { handle }',
        'try: code except Exception as e: handle',
        'try code except (Exception e) handle',
        'catch (Exception e) { handle }'
      ],
      correctAnswer: 'try: code except Exception as e: handle',
      explanation: 'Python uses "try" and "except" for exception handling. The correct syntax is "try: code except ExceptionType as variable: handle". The as e part is optional but useful for accessing information about the exception.',
      difficulty: 'intermediate',
      topics: ['exception handling', 'error handling']
    },
    {
      id: 'py-i-4',
      question: 'What is the output of the following code?\n\ndef func(a, b=2, c=3):\n    return a + b + c\n\nprint(func(1, c=5))',
      options: [
        '6',
        '8',
        '9',
        'Error'
      ],
      correctAnswer: '8',
      explanation: 'The function call func(1, c=5) passes 1 for parameter a, uses the default value 2 for parameter b, and overrides the default for c with 5. So the result is 1 + 2 + 5 = 8.',
      difficulty: 'intermediate',
      topics: ['functions', 'default parameters', 'named arguments']
    },
    {
      id: 'py-i-5',
      question: 'What is the purpose of the __init__ method in a Python class?',
      options: [
        'To initialize class variables',
        'To declare private variables',
        'To define class methods',
        'To destroy objects when they are no longer needed'
      ],
      correctAnswer: 'To initialize class variables',
      explanation: 'The __init__ method in Python classes is a special method (constructor) that is automatically called when a new instance of the class is created. It is used to initialize the attributes of the class.',
      difficulty: 'intermediate',
      topics: ['classes', 'objects', 'constructors']
    },
    
    // Advanced Python Questions
    {
      id: 'py-a-1',
      question: 'What is the output of the following code?\n\nclass Meta(type):\n    def __new__(cls, name, bases, attrs):\n        attrs["x"] = 10\n        return super().__new__(cls, name, bases, attrs)\n\nclass Test(metaclass=Meta):\n    pass\n\nprint(Test.x)',
      options: [
        '10',
        'None',
        'AttributeError',
        'TypeError'
      ],
      correctAnswer: '10',
      explanation: 'This code demonstrates the use of metaclasses in Python. When the Test class is created, the Meta.__new__ method is called, which adds an attribute "x" with value 10 to the class. Therefore, Test.x returns 10. Metaclasses are used to customize class creation.',
      difficulty: 'advanced',
      topics: ['metaclasses', 'class creation', 'reflection']
    },
    {
      id: 'py-a-2',
      question: 'What is the time complexity of dictionary lookups in Python?',
      options: [
        'O(n)',
        'O(log n)',
        'O(1) amortized',
        'O(n log n)'
      ],
      correctAnswer: 'O(1) amortized',
      explanation: 'Python dictionaries are implemented using hash tables, which provide amortized O(1) (constant time) lookup operations. This is why dictionaries are a preferred choice when fast lookups are needed. The "amortized" part accounts for rare cases like hash collisions and resizing operations.',
      difficulty: 'advanced',
      topics: ['dictionaries', 'time complexity', 'data structures', 'performance']
    },
    {
      id: 'py-a-3',
      question: 'What will the following code output?\n\nimport asyncio\n\nasync def foo():\n    await asyncio.sleep(1)\n    return "foo"\n\nasync def bar():\n    await asyncio.sleep(2)\n    return "bar"\n\nasync def main():\n    tasks = [foo(), bar()]\n    results = await asyncio.gather(*tasks)\n    print(results)\n\nasyncio.run(main())',
      options: [
        '["foo", "bar"]',
        '["bar", "foo"]',
        'foo bar',
        'It will raise an exception'
      ],
      correctAnswer: '["foo", "bar"]',
      explanation: 'This code demonstrates Python\'s asyncio for concurrent programming. asyncio.gather() runs multiple coroutines concurrently and returns their results in the order they were passed (not the order they completed). In this case, even though bar() takes longer than foo(), the results list will contain ["foo", "bar"].',
      difficulty: 'advanced',
      topics: ['asyncio', 'concurrency', 'coroutines', 'async/await']
    }
  ],
  
  'javascript': [
    // Beginner JavaScript Questions
    {
      id: 'js-b-1',
      question: 'Which of the following is a correct way to declare a variable in JavaScript?',
      options: [
        'variable x = 5;',
        'var x = 5;',
        'x := 5;',
        'int x = 5;'
      ],
      correctAnswer: 'var x = 5;',
      explanation: 'In JavaScript, variables can be declared using "var", "let", or "const". "var" was the original way to declare variables before ES6 introduced "let" and "const". The syntax shown is a correct use of "var".',
      difficulty: 'beginner',
      topics: ['variables', 'syntax']
    },
    {
      id: 'js-b-2',
      question: 'What is the output of the following code?\n\nconsole.log(typeof []);',
      options: [
        '"array"',
        '"object"',
        '"list"',
        'undefined'
      ],
      correctAnswer: '"object"',
      explanation: 'In JavaScript, arrays are a type of object, so typeof [] returns "object". To specifically check if something is an array, you can use Array.isArray([]), which would return true.',
      difficulty: 'beginner',
      topics: ['types', 'arrays', 'objects']
    },
    {
      id: 'js-b-3',
      question: 'What is the correct syntax for a JavaScript function declaration?',
      options: [
        'function myFunction() {}',
        'def myFunction() {}',
        'function:myFunction() {}',
        'function = myFunction() {}'
      ],
      correctAnswer: 'function myFunction() {}',
      explanation: 'In JavaScript, a function is declared using the "function" keyword followed by the function name, parameters in parentheses, and the function body in curly braces. This is the standard function declaration syntax.',
      difficulty: 'beginner',
      topics: ['functions', 'syntax']
    },
    {
      id: 'js-b-4',
      question: 'What will the following code output?\n\nconsole.log(2 + "2");',
      options: [
        '4',
        '22',
        'Error',
        'NaN'
      ],
      correctAnswer: '22',
      explanation: 'JavaScript performs type coercion when operators are used with mixed data types. In this case, the + operator is used with a number and a string, so the number 2 is converted to a string "2" and then concatenated with the other "2", resulting in "22".',
      difficulty: 'beginner',
      topics: ['type coercion', 'operators', 'strings']
    },
    {
      id: 'js-b-5',
      question: 'Which method adds one or more elements to the end of an array in JavaScript?',
      options: [
        'arr.push()',
        'arr.add()',
        'arr.append()',
        'arr.insert()'
      ],
      correctAnswer: 'arr.push()',
      explanation: 'In JavaScript, the push() method adds one or more elements to the end of an array and returns the new length of the array. For example: let arr = [1, 2]; arr.push(3); // arr is now [1, 2, 3]',
      difficulty: 'beginner',
      topics: ['arrays', 'methods']
    },
    
    // Intermediate JavaScript Questions
    {
      id: 'js-i-1',
      question: 'What is the output of the following code?\n\nconsole.log(1 + "2" + 3);',
      options: [
        '6',
        '123',
        '15',
        'Error'
      ],
      correctAnswer: '123',
      explanation: 'JavaScript evaluates expressions from left to right. First, 1 + "2" is evaluated, which results in "12" due to type coercion (the number 1 is converted to a string). Then, "12" + 3 is evaluated, converting 3 to a string and concatenating to get "123".',
      difficulty: 'intermediate',
      topics: ['type coercion', 'operators', 'evaluation order']
    },
    {
      id: 'js-i-2',
      question: 'Which statement about closures in JavaScript is true?',
      options: [
        'Closures cannot access variables from their outer function',
        'Closures take a snapshot of outer variables at creation time',
        'A closure is created every time a function is called',
        'Closures only exist in arrow functions'
      ],
      correctAnswer: 'Closures take a snapshot of outer variables at creation time',
      explanation: 'A closure in JavaScript is formed when a function retains access to its lexical scope even when the function is executed outside that scope. The closure "captures" or takes a snapshot of variables from its outer function at the time of creation, allowing the function to access those variables later.',
      difficulty: 'intermediate',
      topics: ['closures', 'scope', 'functions']
    },
    {
      id: 'js-i-3',
      question: 'What is the purpose of the Promise object in JavaScript?',
      options: [
        'To force functions to return values',
        'To represent a computation that might be completed in the future',
        'To promise the browser that code will execute',
        'To block execution until an operation completes'
      ],
      correctAnswer: 'To represent a computation that might be completed in the future',
      explanation: 'Promises in JavaScript represent the eventual completion (or failure) of an asynchronous operation and its resulting value. They provide a cleaner way to handle asynchronous operations compared to callbacks, allowing chained operations with .then() and error handling with .catch().',
      difficulty: 'intermediate',
      topics: ['promises', 'asynchronous', 'callbacks']
    },
    {
      id: 'js-i-4',
      question: 'What does the "this" keyword refer to in a regular JavaScript function (not an arrow function)?',
      options: [
        'The function itself',
        'The global object (window in browsers)',
        'The object that is executing the current function',
        'The parent function'
      ],
      correctAnswer: 'The object that is executing the current function',
      explanation: 'In JavaScript, the value of "this" in a regular function depends on how the function is called. By default, in a non-strict mode regular function, "this" refers to the object that is executing the current function. This can be the global object, an object calling a method, or an object specified using call(), apply(), or bind().',
      difficulty: 'intermediate',
      topics: ['this', 'context', 'functions', 'objects']
    },
    
    // Advanced JavaScript Questions
    {
      id: 'js-a-1',
      question: 'What is the output of the following code?\n\nlet a = {x: 1};\nlet b = {x: 1};\nconsole.log(a === b);',
      options: [
        'true',
        'false',
        'undefined',
        'Error'
      ],
      correctAnswer: 'false',
      explanation: 'In JavaScript, objects are compared by reference, not by value. Even though objects a and b have the same properties and values, they are different objects in memory, so a === b evaluates to false. This is different from primitives like numbers and strings, which are compared by value.',
      difficulty: 'advanced',
      topics: ['objects', 'equality', 'reference vs value']
    },
    {
      id: 'js-a-2',
      question: 'What is the output of the following code?\n\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\nlet counter1 = createCounter();\nlet counter2 = createCounter();\nconsole.log(counter1());\nconsole.log(counter1());\nconsole.log(counter2());',
      options: [
        '1, 2, 1',
        '1, 2, 3',
        '0, 1, 0',
        '1, 1, 1'
      ],
      correctAnswer: '1, 2, 1',
      explanation: 'This code demonstrates closures in JavaScript. Each call to createCounter() creates a new closure with its own count variable. counter1 and counter2 are different closures with separate count variables. When counter1() is called the first time, it increments and returns count (1). The second call returns 2. counter2() has its own count variable that starts at 0, so it returns 1.',
      difficulty: 'advanced',
      topics: ['closures', 'scope', 'functions']
    },
    {
      id: 'js-a-3',
      question: 'What will the following code output?\n\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
      options: [
        '1, 2, 3, 4',
        '1, 4, 3, 2',
        '1, 4, 2, 3',
        '1, 3, 4, 2'
      ],
      correctAnswer: '1, 4, 3, 2',
      explanation: 'This question tests understanding of the JavaScript event loop and task queues. Synchronous code runs first (console.log(1) and console.log(4)). The Promise.then callback is placed in the microtask queue, which has higher priority than the setTimeout callback in the task queue. After synchronous code completes, microtasks execute before tasks, so 3 is logged before 2.',
      difficulty: 'advanced',
      topics: ['event loop', 'asynchronous', 'promises', 'setTimeout', 'microtasks']
    }
  ]
};

export async function POST(req: Request) {
  try {
    const requestData: QuizRequest = await req.json();
    
    if (!requestData.topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }
    
    if (!requestData.difficulty) {
      return NextResponse.json(
        { error: 'Difficulty is required' },
        { status: 400 }
      );
    }
    
    // Get quiz data
    const quiz = generateQuiz(requestData);
    
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}

function generateQuiz(request: QuizRequest): QuizResponse {
  const { topic, difficulty, count = 5 } = request;
  
  // Get available questions for the topic (default to Python if topic not found)
  const availableQuestions = quizKnowledgeBase[topic.toLowerCase()] || 
                             quizKnowledgeBase['python'];
  
  // Filter questions by difficulty
  let matchingQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
  
  // If not enough questions of requested difficulty, fall back to easier questions
  if (matchingQuestions.length < count) {
    const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
    const currentDifficultyIndex = difficultyLevels.indexOf(difficulty);
    
    // Try easier difficulties if current is not beginner
    if (currentDifficultyIndex > 0) {
      const easierQuestions = availableQuestions.filter(
        q => difficultyLevels.indexOf(q.difficulty as any) < currentDifficultyIndex
      );
      matchingQuestions = [...matchingQuestions, ...easierQuestions];
    }
  }
  
  // Shuffle and select the requested number of questions
  const selectedQuestions = shuffleArray(matchingQuestions).slice(0, count);
  
  // Determine appropriate title based on topic and difficulty
  const topicName = topic.charAt(0).toUpperCase() + topic.slice(1);
  const titleMap: Record<string, string> = {
    'beginner': `${topicName} Fundamentals Assessment`,
    'intermediate': `Intermediate ${topicName} Skills Assessment`,
    'advanced': `Advanced ${topicName} Concepts Assessment`
  };
  
  // Create description based on difficulty
  const descriptionMap: Record<string, string> = {
    'beginner': `Test your basic knowledge of ${topicName} fundamentals including syntax, variables, and simple operations.`,
    'intermediate': `Challenge your understanding of ${topicName} with questions covering functions, data structures, and more complex concepts.`,
    'advanced': `Demonstrate your expertise in advanced ${topicName} topics including optimization, design patterns, and language-specific features.`
  };
  
  return {
    id: `${topic}-${difficulty}-${Date.now()}`,
    title: titleMap[difficulty] || `${topicName} Assessment`,
    description: descriptionMap[difficulty] || `Test your knowledge of ${topicName} programming.`,
    questions: selectedQuestions,
    topic,
    difficulty,
    estimatedTime: calculateEstimatedTime(selectedQuestions.length, difficulty)
  };
}

function calculateEstimatedTime(questionCount: number, difficulty: string): number {
  // Average time per question based on difficulty (in minutes)
  const timePerQuestion: Record<string, number> = {
    'beginner': 1,
    'intermediate': 1.5,
    'advanced': 2.5
  };
  
  return Math.ceil(questionCount * (timePerQuestion[difficulty] || 1));
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
} 