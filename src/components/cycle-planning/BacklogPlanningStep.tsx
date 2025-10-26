import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ListTodo, Lightbulb, RefreshCw, Plus, X } from 'lucide-react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BacklogItem, Outcome } from '../../types';
import BacklogContainer from '../BacklogContainer';
import BacklogItemCard from '../BacklogItemCard';

interface BacklogPlanningStepProps {
  shortTermOutcomes: Outcome[];
  designAgentUrl: string;
  onBack: () => void;
  onNext: () => void;
  upcomingQuarter?: string; // Make this prop optional with a default value
}

const BacklogPlanningStep: React.FC<BacklogPlanningStepProps> = ({
  shortTermOutcomes,
  designAgentUrl,
  onBack,
  onNext,
  upcomingQuarter = "Q4 2025" // Default value if not provided
}) => {
  // State for backlog items
  const [productBacklogItems, setProductBacklogItems] = useState<BacklogItem[]>([]);
  const [upcomingCycleItems, setUpcomingCycleItems] = useState<BacklogItem[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<BacklogItem[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isRegeneratingRecommendations, setIsRegeneratingRecommendations] = useState(false);
  
  // State for adding new items
  const [showAddItemForm, setShowAddItemForm] = useState<string | null>(null); // 'product-backlog' or 'upcoming-cycle'
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newItemWorkPackageType, setNewItemWorkPackageType] = useState<'epic' | 'feature'>('feature');
  const [newItemEpicId, setNewItemEpicId] = useState<string | null>(null);
  
  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Generate initial backlog items
  useEffect(() => {
    // Simulate loading existing product backlog items
    const initialProductBacklog: BacklogItem[] = [
      {
        id: 'pb-1',
        title: 'Implement user authentication flow',
        description: 'Create login, registration, and password reset functionality',
        priority: 'high',
        status: 'todo',
        tags: ['auth', 'security'],
        assignee: null,
        estimate: 8,
        workPackageType: 'epic',
        epicId: null,
        effort: 'large',
        impact: 'high',
        dueDate: '2025-08-15'
      },
      {
        id: 'pb-2',
        title: 'Design system component library',
        description: 'Create reusable UI components following our brand guidelines',
        priority: 'medium',
        status: 'todo',
        tags: ['ui', 'design'],
        assignee: null,
        estimate: 13,
        workPackageType: 'feature',
        epicId: 'pb-1',
        effort: 'medium',
        impact: 'medium',
        dueDate: '2025-07-30'
      },
      {
        id: 'pb-3',
        title: 'API integration for product catalog',
        description: 'Connect to backend services to fetch and display product data',
        priority: 'medium',
        status: 'todo',
        tags: ['api', 'backend'],
        assignee: null,
        estimate: 5,
        workPackageType: 'epic',
        epicId: null,
        effort: 'medium',
        impact: 'high',
        dueDate: '2025-09-10'
      },
      {
        id: 'pb-4',
        title: 'Implement search functionality',
        description: 'Add search bar and results page with filtering options',
        priority: 'low',
        status: 'todo',
        tags: ['search', 'ui'],
        assignee: null,
        estimate: 8,
        workPackageType: 'feature',
        epicId: 'pb-3',
        effort: 'small',
        impact: 'medium',
        dueDate: '2025-08-05'
      },
      {
        id: 'pb-5',
        title: 'User profile management',
        description: 'Allow users to view and edit their profile information',
        priority: 'low',
        status: 'todo',
        tags: ['user', 'profile'],
        assignee: null,
        estimate: 5,
        workPackageType: 'feature',
        epicId: 'pb-1',
        effort: 'small',
        impact: 'low',
        dueDate: '2025-07-25'
      }
    ];
    
    setProductBacklogItems(initialProductBacklog);
    
    // Simulate loading AI recommendations based on outcomes
    setIsLoadingRecommendations(true);
    setTimeout(() => {
      generateAIRecommendations();
    }, 1500);
  }, []);
  
  // Generate AI recommendations based on outcomes
  const generateAIRecommendations = () => {
    setIsLoadingRecommendations(true);
    setIsRegeneratingRecommendations(true);
    
    // Clear existing recommendations if regenerating
    if (isRegeneratingRecommendations) {
      setAiRecommendations([]);
    }
    
    // Simulate AI generating recommendations with a delay
    setTimeout(() => {
      // Generate different recommendations based on whether this is initial load or regeneration
      const recommendations: BacklogItem[] = isRegeneratingRecommendations ? 
        [
          {
            id: `ai-${Date.now()}-1`,
            title: 'Create unified feedback collection system',
            description: 'Implement a centralized system for collecting user feedback across all product touchpoints',
            priority: 'high',
            status: 'todo',
            tags: ['feedback', 'user-research'],
            assignee: null,
            estimate: 13,
            workPackageType: 'epic',
            epicId: null,
            effort: 'large',
            impact: 'high',
            dueDate: '2025-09-15'
          },
          {
            id: `ai-${Date.now()}-2`,
            title: 'Implement trunk-based development workflow',
            description: 'Set up CI/CD pipeline and documentation for trunk-based development practices',
            priority: 'medium',
            status: 'todo',
            tags: ['devops', 'workflow'],
            assignee: null,
            estimate: 8,
            workPackageType: 'feature',
            epicId: null,
            effort: 'medium',
            impact: 'medium',
            dueDate: '2025-08-20'
          },
          {
            id: `ai-${Date.now()}-3`,
            title: 'Establish regular user testing cadence',
            description: 'Create templates and processes for regular user testing sessions',
            priority: 'medium',
            status: 'todo',
            tags: ['user-testing', 'research'],
            assignee: null,
            estimate: 5,
            workPackageType: 'feature',
            epicId: null,
            effort: 'small',
            impact: 'high',
            dueDate: '2025-07-30'
          }
        ] : 
        [
          {
            id: `ai-${Date.now()}-1`,
            title: 'Create engineering metrics dashboard',
            description: 'Develop a dashboard showing key engineering metrics to support data-driven decisions',
            priority: 'high',
            status: 'todo',
            tags: ['metrics', 'dashboard'],
            assignee: null,
            estimate: 8,
            workPackageType: 'epic',
            epicId: null,
            effort: 'large',
            impact: 'high',
            dueDate: '2025-09-01'
          },
          {
            id: `ai-${Date.now()}-2`,
            title: 'Integrate user research into planning process',
            description: 'Create templates and workflows to incorporate user research findings into product planning',
            priority: 'medium',
            status: 'todo',
            tags: ['user-research', 'planning'],
            assignee: null,
            estimate: 5,
            workPackageType: 'feature',
            epicId: null,
            effort: 'medium',
            impact: 'medium',
            dueDate: '2025-08-10'
          },
          {
            id: `ai-${Date.now()}-3`,
            title: 'Implement automated quality gates',
            description: 'Set up automated quality checks in the CI/CD pipeline to catch issues before production',
            priority: 'high',
            status: 'todo',
            tags: ['quality', 'automation'],
            assignee: null,
            estimate: 13,
            workPackageType: 'feature',
            epicId: null,
            effort: 'medium',
            impact: 'high',
            dueDate: '2025-08-25'
          }
        ];
      
      setAiRecommendations(recommendations);
      setIsLoadingRecommendations(false);
      setIsRegeneratingRecommendations(false);
    }, 1500);
  };
  
  // Handle regenerating AI recommendations
  const handleRegenerateRecommendations = () => {
    setIsRegeneratingRecommendations(true);
    generateAIRecommendations();
  };
  
  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Add a class to the body to ensure proper z-index stacking context
    document.body.classList.add('dragging-active');
    
    // Create a portal container for the dragging overlay if it doesn't exist
    if (!document.getElementById('drag-overlay-container')) {
      const portalContainer = document.createElement('div');
      portalContainer.id = 'drag-overlay-container';
      portalContainer.style.position = 'fixed';
      portalContainer.style.top = '0';
      portalContainer.style.left = '0';
      portalContainer.style.width = '100%';
      portalContainer.style.height = '100%';
      portalContainer.style.pointerEvents = 'none';
      portalContainer.style.zIndex = '9999';
      document.body.appendChild(portalContainer);
    }
  };
  
  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // If dragging over a container, no need to do anything yet
    if (overId === 'product-backlog' || overId === 'upcoming-cycle' || overId === 'ai-recommendations') {
      return;
    }
    
    // Find the item being dragged
    const activeItem = [...productBacklogItems, ...upcomingCycleItems, ...aiRecommendations].find(
      item => item.id === activeId
    );
    
    if (!activeItem) return;
    
    // Find which container the active item is from
    const activeContainer = getContainerForItem(activeId);
    // Find which container the over item is in
    const overContainer = getContainerForItem(overId);
    
    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }
    
    // Move item between containers
    if (activeContainer === 'product-backlog' && overContainer === 'upcoming-cycle') {
      setProductBacklogItems(items => items.filter(item => item.id !== activeId));
      setUpcomingCycleItems(items => [...items, activeItem]);
    } else if (activeContainer === 'upcoming-cycle' && overContainer === 'product-backlog') {
      setUpcomingCycleItems(items => items.filter(item => item.id !== activeId));
      setProductBacklogItems(items => [...items, activeItem]);
    } else if (activeContainer === 'ai-recommendations' && overContainer === 'upcoming-cycle') {
      setAiRecommendations(items => items.filter(item => item.id !== activeId));
      setUpcomingCycleItems(items => [...items, activeItem]);
    } else if (activeContainer === 'ai-recommendations' && overContainer === 'product-backlog') {
      setAiRecommendations(items => items.filter(item => item.id !== activeId));
      setProductBacklogItems(items => [...items, activeItem]);
    }
  };
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Remove the dragging class
    document.body.classList.remove('dragging-active');
    
    // Remove the portal container if it exists
    const portalContainer = document.getElementById('drag-overlay-container');
    if (portalContainer) {
      document.body.removeChild(portalContainer);
    }
    
    if (!over) {
      setActiveId(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // If dropping on a container directly, move the item to that container
    if (overId === 'product-backlog' || overId === 'upcoming-cycle' || overId === 'ai-recommendations') {
      const activeItem = [...productBacklogItems, ...upcomingCycleItems, ...aiRecommendations].find(
        item => item.id === activeId
      );
      
      if (!activeItem) {
        setActiveId(null);
        return;
      }
      
      const activeContainer = getContainerForItem(activeId);
      
      if (activeContainer === overId) {
        // Item is already in this container
        setActiveId(null);
        return;
      }
      
      // Move item to the target container
      if (overId === 'product-backlog') {
        if (activeContainer === 'upcoming-cycle') {
          setUpcomingCycleItems(items => items.filter(item => item.id !== activeId));
        } else if (activeContainer === 'ai-recommendations') {
          setAiRecommendations(items => items.filter(item => item.id !== activeId));
        }
        setProductBacklogItems(items => [...items, activeItem]);
      } else if (overId === 'upcoming-cycle') {
        if (activeContainer === 'product-backlog') {
          setProductBacklogItems(items => items.filter(item => item.id !== activeId));
        } else if (activeContainer === 'ai-recommendations') {
          setAiRecommendations(items => items.filter(item => item.id !== activeId));
        }
        setUpcomingCycleItems(items => [...items, activeItem]);
      }
      
      setActiveId(null);
      return;
    }
    
    // If dropping on another item, handle reordering within the same container
    const activeContainer = getContainerForItem(activeId);
    const overContainer = getContainerForItem(overId);
    
    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      setActiveId(null);
      return;
    }
    
    // Reorder within the same container
    if (activeContainer === 'product-backlog') {
      const oldIndex = productBacklogItems.findIndex(item => item.id === activeId);
      const newIndex = productBacklogItems.findIndex(item => item.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setProductBacklogItems(items => arrayMove(items, oldIndex, newIndex));
      }
    } else if (activeContainer === 'upcoming-cycle') {
      const oldIndex = upcomingCycleItems.findIndex(item => item.id === activeId);
      const newIndex = upcomingCycleItems.findIndex(item => item.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setUpcomingCycleItems(items => arrayMove(items, oldIndex, newIndex));
      }
    }
    
    setActiveId(null);
  };
  
  // Helper function to determine which container an item belongs to
  const getContainerForItem = (itemId: string): string | null => {
    if (productBacklogItems.some(item => item.id === itemId)) {
      return 'product-backlog';
    }
    if (upcomingCycleItems.some(item => item.id === itemId)) {
      return 'upcoming-cycle';
    }
    if (aiRecommendations.some(item => item.id === itemId)) {
      return 'ai-recommendations';
    }
    return null;
  };
  
  // Get all epics from all containers
  const getAllEpics = (): BacklogItem[] => {
    return [
      ...productBacklogItems.filter(item => item.workPackageType === 'epic'),
      ...upcomingCycleItems.filter(item => item.workPackageType === 'epic'),
      ...aiRecommendations.filter(item => item.workPackageType === 'epic')
    ];
  };
  
  // Handle work package type update
  const handleUpdateWorkPackageType = (id: string, type: 'epic' | 'feature') => {
    // Update in product backlog
    if (productBacklogItems.some(item => item.id === id)) {
      setProductBacklogItems(items => 
        items.map(item => 
          item.id === id 
            ? { 
                ...item, 
                workPackageType: type,
                // Clear epicId if changing to epic
                epicId: type === 'epic' ? null : item.epicId
              } 
            : item
        )
      );
    }
    
    // Update in upcoming cycle
    if (upcomingCycleItems.some(item => item.id === id)) {
      setUpcomingCycleItems(items => 
        items.map(item => 
          item.id === id 
            ? { 
                ...item, 
                workPackageType: type,
                // Clear epicId if changing to epic
                epicId: type === 'epic' ? null : item.epicId
              } 
            : item
        )
      );
    }
    
    // Update in AI recommendations
    if (aiRecommendations.some(item => item.id === id)) {
      setAiRecommendations(items => 
        items.map(item => 
          item.id === id 
            ? { 
                ...item, 
                workPackageType: type,
                // Clear epicId if changing to epic
                epicId: type === 'epic' ? null : item.epicId
              } 
            : item
        )
      );
    }
  };
  
  // Handle epic ID update
  const handleUpdateEpicId = (id: string, epicId: string | null) => {
    // Update in product backlog
    if (productBacklogItems.some(item => item.id === id)) {
      setProductBacklogItems(items => 
        items.map(item => 
          item.id === id ? { ...item, epicId } : item
        )
      );
    }
    
    // Update in upcoming cycle
    if (upcomingCycleItems.some(item => item.id === id)) {
      setUpcomingCycleItems(items => 
        items.map(item => 
          item.id === id ? { ...item, epicId } : item
        )
      );
    }
    
    // Update in AI recommendations
    if (aiRecommendations.some(item => item.id === id)) {
      setAiRecommendations(items => 
        items.map(item => 
          item.id === id ? { ...item, epicId } : item
        )
      );
    }
  };

  // Handle updating any backlog item attribute
  const handleUpdateBacklogItem = (id: string, updatedItem: Partial<BacklogItem>) => {
    // Update in product backlog
    if (productBacklogItems.some(item => item.id === id)) {
      setProductBacklogItems(items => 
        items.map(item => 
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
    }
    
    // Update in upcoming cycle
    if (upcomingCycleItems.some(item => item.id === id)) {
      setUpcomingCycleItems(items => 
        items.map(item => 
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
    }
    
    // Update in AI recommendations
    if (aiRecommendations.some(item => item.id === id)) {
      setAiRecommendations(items => 
        items.map(item => 
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
    }
  };
  
  // Handle showing the add item form
  const handleShowAddItemForm = (containerId: string) => {
    setShowAddItemForm(containerId);
    // Reset form fields
    setNewItemTitle('');
    setNewItemDescription('');
    setNewItemPriority('medium');
    setNewItemWorkPackageType('feature');
    setNewItemEpicId(null);
  };
  
  // Handle canceling the add item form
  const handleCancelAddItem = () => {
    setShowAddItemForm(null);
  };
  
  // Handle adding a new item
  const handleAddItem = () => {
    if (!newItemTitle.trim()) {
      return; // Don't add empty items
    }
    
    const newItem: BacklogItem = {
      id: `manual-${Date.now()}`,
      title: newItemTitle,
      description: newItemDescription,
      priority: newItemPriority,
      status: 'todo',
      tags: [],
      assignee: null,
      estimate: 0, // Set a default value but we won't display it
      workPackageType: newItemWorkPackageType,
      epicId: newItemWorkPackageType === 'feature' ? newItemEpicId : null,
      effort: 'medium',
      impact: 'medium'
    };
    
    if (showAddItemForm === 'product-backlog') {
      setProductBacklogItems(items => [...items, newItem]);
    } else if (showAddItemForm === 'upcoming-cycle') {
      setUpcomingCycleItems(items => [...items, newItem]);
    }
    
    // Reset form
    setShowAddItemForm(null);
  };

  // Get all epics for dropdown selection
  const allEpics = getAllEpics();

  // Check if design agent URL is provided and valid
  const hasValidDesignUrl = designAgentUrl && designAgentUrl.trim() !== '';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <ListTodo className="h-5 w-5 mr-2 text-blue-500" />
            Step 3: Plan Your Backlog
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Organize your backlog items for the upcoming 90-day cycle
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-2">Design Concept</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                Your design concept from the Innovation Sprint:
              </p>
              <div className="flex items-center">
                {hasValidDesignUrl ? (
                  <a 
                    href={designAgentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {designAgentUrl}
                  </a>
                ) : (
                  <span className="text-amber-600 text-sm">
                    No design concept URL provided
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-2">Backlog Planning</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag items between backlogs to plan your upcoming cycle. You can also reorder items within each backlog.
            </p>
            
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Upcoming Quarter Backlog - On the left */}
                <div className="lg:col-span-5">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-blue-100 border-b border-blue-200 flex justify-between items-center">
                      <h4 className="text-sm font-medium text-blue-800">{upcomingQuarter} Backlog</h4>
                      <button
                        onClick={() => handleShowAddItemForm('upcoming-cycle')}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </button>
                    </div>
                    
                    {/* Add Item Form for Upcoming Cycle */}
                    {showAddItemForm === 'upcoming-cycle' && (
                      <div className="p-4 bg-blue-50 border-b border-blue-200">
                        <div className="bg-white p-4 rounded-md shadow-sm">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="text-sm font-medium text-gray-900">Add New Work Package</h5>
                            <button 
                              onClick={handleCancelAddItem}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="upcoming-title" className="block text-xs font-medium text-gray-700 mb-1">
                                Title *
                              </label>
                              <input
                                type="text"
                                id="upcoming-title"
                                value={newItemTitle}
                                onChange={(e) => setNewItemTitle(e.target.value)}
                                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter title"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="upcoming-description" className="block text-xs font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                id="upcoming-description"
                                value={newItemDescription}
                                onChange={(e) => setNewItemDescription(e.target.value)}
                                rows={2}
                                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter description"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label htmlFor="upcoming-priority" className="block text-xs font-medium text-gray-700 mb-1">
                                  Priority
                                </label>
                                <select
                                  id="upcoming-priority"
                                  value={newItemPriority}
                                  onChange={(e) => setNewItemPriority(e.target.value as 'low' | 'medium' | 'high')}
                                  className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>
                              </div>
                              
                              <div>
                                <label htmlFor="upcoming-type" className="block text-xs font-medium text-gray-700 mb-1">
                                  Work Package Type
                                </label>
                                <select
                                  id="upcoming-type"
                                  value={newItemWorkPackageType}
                                  onChange={(e) => setNewItemWorkPackageType(e.target.value as 'epic' | 'feature')}
                                  className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="epic">Epic</option>
                                  <option value="feature">Feature</option>
                                </select>
                              </div>
                            </div>
                            
                            {newItemWorkPackageType === 'feature' && (
                              <div>
                                <label htmlFor="upcoming-epic" className="block text-xs font-medium text-gray-700 mb-1">
                                  Parent Epic
                                </label>
                                <select
                                  id="upcoming-epic"
                                  value={newItemEpicId || ''}
                                  onChange={(e) => setNewItemEpicId(e.target.value || null)}
                                  className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">None</option>
                                  {allEpics.map(epic => (
                                    <option key={epic.id} value={epic.id}>
                                      {epic.title}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                            
                            <div className="flex justify-end pt-2">
                              <button
                                onClick={handleCancelAddItem}
                                className="mr-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAddItem}
                                disabled={!newItemTitle.trim()}
                                className={`px-3 py-1.5 text-xs font-medium text-white rounded-md shadow-sm ${
                                  newItemTitle.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                                }`}
                              >
                                Add Item
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <SortableContext
                      items={upcomingCycleItems.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <BacklogContainer
                        id="upcoming-cycle"
                        items={upcomingCycleItems}
                        className="bg-blue-50 min-h-[300px]"
                      >
                        {upcomingCycleItems.map(item => (
                          <BacklogItemCard
                            key={item.id}
                            item={item}
                            isDragging={activeId === item.id}
                            epics={allEpics}
                            onUpdateWorkPackageType={handleUpdateWorkPackageType}
                            onUpdateEpicId={handleUpdateEpicId}
                            onUpdateItem={handleUpdateBacklogItem}
                          />
                        ))}
                      </BacklogContainer>
                    </SortableContext>
                  </div>
                </div>
                
                <div className="lg:col-span-7">
                  {/* AI Recommendations - Now above Product Backlog */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-purple-100 border-b border-purple-200 flex justify-between items-center">
                      <h4 className="text-sm font-medium text-purple-800">AI Recommendations</h4>
                      <button
                        onClick={handleRegenerateRecommendations}
                        disabled={isLoadingRecommendations}
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                          isLoadingRecommendations 
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                            : 'text-purple-700 bg-purple-100 hover:bg-purple-200'
                        }`}
                      >
                        <RefreshCw className={`h-3 w-3 mr-1 ${isLoadingRecommendations ? 'animate-spin' : ''}`} />
                        {isLoadingRecommendations ? 'Loading...' : 'Regenerate'}
                      </button>
                    </div>
                    {isLoadingRecommendations ? (
                      <div className="flex items-center justify-center p-8 bg-purple-50 min-h-[200px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        <span className="ml-2 text-sm text-purple-600">Generating recommendations...</span>
                      </div>
                    ) : (
                      <SortableContext
                        items={aiRecommendations.map(item => item.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <BacklogContainer
                          id="ai-recommendations"
                          items={aiRecommendations}
                          className="bg-purple-50 min-h-[200px]"
                        >
                          {aiRecommendations.map(item => (
                            <BacklogItemCard
                              key={item.id}
                              item={item}
                              isDragging={activeId === item.id}
                              epics={allEpics}
                              onUpdateWorkPackageType={handleUpdateWorkPackageType}
                              onUpdateEpicId={handleUpdateEpicId}
                              onUpdateItem={handleUpdateBacklogItem}
                            />
                          ))}
                        </BacklogContainer>
                      </SortableContext>
                    )}
                    <div className="px-4 py-3 bg-purple-50 border-t border-purple-200">
                      <p className="text-xs text-purple-700">
                        <Lightbulb className="h-3 w-3 inline mr-1" />
                        Drag recommendations to your backlog
                      </p>
                    </div>
                  </div>
                  
                  {/* Product Backlog - Now below AI Recommendations */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-800">Product Backlog</h4>
                      <button
                        onClick={() => handleShowAddItemForm('product-backlog')}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </button>
                    </div>
                    
                    {/* Add Item Form for Product Backlog */}
                    {showAddItemForm === 'product-backlog' && (
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="bg-white p-4 rounded-md shadow-sm">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="text-sm font-medium text-gray-900">Add New Work Package</h5>
                            <button 
                              onClick={handleCancelAddItem}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="product-title" className="block text-xs font-medium text-gray-700 mb-1">
                                Title *
                              </label>
                              <input
                                type="text"
                                id="product-title"
                                value={newItemTitle}
                                onChange={(e) => setNewItemTitle(e.target.value)}
                                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter title"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="product-description" className="block text-xs font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                id="product-description"
                                value={newItemDescription}
                                onChange={(e) => setNewItemDescription(e.target.value)}
                                rows={2}
                                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter description"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label htmlFor="product-priority" className="block text-xs font-medium text-gray-700 mb-1">
                                  Priority
                                </label>
                                <select
                                  id="product-priority"
                                  value={newItemPriority}
                                  onChange={(e) => setNewItemPriority(e.target.value as 'low' | 'medium' | 'high')}
                                  className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>
                              </div>
                              
                              <div>
                                <label htmlFor="product-type" className="block text-xs font-medium text-gray-700 mb-1">
                                  Work Package Type
                                </label>
                                <select
                                  id="product-type"
                                  value={newItemWorkPackageType}
                                  onChange={(e) => setNewItemWorkPackageType(e.target.value as 'epic' | 'feature')}
                                  className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="epic">Epic</option>
                                  <option value="feature">Feature</option>
                                </select>
                              </div>
                            </div>
                            
                            {newItemWorkPackageType === 'feature' && (
                              <div>
                                <label htmlFor="product-epic" className="block text-xs font-medium text-gray-700 mb-1">
                                  Parent Epic
                                </label>
                                <select
                                  id="product-epic"
                                  value={newItemEpicId || ''}
                                  onChange={(e) => setNewItemEpicId(e.target.value || null)}
                                  className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">None</option>
                                  {allEpics.map(epic => (
                                    <option key={epic.id} value={epic.id}>
                                      {epic.title}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                            
                            <div className="flex justify-end pt-2">
                              <button
                                onClick={handleCancelAddItem}
                                className="mr-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAddItem}
                                disabled={!newItemTitle.trim()}
                                className={`px-3 py-1.5 text-xs font-medium text-white rounded-md shadow-sm ${
                                  newItemTitle.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                                }`}
                              >
                                Add Item
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <SortableContext
                      items={productBacklogItems.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <BacklogContainer
                        id="product-backlog"
                        items={productBacklogItems}
                        className="bg-gray-50 min-h-[200px]"
                      >
                        {productBacklogItems.map(item => (
                          <BacklogItemCard
                            key={item.id}
                            item={item}
                            isDragging={activeId === item.id}
                            epics={allEpics}
                            onUpdateWorkPackageType={handleUpdateWorkPackageType}
                            onUpdateEpicId={handleUpdateEpicId}
                            onUpdateItem={handleUpdateBacklogItem}
                          />
                        ))}
                      </BacklogContainer>
                    </SortableContext>
                  </div>
                </div>
              </div>
            </DndContext>
          </div>
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Innovation Sprint
            </button>
            <div className="flex items-center">
              {upcomingCycleItems.length === 0 && (
                <div className="mr-3 text-sm text-amber-600 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  <span>No items in quarterly backlog</span>
                </div>
              )}
              <button
                onClick={onNext}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Continue to Team Connections
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklogPlanningStep;
