import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BacklogItem } from '../types';
import { GripVertical, AlertCircle, ChevronDown, ChevronUp, Package } from 'lucide-react';

interface BacklogItemCardProps {
  item: BacklogItem;
  isDragging?: boolean;
  epics?: BacklogItem[];
  onUpdateWorkPackageType?: (id: string, type: 'epic' | 'feature') => void;
  onUpdateEpicId?: (id: string, epicId: string | null) => void;
}

const BacklogItemCard: React.FC<BacklogItemCardProps> = ({ 
  item, 
  isDragging = false,
  epics = [],
  onUpdateWorkPackageType,
  onUpdateEpicId
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const [isExpanded, setIsExpanded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Add z-index when dragging to ensure item appears on top of other elements
    zIndex: isDragging ? 9999 : 'auto',
    position: isDragging ? 'relative' : 'static',
  };

  // Priority color mapping
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  // Status color mapping
  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    review: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    blocked: 'bg-red-100 text-red-800',
  };

  // Work package type color mapping
  const workPackageTypeColors = {
    epic: 'bg-indigo-100 text-indigo-800',
    feature: 'bg-teal-100 text-teal-800',
  };

  // Handle work package type change
  const handleWorkPackageTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'epic' | 'feature';
    if (onUpdateWorkPackageType) {
      onUpdateWorkPackageType(item.id, newType);
    }
  };

  // Handle epic selection change
  const handleEpicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const epicId = e.target.value === '' ? null : e.target.value;
    if (onUpdateEpicId) {
      onUpdateEpicId(item.id, epicId);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white border rounded-md shadow-sm p-3 ${
        isDragging ? 'opacity-90 shadow-lg' : ''
      } ${item.workPackageType === 'feature' && item.epicId ? 'ml-4 border-l-4 border-l-indigo-300' : ''}`}
    >
      <div className="flex items-start">
        <div
          {...listeners}
          className="cursor-grab mr-2 mt-1 text-gray-400 hover:text-gray-600"
        >
          <GripVertical size={16} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              {item.workPackageType === 'epic' && (
                <Package size={14} className="mr-1 text-indigo-600" />
              )}
              {item.title}
            </h4>
            <div className="flex items-center space-x-1">
              {item.priority && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    priorityColors[item.priority as keyof typeof priorityColors] || 'bg-gray-100'
                  }`}
                >
                  {item.priority}
                </span>
              )}
              {item.estimate && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {item.estimate} pts
                </span>
              )}
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
          {item.description && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {item.workPackageType && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  workPackageTypeColors[item.workPackageType as keyof typeof workPackageTypeColors] || 'bg-gray-100'
                }`}
              >
                {item.workPackageType === 'epic' ? 'Epic' : 'Feature'}
              </span>
            )}
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {item.status && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  statusColors[item.status as keyof typeof statusColors] || 'bg-gray-100'
                }`}
              >
                {item.status}
              </span>
            )}
          </div>
          
          {/* Expanded details section */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Work Package Type
                  </label>
                  <select
                    value={item.workPackageType || ''}
                    onChange={handleWorkPackageTypeChange}
                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="epic">Epic</option>
                    <option value="feature">Feature</option>
                  </select>
                </div>
                
                {/* Epic selection dropdown (only visible for features) */}
                {item.workPackageType === 'feature' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Parent Epic
                    </label>
                    <select
                      value={item.epicId || ''}
                      onChange={handleEpicChange}
                      className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Epic</option>
                      {epics.map(epic => (
                        <option key={epic.id} value={epic.id}>
                          {epic.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacklogItemCard;
