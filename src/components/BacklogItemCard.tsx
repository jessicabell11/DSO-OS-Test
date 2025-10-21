import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BacklogItem } from '../types';
import { GripVertical, Package, ChevronDown, ChevronUp, Edit, Save, X } from 'lucide-react';

interface BacklogItemCardProps {
  item: BacklogItem;
  isDragging?: boolean;
  epics?: BacklogItem[];
  onUpdateWorkPackageType?: (id: string, type: 'epic' | 'feature') => void;
  onUpdateEpicId?: (id: string, epicId: string | null) => void;
  onUpdateItem?: (id: string, updatedItem: Partial<BacklogItem>) => void;
}

const BacklogItemCard: React.FC<BacklogItemCardProps> = ({ 
  item, 
  isDragging = false,
  epics = [],
  onUpdateWorkPackageType,
  onUpdateEpicId,
  onUpdateItem
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State for editable fields
  const [editableItem, setEditableItem] = useState<Partial<BacklogItem>>({
    title: item.title,
    description: item.description || '',
    priority: item.priority,
    status: item.status,
    workPackageType: item.workPackageType,
    epicId: item.epicId,
    effort: item.effort,
    impact: item.impact,
    assignee: item.assignee || '',
    dueDate: item.dueDate || '',
    tags: [...(item.tags || [])]
  });

  // New tag input state
  const [newTag, setNewTag] = useState('');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : 'auto',
    position: isDragging ? 'relative' as const : 'static' as const,
  };

  // Priority color mapping
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  // Work package type color mapping
  const workPackageTypeColors = {
    epic: 'bg-indigo-100 text-indigo-800',
    feature: 'bg-teal-100 text-teal-800',
  };

  // Status color mapping
  const statusColors = {
    'not-started': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'blocked': 'bg-red-100 text-red-800',
    'completed': 'bg-green-100 text-green-800',
    'todo': 'bg-gray-100 text-gray-800',
  };

  // Handle work package type change
  const handleWorkPackageTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'epic' | 'feature';
    
    if (isEditing) {
      setEditableItem(prev => ({
        ...prev,
        workPackageType: newType,
        // Clear epicId if changing to epic
        epicId: newType === 'epic' ? null : prev.epicId
      }));
    } else if (onUpdateWorkPackageType) {
      onUpdateWorkPackageType(item.id, newType);
    }
  };

  // Handle epic selection change
  const handleEpicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const epicId = e.target.value === '' ? null : e.target.value;
    
    if (isEditing) {
      setEditableItem(prev => ({
        ...prev,
        epicId
      }));
    } else if (onUpdateEpicId) {
      onUpdateEpicId(item.id, epicId);
    }
  };

  // Handle input change for editable fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableItem(prev => ({
      ...prev,
      [name]: value || null
    }));
  };

  // Start editing
  const handleStartEditing = () => {
    setIsEditing(true);
    setIsExpanded(true); // Always expand when editing
  };

  // Cancel editing
  const handleCancelEditing = () => {
    setIsEditing(false);
    // Reset editable item to original values
    setEditableItem({
      title: item.title,
      description: item.description || '',
      priority: item.priority,
      status: item.status,
      workPackageType: item.workPackageType,
      epicId: item.epicId,
      effort: item.effort,
      impact: item.impact,
      assignee: item.assignee || '',
      dueDate: item.dueDate || '',
      tags: [...(item.tags || [])]
    });
    setNewTag('');
  };

  // Save changes
  const handleSaveChanges = () => {
    if (onUpdateItem && editableItem.title) {
      onUpdateItem(item.id, editableItem);
    }
    setIsEditing(false);
  };

  // Add a new tag
  const handleAddTag = () => {
    if (newTag.trim() && !editableItem.tags?.includes(newTag.trim())) {
      setEditableItem(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setEditableItem(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // Handle key press for tag input
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white border rounded-md shadow-sm p-3 ${
        isDragging ? 'opacity-90 shadow-lg' : ''
      } ${!isEditing && item.workPackageType === 'feature' && item.epicId ? 'ml-4 border-l-4 border-l-indigo-300' : ''}`}
    >
      <div className="flex items-start">
        {!isEditing && (
          <div
            {...listeners}
            className="cursor-grab mr-2 mt-1 text-gray-400 hover:text-gray-600"
          >
            <GripVertical size={16} />
          </div>
        )}
        <div className="flex-1">
          {/* Header with title and controls */}
          <div className="flex items-center justify-between mb-2">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editableItem.title}
                onChange={handleInputChange}
                className="text-sm font-medium text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                placeholder="Enter title"
              />
            ) : (
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                {item.workPackageType === 'epic' && (
                  <Package size={14} className="mr-1 text-indigo-600" />
                )}
                {item.title}
              </h4>
            )}
            <div className="flex items-center space-x-1">
              {!isEditing && item.priority && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    priorityColors[item.priority as keyof typeof priorityColors] || 'bg-gray-100'
                  }`}
                >
                  {item.priority}
                </span>
              )}
              {isEditing ? (
                <div className="flex space-x-1">
                  <button 
                    onClick={handleSaveChanges}
                    className="text-green-600 hover:text-green-800"
                    title="Save changes"
                  >
                    <Save size={16} />
                  </button>
                  <button 
                    onClick={handleCancelEditing}
                    className="text-red-600 hover:text-red-800"
                    title="Cancel editing"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleStartEditing}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit item"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {isEditing ? (
            <textarea
              name="description"
              value={editableItem.description}
              onChange={handleInputChange}
              rows={2}
              className="text-xs text-gray-600 mb-2 w-full border rounded-md p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Enter description"
            />
          ) : (
            item.description && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
            )
          )}

          {/* Tags in edit mode */}
          {isEditing && (
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-1 mb-2">
                {editableItem.tags?.map((tag, index) => (
                  <div key={index} className="flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="text-xs border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 flex-1"
                  placeholder="Add a tag"
                />
                <button
                  onClick={handleAddTag}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded-r-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Work package type label */}
          {!isEditing && (
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
            </div>
          )}
          
          {/* Expanded details section */}
          {(isExpanded || isEditing) && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="space-y-3">
                {/* Work Package Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Work Package Type
                  </label>
                  <select
                    name="workPackageType"
                    value={isEditing ? editableItem.workPackageType : item.workPackageType || ''}
                    onChange={handleWorkPackageTypeChange}
                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={isDragging}
                  >
                    <option value="epic">Epic</option>
                    <option value="feature">Feature</option>
                  </select>
                </div>
                
                {/* Epic selection dropdown (only visible for features) */}
                {(isEditing ? editableItem.workPackageType : item.workPackageType) === 'feature' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Parent Epic
                    </label>
                    <select
                      name="epicId"
                      value={isEditing ? editableItem.epicId || '' : item.epicId || ''}
                      onChange={handleEpicChange}
                      className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      disabled={isDragging}
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

                {/* Additional editable fields */}
                {isEditing && (
                  <>
                    {/* Priority */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={editableItem.priority || ''}
                        onChange={handleInputChange}
                        className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={editableItem.status || ''}
                        onChange={handleInputChange}
                        className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="blocked">Blocked</option>
                        <option value="completed">Completed</option>
                        <option value="todo">Todo</option>
                      </select>
                    </div>

                    {/* Effort */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Effort
                      </label>
                      <select
                        name="effort"
                        value={editableItem.effort || ''}
                        onChange={handleInputChange}
                        className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    {/* Impact */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Impact
                      </label>
                      <select
                        name="impact"
                        value={editableItem.impact || ''}
                        onChange={handleInputChange}
                        className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Assignee */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Assignee
                      </label>
                      <input
                        type="text"
                        name="assignee"
                        value={editableItem.assignee || ''}
                        onChange={handleInputChange}
                        className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter assignee"
                      />
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={editableItem.dueDate || ''}
                        onChange={handleDateChange}
                        className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
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
