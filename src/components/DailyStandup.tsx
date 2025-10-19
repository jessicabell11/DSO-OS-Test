import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Clock, CheckCircle, AlertCircle, XCircle, Plus, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BacklogItem } from '../types';
import AIAssistant from './AIAssistant';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import BacklogItemCard from './BacklogItemCard';
import Sidebar from './Sidebar';

interface DailyStandupProps {
  backlog: BacklogItem[];
}

const DailyStandup: React.FC<DailyStandupProps> = ({ backlog }) => {
  const [activeTab, setActiveTab] = useState('daily-standup');
  const [items, setItems] = useState<BacklogItem[]>(backlog.filter(item => 
    item.tags.includes('Current Sprint')
  ));
  const [activeItem, setActiveItem] = useState<BacklogItem | null>(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [standupNotes, setStandupNotes] = useState<{
    date: string;
    notes: {
      id: string;
      content: string;
      type: 'blocker' | 'achievement' | 'plan';
      author: string;
    }[]
  }>({
    date: new Date().toISOString().split('T')[0],
    notes: [
      {
        id: '1',
        content: 'Completed the API integration for user authentication',
        type: 'achievement',
        author: 'Alex Johnson'
      },
      {
        id: '2',
        content: 'Blocked on the database migration due to permission issues',
        type: 'blocker',
        author: 'Maria Garcia'
      },
      {
        id: '3',
        content: 'Will start working on the UI components for the dashboard',
        type: 'plan',
        author: 'David Kim'
      }
    ]
  });
  
  // Group items by status
  const todoItems = items.filter(item => item.status === 'not-started');
  const inProgressItems = items.filter(item => item.status === 'in-progress');
  const blockedItems = items.filter(item => item.status === 'blocked');
  const doneItems = items.filter(item => item.status === 'completed');
  
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
    
    // Update the item's status based on the container it was dropped into
    const updatedItems = items.map(item => {
      if (item.id === draggedItem.id) {
        let newStatus = item.status;
        
        if (containerId === 'todo') {
          newStatus = 'not-started';
        } else if (containerId === 'in-progress') {
          newStatus = 'in-progress';
        } else if (containerId === 'blocked') {
          newStatus = 'blocked';
        } else if (containerId === 'done') {
          newStatus = 'completed';
        }
        
        return { ...item, status: newStatus };
      }
      return item;
    });
    
    setItems(updatedItems);
    setActiveItem(null);
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

  const handleAddNote = (type: 'blocker' | 'achievement' | 'plan') => {
    if (newNote.trim()) {
      const newNoteObj = {
        id: Date.now().toString(),
        content: newNote,
        type,
        author: 'You' // In a real app, this would be the current user
      };
      
      setStandupNotes({
        ...standupNotes,
        notes: [...standupNotes.notes, newNoteObj]
      });
      
      setNewNote('');
      setShowAddNoteModal(false);
    }
  };

  const getNoteTypeIcon = (type: 'blocker' | 'achievement' | 'plan') => {
    switch (type) {
      case 'blocker':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'achievement':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'plan':
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNoteTypeBadge = (type: 'blocker' | 'achievement' | 'plan') => {
    switch (type) {
      case 'blocker':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Blocker</span>;
      case 'achievement':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Achievement</span>;
      case 'plan':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Plan</span>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2 text-blue-500" />
                  Daily Standup
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Track progress, identify blockers, and plan your day
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={() => setShowAddNoteModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </button>
            </div>
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                      Sprint Progress
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Sprint 24</h3>
                        <p className="text-sm text-gray-500">May 15 - May 28, 2025</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Day 6 of 10
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Sprint Progress</h4>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">60% complete (5 days remaining)</p>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700">To Do</h4>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{todoItems.length}</p>
                        <p className="text-xs text-gray-500">items</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700">In Progress</h4>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{inProgressItems.length}</p>
                        <p className="text-xs text-gray-500">items</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700">Blocked</h4>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{blockedItems.length}</p>
                        <p className="text-xs text-gray-500">items</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700">Done</h4>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{doneItems.length}</p>
                        <p className="text-xs text-gray-500">items</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                      Kanban Board
                    </h2>
                  </div>
                  <div className="p-4">
                    <DndContext 
                      sensors={sensors}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* To Do Column */}
                        <div 
                          id="todo"
                          className="bg-gray-50 rounded-lg p-3 min-h-[300px]"
                        >
                          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            To Do
                            <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              {todoItems.length}
                            </span>
                          </h3>
                          <div className="space-y-2">
                            <SortableContext 
                              items={todoItems.map(item => item.id)} 
                              strategy={verticalListSortingStrategy}
                            >
                              {todoItems.map((item) => (
                                <BacklogItemCard 
                                  key={item.id} 
                                  item={item} 
                                  getStatusBadge={getStatusBadge}
                                  getPriorityColor={getPriorityColor}
                                />
                              ))}
                            </SortableContext>
                            {todoItems.length === 0 && (
                              <div className="text-center py-4 text-sm text-gray-500">
                                No items
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* In Progress Column */}
                        <div 
                          id="in-progress"
                          className="bg-gray-50 rounded-lg p-3 min-h-[300px]"
                        >
                          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-blue-500" />
                            In Progress
                            <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              {inProgressItems.length}
                            </span>
                          </h3>
                          <div className="space-y-2">
                            <SortableContext 
                              items={inProgressItems.map(item => item.id)} 
                              strategy={verticalListSortingStrategy}
                            >
                              {inProgressItems.map((item) => (
                                <BacklogItemCard 
                                  key={item.id} 
                                  item={item} 
                                  getStatusBadge={getStatusBadge}
                                  getPriorityColor={getPriorityColor}
                                />
                              ))}
                            </SortableContext>
                            {inProgressItems.length === 0 && (
                              <div className="text-center py-4 text-sm text-gray-500">
                                No items
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Blocked Column */}
                        <div 
                          id="blocked"
                          className="bg-gray-50 rounded-lg p-3 min-h-[300px]"
                        >
                          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                            Blocked
                            <span className="ml-2 bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              {blockedItems.length}
                            </span>
                          </h3>
                          <div className="space-y-2">
                            <SortableContext 
                              items={blockedItems.map(item => item.id)} 
                              strategy={verticalListSortingStrategy}
                            >
                              {blockedItems.map((item) => (
                                <BacklogItemCard 
                                  key={item.id} 
                                  item={item} 
                                  getStatusBadge={getStatusBadge}
                                  getPriorityColor={getPriorityColor}
                                />
                              ))}
                            </SortableContext>
                            {blockedItems.length === 0 && (
                              <div className="text-center py-4 text-sm text-gray-500">
                                No items
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Done Column */}
                        <div 
                          id="done"
                          className="bg-gray-50 rounded-lg p-3 min-h-[300px]"
                        >
                          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            Done
                            <span className="ml-2 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              {doneItems.length}
                            </span>
                          </h3>
                          <div className="space-y-2">
                            <SortableContext 
                              items={doneItems.map(item => item.id)} 
                              strategy={verticalListSortingStrategy}
                            >
                              {doneItems.map((item) => (
                                <BacklogItemCard 
                                  key={item.id} 
                                  item={item} 
                                  getStatusBadge={getStatusBadge}
                                  getPriorityColor={getPriorityColor}
                                />
                              ))}
                            </SortableContext>
                            {doneItems.length === 0 && (
                              <div className="text-center py-4 text-sm text-gray-500">
                                No items
                              </div>
                            )}
                          </div>
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
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                      Today's Notes
                    </h2>
                    <span className="text-sm text-gray-500">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {standupNotes.notes.map((note) => (
                        <div key={note.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              {getNoteTypeIcon(note.type)}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm text-gray-700">{note.content}</p>
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500">{note.author}</span>
                                </div>
                                {getNoteTypeBadge(note.type)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      Standup Guide
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-3 py-2">
                        <h3 className="text-sm font-medium text-gray-900">What did you do yesterday?</h3>
                        <p className="mt-1 text-xs text-gray-500">Share your accomplishments from the previous day.</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-3 py-2">
                        <h3 className="text-sm font-medium text-gray-900">What will you do today?</h3>
                        <p className="mt-1 text-xs text-gray-500">Share your plan for today's work.</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-3 py-2">
                        <h3 className="text-sm font-medium text-gray-900">Any blockers?</h3>
                        <p className="mt-1 text-xs text-gray-500">Share any issues preventing you from making progress.</p>
                      </div>
                      <div className="mt-4 text-xs text-gray-500">
                        <p>Remember to keep your update brief (1-2 minutes) and focused on the sprint goals.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Add Note Modal */}
        {showAddNoteModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Add Standup Note
                      </h3>
                      <div className="mt-4">
                        <textarea
                          rows={4}
                          className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                          placeholder="What would you like to share with the team?"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleAddNote('achievement')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Achievement
                  </button>
                  <button
                    type="button"
                    className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleAddNote('plan')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Plan
                  </button>
                  <button
                    type="button"
                    className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleAddNote('blocker')}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Blocker
                  </button>
                  <button
                    type="button"
                    className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddNoteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  );
};

export default DailyStandup;
