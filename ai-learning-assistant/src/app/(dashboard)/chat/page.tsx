'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, Send, ExternalLink, BookOpen } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

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
  const [userId, setUserId] = useState<string>('guest-user');
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
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          topic,
          userId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from the AI');
      }
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        sources: data.sources,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
    } finally {
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
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
        {/* Topic selection */}
        <div className="md:col-span-1">
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Select Topic</h2>
            <div className="space-y-2">
              <Button 
                variant={topic === 'python' ? 'default' : 'outline'} 
                className="w-full justify-start"
                onClick={() => handleTopicChange('python')}
              >
                Python
              </Button>
              <Button 
                variant={topic === 'javascript' ? 'default' : 'outline'} 
                className="w-full justify-start"
                onClick={() => handleTopicChange('javascript')}
              >
                JavaScript
              </Button>
              {/* Add more topics as needed */}
            </div>
          </Card>
        </div>
        
        {/* Chat area */}
        <div className="md:col-span-3">
          <Card className="flex flex-col h-[70vh]">
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
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <div 
                      dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} 
                      className="prose prose-sm max-w-none"
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
                <div className="flex items-center p-3 rounded-lg bg-muted max-w-[80%]">
                  <Spinner size="sm" />
                  <span className="ml-3">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 