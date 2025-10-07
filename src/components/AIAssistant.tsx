import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi there! I'm your team's AI assistant. Ask me anything about the Accelerator team, our metrics, goals, or how I can help you understand our dashboard better.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const response = generateAIResponse(input);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const generateAIResponse = (query: string): string => {
    // Simple keyword-based responses
    const normalizedQuery = query.toLowerCase();
    
    if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi')) {
      return "Hello! How can I help you with the Accelerator team today?";
    }
    
    if (normalizedQuery.includes('team') && (normalizedQuery.includes('who') || normalizedQuery.includes('what'))) {
      return "The Accelerator team builds and maintains DevLake, an open-source dev data platform that integrates, analyzes, and visualizes software development data from various tools. We focus on helping engineering teams measure and improve their development processes through data-driven insights.";
    }
    
    if (normalizedQuery.includes('dora')) {
      return "DORA metrics are four key metrics identified by the DevOps Research and Assessment team:\n\n1. **Deployment Frequency** - How often we deploy code to production\n2. **Lead Time for Changes** - How long it takes from code commit to running in production\n3. **Change Failure Rate** - Percentage of deployments that cause a failure in production\n4. **Time to Restore Service** - How long it takes to recover from a failure\n\nOur team tracks these metrics to improve our development processes and delivery performance.";
    }
    
    if (normalizedQuery.includes('goal') || normalizedQuery.includes('mission')) {
      return "Our team's mission aligns with the broader organizational goal of \"Health for all, Hunger for none\". We contribute to this by building tools that help engineering teams become more efficient and effective through data-driven insights, ultimately accelerating the delivery of solutions that address global health and food security challenges.";
    }
    
    if (normalizedQuery.includes('backlog') || normalizedQuery.includes('priority')) {
      return "Our current top priorities in the backlog are:\n\n1. Implementing the GitLab data connector\n2. Fixing the Jenkins connector data loss issue\n3. Optimizing the ETL pipeline performance\n\nThese items are critical for improving data completeness and reliability for our users.";
    }
    
    if (normalizedQuery.includes('accomplishment') || normalizedQuery.includes('achievement')) {
      return "Recent key accomplishments include:\n\n- GitHub Integration Enhancement with PR review metrics and code quality insights\n- DORA Metrics Dashboard Release with historical trends and team comparisons\n- Jira Cloud Connector Launch with advanced workflow analytics capabilities\n\nThese have significantly improved our platform's capabilities and user adoption.";
    }
    
    if (normalizedQuery.includes('challenge') || normalizedQuery.includes('problem') || normalizedQuery.includes('issue')) {
      return "Some current challenges we're addressing include:\n\n- Data pipeline performance bottlenecks\n- Inconsistent metric definitions across teams\n- Jenkins connector data loss issues\n\nWe're actively working on solutions for these challenges to improve our platform's reliability and effectiveness.";
    }
    
    // Default response for queries we don't have specific answers for
    return "That's an interesting question about our team. While I don't have specific information on that topic, I can tell you that the Accelerator team focuses on building DevLake, which helps engineering teams measure and improve their development processes through data-driven insights. Is there something specific about our metrics, goals, or capabilities you'd like to know more about?";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 bg-[#de0043] text-white rounded-full p-4 shadow-lg hover:bg-[#c5003c] transition-colors z-50"
          aria-label="Open AI Assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div 
          className={`fixed right-4 bottom-4 bg-white rounded-lg shadow-xl z-50 transition-all duration-300 ease-in-out ${
            isMinimized 
              ? 'w-72 h-14' 
              : 'w-80 sm:w-96 h-[32rem] max-h-[80vh]'
          }`}
        >
          {/* Chat header */}
          <div className="bg-[#de0043] text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[#c5003c] flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Team AI Assistant</h3>
                {!isMinimized && <p className="text-xs text-pink-100">Ask me anything about the team</p>}
              </div>
            </div>
            <div className="flex">
              <button 
                onClick={toggleMinimize} 
                className="text-white hover:text-pink-200 mr-2"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button 
                onClick={toggleChat} 
                className="text-white hover:text-pink-200"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-8rem)]">
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
                  >
                    <div 
                      className={`inline-block max-w-[85%] rounded-lg px-4 py-2 ${
                        message.role === 'user' 
                          ? 'bg-[#de0043] text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="mb-4">
                    <div className="inline-block bg-gray-100 rounded-lg px-4 py-2 text-gray-800">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="p-4 border-t">
                <div className="flex items-end">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about the team..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#de0043] resize-none"
                    rows={1}
                    style={{ maxHeight: '100px', minHeight: '42px' }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={input.trim() === ''}
                    className={`ml-2 p-2 rounded-full ${
                      input.trim() === '' 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-[#de0043] text-white hover:bg-[#c5003c]'
                    }`}
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
