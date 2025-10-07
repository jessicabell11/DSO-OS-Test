import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { RelatedTeam, ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

interface TeamAIAssistantModalProps {
  team: RelatedTeam;
  onClose: () => void;
}

const TeamAIAssistantModal: React.FC<TeamAIAssistantModalProps> = ({ team, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hi there! I'm the AI assistant for the ${team.name}. How can I help you today? You can ask about our capabilities, outcomes, backlog items, or if we have capacity to collaborate.`,
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

  // Focus input when modal opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      const response = generateTeamAIResponse(input, team);
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

  const generateTeamAIResponse = (query: string, team: RelatedTeam): string => {
    // Simple keyword-based responses customized for the specific team
    const normalizedQuery = query.toLowerCase();
    
    if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi')) {
      return `Hello! I'm the AI assistant for the ${team.name}. How can I help you today?`;
    }
    
    if (normalizedQuery.includes('who') || normalizedQuery.includes('what') || normalizedQuery.includes('about')) {
      return `The ${team.name} ${team.description.toLowerCase()}. We work closely with other teams to deliver high-quality solutions and have expertise in ${team.capabilities.join(', ')}.`;
    }
    
    if (normalizedQuery.includes('outcome') || normalizedQuery.includes('goal') || normalizedQuery.includes('objective')) {
      return `Our team is currently focused on these key outcomes:\n\n${team.sharedOutcomes.map(outcome => `- ${outcome}`).join('\n')}\n\nThese align with our mission to ${team.description.toLowerCase()}.`;
    }
    
    if (normalizedQuery.includes('capability') || normalizedQuery.includes('skill') || normalizedQuery.includes('expertise')) {
      return `Our team provides these key capabilities:\n\n${team.capabilities.map(capability => `- ${capability}`).join('\n')}\n\nWe've developed these capabilities through years of experience and continuous learning.`;
    }
    
    if (normalizedQuery.includes('capacity') || normalizedQuery.includes('availability') || normalizedQuery.includes('help')) {
      if (team.capacity === 'high') {
        return `Great news! We currently have high capacity and would be happy to collaborate. We could start as early as next week. Would you like me to connect you with ${team.contactPerson.name}, our ${team.contactPerson.role}?`;
      } else if (team.capacity === 'medium') {
        return `We currently have medium capacity. We might be able to help with smaller tasks or provide advisory support. For a full collaboration, we'd need to finish some current commitments first. Would you like to schedule a quick chat with ${team.contactPerson.name} to discuss possibilities?`;
      } else if (team.capacity === 'low') {
        return `We're currently at low capacity due to several ongoing projects. We could potentially provide limited advisory support, but wouldn't be able to take on significant new work for about 4-6 weeks. Would you like me to let you know when our capacity opens up?`;
      } else {
        return `I'm sorry, but we currently don't have any capacity to take on additional work. We're fully committed to our current projects until at least the end of the quarter. I'd be happy to schedule something for next quarter if that works for you?`;
      }
    }
    
    if (normalizedQuery.includes('backlog') || normalizedQuery.includes('working on') || normalizedQuery.includes('priority')) {
      if (team.relationshipType === 'backlog' || team.relationshipType === 'multiple') {
        return `Our current top priorities include:\n\n- Completing the ${team.capabilities[0]} implementation\n- Improving our ${team.capabilities[1]} offering\n- Launching our new ${team.capabilities[2]} service\n\nWe also have some upcoming milestones: ${team.upcomingMilestones?.join(', ')}`;
      } else {
        return `Our team is currently focused on several key initiatives, including enhancing our ${team.capabilities[0]} and improving our ${team.capabilities[1]}. We're also preparing for these upcoming milestones: ${team.upcomingMilestones?.join(', ')}`;
      }
    }
    
    if (normalizedQuery.includes('contact') || normalizedQuery.includes('talk') || normalizedQuery.includes('meet')) {
      return `The best person to contact is ${team.contactPerson.name}, our ${team.contactPerson.role}. You can reach them at ${team.contactPerson.email}. Would you like me to set up an introduction?`;
    }
    
    if (normalizedQuery.includes('collaborate') || normalizedQuery.includes('work together') || normalizedQuery.includes('partnership')) {
      return `We'd be ${team.capacity === 'none' ? 'interested in collaborating, but unfortunately don\'t have capacity right now' : 'happy to explore collaboration opportunities'}! Our team has previously worked with other groups on ${team.sharedOutcomes[0].toLowerCase()}. The best approach would be to set up an initial discussion with ${team.contactPerson.name} to identify specific areas where we can add value to each other's work.`;
    }
    
    if (normalizedQuery.includes('milestone') || normalizedQuery.includes('roadmap') || normalizedQuery.includes('timeline')) {
      if (team.upcomingMilestones && team.upcomingMilestones.length > 0) {
        return `We have several important milestones coming up:\n\n${team.upcomingMilestones.map(milestone => `- ${milestone}`).join('\n')}\n\nThese align with our focus on ${team.sharedOutcomes[0].toLowerCase()}.`;
      } else {
        return `We're currently finalizing our roadmap for the upcoming quarter. Our main focus will be on enhancing our ${team.capabilities[0]} and ${team.capabilities[1]} capabilities. I'd be happy to share more details once our planning is complete.`;
      }
    }
    
    // Default response for queries we don't have specific answers for
    return `That's an interesting question about our team. While I don't have specific information on that topic, I can tell you that the ${team.name} ${team.description.toLowerCase()}. We have expertise in ${team.capabilities.slice(0, 2).join(' and ')}. Would you like to know more about our capabilities, current capacity, or how we might collaborate?`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Modal header */}
        <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{team.name} AI Assistant</h3>
              <p className="text-xs text-blue-100">Ask about capabilities, outcomes, or capacity</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-blue-200"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
            >
              <div 
                className={`inline-block max-w-[85%] rounded-lg px-4 py-2 ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
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
              placeholder={`Ask the ${team.name} assistant...`}
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              style={{ maxHeight: '100px', minHeight: '42px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={input.trim() === ''}
              className={`ml-2 p-2 rounded-full ${
                input.trim() === '' 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAIAssistantModal;
