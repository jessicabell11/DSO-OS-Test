import React, { useState } from 'react';
import { ArrowLeft, Calendar, Target, Users, MessageSquare, ListTodo, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OutcomeData, UserResearchInsight, Recommendation, BacklogItem } from '../types';
import AIAssistant from './AIAssistant';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import BacklogItemCard from './BacklogItemCard';
import BacklogContainer from './BacklogContainer';
import Sidebar from './Sidebar';

interface SprintPlanProps {
  outcomes: OutcomeData;
  userResearch: UserResearchInsight[];
  recommendations: Recommendation[];
  backlog: BacklogItem[];
}

const SprintPlan: React.FC<SprintPlanProps> = ({
  outcomes,
  userResearch,
  recommendations,
  backlog
}) => {
  const [activeTab, setActiveTab] = useState('sprint-plan');
  const [activeContentTab, setActiveContentTab] = useState('overview');
  const [items, setItems] = useState<BacklogItem[]>(backlog);
  const [activeItem, setActiveItem] = useState<BacklogItem | null>(null);
  
  // Filter backlog items for different panels
  const currentSprintItems = items.filter(item => 
    item.tags.includes('Current Sprint')
  );
  
  // Filter for Q4 Backlog items
  const q4BacklogItems = items.filter(item => 
    item.tags.includes('Q4') && 
    !item.tags.includes('Current Sprint') && 
    !item.tags.includes('Completed Sprint')
  );
  
  // Filter for regular backlog items (not in Q4, Current Sprint, or Completed Sprint)
  const backlogItems = items.filter(item => 
    !item.tags.includes('Q4') &&
    !item.tags.includes('Current Sprint') && 
    !item.tags.includes('Completed Sprint')
  );
  
  // Filter for Previous Sprint items that are NOT completed
  const previousSprintItems = items.filter(item => 
    item.tags.includes('Completed Sprint') && 
    item.status !== 'completed'
  );

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedItem = items.find(item => item.id === active.id);
    if (draggedItem) {
      setActiveItem(draggedItem);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveItem(null);
      return;
    }

    // Find the dragged item
    const draggedItem = items.find(item => item.id === active.id);
    if (!draggedItem) {
      setActiveItem(null);
      return;
    }

    // Determine which container the item was dropped into
    const containerId = over.id.toString();
    
    // Update the item's tags based on the container it was dropped into
    const updatedItems = items.map(item => {
      if (item.id === draggedItem.id) {
        const newTags = [...item.tags.filter(tag => 
          tag !== 'Current Sprint' && tag !== 'Completed Sprint' && tag !== 'Q4'
        )];
        
        if (containerId === 'current-sprint') {
          newTags.push('Current Sprint');
        } else if (containerId === 'previous-sprint') {
          newTags.push('Completed Sprint');
          return { ...item, tags: newTags, status: 'completed' };
        } else if (containerId === 'q4-backlog') {
          newTags.push('Q4');
        }
        // If dropped in regular backlog, we've already filtered out the special tags
        
        return { ...item, tags: newTags };
      }
      return item;
    });
    
    setItems(updatedItems);
    setActiveItem(null);
  };

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not-started':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Not Started</span>;
      case 'in-progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
      case 'blocked':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Blocked</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-blue-500" />
                Sprint Plan
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Sprint 24 • May 15 - May 28, 2025
              </span>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <p className="mt-1 text-sm text-gray-500">
              Plan and track your team's sprint objectives and deliverables
            </p>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex -mb-px space-x-8">
              <button
                onClick={() => setActiveContentTab('overview')}
                className={`py-4 px-1 text-sm font-medium ${
                  activeContentTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveContentTab('sprint-goals')}
                className={`py-4 px-1 text-sm font-medium ${
                  activeContentTab === 'sprint-goals'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sprint Goals
              </button>
              <button
                onClick={() => setActiveContentTab('team-capacity')}
                className={`py-4 px-1 text-sm font-medium ${
                  activeContentTab === 'team-capacity'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Team Capacity
              </button>
              <button
                onClick={() => setActiveContentTab('sprint-backlog')}
                className={`py-4 px-1 text-sm font-medium ${
                  activeContentTab === 'sprint-backlog'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sprint Backlog
              </button>
            </nav>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {activeContentTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow mb-6">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-500" />
                        Current Sprint
                      </h2>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Sprint 24</h3>
                          <p className="text-sm text-gray-500">May 15 - May 28, 2025</p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          In Progress
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Sprint Progress</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">60% complete (5 days remaining)</p>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700">Sprint Goals</h4>
                          <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
                          <p className="text-xs text-gray-500">Key objectives</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700">Backlog Items</h4>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{currentSprintItems.length}</p>
                          <p className="text-xs text-gray-500">Planned for this sprint</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700">Completion</h4>
                          <p className="text-2xl font-bold text-gray-900 mt-1">45%</p>
                          <p className="text-xs text-gray-500">Of planned work</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <ListTodo className="h-5 w-5 mr-2 text-blue-500" />
                        Sprint Backlog
                      </h2>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        {currentSprintItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                              <div className="flex space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                  {item.priority}
                                </span>
                                {getStatusBadge(item.status)}
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{item.description}</p>
                          </div>
                        ))}
                        {currentSprintItems.length > 3 && (
                          <button 
                            onClick={() => setActiveContentTab('sprint-backlog')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View all {currentSprintItems.length} items →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-lg shadow mb-6">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <Target className="h-5 w-5 mr-2 text-blue-500" />
                        Sprint Goals
                      </h2>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-3">
                          <h3 className="text-sm font-medium text-gray-900">Complete user onboarding flow redesign</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-700">Progress</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                On Track
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3">
                          <h3 className="text-sm font-medium text-gray-900">Implement API integration with partner systems</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-700">Progress</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                At Risk
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3">
                          <h3 className="text-sm font-medium text-gray-900">Fix critical security vulnerabilities</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-700">Progress</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                On Track
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-blue-500" />
                        Team Capacity
                      </h2>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">Total Capacity</h3>
                            <span className="text-sm font-medium text-gray-900">80 story points</span>
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">60 points committed (75% of capacity)</p>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3">
                          <h3 className="text-sm font-medium text-gray-900">Team Availability</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-700">Engineers</span>
                              <span className="text-xs font-medium text-gray-900">5/6 available</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-700">Designers</span>
                              <span className="text-xs font-medium text-gray-900">2/2 available</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-700">QA</span>
                              <span className="text-xs font-medium text-gray-900">1/2 available</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeContentTab === 'sprint-goals' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-500" />
                    Sprint Goals
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Key objectives and measurements for the current sprint
                  </p>
                </div>
                <div className="p-4">
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900">Complete user onboarding flow redesign</h3>
                      <p className="mt-1 text-sm text-gray-500">Implement the new user onboarding experience based on recent user research to improve conversion rates.</p>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Completion Status</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500">Target: 100%</span>
                              <span className="mx-2 text-gray-300">|</span>
                              <span className="text-xs text-gray-500">Current: 70%</span>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            On Track
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900">Implement API integration with partner systems</h3>
                      <p className="mt-1 text-sm text-gray-500">Complete the integration with three partner APIs to enable data sharing and enhanced functionality.</p>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Completion Status</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500">Target: 100%</span>
                              <span className="mx-2 text-gray-300">|</span>
                              <span className="text-xs text-gray-500">Current: 40%</span>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            At Risk
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900">Fix critical security vulnerabilities</h3>
                      <p className="mt-1 text-sm text-gray-500">Address all high and critical security vulnerabilities identified in the recent security audit.</p>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Completion Status</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500">Target: 100%</span>
                              <span className="mx-2 text-gray-300">|</span>
                              <span className="text-xs text-gray-500">Current: 80%</span>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            On Track
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeContentTab === 'team-capacity' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-blue-500" />
                        Team Capacity
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Team member availability and capacity for the current sprint
                      </p>
                    </div>
                    <div className="p-4">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-md font-medium text-gray-900 mb-3">Sprint Capacity Overview</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700">Total Capacity</h4>
                                <p className="text-2xl font-bold text-gray-900 mt-1">80 points</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-700">Committed</h4>
                                <p className="text-2xl font-bold text-gray-900 mt-1">60 points</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-700">Remaining</h4>
                                <p className="text-2xl font-bold text-gray-900 mt-1">20 points</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                              <p className="mt-1 text-xs text-gray-500">75% of capacity committed</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-md font-medium text-gray-900 mb-3">Team Member Availability</h3>
                          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Team Member</th>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Availability</th>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Capacity (points)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Alex Johnson</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Engineer</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">100%</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">15</td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Maria Garcia</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Engineer</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">100%</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">15</td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">David Kim</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Engineer</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">80%</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">12</td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Sarah Wilson</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Engineer</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">100%</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">15</td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">James Lee</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Engineer</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">0%</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">0</td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Emma Brown</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Designer</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">100%</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">10</td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Michael Chen</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Designer</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">100%</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">10</td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Olivia Martinez</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">QA</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">100%</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">8</td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">William Taylor</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">QA</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">0%</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">0</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-lg shadow mb-6">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-500" />
                        Sprint Details
                      </h2>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Sprint Duration</h3>
                          <p className="text-sm text-gray-900 mt-1">2 weeks (10 working days)</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Sprint Dates</h3>
                          <p className="text-sm text-gray-900 mt-1">May 15 - May 28, 2025</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Working Days</h3>
                          <p className="text-sm text-gray-900 mt-1">10 days</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Team Size</h3>
                          <p className="text-sm text-gray-900 mt-1">9 members (7 available)</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Velocity (avg. last 3 sprints)</h3>
                          <p className="text-sm text-gray-900 mt-1">65 points</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <Target className="h-5 w-5 mr-2 text-blue-500" />
                        Capacity Allocation
                      </h2>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Work Type Distribution</h3>
                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center justify-between text-xs">
                                <span>New Features</span>
                                <span>50%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-xs">
                                <span>Bug Fixes</span>
                                <span>30%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-xs">
                                <span>Technical Debt</span>
                                <span>15%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-xs">
                                <span>Research</span>
                                <span>5%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeContentTab === 'sprint-backlog' && (
              <DndContext 
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <BacklogContainer
                      id="previous-sprint"
                      title="Previous Sprint"
                      description="Non-completed items from previous sprint"
                      items={previousSprintItems}
                      itemCount={previousSprintItems.length}
                      badgeColor="bg-green-100 text-green-800"
                      icon={<Calendar className="h-5 w-5 mr-2 text-blue-500" />}
                    >
                      {previousSprintItems.length > 0 ? (
                        <SortableContext 
                          items={previousSprintItems.map(item => item.id)} 
                          strategy={verticalListSortingStrategy}
                        >
                          {previousSprintItems.map((item) => (
                            <BacklogItemCard 
                              key={item.id} 
                              item={item} 
                              getStatusBadge={getStatusBadge}
                              getPriorityColor={getPriorityColor}
                            />
                          ))}
                        </SortableContext>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-500">No non-completed items from previous sprint</p>
                        </div>
                      )}
                    </BacklogContainer>
                    
                    <BacklogContainer
                      id="current-sprint"
                      title="Upcoming Sprint"
                      description="Items planned for this sprint"
                      items={currentSprintItems}
                      itemCount={currentSprintItems.length}
                      badgeColor="bg-blue-100 text-blue-800"
                      icon={<Clock className="h-5 w-5 mr-2 text-blue-500" />}
                    >
                      {currentSprintItems.length > 0 ? (
                        <SortableContext 
                          items={currentSprintItems.map(item => item.id)} 
                          strategy={verticalListSortingStrategy}
                        >
                          {currentSprintItems.map((item) => (
                            <BacklogItemCard 
                              key={item.id} 
                              item={item} 
                              getStatusBadge={getStatusBadge}
                              getPriorityColor={getPriorityColor}
                            />
                          ))}
                        </SortableContext>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-500">No items in upcoming sprint</p>
                        </div>
                      )}
                    </BacklogContainer>
                  </div>
                  
                  <div className="space-y-6">
                    <BacklogContainer
                      id="q4-backlog"
                      title="Q4 Backlog"
                      description="Items planned for Q4"
                      items={q4BacklogItems}
                      itemCount={q4BacklogItems.length}
                      badgeColor="bg-purple-100 text-purple-800"
                      icon={<Calendar className="h-5 w-5 mr-2 text-purple-500" />}
                    >
                      {q4BacklogItems.length > 0 ? (
                        <SortableContext 
                          items={q4BacklogItems.map(item => item.id)} 
                          strategy={verticalListSortingStrategy}
                        >
                          {q4BacklogItems.map((item) => (
                            <BacklogItemCard 
                              key={item.id} 
                              item={item} 
                              getStatusBadge={getStatusBadge}
                              getPriorityColor={getPriorityColor}
                            />
                          ))}
                        </SortableContext>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-500">No items in Q4 backlog</p>
                        </div>
                      )}
                    </BacklogContainer>
                    
                    <BacklogContainer
                      id="product-backlog"
                      title="Product Backlog"
                      description="Items available for sprint planning"
                      items={backlogItems}
                      itemCount={backlogItems.length}
                      badgeColor="bg-gray-100 text-gray-800"
                      icon={<ListTodo className="h-5 w-5 mr-2 text-blue-500" />}
                    >
                      {backlogItems.length > 0 ? (
                        <SortableContext 
                          items={backlogItems.map(item => item.id)} 
                          strategy={verticalListSortingStrategy}
                        >
                          {backlogItems.map((item) => (
                            <BacklogItemCard 
                              key={item.id} 
                              item={item} 
                              getStatusBadge={getStatusBadge}
                              getPriorityColor={getPriorityColor}
                            />
                          ))}
                        </SortableContext>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-500">No items in product backlog</p>
                        </div>
                      )}
                    </BacklogContainer>
                  </div>
                </div>
                
                <DragOverlay>
                  {activeItem ? (
                    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-lg opacity-80">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{activeItem.title}</h3>
                        {getStatusBadge(activeItem.status)}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{activeItem.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(activeItem.priority)}`}>
                            {activeItem.priority}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {activeItem.effort}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </main>

        {/* AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  );
};

export default SprintPlan;
