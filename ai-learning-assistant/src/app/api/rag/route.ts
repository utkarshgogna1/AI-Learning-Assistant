import { NextResponse } from 'next/server';

interface RAGRequest {
  question: string;
  topic?: string;
  userId?: string;
}

interface RAGResponse {
  answer: string;
  sources: {
    title: string;
    url: string;
    snippet: string;
  }[];
}

// Enhanced knowledge base with more specific, structured content
const knowledgeBase: Record<string, Array<{ content: string; url: string; title: string; keywords: string[] }>> = {
  'python': [
    {
      content: 'Python is a high-level, interpreted programming language known for its readability and simplicity. It uses indentation to define code blocks and supports multiple programming paradigms, including procedural, object-oriented, and functional programming.',
      url: 'https://docs.python.org/3/tutorial/introduction.html',
      title: 'Python Introduction',
      keywords: ['python', 'introduction', 'programming', 'language', 'basics', 'what is']
    },
    {
      content: 'Python variables are dynamically typed, meaning you don\'t need to declare their type explicitly. Python handles this automatically based on the value assigned. For example: x = 5 creates an integer variable, and x = "Hello" creates a string variable. Variables can refer to values of any type, and the type can change during program execution.',
      url: 'https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator',
      title: 'Python Variables',
      keywords: ['variable', 'variables', 'assign', 'assignment', 'type', 'typing', 'dynamic']
    },
    {
      content: 'Python lists are ordered, mutable collections that can contain elements of different types. You can create lists using square brackets, e.g., [1, 2, 3]. Common operations include append() to add an element, extend() to add another list, insert() to add at a specific position, remove() to remove by value, and pop() to remove by index.',
      url: 'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
      title: 'Python Lists',
      keywords: ['list', 'lists', 'array', 'arrays', 'collection', 'append', 'extend', 'insert', 'remove']
    },
    {
      content: 'Python dictionaries are key-value pairs that provide an efficient way to store and retrieve data. You can create dictionaries using curly braces, e.g., {"name": "John", "age": 30}. Accessing values is done with square brackets: dict_name["key"]. Common methods include .keys(), .values(), .items(), .get(), and .update(). Dictionaries are mutable and can contain values of any type.',
      url: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries',
      title: 'Python Dictionaries',
      keywords: ['dictionary', 'dictionaries', 'dict', 'hash', 'map', 'key', 'value', 'pairs', 'mapping']
    },
    {
      content: 'Python functions are defined using the "def" keyword, followed by the function name and parameters. For example, "def greet(name): return f\'Hello, {name}!\'". Functions can have default parameter values like "def greet(name="World")" and can accept variable numbers of arguments using *args and **kwargs. Functions return None by default if no return statement is used.',
      url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
      title: 'Python Functions',
      keywords: ['function', 'functions', 'def', 'define', 'parameter', 'parameters', 'return', 'argument', 'arguments']
    },
    {
      content: 'Python classes are defined with the "class" keyword. A simple class definition might look like: "class Person: def __init__(self, name): self.name = name". The __init__ method is a special method that initializes class instances. To create an object: "p = Person("John")". Classes support inheritance, method overriding, and special methods like __str__ for string representation.',
      url: 'https://docs.python.org/3/tutorial/classes.html',
      title: 'Python Classes and Objects',
      keywords: ['class', 'classes', 'object', 'objects', 'oop', 'inheritance', 'instance', 'init', 'method', 'methods']
    },
    {
      content: 'List comprehensions in Python provide a concise way to create lists. The syntax is: [expression for item in iterable if condition]. For example, [x**2 for x in range(10) if x % 2 == 0] creates a list of squares of even numbers. They are more readable and often faster than equivalent for loops.',
      url: 'https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions',
      title: 'Python List Comprehensions',
      keywords: ['list comprehension', 'comprehension', 'comprehensions', 'expression', 'generate', 'generator']
    },
    {
      content: 'Python\'s exception handling is done using try, except, else, and finally blocks. For example: "try: result = x/y except ZeroDivisionError: print(\'Cannot divide by zero\')". The else clause executes if no exception occurs, and the finally clause always executes. You can also create custom exceptions by inheriting from Exception class.',
      url: 'https://docs.python.org/3/tutorial/errors.html',
      title: 'Python Exceptions',
      keywords: ['exception', 'exceptions', 'try', 'except', 'finally', 'error', 'errors', 'handling']
    },
    {
      content: 'Python arrays can be created using the array module, which provides a space-efficient way to store homogeneous data. Unlike lists, arrays can only contain items of the same data type. For example: "import array; arr = array.array(\'i\', [1, 2, 3])". The first argument is a type code indicating the data type.',
      url: 'https://docs.python.org/3/library/array.html',
      title: 'Python Arrays',
      keywords: ['array', 'arrays', 'buffer', 'homogeneous', 'sequence', 'efficient']
    }
  ],
  'javascript': [
    {
      content: 'JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It\'s primarily used for web development but has expanded to server-side with Node.js and other environments. It supports multiple paradigms including object-oriented, functional, and event-driven programming.',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction',
      title: 'JavaScript Introduction',
      keywords: ['javascript', 'introduction', 'basics', 'what is', 'ecmascript']
    },
    {
      content: 'Variables in JavaScript are declared using let, const, or var keywords. "let" and "const" were introduced in ES6 and are block-scoped, while "var" is function-scoped. "const" creates a constant reference to a value that cannot be reassigned. Example: "let x = 5; const PI = 3.14; var name = \'John\';"',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations',
      title: 'JavaScript Variables',
      keywords: ['variable', 'variables', 'let', 'const', 'var', 'declaration', 'scope']
    },
    {
      content: 'JavaScript arrays are ordered collections of values that can be of any type. They are created using square brackets, e.g., [1, "hello", true]. Arrays have methods like push() to add elements, pop() to remove from the end, shift() to remove from the beginning, and slice() to create a new array. Array.map(), Array.filter(), and Array.reduce() are powerful methods for transforming arrays.',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections',
      title: 'JavaScript Arrays',
      keywords: ['array', 'arrays', 'list', 'collection', 'push', 'pop', 'map', 'filter', 'reduce']
    },
    {
      content: 'JavaScript functions can be regular functions, arrow functions, or function expressions. Arrow functions, introduced in ES6, provide a more concise syntax and do not have their own "this" binding. Examples: "function add(a, b) { return a + b; }" (regular), "const add = (a, b) => a + b;" (arrow), and "const add = function(a, b) { return a + b; }" (expression).',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
      title: 'JavaScript Functions',
      keywords: ['function', 'functions', 'arrow', 'expression', 'method', 'callback', 'return']
    },
    {
      content: 'JavaScript objects are collections of key-value pairs where keys are strings (or Symbols) and values can be any data type. They can be created using object literals: "const person = { name: \'John\', age: 30 };", with constructors: "const person = new Object();", or with the class syntax (ES6+). Properties can be accessed using dot notation (person.name) or bracket notation (person[\'name\']).',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects',
      title: 'JavaScript Objects',
      keywords: ['object', 'objects', 'property', 'properties', 'method', 'methods', 'key', 'value']
    },
    {
      content: 'Promises in JavaScript represent the eventual completion (or failure) of an asynchronous operation and its resulting value. A Promise is in one of these states: pending, fulfilled, or rejected. The Promise API includes methods like then() to handle success, catch() to handle errors, and finally() for cleanup. Example: "fetch(url).then(response => response.json()).catch(error => console.log(error));"',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
      title: 'JavaScript Promises',
      keywords: ['promise', 'promises', 'async', 'asynchronous', 'then', 'catch', 'finally', 'resolve', 'reject']
    },
    {
      content: 'The async/await syntax in JavaScript provides a more intuitive way to work with Promises. An async function returns a Promise, and the await keyword can be used to pause execution until a Promise is resolved or rejected. Example: "async function fetchData() { try { const response = await fetch(url); const data = await response.json(); return data; } catch (error) { console.log(error); } }"',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Asynchronous_JavaScript',
      title: 'JavaScript Async/Await',
      keywords: ['async', 'await', 'asynchronous', 'promise', 'promises', 'function']
    },
    {
      content: 'JavaScript closures are created when a function accesses variables from its outer lexical scope, even after the outer function has returned. This is powerful for data encapsulation and creating private variables. Example: "function counter() { let count = 0; return function() { return ++count; }; }" creates a closure where the inner function maintains access to count even after counter() has finished execution.',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
      title: 'JavaScript Closures',
      keywords: ['closure', 'closures', 'scope', 'lexical', 'encapsulation', 'private', 'variables']
    }
  ]
};

export async function POST(req: Request) {
  try {
    const requestData: RAGRequest = await req.json();
    
    if (!requestData.question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }
    
    // Generate a response using RAG
    const response = generateRAGResponse(requestData);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating RAG response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

function generateRAGResponse(request: RAGRequest): RAGResponse {
  const { question, topic = 'python' } = request;
  
  // In a real RAG system, we would:
  // 1. Retrieve relevant documents using a vector database
  // 2. Send the question and retrieved documents to an LLM
  // 3. Return the LLM's response and sources
  
  // For this demo, we'll use keyword matching for better results
  const lowerQuestion = question.toLowerCase();
  
  // Determine which knowledge base to use
  const topicKnowledge = knowledgeBase[topic] || knowledgeBase['python'];
  
  // More sophisticated document retrieval using keyword matching
  const scoredDocs = topicKnowledge.map(doc => {
    let score = 0;
    
    // Check for exact topic match
    if (doc.keywords.includes(topic)) {
      score += 3;
    }
    
    // Add scores for each keyword that matches in the question
    doc.keywords.forEach(keyword => {
      if (lowerQuestion.includes(keyword)) {
        // More specific terms get higher scores
        score += keyword.length > 5 ? 2 : 1;
      }
    });
    
    // Check for word matches in content (less important)
    const questionWords = lowerQuestion.split(/\s+/);
    const contentLower = doc.content.toLowerCase();
    
    questionWords.forEach(word => {
      if (word.length > 3 && contentLower.includes(word)) {
        score += 0.5;
      }
    });
    
    return { doc, score };
  });
  
  // Sort by score descending and get top matches
  const relevantDocs = scoredDocs
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.doc);
  
  // If no relevant docs found, find the most general topic introduction
  if (relevantDocs.length === 0) {
    const introDoc = topicKnowledge.find(doc => 
      doc.keywords.includes('introduction') || doc.title.includes('Introduction')
    ) || topicKnowledge[0];
    
    return {
      answer: `I don't have specific information about that query, but here's some general information about ${topic}: ${introDoc.content}`,
      sources: [{
        title: introDoc.title,
        url: introDoc.url,
        snippet: introDoc.content.substring(0, 150) + '...'
      }]
    };
  }
  
  // Generate a more tailored response based on the question type and relevant docs
  let answer = '';
  
  // Detect question types and format response accordingly
  if (lowerQuestion.includes('what is') || lowerQuestion.includes('definition') || lowerQuestion.startsWith('define')) {
    // Definition question
    answer = `${relevantDocs[0].content} `;
    if (relevantDocs.length > 1) {
      answer += `Additionally, you should know that ${relevantDocs[1].content.substring(0, relevantDocs[1].content.indexOf('.'))}`;
    }
  } else if (lowerQuestion.includes('how to') || lowerQuestion.includes('how do') || lowerQuestion.includes('example') || lowerQuestion.includes('code for')) {
    // How-to question
    const subjectMatch = lowerQuestion.match(/(?:for|about|with)\s+(\w+)s?/i);
    const subject = subjectMatch ? subjectMatch[1] : (lowerQuestion.includes('arrays') ? 'arrays' : topic);
    
    answer = `${relevantDocs[0].content} `;
    if (relevantDocs.length > 1) {
      answer += `For more advanced usage: ${relevantDocs[1].content}`;
    }
  } else if (lowerQuestion.includes('compare') || lowerQuestion.includes('difference') || lowerQuestion.includes('versus') || lowerQuestion.includes('vs')) {
    // Comparison question
    answer = `When considering differences: ${relevantDocs[0].content} `;
    if (relevantDocs.length > 1) {
      answer += `In contrast, ${relevantDocs[1].content}`;
    }
  } else if (lowerQuestion.includes('best practice') || lowerQuestion.includes('when should')) {
    // Best practices question
    answer = `Best practices for ${topic}: ${relevantDocs[0].content} `;
    if (relevantDocs.length > 1) {
      answer += `Additionally, consider that ${relevantDocs[1].content}`;
    }
  } else if (lowerQuestion.includes('why') || lowerQuestion.includes('reason')) {
    // Why question
    answer = `The reason is: ${relevantDocs[0].content} `;
    if (relevantDocs.length > 1) {
      answer += `Furthermore, ${relevantDocs[1].content}`;
    }
  } else if (lowerQuestion.length < 15 || lowerQuestion.endsWith('?') === false) {
    // Short query or not a question - likely a topic request
    const cleanTopic = lowerQuestion.replace(/^(show|tell|give)\s+(me|us)?\s+/i, '').trim() || topic;
    answer = `${relevantDocs[0].content} `;
    if (relevantDocs.length > 1) {
      answer += `\n\nAdditional information: ${relevantDocs[1].content}`;
    }
  } else {
    // General response for other question types
    answer = relevantDocs[0].content + ' ';
    if (relevantDocs.length > 1) {
      // Find sentences that might be most relevant by looking for keywords
      const secondaryContent = relevantDocs[1].content;
      const questionWords = lowerQuestion.split(/\s+/).filter(w => w.length > 3);
      
      // Try to find a sentence with the most matches to question words
      const sentences = secondaryContent.split(/\.\s+/);
      let bestSentence = sentences[0];
      let maxMatches = 0;
      
      for (const sentence of sentences) {
        const sentenceLower = sentence.toLowerCase();
        const matches = questionWords.filter(word => sentenceLower.includes(word)).length;
        
        if (matches > maxMatches) {
          maxMatches = matches;
          bestSentence = sentence;
        }
      }
      
      answer += `${bestSentence}.`;
    }
  }
  
  // Format sources
  const sources = relevantDocs.map(doc => ({
    title: doc.title,
    url: doc.url,
    snippet: doc.content.substring(0, 150) + (doc.content.length > 150 ? '...' : '')
  }));
  
  return { answer, sources };
}

// Keyword map with weights to determine relevance
// In a real system, this would be handled by embeddings and vector similarity
const keywordMap: Record<string, number> = {
  'python': 1,
  'javascript': 1,
  'variable': 0.8,
  'variables': 0.8,
  'function': 0.8,
  'functions': 0.8,
  'list': 0.7,
  'lists': 0.7,
  'dictionary': 0.7,
  'dictionaries': 0.7,
  'promise': 0.7,
  'promises': 0.7,
  'async': 0.7,
  'await': 0.7,
  'object': 0.6,
  'objects': 0.6,
  'class': 0.6,
  'classes': 0.6,
  'example': 0.5,
  'definition': 0.5,
  'tutorial': 0.5,
  'code': 0.4,
  'program': 0.4
}; 