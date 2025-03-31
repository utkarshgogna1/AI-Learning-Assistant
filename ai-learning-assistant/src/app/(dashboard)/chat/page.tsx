'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertCircle, Send, ExternalLink, BookOpen } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    url: string;
    snippet: string;
  }[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>('python');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize chat with a welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI learning assistant. Ask me anything about ${topic} programming and I'll help you understand the concepts.`,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
  }, []);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      // For this demo, we'll just simulate a response
      setTimeout(() => {
        // Sample responses based on topic and input
        let sampleResponse = "";
        
        if (input.toLowerCase().includes("what") && input.toLowerCase().includes("python")) {
          sampleResponse = "Python is a high-level, interpreted programming language known for its readability and versatility. It supports multiple programming paradigms, including procedural, object-oriented, and functional programming.";
        } else if (input.toLowerCase().includes("loop") && topic === "python") {
          sampleResponse = "In Python, you can use several types of loops:\n\n1. `for` loops: `for i in range(10): print(i)`\n2. `while` loops: `while condition: do_something()`\n3. List comprehensions: `[x for x in range(10)]`";
        } else if (input.toLowerCase().includes("function") && topic === "python") {
          sampleResponse = "In Python, you define functions using the `def` keyword:\n\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n\nresult = greet('World')\nprint(result)  # Outputs: Hello, World!\n```";
        } else if (topic === "javascript") {
          sampleResponse = "JavaScript is a dynamic programming language that's commonly used for web development. It can run in browsers and on servers using Node.js.";
        } else {
          sampleResponse = "That's an interesting question about " + topic + "! In programming, it's important to understand the fundamentals before moving to advanced topics.";
        }
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: sampleResponse,
          timestamp: new Date(),
          sources: [
            {
              title: topic + " Documentation",
              url: topic === "python" ? "https://docs.python.org/3/" : "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
              snippet: "Official documentation"
            }
          ],
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
      setIsLoading(false);
    }
  };

  const handleTopicChange = (newTopic: string) => {
    setTopic(newTopic);
    
    // Add a message about the topic change
    const topicChangeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I've switched to helping you with ${newTopic} programming. What would you like to know?`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, topicChangeMessage]);
  };
  
  // Format messages for better readability
  const formatMessageContent = (content: string) => {
    // Make code blocks look better
    let formattedContent = content.replace(
      /`([^`]+)`/g, 
      '<code class="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm">$1</code>'
    );
    
    // Convert URLs to links
    formattedContent = formattedContent.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>'
    );
    
    return formattedContent;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Learning Assistant</h1>
        <p className="text-gray-600">
          Chat with the AI to learn programming concepts and get answers to your questions.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <div className="flex items-center">
            <span className="mr-2">
              <AlertCircle className="h-4 w-4" />
            </span>
            <span className="font-bold">Error</span>
          </div>
          <p className="ml-6">{error}</p>
        </div>
      )}
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
        {/* Topic selection */}
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="font-semibold mb-4">Select Topic</h2>
            <div className="space-y-2">
              <button 
                className={`w-full text-left px-4 py-2 rounded ${
                  topic === 'python' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleTopicChange('python')}
              >
                Python
              </button>
              <button 
                className={`w-full text-left px-4 py-2 rounded ${
                  topic === 'javascript' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleTopicChange('javascript')}
              >
                JavaScript
              </button>
              {/* Add more topics as needed */}
            </div>
          </div>
        </div>
        
        {/* Chat area */}
        <div className="md:col-span-3">
          <div className="flex flex-col h-[70vh] bg-white shadow rounded-lg">
            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 ${
                    message.role === 'user' ? 'ml-auto mr-0 max-w-[80%]' : 'ml-0 mr-auto max-w-[80%]'
                  }`}
                >
                  <div 
                    className={`p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100'
                    }`}
                  >
                    <div 
                      dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} 
                    />
                    
                    {/* Sources section */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 border-t border-gray-200 pt-2">
                        <p className="text-xs font-medium flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Sources:
                        </p>
                        <ul className="text-xs mt-1 space-y-1">
                          {message.sources.map((source, index) => (
                            <li key={index}>
                              <a 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-start gap-1 hover:underline"
                              >
                                <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                <span>{source.title}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center p-3 rounded-lg bg-gray-100 max-w-[80%]">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-3">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className={`px-4 py-2 rounded flex items-center ${
                    isLoading || !input.trim() 
                      ? 'bg-blue-300 text-white' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 