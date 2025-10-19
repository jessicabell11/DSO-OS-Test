import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  Target, 
  Calendar, 
  Package, 
  Zap, 
  Bug, 
  Send, 
  Copy, 
  Download,
  AlertCircle
} from 'lucide-react';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';
import { OutcomeData, BacklogItem, ReleaseNote } from '../types';

interface SprintReviewDemoProps {
  outcomes: OutcomeData;
  backlog: BacklogItem[];
  releaseNotes: ReleaseNote[];
}

const SprintReviewDemo: React.FC<SprintReviewDemoProps> = ({ 
  outcomes, 
  backlog, 
  releaseNotes 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sprint-review');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean | null>(null);
  const [publishMessage, setPublishMessage] = useState('');

  // Get current sprint data (using the most recent sprint from releaseNotes)
  const currentSprint = releaseNotes[0];
  
  // Filter backlog items that are completed in the current sprint
  const completedItems = backlog.filter(item => 
    item.status === 'completed' && 
    item.tags.some(tag => tag === 'Current Sprint')
  );

  // Generate AI release notes based on completed items
  const generateReleaseNotes = () => {
    setIsGeneratingNotes(true);
    
    // Simulate AI generation with a timeout
    setTimeout(() => {
      const generatedContent = `
# Sprint ${currentSprint.sprintNumber} Release Notes: ${currentSprint.sprintName}

## Overview
We're excited to share the outcomes of our latest sprint, which focused on enhancing our platform's data collection capabilities and improving the user experience.

## Key Deliverables

${completedItems.map(item => `
### ${item.title}
${item.description}

**Impact:** ${item.impact === 'high' ? 'High impact feature that significantly improves our platform capabilities' : 
  item.impact === 'medium' ? 'Medium impact enhancement that improves user experience' : 
  'Quality improvement that enhances platform stability'}

**Team:** ${item.assignee || 'Cross-functional team'}
`).join('')}

## 90-Day Cycle Progress
We're making steady progress toward our 90-day cycle goals:
- Improved data completeness by 28%
- Onboarded 8 engineering teams to the platform
- Enhanced cross-team collaboration metrics

## Coming Next
Stay tuned for our upcoming sprint where we'll focus on:
- Advanced analytics capabilities
- Additional data source integrations
- Performance optimizations

Thank you for your continued support and feedback!
`;
      
      setGeneratedNotes(generatedContent);
      setIsGeneratingNotes(false);
    }, 2000);
  };

  // Publish release notes to Viva Engage
  const publishToVivaEngage = () => {
    setIsPublishing(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Simulate successful publishing
      setPublishSuccess(true);
      setPublishMessage('Release notes successfully published to Viva Engage - IT Community channel');
      
      setTimeout(() => {
        setPublishSuccess(null);
        setPublishMessage('');
      }, 5000);
      
      setIsPublishing(false);
    }, 2000);
  };

  // Copy release notes to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedNotes);
    alert('Release notes copied to clipboard');
  };

  // Download release notes as markdown
  const downloadReleaseNotes = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedNotes], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `sprint-${currentSprint.sprintNumber}-release-notes.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Helper function for status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'off-track':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')} 
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-blue-500" />
                  Sprint Review & Demo
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Review sprint outcomes and generate release notes
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 90-Day Cycle Outcomes */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-4 py-5 border-b border-gray-200 flex items-center">
                    <Target className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">90-Day Cycle Outcomes</h2>
                  </div>
                  <div className="p-4 space-y-6">
                    {outcomes.shortTerm.map((outcome, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900">{outcome.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{outcome.description}</p>
                        <div className="mt-4 space-y-3">
                          {outcome.metrics.map((metric, mIndex) => (
                            <div key={mIndex} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-700">{metric.name}</p>
                                <div className="flex items-center mt-1">
                                  <span className="text-xs text-gray-500">Target: {metric.target}</span>
                                  <span className="mx-2 text-gray-300">|</span>
                                  <span className="text-xs text-gray-500">Current: {metric.current}</span>
                                </div>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                                {metric.status === 'on-track' ? 'On Track' : metric.status === 'at-risk' ? 'At Risk' : 'Off Track'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sprint Goals */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-4 py-5 border-b border-gray-200 flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">Sprint Goals</h2>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#de0043] text-white mr-2">
                          {currentSprint.sprintNumber}
                        </div>
                        <h3 className="font-medium">{currentSprint.sprintName}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Released: {new Date(currentSprint.releaseDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      
                      <h4 className="font-medium text-gray-700 mb-2">Sprint Goals:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Complete integration with Jira Cloud</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Implement dashboard export functionality</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Fix critical Jenkins data loss issue</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Completed Items & Release Notes */}
              <div className="lg:col-span-2">
                {/* Completed Items */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-4 py-5 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Completed Items</h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {completedItems.length > 0 ? (
                        completedItems.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className={`p-2 rounded-md mr-3 ${
                                item.priority === 'high' ? 'bg-green-100' : 
                                item.priority === 'medium' ? 'bg-blue-100' : 
                                'bg-amber-100'
                              }`}>
                                {item.priority === 'high' ? <Package size={20} className="text-green-600" /> : 
                                 item.priority === 'medium' ? <Zap size={20} className="text-blue-600" /> : 
                                 <Bug size={20} className="text-amber-600" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                                    <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                                      item.priority === 'high' ? 'bg-green-100 text-green-800' : 
                                      item.priority === 'medium' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-amber-100 text-amber-800'
                                    }`}>
                                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                                    </span>
                                  </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                                
                                {item.assignee && (
                                  <div className="mt-3">
                                    <h4 className="text-sm font-medium text-gray-700">Assignee:</h4>
                                    <p className="text-sm text-gray-600">{item.assignee}</p>
                                  </div>
                                )}
                                
                                <div className="mt-3">
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.tags.map((tag, tIndex) => (
                                      <span 
                                        key={tIndex} 
                                        className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                            <AlertCircle className="h-6 w-6 text-gray-600" />
                          </div>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No completed items</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            There are no completed items for the current sprint yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Generated Release Notes */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-4 py-5 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">AI Generated Release Notes</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Generate and publish release notes based on completed items
                    </p>
                  </div>
                  <div className="p-4">
                    {!generatedNotes ? (
                      <div className="text-center py-8">
                        <button
                          onClick={generateReleaseNotes}
                          disabled={isGeneratingNotes || completedItems.length === 0}
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                            isGeneratingNotes || completedItems.length === 0 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                          }`}
                        >
                          {isGeneratingNotes ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>Generate Release Notes</>
                          )}
                        </button>
                        {completedItems.length === 0 && (
                          <p className="mt-2 text-sm text-gray-500">
                            Complete some items in the current sprint to generate release notes.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="bg-gray-50 rounded-md p-4 mb-4 whitespace-pre-line font-mono text-sm overflow-auto max-h-96">
                          {generatedNotes}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={publishToVivaEngage}
                            disabled={isPublishing}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                              isPublishing 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-[#de0043] hover:bg-[#c0003a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#de0043]'
                            }`}
                          >
                            {isPublishing ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publishing...
                              </>
                            ) : (
                              <>
                                <Send size={16} className="mr-2" />
                                Publish to Viva Engage
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={copyToClipboard}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Copy size={16} className="mr-2" />
                            Copy to Clipboard
                          </button>
                          
                          <button
                            onClick={downloadReleaseNotes}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Download size={16} className="mr-2" />
                            Download as Markdown
                          </button>
                        </div>
                        
                        {publishSuccess !== null && (
                          <div className={`mt-4 p-3 rounded-md ${
                            publishSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                          }`}>
                            {publishMessage}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
};

export default SprintReviewDemo;
