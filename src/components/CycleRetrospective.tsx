import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RefreshCw, 
  Award, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  Plus,
  Download,
  Send,
  Layout
} from 'lucide-react';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';
import RetrospectiveWhiteboard from './RetrospectiveWhiteboard';
import { OutcomeData, AccomplishmentData, BacklogItem } from '../types';
import { accomplishmentData } from '../data/dashboardData';

interface CycleRetrospectiveProps {
  outcomes?: OutcomeData;
  backlog?: BacklogItem[];
}

const CycleRetrospective: React.FC<CycleRetrospectiveProps> = ({ 
  outcomes,
  backlog = []
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cycle-retrospective');
  const [accomplishments, setAccomplishments] = useState<AccomplishmentData[]>(accomplishmentData);
  const [newAccomplishment, setNewAccomplishment] = useState<Partial<AccomplishmentData>>({
    title: '',
    description: '',
    type: 'accomplishment',
    impact: '',
    team: []
  });
  const [newLearning, setNewLearning] = useState<Partial<AccomplishmentData>>({
    title: '',
    description: '',
    type: 'learning',
    impact: '',
    team: []
  });
  const [showAccomplishmentForm, setShowAccomplishmentForm] = useState(false);
  const [showLearningForm, setShowLearningForm] = useState(false);
  const [teamInput, setTeamInput] = useState('');
  const [activeSection, setActiveSection] = useState('accomplishments');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean | null>(null);
  const [publishMessage, setPublishMessage] = useState('');
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  // Filter accomplishments and learnings
  const filteredAccomplishments = accomplishments.filter(item => item.type === 'accomplishment');
  const filteredLearnings = accomplishments.filter(item => item.type === 'learning');

  // Handle adding a new accomplishment
  const handleAddAccomplishment = () => {
    if (newAccomplishment.title && newAccomplishment.description) {
      const accomplishment: AccomplishmentData = {
        ...newAccomplishment as AccomplishmentData,
        date: new Date().toISOString().split('T')[0],
        type: 'accomplishment'
      };
      
      setAccomplishments([accomplishment, ...accomplishments]);
      setNewAccomplishment({
        title: '',
        description: '',
        type: 'accomplishment',
        impact: '',
        team: []
      });
      setShowAccomplishmentForm(false);
    }
  };

  // Handle adding a new learning
  const handleAddLearning = () => {
    if (newLearning.title && newLearning.description) {
      const learning: AccomplishmentData = {
        ...newLearning as AccomplishmentData,
        date: new Date().toISOString().split('T')[0],
        type: 'learning'
      };
      
      setAccomplishments([learning, ...accomplishments]);
      setNewLearning({
        title: '',
        description: '',
        type: 'learning',
        impact: '',
        team: []
      });
      setShowLearningForm(false);
    }
  };

  // Handle adding a team to an accomplishment or learning
  const handleAddTeam = (isAccomplishment: boolean) => {
    if (teamInput.trim()) {
      if (isAccomplishment) {
        setNewAccomplishment({
          ...newAccomplishment,
          team: [...(newAccomplishment.team || []), teamInput.trim()]
        });
      } else {
        setNewLearning({
          ...newLearning,
          team: [...(newLearning.team || []), teamInput.trim()]
        });
      }
      setTeamInput('');
    }
  };

  // Handle removing a team from an accomplishment or learning
  const handleRemoveTeam = (team: string, isAccomplishment: boolean) => {
    if (isAccomplishment) {
      setNewAccomplishment({
        ...newAccomplishment,
        team: newAccomplishment.team?.filter(t => t !== team) || []
      });
    } else {
      setNewLearning({
        ...newLearning,
        team: newLearning.team?.filter(t => t !== team) || []
      });
    }
  };

  // Generate retrospective report
  const generateReport = () => {
    setIsGeneratingReport(true);
    
    // Simulate AI generation with a timeout
    setTimeout(() => {
      const generatedContent = `
# 90-Day Cycle Retrospective Report: Q2 2025

## Executive Summary
Our team has completed the Q2 2025 cycle with significant achievements in platform development and data integration. We've successfully launched key features that have improved engineering metrics visibility and team collaboration. While we faced some challenges with data pipeline performance and cross-team metric standardization, we've learned valuable lessons that will inform our next cycle planning.

## Key Accomplishments

${filteredAccomplishments.map(item => `
### ${item.title}
${item.description}

**Impact:** ${item.impact}
**Team(s) Involved:** ${item.team.join(', ')}
**Date:** ${new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
`).join('')}

## Key Learnings

${filteredLearnings.map(item => `
### ${item.title}
${item.description}

**Impact:** ${item.impact}
**Team(s) Involved:** ${item.team.join(', ')}
**Date:** ${new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
`).join('')}

## Metrics Progress

- Lead Time for Changes: Improved by 27% (from 6.2 days to 4.5 days)
- Deployment Frequency: Increased by 50% (from 8 to 12 deployments per month)
- Mean Time to Recovery: Improved by 21% (from 8.2 hours to 6.5 hours)
- Change Failure Rate: Reduced by 29% (from 12% to 8.5%)

## Recommendations for Next Cycle

1. **Focus on User Onboarding**: Our data shows a 3.5% decrease in onboarding completion rates. We should prioritize improving the onboarding experience.

2. **Expand Integration Capabilities**: Based on user feedback, prioritize GitLab and Azure DevOps integrations.

3. **Improve Mobile Experience**: Leadership users access dashboards via mobile 3x more than individual contributors. Optimize mobile views for executive users.

4. **Simplify Custom Metrics Builder**: Users find the current builder powerful but complex. Develop a simplified mode with templates.

5. **Increase Feature Awareness**: 42% of users were unaware of key features. Create an in-app feature spotlight series.

## Next Steps

- Schedule 90-Day Cycle Planning session for Q3 2025
- Prioritize backlog items based on retrospective findings
- Share learnings with related teams to improve cross-team collaboration
- Update team OKRs to reflect new priorities

Thank you to everyone who contributed to this successful cycle!
`;
      
      setGeneratedReport(generatedContent);
      setIsGeneratingReport(false);
    }, 2000);
  };

  // Publish retrospective report
  const publishReport = () => {
    setIsPublishing(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Simulate successful publishing
      setPublishSuccess(true);
      setPublishMessage('Retrospective report successfully published to Viva Engage - Engineering Leadership channel');
      
      setTimeout(() => {
        setPublishSuccess(null);
        setPublishMessage('');
      }, 5000);
      
      setIsPublishing(false);
    }, 2000);
  };

  // Download retrospective report
  const downloadReport = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedReport], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `90-day-cycle-retrospective-q2-2025.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // If whiteboard is shown, render only the whiteboard in full screen
  if (showWhiteboard) {
    return <RetrospectiveWhiteboard onClose={() => setShowWhiteboard(false)} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')} 
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                  <RefreshCw className="h-6 w-6 mr-2 text-blue-500" />
                  90-Day Cycle Retrospective
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Reflect on what went well, what we learned, and how we can improve in the next cycle
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Whiteboard Button */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <Layout className="h-5 w-5 text-blue-600 mr-2" />
                    Retrospective Whiteboard
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Collaborate with your team to add sticky notes about what went well and what needs improvement
                  </p>
                </div>
                <button
                  onClick={() => setShowWhiteboard(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Layout size={16} className="mr-2" />
                  Open Whiteboard
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-6">
              <div className="px-4 py-5 border-b border-gray-200">
                <div className="flex items-center">
                  <RefreshCw className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Cycle Reflection</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Reflect on what went well, what we learned, and how we can improve in the next cycle
                </p>
              </div>
              <div className="p-4">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeSection === 'accomplishments' 
                        ? 'border-b-2 border-blue-500 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveSection('accomplishments')}
                  >
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Accomplishments
                    </div>
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeSection === 'learnings' 
                        ? 'border-b-2 border-blue-500 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveSection('learnings')}
                  >
                    <div className="flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Learnings
                    </div>
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeSection === 'metrics' 
                        ? 'border-b-2 border-blue-500 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveSection('metrics')}
                  >
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Metrics Progress
                    </div>
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeSection === 'report' 
                        ? 'border-b-2 border-blue-500 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveSection('report')}
                  >
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Retrospective Report
                    </div>
                  </button>
                </div>

                {/* Accomplishments Section */}
                {activeSection === 'accomplishments' && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">What went well</h3>
                      <button
                        onClick={() => setShowAccomplishmentForm(!showAccomplishmentForm)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Accomplishment
                      </button>
                    </div>

                    {/* Add Accomplishment Form */}
                    {showAccomplishmentForm && (
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">New Accomplishment</h4>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                              type="text"
                              id="title"
                              value={newAccomplishment.title}
                              onChange={(e) => setNewAccomplishment({...newAccomplishment, title: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="E.g., GitHub Integration Enhancement"
                            />
                          </div>
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                              id="description"
                              value={newAccomplishment.description}
                              onChange={(e) => setNewAccomplishment({...newAccomplishment, description: e.target.value})}
                              rows={3}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Describe the accomplishment in detail"
                            />
                          </div>
                          <div>
                            <label htmlFor="impact" className="block text-sm font-medium text-gray-700">Impact</label>
                            <textarea
                              id="impact"
                              value={newAccomplishment.impact}
                              onChange={(e) => setNewAccomplishment({...newAccomplishment, impact: e.target.value})}
                              rows={2}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Describe the impact of this accomplishment"
                            />
                          </div>
                          <div>
                            <label htmlFor="teams" className="block text-sm font-medium text-gray-700">Teams Involved</label>
                            <div className="mt-1 flex">
                              <input
                                type="text"
                                id="teams"
                                value={teamInput}
                                onChange={(e) => setTeamInput(e.target.value)}
                                className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Add team name"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddTeam(true)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Add
                              </button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {newAccomplishment.team?.map((team, index) => (
                                <span 
                                  key={index} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {team}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTeam(team, true)}
                                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
                                  >
                                    <span className="sr-only">Remove {team}</span>
                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                    </svg>
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3 mt-4">
                            <button
                              type="button"
                              onClick={() => setShowAccomplishmentForm(false)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddAccomplishment}
                              disabled={!newAccomplishment.title || !newAccomplishment.description}
                              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                                !newAccomplishment.title || !newAccomplishment.description
                                  ? 'bg-gray-300 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                              }`}
                            >
                              Save Accomplishment
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Accomplishments List */}
                    <div className="space-y-4">
                      {filteredAccomplishments.length > 0 ? (
                        filteredAccomplishments.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="p-2 rounded-md mr-3 bg-green-100">
                                <Award size={20} className="text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                                
                                <div className="mt-3">
                                  <h5 className="text-sm font-medium text-gray-700">Impact:</h5>
                                  <p className="text-sm text-gray-600">{item.impact}</p>
                                </div>
                                
                                <div className="mt-3 flex flex-wrap items-center">
                                  <span className="text-sm font-medium text-gray-700 mr-2">Teams:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {item.team.map((team, tIndex) => (
                                      <span 
                                        key={tIndex} 
                                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                      >
                                        {team}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="mt-2 text-xs text-gray-500">
                                  {new Date(item.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                            <Award className="h-6 w-6 text-gray-600" />
                          </div>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No accomplishments yet</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Add your team's accomplishments from this cycle.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Learnings Section */}
                {activeSection === 'learnings' && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">What we learned</h3>
                      <button
                        onClick={() => setShowLearningForm(!showLearningForm)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Learning
                      </button>
                    </div>

                    {/* Add Learning Form */}
                    {showLearningForm && (
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">New Learning</h4>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="learning-title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                              type="text"
                              id="learning-title"
                              value={newLearning.title}
                              onChange={(e) => setNewLearning({...newLearning, title: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="E.g., Data Pipeline Performance Bottlenecks"
                            />
                          </div>
                          <div>
                            <label htmlFor="learning-description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                              id="learning-description"
                              value={newLearning.description}
                              onChange={(e) => setNewLearning({...newLearning, description: e.target.value})}
                              rows={3}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Describe what you learned"
                            />
                          </div>
                          <div>
                            <label htmlFor="learning-impact" className="block text-sm font-medium text-gray-700">Impact</label>
                            <textarea
                              id="learning-impact"
                              value={newLearning.impact}
                              onChange={(e) => setNewLearning({...newLearning, impact: e.target.value})}
                              rows={2}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Describe the impact of this learning"
                            />
                          </div>
                          <div>
                            <label htmlFor="learning-teams" className="block text-sm font-medium text-gray-700">Teams Involved</label>
                            <div className="mt-1 flex">
                              <input
                                type="text"
                                id="learning-teams"
                                value={teamInput}
                                onChange={(e) => setTeamInput(e.target.value)}
                                className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Add team name"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddTeam(false)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Add
                              </button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {newLearning.team?.map((team, index) => (
                                <span 
                                  key={index} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {team}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTeam(team, false)}
                                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
                                  >
                                    <span className="sr-only">Remove {team}</span>
                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                    </svg>
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3 mt-4">
                            <button
                              type="button"
                              onClick={() => setShowLearningForm(false)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddLearning}
                              disabled={!newLearning.title || !newLearning.description}
                              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                                !newLearning.title || !newLearning.description
                                  ? 'bg-gray-300 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                              }`}
                            >
                              Save Learning
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Learnings List */}
                    <div className="space-y-4">
                      {filteredLearnings.length > 0 ? (
                        filteredLearnings.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="p-2 rounded-md mr-3 bg-amber-100">
                                <Lightbulb size={20} className="text-amber-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                                
                                <div className="mt-3">
                                  <h5 className="text-sm font-medium text-gray-700">Impact:</h5>
                                  <p className="text-sm text-gray-600">{item.impact}</p>
                                </div>
                                
                                <div className="mt-3 flex flex-wrap items-center">
                                  <span className="text-sm font-medium text-gray-700 mr-2">Teams:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {item.team.map((team, tIndex) => (
                                      <span 
                                        key={tIndex} 
                                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                      >
                                        {team}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="mt-2 text-xs text-gray-500">
                                  {new Date(item.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                            <Lightbulb className="h-6 w-6 text-gray-600" />
                          </div>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No learnings yet</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Add your team's learnings from this cycle.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Metrics Progress Section */}
                {activeSection === 'metrics' && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Metrics Progress</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* DORA Metrics */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-md font-medium text-gray-900 mb-3">DORA Metrics</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">Lead Time for Changes</span>
                              <span className="text-sm text-green-600 flex items-center">
                                <TrendingUp size={14} className="mr-1" />
                                -27%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Previous: 6.2 days</span>
                              <span>Current: 4.5 days</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">Deployment Frequency</span>
                              <span className="text-sm text-green-600 flex items-center">
                                <TrendingUp size={14} className="mr-1" />
                                +50%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Previous: 8 per month</span>
                              <span>Current: 12 per month</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">Mean Time to Recover</span>
                              <span className="text-sm text-green-600 flex items-center">
                                <TrendingUp size={14} className="mr-1" />
                                -21%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Previous: 8.2 hours</span>
                              <span>Current: 6.5 hours</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">Change Failure Rate</span>
                              <span className="text-sm text-green-600 flex items-center">
                                <TrendingUp size={14} className="mr-1" />
                                -29%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Previous: 12%</span>
                              <span>Current: 8.5%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Product Adoption Metrics */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-md font-medium text-gray-900 mb-3">Product Adoption</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">Monthly Active Users</span>
                              <span className="text-sm text-green-600 flex items-center">
                                <TrendingUp size={14} className="mr-1" />
                                +12.4%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Previous: 1,638</span>
                              <span>Current: 1,842</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">Team Adoption Rate</span>
                              <span className="text-sm text-green-600 flex items-center">
                                <TrendingUp size={14} className="mr-1" />
                                +5.2%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Previous: 64.7%</span>
                              <span>Current: 68%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">User Retention</span>
                              <span className="text-sm text-gray-600 flex items-center">
                                <TrendingUp size={14} className="mr-1" />
                                +0.8%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Previous: 75.4%</span>
                              <span>Current: 76%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">New User Onboarding Completion</span>
                              <span className="text-sm text-red-600 flex items-center">
                                <TrendingUp size={14} className="mr-1 transform rotate-180" />
                                -3.5%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-red-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Previous: 64.2%</span>
                              <span>Current: 62%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Outcome Progress */}
                      <div className="border border-gray-200 rounded-lg p-4 md:col-span-2">
                        <h4 className="text-md font-medium text-gray-900 mb-3">Outcome Progress</h4>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-gray-100 rounded p-3 bg-gray-50">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">DevLake Data Integration</h5>
                              <div className="space-y-2">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-700">Data Sources Connected</span>
                                    <span className="text-xs font-medium text-green-700">5/8</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '62.5%' }}></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-700">Data Completeness</span>
                                    <span className="text-xs font-medium text-yellow-700">82%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border border-gray-100 rounded p-3 bg-gray-50">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Developer Productivity Metrics</h5>
                              <div className="space-y-2">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-700">DORA Metrics Coverage</span>
                                    <span className="text-xs font-medium text-green-700">75%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-700">Teams Onboarded</span>
                                    <span className="text-xs font-medium text-green-700">8/12</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '66.7%' }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recommendations Based on Metrics */}
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Recommendations Based on Metrics</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div className="ml-3">
                            <h5 className="text-sm font-medium text-gray-900">Improve User Onboarding</h5>
                            <p className="text-sm text-gray-500">Onboarding completion has decreased by 3.5%. Consider simplifying the onboarding flow and adding interactive tutorials.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <ThumbsUp className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="ml-3">
                            <h5 className="text-sm font-medium text-gray-900">Continue DORA Metrics Focus</h5>
                            <p className="text-sm text-gray-500">All DORA metrics are trending positively. Continue the current initiatives to maintain momentum.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <ThumbsDown className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="ml-3">
                            <h5 className="text-sm font-medium text-gray-900">Address Data Completeness</h5>
                            <p className="text-sm text-gray-500">Data completeness is at 82%, below the 95% target. Identify and fix data collection gaps in the remaining integrations.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Retrospective Report Section */}
                {activeSection === 'report' && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Retrospective Report</h3>
                      {!generatedReport && (
                        <button
                          onClick={generateReport}
                          disabled={isGeneratingReport}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                            isGeneratingReport 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                          }`}
                        >
                          {isGeneratingReport ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>Generate Report</>
                          )}
                        </button>
                      )}
                    </div>

                    {!generatedReport ? (
                      <div className="text-center py-8">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                          <RefreshCw className="h-6 w-6 text-gray-600" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No report generated yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Generate a comprehensive retrospective report based on accomplishments, learnings, and metrics.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="bg-gray-50 rounded-md p-4 mb-4 whitespace-pre-line font-mono text-sm overflow-auto max-h-96">
                          {generatedReport}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={publishReport}
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
                            onClick={downloadReport}
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
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Next Steps</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Actions to take based on retrospective findings
                </p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Schedule 90-Day Cycle Planning</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Set up a planning session with the team to define goals and priorities for the next 90-day cycle.
                      </p>
                      <button className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Schedule Meeting
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Update Backlog Priorities</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Reprioritize the backlog based on retrospective findings and user research insights.
                      </p>
                      <button className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        View Backlog
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Share Learnings with Related Teams</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Schedule knowledge sharing sessions with related teams to improve cross-team collaboration.
                      </p>
                      <button className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Schedule Sessions
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Update Team OKRs</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Revise team objectives and key results based on retrospective insights and new priorities.
                      </p>
                      <button className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Update OKRs
                      </button>
                    </div>
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

export default CycleRetrospective;
