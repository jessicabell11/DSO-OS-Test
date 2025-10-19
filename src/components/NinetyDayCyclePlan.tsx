import React, { useState } from 'react';
import { ArrowLeft, Calendar, Target, Users, MessageSquare, ListTodo, Clock, CheckCircle, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { OutcomeData, UserResearchInsight, Recommendation, BacklogItem } from '../types';
import AIAssistant from './AIAssistant';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import BacklogItemCard from './BacklogItemCard';
import BacklogContainer from './BacklogContainer';
import Sidebar from './Sidebar';
import DefineOutcomesStep from './cycle-planning/DefineOutcomesStep';
import InnovationSprintStep from './cycle-planning/InnovationSprintStep';
import BacklogPlanningStep from './cycle-planning/BacklogPlanningStep';
import TeamConnectionsStep from './cycle-planning/TeamConnectionsStep';
import PlanSummaryStep from './cycle-planning/PlanSummaryStep';

interface NinetyDayCyclePlanProps {
  outcomes: OutcomeData;
  userResearch: UserResearchInsight[];
  recommendations: Recommendation[];
  backlog: BacklogItem[];
}

const NinetyDayCyclePlan: React.FC<NinetyDayCyclePlanProps> = ({
  outcomes,
  userResearch,
  recommendations,
  backlog
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('90-day-cycle');
  const [currentStep, setCurrentStep] = useState(1);
  const [items, setItems] = useState<BacklogItem[]>(backlog);
  const [activeItem, setActiveItem] = useState<BacklogItem | null>(null);
  
  // Planning state
  const [shortTermOutcomes, setShortTermOutcomes] = useState(outcomes.shortTerm);
  const [innovationSprintUrl, setInnovationSprintUrl] = useState('');
  const [designAgentUrl, setDesignAgentUrl] = useState('');
  const [recommendedEpics, setRecommendedEpics] = useState<BacklogItem[]>([]);
  const [upcomingCycleItems, setUpcomingCycleItems] = useState<BacklogItem[]>(
    items.filter(item => item.tags.includes('Upcoming Cycle'))
  );
  // New state for selected teams
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  // State for confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  // State for quarter selector dropdown
  const [showQuarterSelector, setShowQuarterSelector] = useState(false);
  // State for selected quarter and year
  const [selectedQuarter, setSelectedQuarter] = useState("Q4");
  const [selectedYear, setSelectedYear] = useState("2025");
  
  // Filter backlog items for different panels
  const previousCycleItems = items.filter(item => 
    item.tags.includes('Previous Cycle') && 
    item.status !== 'completed'
  );
  
  const unassignedBacklogItems = items.filter(item => 
    !item.tags.includes('Previous Cycle') && 
    !item.tags.includes('Upcoming Cycle')
  );

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get the upcoming quarter and year for display
  const upcomingQuarter = `${selectedQuarter} ${selectedYear}`;

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
          tag !== 'Previous Cycle' && tag !== 'Upcoming Cycle'
        )];
        
        if (containerId === 'q3-backlog') {
          newTags.push('Previous Cycle');
        } else if (containerId === 'q4-backlog') {
          newTags.push('Upcoming Cycle');
        }
        // If dropped in product-backlog, we've already filtered out the cycle tags
        
        return { ...item, tags: newTags };
      }
      return item;
    });
    
    setItems(updatedItems);
    setActiveItem(null);
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle finalize plan
  const handleFinalizePlan = () => {
    setShowConfirmation(true);
  };

  // Handle confirmation
  const handleConfirmFinalize = () => {
    setShowConfirmation(false);
    // Navigate to Sprint Plan screen
    navigate('/sprint-plan');
  };

  // Handle cancel confirmation
  const handleCancelFinalize = () => {
    setShowConfirmation(false);
  };

  // Handle quarter selection
  const handleQuarterSelection = (quarter: string) => {
    setSelectedQuarter(quarter);
    setShowQuarterSelector(false);
  };

  // Handle year selection
  const handleYearSelection = (year: string) => {
    setSelectedYear(year);
    setShowQuarterSelector(false);
  };

  // Generate available years (current year and next 3 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return [
      currentYear.toString(),
      (currentYear + 1).toString(),
      (currentYear + 2).toString(),
      (currentYear + 3).toString()
    ];
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DefineOutcomesStep 
            longTermOutcomes={outcomes.longTerm}
            midTermOutcomes={outcomes.midTerm}
            shortTermOutcomes={shortTermOutcomes}
            setShortTermOutcomes={setShortTermOutcomes}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <InnovationSprintStep 
            innovationSprintUrl={innovationSprintUrl}
            setInnovationSprintUrl={setInnovationSprintUrl}
            designAgentUrl={designAgentUrl}
            setDesignAgentUrl={setDesignAgentUrl}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <BacklogPlanningStep 
            shortTermOutcomes={shortTermOutcomes}
            designAgentUrl={designAgentUrl}
            onNext={nextStep}
            onBack={prevStep}
            upcomingQuarter={upcomingQuarter}
          />
        );
      case 4:
        return (
          <TeamConnectionsStep
            shortTermOutcomes={shortTermOutcomes}
            upcomingCycleItems={upcomingCycleItems}
            selectedTeams={selectedTeams}
            setSelectedTeams={setSelectedTeams}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <PlanSummaryStep 
            shortTermOutcomes={shortTermOutcomes}
            upcomingCycleItems={upcomingCycleItems}
            selectedTeams={selectedTeams}
            onBack={prevStep}
            onFinalize={handleFinalizePlan}
            upcomingQuarter={upcomingQuarter}
          />
        );
      default:
        return null;
    }
  };

  // Steps for the stepper
  const steps = [
    "Define Outcomes",
    "Innovation Sprint",
    "Backlog Planning",
    "Team Connections",
    "Review & Finalize"
  ];

  // Close quarter selector when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.quarter-selector') && !target.closest('.quarter-dropdown')) {
        setShowQuarterSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                <Calendar className="h-6 w-6 mr-2 text-blue-500" />
                90-Day Cycle Planning
              </h1>
            </div>
            <div className="flex items-center space-x-2 relative quarter-selector">
              <button 
                onClick={() => setShowQuarterSelector(!showQuarterSelector)}
                className="text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md flex items-center"
              >
                Planning for {upcomingQuarter}
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              
              {/* Quarter and Year Selector Dropdown */}
              {showQuarterSelector && (
                <div className="absolute right-0 top-10 mt-1 w-64 bg-white rounded-md shadow-lg z-10 quarter-dropdown">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Select Quarter & Year</h3>
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quarter</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                          <button
                            key={quarter}
                            onClick={() => handleQuarterSelection(quarter)}
                            className={`text-xs py-1.5 rounded-md ${
                              selectedQuarter === quarter
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {quarter}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                      <div className="grid grid-cols-2 gap-2">
                        {generateYears().map((year) => (
                          <button
                            key={year}
                            onClick={() => handleYearSelection(year)}
                            className={`text-xs py-1.5 rounded-md ${
                              selectedYear === year
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <p className="mt-1 text-sm text-gray-500">
              Plan your team's upcoming 90-day cycle outcomes and output
            </p>
          </div>
          
          {/* Team Workflow style stepper */}
          <div className="mt-8 px-8 mb-8">
            <div className="flex items-start justify-between w-full">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  {/* Step circle */}
                  <div className="flex flex-col items-center relative">
                    <div 
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 
                        ${index < currentStep 
                          ? 'border-blue-500 bg-blue-500 text-white' 
                          : index === currentStep
                            ? 'border-blue-500 bg-white text-blue-500'
                            : 'border-gray-300 bg-white text-gray-500'}`}
                      onClick={() => index < currentStep && setCurrentStep(index + 1)}
                      style={{ cursor: index < currentStep ? 'pointer' : 'default' }}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="mt-4 text-sm text-center max-w-[100px]">
                      {step}
                    </div>
                  </div>
                  
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div 
                      className={`flex-1 h-0.5 mx-4 mt-6 
                        ${index < currentStep ? 'bg-blue-500' : 'bg-gray-300'}`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {getStepContent()}
          </div>
        </main>

        {/* AI Assistant */}
        <AIAssistant />
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">Plan Finalized!</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Your 90-day cycle plan has been finalized. Would you like to proceed to Sprint Planning?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleConfirmFinalize}
                  className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                >
                  Yes, Go to Sprint Planning
                </button>
                <button
                  onClick={handleCancelFinalize}
                  className="px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md w-full border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Stay on Current Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NinetyDayCyclePlan;
