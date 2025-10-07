import React, { useState, useEffect } from 'react';
import { Tag, Clock, ArrowUp, ArrowRight, ArrowDown, AlertCircle, CheckCircle, PauseCircle, PlayCircle } from 'lucide-react';
import { BacklogItem } from '../types';

interface BacklogSectionProps {
  backlog: BacklogItem[];
  setBacklog: React.Dispatch<React.SetStateAction<BacklogItem[]>>;
}

const BacklogSection: React.FC<BacklogSectionProps> = ({ backlog, setBacklog }) => {
  const [filter, setFilter] = useState<'all' | 'not-started' | 'in-progress' | 'blocked' | 'completed'>('all');
  const [sort, setSort] = useState<'priority' | 'effort' | 'impact' | 'dueDate'>('priority');
  
  // Add an effect to log when this component is mounted
  useEffect(() => {
    console.log("BacklogSection mounted");
  }, []);
  
  const filteredBacklog = backlog.filter(item => 
    filter === 'all' || item.status === filter
  );
  
  const sortedBacklog = [...filteredBacklog].sort((a, b) => {
    if (sort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sort === 'effort') {
      const effortOrder = { small: 0, medium: 1, large: 2 };
      return effortOrder[a.effort] - effortOrder[b.effort];
    } else if (sort === 'impact') {
      const impactOrder = { high: 0, medium: 1, low: 2 };
      return impactOrder[a.impact] - impactOrder[b.impact];
    } else if (sort === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ArrowUp size={16} className="text-red-500" />;
      case 'medium':
        return <ArrowRight size={16} className="text-yellow-500" />;
      case 'low':
        return <ArrowDown size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started':
        return <Clock size={16} className="text-gray-500" />;
      case 'in-progress':
        return <PlayCircle size={16} className="text-blue-500" />;
      case 'blocked':
        return <PauseCircle size={16} className="text-red-500" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'Not Started';
      case 'in-progress':
        return 'In Progress';
      case 'blocked':
        return 'Blocked';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const updateItemStatus = (id: string, newStatus: 'not-started' | 'in-progress' | 'blocked' | 'completed') => {
    setBacklog(prevBacklog => 
      prevBacklog.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  return (
    <section id="backlog-section" className="bg-white rounded-lg shadow mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Output Backlog</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upcoming work and tasks for our team
        </p>
      </div>
      
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('not-started')}
              className={`px-3 py-1 text-xs font-medium rounded-md flex items-center ${
                filter === 'not-started'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock size={14} className="mr-1" />
              Not Started
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-3 py-1 text-xs font-medium rounded-md flex items-center ${
                filter === 'in-progress'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <PlayCircle size={14} className="mr-1" />
              In Progress
            </button>
            <button
              onClick={() => setFilter('blocked')}
              className={`px-3 py-1 text-xs font-medium rounded-md flex items-center ${
                filter === 'blocked'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <AlertCircle size={14} className="mr-1" />
              Blocked
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 text-xs font-medium rounded-md flex items-center ${
                filter === 'completed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CheckCircle size={14} className="mr-1" />
              Completed
            </button>
          </div>
          
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="priority">Priority</option>
              <option value="effort">Effort</option>
              <option value="impact">Impact</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {sortedBacklog.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="mr-3">
                    {getPriorityIcon(item.priority)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1">{getStatusText(item.status)}</span>
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500">PRIORITY</h4>
                  <p className="text-sm font-medium text-gray-900 capitalize">{item.priority}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500">EFFORT</h4>
                  <p className="text-sm font-medium text-gray-900 capitalize">{item.effort}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500">IMPACT</h4>
                  <p className="text-sm font-medium text-gray-900 capitalize">{item.impact}</p>
                </div>
                {item.assignee && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500">ASSIGNEE</h4>
                    <p className="text-sm font-medium text-gray-900">{item.assignee}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-medium text-gray-500">DUE DATE</h4>
                  <p className="text-sm font-medium text-gray-900">{formatDate(item.dueDate)}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, tIndex) => (
                    <span 
                      key={tIndex} 
                      className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateItemStatus(item.id, 'not-started')}
                    disabled={item.status === 'not-started'}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      item.status === 'not-started'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Not Started
                  </button>
                  <button
                    onClick={() => updateItemStatus(item.id, 'in-progress')}
                    disabled={item.status === 'in-progress'}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      item.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateItemStatus(item.id, 'blocked')}
                    disabled={item.status === 'blocked'}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      item.status === 'blocked'
                        ? 'bg-red-100 text-red-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    Blocked
                  </button>
                  <button
                    onClick={() => updateItemStatus(item.id, 'completed')}
                    disabled={item.status === 'completed'}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      item.status === 'completed'
                        ? 'bg-green-100 text-green-400 cursor-not-allowed'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BacklogSection;
