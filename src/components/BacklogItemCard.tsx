import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BacklogItem } from '../types';
import { GripVertical, Package, Edit, Save, X } from 'lucide-react';

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
    workPackageType: item.workPackageType,
    epicId: item.epicId
  });

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

  // Start editing
  const handleStartEditing = () => {
    setIsEditing(true);
    setIsExpanded(true); // Always expand when editing
    
    // Reset editable item to current values
    setEditableItem({
      title: item.title,
      description: item.description || '',
      priority: item.priority,
      workPackageType: item.workPackageType,
      epicId: item.epicId
    });
  };

  // Cancel editing
  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  // Save changes
  const handleSaveChanges = () => {
    if (onUpdateItem && editableItem.title) {
      // Preserve the existing values for fields we're not showing in the edit form
      const updatedItem = {
        ...editableItem,
        status: item.status,
        tags: item.tags,
        effort: item.effort,
        impact: item.impact,
        assignee: item.assignee,
        dueDate: item.dueDate
      };
      
      onUpdateItem(item.id, updatedItem);
    }
    setIsEditing(false);
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
                <button 
                  onClick={handleStartEditing}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit item"
                >
                  <Edit size={16} />
                </button>
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
          
          {/* Expanded details section - only shown when editing */}
          {isEditing && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="space-y-3">
                {/* Work Package Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Work Package Type
                  </label>
                  <select
                    name="workPackageType"
                    value={editableItem.workPackageType}
                    onChange={handleWorkPackageTypeChange}
                    className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={isDragging}
                  >
                    <option value="epic">Epic</option>
                    <option value="feature">Feature</option>
                  </select>
                </div>
                
                {/* Epic selection dropdown (only visible for features) */}
                {editableItem.workPackageType === 'feature' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Parent Epic
                    </label>
                    <select
                      name="epicId"
                      value={editableItem.epicId || ''}
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

                {/* Priority - Always show in edit mode */}
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacklogItemCard;
