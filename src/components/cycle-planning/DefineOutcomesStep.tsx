import React, { useState, useEffect, useRef } from 'react';
import { Target, AlertCircle, CheckCircle, PlusCircle, Edit, Trash2, HelpCircle, ChevronRight, ChevronDown, ChevronUp, RefreshCw, Plus, X } from 'lucide-react';
import { Outcome, Metric } from '../../types';

interface DefineOutcomesStepProps {
  longTermOutcomes: Outcome[];
  midTermOutcomes: Outcome[];
  shortTermOutcomes: Outcome[];
  setShortTermOutcomes: React.Dispatch<React.SetStateAction<Outcome[]>>;
  onNext: () => void;
}

const DefineOutcomesStep: React.FC<DefineOutcomesStepProps> = ({
  longTermOutcomes,
  midTermOutcomes,
  shortTermOutcomes,
  setShortTermOutcomes,
  onNext
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState<Outcome | null>(null);
  const [validationFeedback, setValidationFeedback] = useState<{
    who: { valid: boolean; message: string };
    what: { valid: boolean; message: string };
    why: { valid: boolean; message: string };
  }>({
    who: { valid: false, message: 'Missing who will be impacted' },
    what: { valid: false, message: 'Missing what impact is targeted' },
    why: { valid: false, message: 'Missing why this matters' }
  });

  // AI-suggested outcomes
  const [suggestedOutcomes, setSuggestedOutcomes] = useState<(Outcome & { alignedMidTermIndex?: number })[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [isEditingSuggestion, setIsEditingSuggestion] = useState(false);
  const [editingSuggestionIndex, setEditingSuggestionIndex] = useState<number | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // State for adding measurements after accepting an outcome
  const [isAddingMeasurements, setIsAddingMeasurements] = useState(false);
  const [outcomeForMeasurements, setOutcomeForMeasurements] = useState<Outcome | null>(null);
  const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false);
  const [suggestedMetrics, setSuggestedMetrics] = useState<Metric[]>([]);
  const [acceptedMetrics, setAcceptedMetrics] = useState<Metric[]>([]);
  const [isRegeneratingMetrics, setIsRegeneratingMetrics] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState('');

  // State for accepted outcomes panel
  const [acceptedOutcomes, setAcceptedOutcomes] = useState<(Outcome & { alignedMidTermIndex?: number })[]>([]);
  const [expandedOutcomeIndex, setExpandedOutcomeIndex] = useState<number | null>(null);
  const [showAcceptedPanel, setShowAcceptedPanel] = useState(false);
  const [editingAcceptedOutcomeIndex, setEditingAcceptedOutcomeIndex] = useState<number | null>(null);

  // Refs for outcome hierarchy visualization
  const missionRef = useRef<HTMLDivElement | null>(null);
  const longTermRefs = useRef<(HTMLDivElement | null)[]>([]);
  const midTermRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hierarchyContainerRef = useRef<HTMLDivElement | null>(null);
  const [connectorPaths, setConnectorPaths] = useState<{type: string; from: number; to: number; path: string}[]>([]);

  // Function to generate AI suggested outcomes
  const generateAISuggestions = () => {
    setIsLoadingSuggestions(true);
    setIsRegenerating(true);
    
    // Clear existing suggestions if regenerating
    if (isRegenerating) {
      setSuggestedOutcomes([]);
    }
    
    // Simulate AI generating recommendations with a delay
    setTimeout(() => {
      // Generate different suggestions based on whether this is initial load or regeneration
      const aiSuggestions: (Outcome & { alignedMidTermIndex?: number })[] = isRegenerating ? 
        [
          {
            title: "Product teams will implement a unified feedback collection system, resulting in 40% more actionable user insights",
            description: "Create a centralized system for collecting and analyzing user feedback across all product touchpoints.",
            metrics: [],
            alignedMidTermIndex: 1 // Aligns with "Cross-Team Collaboration Metrics"
          },
          {
            title: "Development teams will adopt trunk-based development practices, reducing integration issues by 50%",
            description: "Transition from feature branches to trunk-based development to improve collaboration and reduce merge conflicts.",
            metrics: [],
            alignedMidTermIndex: 0 // Aligns with "Engineering Insights Platform"
          },
          {
            title: "UX researchers will establish a regular cadence of user testing, enabling teams to validate designs before development",
            description: "Implement a structured approach to user testing that provides timely feedback on designs before significant development resources are committed.",
            metrics: [],
            alignedMidTermIndex: 1 // Aligns with "Cross-Team Collaboration Metrics"
          }
        ] : 
        [
          {
            title: "Engineering teams will have access to standardized metrics dashboards, enabling data-driven decisions that improve delivery performance",
            description: "Provide engineering teams with consistent, reliable metrics to measure their performance and make informed decisions about process improvements.",
            metrics: [],
            alignedMidTermIndex: 0 // Aligns with "Engineering Insights Platform"
          },
          {
            title: "Product managers will utilize user research insights in planning, resulting in features that better address customer needs",
            description: "Integrate user research findings directly into the product planning process to ensure features are aligned with actual customer needs and pain points.",
            metrics: [],
            alignedMidTermIndex: 1 // Aligns with "Cross-Team Collaboration Metrics"
          },
          {
            title: "Development teams will implement automated quality gates, reducing production incidents by 30% and improving customer trust",
            description: "Establish automated quality checks throughout the development pipeline to catch issues before they reach production, improving overall system reliability.",
            metrics: [],
            alignedMidTermIndex: 0 // Aligns with "Engineering Insights Platform"
          }
        ];
      
      setSuggestedOutcomes(aiSuggestions);
      setIsLoadingSuggestions(false);
      setIsRegenerating(false);
    }, 1500);
  };

  useEffect(() => {
    // Generate initial AI suggestions
    generateAISuggestions();
  }, []);

  // Define which mid-term outcomes connect to which long-term outcomes
  const getMidTermToLongTermMapping = () => {
    return [
      { midTerm: 0, longTerm: 0 }, // First mid-term connects to first long-term
      { midTerm: 1, longTerm: 0 }, // Second mid-term connects to first long-term
      { midTerm: 2, longTerm: 1 }, // Third mid-term connects to second long-term
    ];
  };

  // Calculate connector paths for outcome hierarchy using only vertical and horizontal lines
  useEffect(() => {
    // Wait for refs to be populated
    if (!hierarchyContainerRef.current || !missionRef.current) return;
    
    const calculateConnectorPaths = () => {
      const container = hierarchyContainerRef.current;
      if (!container || !missionRef.current) return;
      
      const containerRect = container.getBoundingClientRect();
      const newPaths: {type: string; from: number; to: number; path: string}[] = [];
      
      // Mission to Long-term outcomes connections
      const missionRect = missionRef.current.getBoundingClientRect();
      const missionBottom = missionRect.bottom - containerRect.top;
      const missionCenterX = missionRect.left - containerRect.left + missionRect.width / 2;
      
      // First add the vertical line from mission to the horizontal connector
      if (longTermRefs.current.length > 0) {
        // Calculate the Y position for the horizontal connector
        // This should be halfway between the mission box and the long-term outcomes
        const firstLongTermRect = longTermRefs.current[0]?.getBoundingClientRect();
        if (firstLongTermRect) {
          const longTermTop = firstLongTermRect.top - containerRect.top;
          const horizontalConnectorY = missionBottom + (longTermTop - missionBottom) / 2;
          
          // Add vertical line from mission to horizontal connector
          newPaths.push({
            type: 'mission-to-horizontal',
            from: -1, // Mission doesn't have an index
            to: -1,
            path: `M ${missionCenterX} ${missionBottom} L ${missionCenterX} ${horizontalConnectorY}`
          });
          
          // Add horizontal line that spans all long-term outcomes
          if (longTermRefs.current.length > 1) {
            const firstLongTermCenterX = firstLongTermRect.left - containerRect.left + firstLongTermRect.width / 2;
            const lastLongTermRect = longTermRefs.current[longTermRefs.current.length - 1]?.getBoundingClientRect();
            if (lastLongTermRect) {
              const lastLongTermCenterX = lastLongTermRect.left - containerRect.left + lastLongTermRect.width / 2;
              
              newPaths.push({
                type: 'horizontal-connector',
                from: -1,
                to: -1,
                path: `M ${firstLongTermCenterX} ${horizontalConnectorY} L ${lastLongTermCenterX} ${horizontalConnectorY}`
              });
            }
          }
          
          // Add vertical lines from horizontal connector to each long-term outcome
          longTermRefs.current.forEach((ref, index) => {
            if (ref) {
              const rect = ref.getBoundingClientRect();
              const centerX = rect.left - containerRect.left + rect.width / 2;
              
              newPaths.push({
                type: 'horizontal-to-longterm',
                from: -1,
                to: index,
                path: `M ${centerX} ${horizontalConnectorY} L ${centerX} ${rect.top - containerRect.top}`
              });
            }
          });
        }
      }
      
      // Long-term to Mid-term outcome connections
      const connections = getMidTermToLongTermMapping();
      
      connections.forEach(({ midTerm, longTerm }) => {
        const midTermEl = midTermRefs.current[midTerm];
        const longTermEl = longTermRefs.current[longTerm];
        
        if (!midTermEl || !longTermEl) return;
        
        const midTermRect = midTermEl.getBoundingClientRect();
        const longTermRect = longTermEl.getBoundingClientRect();
        
        // Calculate positions relative to container
        const midTermCenterX = midTermRect.left - containerRect.left + midTermRect.width / 2;
        const midTermTop = midTermRect.top - containerRect.top;
        
        const longTermCenterX = longTermRect.left - containerRect.left + longTermRect.width / 2;
        const longTermBottom = longTermRect.bottom - containerRect.top;
        
        // Calculate the Y position for the horizontal connector
        // This should be halfway between the long-term and mid-term outcomes
        const horizontalConnectorY = longTermBottom + (midTermTop - longTermBottom) / 2;
        
        // Add vertical line from long-term to horizontal connector
        newPaths.push({
          type: 'longterm-to-horizontal',
          from: longTerm,
          to: -1,
          path: `M ${longTermCenterX} ${longTermBottom} L ${longTermCenterX} ${horizontalConnectorY}`
        });
        
        // Add horizontal line from long-term vertical to mid-term vertical
        newPaths.push({
          type: 'horizontal-connector-mid',
          from: longTerm,
          to: midTerm,
          path: `M ${longTermCenterX} ${horizontalConnectorY} L ${midTermCenterX} ${horizontalConnectorY}`
        });
        
        // Add vertical line from horizontal connector to mid-term
        newPaths.push({
          type: 'horizontal-to-midterm',
          from: -1,
          to: midTerm,
          path: `M ${midTermCenterX} ${horizontalConnectorY} L ${midTermCenterX} ${midTermTop}`
        });
      });
      
      setConnectorPaths(newPaths);
    };
    
    // Use a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      calculateConnectorPaths();
      window.addEventListener('resize', calculateConnectorPaths);
    }, 300);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateConnectorPaths);
    };
  }, [longTermOutcomes, midTermOutcomes]);

  const handleAddSuggestedOutcome = (outcome: Outcome & { alignedMidTermIndex?: number }) => {
    // Add the outcome to shortTermOutcomes without measurements
    const newOutcome = {
      ...outcome,
      metrics: []
    };
    
    // Remove from suggestions
    setSuggestedOutcomes(prev => prev.filter(o => o.title !== outcome.title));
    
    // Set up for adding measurements
    setOutcomeForMeasurements(newOutcome);
    setIsAddingMeasurements(true);
    
    // Reset accepted metrics
    setAcceptedMetrics([]);
    
    // Simulate AI generating recommended measurements
    setIsLoadingMeasurements(true);
    setTimeout(() => {
      // Generate AI recommended measurements based on the outcome
      const recommendedMetrics: Metric[] = generateAIRecommendedMetrics(outcome);
      
      setSuggestedMetrics(recommendedMetrics);
      setIsLoadingMeasurements(false);
    }, 1000);
  };

  // Function to handle regenerating AI suggestions
  const handleRegenerateAISuggestions = () => {
    generateAISuggestions();
  };

  // Function to handle regenerating AI suggested measurements
  const handleRegenerateAISuggestedMetrics = () => {
    if (!outcomeForMeasurements) return;
    
    setIsRegeneratingMetrics(true);
    setSuggestedMetrics([]);
    setIsLoadingMeasurements(true);
    
    setTimeout(() => {
      // Generate different AI recommended measurements
      const newRecommendedMetrics: Metric[] = generateAIRecommendedMetrics(outcomeForMeasurements, true);
      
      setSuggestedMetrics(newRecommendedMetrics);
      setIsLoadingMeasurements(false);
      setIsRegeneratingMetrics(false);
    }, 1000);
  };

  // Function to generate AI recommended metrics based on the outcome
  const generateAIRecommendedMetrics = (outcome: Outcome, isRegeneration: boolean = false): Metric[] => {
    const title = outcome.title.toLowerCase();
    const midTermIndex = (outcome as any).alignedMidTermIndex || 0;
    
    // Generate different metrics based on whether this is initial generation or regeneration
    if (isRegeneration) {
      if (midTermIndex === 0) { // Engineering Insights Platform
        return [
          {
            name: "Engineering productivity score",
            current: "68",
            target: "85",
            unit: "points",
            status: "on-track"
          },
          {
            name: "Time spent on metrics analysis",
            current: "2",
            target: "5",
            unit: "hours/week",
            status: "on-track"
          },
          {
            name: "Insights-driven decisions",
            current: "30",
            target: "75",
            unit: "%",
            status: "on-track"
          }
        ];
      } else { // Cross-Team Collaboration Metrics
        return [
          {
            name: "Cross-team dependencies resolved",
            current: "45",
            target: "80",
            unit: "%",
            status: "on-track"
          },
          {
            name: "Shared planning sessions",
            current: "4",
            target: "12",
            unit: "per quarter",
            status: "on-track"
          },
          {
            name: "Collaboration satisfaction",
            current: "3.2",
            target: "4.5",
            unit: "out of 5",
            status: "on-track"
          }
        ];
      }
    }
    
    if (title.includes("metrics dashboard") || title.includes("data-driven")) {
      return [
        {
          name: "Dashboard adoption rate",
          current: "15",
          target: "80",
          unit: "%",
          status: "on-track"
        },
        {
          name: "Teams using metrics in planning",
          current: "3",
          target: "12",
          unit: "teams",
          status: "on-track"
        },
        {
          name: "Data-driven decisions documented",
          current: "5",
          target: "30",
          unit: "per quarter",
          status: "on-track"
        }
      ];
    } else if (title.includes("user research") || title.includes("customer needs") || title.includes("user testing") || title.includes("feedback")) {
      return [
        {
          name: "Features with research backing",
          current: "40",
          target: "90",
          unit: "%",
          status: "on-track"
        },
        {
          name: "User research sessions",
          current: "8",
          target: "24",
          unit: "per quarter",
          status: "on-track"
        },
        {
          name: "Customer satisfaction score",
          current: "72",
          target: "85",
          unit: "NPS",
          status: "on-track"
        }
      ];
    } else if (title.includes("quality gates") || title.includes("production incidents") || title.includes("trunk-based") || title.includes("integration issues")) {
      return [
        {
          name: "Production incidents",
          current: "12",
          target: "8",
          unit: "per month",
          status: "on-track"
        },
        {
          name: "Automated quality gates",
          current: "3",
          target: "7",
          unit: "gates",
          status: "on-track"
        },
        {
          name: "Code coverage",
          current: "65",
          target: "85",
          unit: "%",
          status: "on-track"
        }
      ];
    } else {
      // Default metrics based on mid-term outcome alignment
      if (midTermIndex === 0) { // Engineering Insights Platform
        return [
          {
            name: "Platform usage",
            current: "35",
            target: "85",
            unit: "%",
            status: "on-track"
          },
          {
            name: "Insights generated",
            current: "12",
            target: "50",
            unit: "per sprint",
            status: "on-track"
          },
          {
            name: "Time saved by automation",
            current: "4",
            target: "15",
            unit: "hours/week",
            status: "on-track"
          }
        ];
      } else { // Cross-Team Collaboration Metrics
        return [
          {
            name: "Team collaboration score",
            current: "65",
            target: "90",
            unit: "%",
            status: "on-track"
          },
          {
            name: "Cross-team initiatives",
            current: "3",
            target: "8",
            unit: "per quarter",
            status: "on-track"
          },
          {
            name: "Knowledge sharing sessions",
            current: "5",
            target: "15",
            unit: "per quarter",
            status: "on-track"
          }
        ];
      }
    }
  };

  // Function to generate AI suggested metrics for an outcome being edited
  const generateAISuggestedMetricsForEditing = () => {
    if (!editingOutcome) return;
    
    setIsLoadingMeasurements(true);
    
    setTimeout(() => {
      // Generate AI recommended measurements based on the outcome
      const midTermIndex = (editingOutcome as any).alignedMidTermIndex || 0;
      const recommendedMetrics: Metric[] = generateAIRecommendedMetrics({
        ...editingOutcome,
        alignedMidTermIndex: midTermIndex
      } as any);
      
      // Add these metrics to the outcome
      setEditingOutcome({
        ...editingOutcome,
        metrics: [...editingOutcome.metrics, ...recommendedMetrics]
      });
      
      setIsLoadingMeasurements(false);
    }, 1000);
  };

  const handleAcceptSuggestedMetric = (metric: Metric) => {
    // Add to accepted metrics
    setAcceptedMetrics(prev => [...prev, metric]);
    
    // Remove from suggested metrics
    setSuggestedMetrics(prev => prev.filter(m => m.name !== metric.name));
  };

  const handleRemoveAcceptedMetric = (index: number) => {
    // Show confirmation dialog
    setConfirmMessage("Are you sure you want to remove this measurement?");
    setConfirmAction(() => () => {
      const updatedMetrics = [...acceptedMetrics];
      updatedMetrics.splice(index, 1);
      setAcceptedMetrics(updatedMetrics);
      setShowConfirmDialog(false);
    });
    setShowConfirmDialog(true);
  };

  const handleEditSuggestion = (index: number) => {
    setEditingSuggestionIndex(index);
    setEditingOutcome({...suggestedOutcomes[index]});
    setIsEditingSuggestion(true);
    setIsEditing(true);
    
    // Reset validation feedback to show red X's by default
    setValidationFeedback({
      who: { valid: false, message: 'Missing who will be impacted' },
      what: { valid: false, message: 'Missing what impact is targeted' },
      why: { valid: false, message: 'Missing why this matters' }
    });
    
    // Then validate the suggestion text
    const validation = validateOutcome(suggestedOutcomes[index].title);
    setValidationFeedback(validation);
  };

  const handleSaveSuggestionEdit = () => {
    if (!editingOutcome || editingSuggestionIndex === null) return;
    
    // Validate outcome
    const validation = validateOutcome(editingOutcome.title);
    setValidationFeedback(validation);
    
    // Update the suggestion regardless of validation
    const updatedSuggestions = [...suggestedOutcomes];
    updatedSuggestions[editingSuggestionIndex] = {
      ...editingOutcome,
      metrics: [], // Ensure no metrics are added at this stage
      alignedMidTermIndex: (editingOutcome as any).alignedMidTermIndex // Preserve the alignment
    };
    setSuggestedOutcomes(updatedSuggestions);
    
    setIsEditing(false);
    setIsEditingSuggestion(false);
    setEditingOutcome(null);
    setEditingSuggestionIndex(null);
  };

  const handleCreateNewOutcome = () => {
    const newOutcome: Outcome & { alignedMidTermIndex?: number } = {
      title: "",
      description: "",
      metrics: [],
      alignedMidTermIndex: 0 // Default to first mid-term outcome
    };
    setEditingOutcome(newOutcome);
    setIsEditing(true);
    setIsEditingSuggestion(false);
    
    // Reset validation feedback to show red X's by default
    setValidationFeedback({
      who: { valid: false, message: 'Missing who will be impacted' },
      what: { valid: false, message: 'Missing what impact is targeted' },
      why: { valid: false, message: 'Missing why this matters' }
    });
  };

  const handleEditOutcome = (outcome: Outcome) => {
    setEditingOutcome({...outcome});
    setIsEditing(true);
    setIsEditingSuggestion(false);
    
    // Validate the existing outcome text
    const validation = validateOutcome(outcome.title);
    setValidationFeedback(validation);
  };

  const handleDeleteOutcome = (outcome: Outcome) => {
    // Show confirmation dialog
    setConfirmMessage("Are you sure you want to delete this outcome?");
    setConfirmAction(() => () => {
      setShortTermOutcomes(prev => prev.filter(o => o.title !== outcome.title));
      setShowConfirmDialog(false);
    });
    setShowConfirmDialog(true);
  };

  // Handle editing an accepted outcome
  const handleEditAcceptedOutcome = (index: number) => {
    setEditingAcceptedOutcomeIndex(index);
    setEditingOutcome({...acceptedOutcomes[index]});
    setIsEditing(true);
    setIsEditingSuggestion(false);
    
    // Validate the existing outcome text
    const validation = validateOutcome(acceptedOutcomes[index].title);
    setValidationFeedback(validation);
  };

  // Handle deleting an accepted outcome
  const handleDeleteAcceptedOutcome = (index: number) => {
    // Show confirmation dialog
    setConfirmMessage("Are you sure you want to delete this outcome?");
    setConfirmAction(() => () => {
      const updatedAcceptedOutcomes = [...acceptedOutcomes];
      updatedAcceptedOutcomes.splice(index, 1);
      setAcceptedOutcomes(updatedAcceptedOutcomes);
      
      // If there are no more accepted outcomes, hide the panel
      if (updatedAcceptedOutcomes.length === 0) {
        setShowAcceptedPanel(false);
      }
      setShowConfirmDialog(false);
    });
    setShowConfirmDialog(true);
  };

  const handleSaveOutcome = () => {
    if (!editingOutcome) return;
    
    // Validate outcome but allow saving regardless of validation results
    const validation = validateOutcome(editingOutcome.title);
    setValidationFeedback(validation);
    
    // Check if we're editing an accepted outcome
    if (editingAcceptedOutcomeIndex !== null) {
      // Update existing accepted outcome
      const updatedAcceptedOutcomes = [...acceptedOutcomes];
      updatedAcceptedOutcomes[editingAcceptedOutcomeIndex] = {
        ...editingOutcome,
        alignedMidTermIndex: (editingOutcome as any).alignedMidTermIndex // Preserve alignment if it exists
      };
      setAcceptedOutcomes(updatedAcceptedOutcomes);
      setEditingAcceptedOutcomeIndex(null);
    } else {
      // Check if this is a new outcome or an edit of an existing shortTermOutcome
      const existingIndex = shortTermOutcomes.findIndex(o => o.title === editingOutcome.title);
      
      if (existingIndex >= 0) {
        // Update existing outcome in shortTermOutcomes
        const updatedOutcomes = [...shortTermOutcomes];
        updatedOutcomes[existingIndex] = editingOutcome;
        setShortTermOutcomes(updatedOutcomes);
      } else {
        // Add new outcome to shortTermOutcomes AND to acceptedOutcomes
        setShortTermOutcomes(prev => [...prev, editingOutcome]);
        
        // Also add to accepted outcomes panel
        setAcceptedOutcomes(prev => [...prev, editingOutcome as any]);
        setShowAcceptedPanel(true);
      }
    }
    
    setIsEditing(false);
    setEditingOutcome(null);
  };

  const handleSaveMeasurements = () => {
    if (!outcomeForMeasurements) return;
    
    // Add the outcome with accepted measurements to shortTermOutcomes
    const outcomeWithMetrics = {
      ...outcomeForMeasurements,
      metrics: acceptedMetrics
    };
    
    setShortTermOutcomes(prev => [...prev, outcomeWithMetrics]);
    
    // Also add to accepted outcomes panel
    setAcceptedOutcomes(prev => [...prev, outcomeWithMetrics as any]);
    setShowAcceptedPanel(true);
    
    // Reset state
    setIsAddingMeasurements(false);
    setOutcomeForMeasurements(null);
    setSuggestedMetrics([]);
    setAcceptedMetrics([]);
  };

  const handleCancelMeasurements = () => {
    // Show confirmation dialog
    setConfirmMessage("Are you sure you want to cancel? Any accepted measurements will be lost.");
    setConfirmAction(() => () => {
      setIsAddingMeasurements(false);
      setOutcomeForMeasurements(null);
      setSuggestedMetrics([]);
      setAcceptedMetrics([]);
      setShowConfirmDialog(false);
    });
    setShowConfirmDialog(true);
  };

  const validateOutcome = (outcomeText: string) => {
    // Simple validation logic - in a real app this would be more sophisticated
    const hasWho = outcomeText.toLowerCase().includes("teams") || 
                  outcomeText.toLowerCase().includes("users") || 
                  outcomeText.toLowerCase().includes("customers") ||
                  outcomeText.toLowerCase().includes("engineers") ||
                  outcomeText.toLowerCase().includes("managers");
    
    const hasWhat = outcomeText.toLowerCase().includes("will") && 
                   (outcomeText.toLowerCase().includes("have") || 
                    outcomeText.toLowerCase().includes("be able") || 
                    outcomeText.toLowerCase().includes("utilize") ||
                    outcomeText.toLowerCase().includes("implement") ||
                    outcomeText.toLowerCase().includes("adopt") ||
                    outcomeText.toLowerCase().includes("establish"));
    
    const hasWhy = outcomeText.toLowerCase().includes("enabling") || 
                  outcomeText.toLowerCase().includes("resulting") || 
                  outcomeText.toLowerCase().includes("improving") ||
                  outcomeText.toLowerCase().includes("reducing");
    
    return {
      who: { 
        valid: hasWho, 
        message: hasWho ? "Clearly identifies who will be impacted" : "Missing who will be impacted" 
      },
      what: { 
        valid: hasWhat, 
        message: hasWhat ? "Clearly states what impact is targeted" : "Missing what impact is targeted" 
      },
      why: { 
        valid: hasWhy, 
        message: hasWhy ? "Clearly explains why this matters" : "Missing why this matters" 
      }
    };
  };

  const handleAddMetric = () => {
    if (isAddingMeasurements && outcomeForMeasurements) {
      // Adding metrics to a newly accepted outcome
      const newMetric: Metric = {
        name: "",
        target: "",
        current: "",
        unit: "",
        status: "on-track"
      };
      
      setAcceptedMetrics(prev => [...prev, newMetric]);
    } else if (editingOutcome) {
      // Adding metrics to an existing outcome being edited
      const newMetric: Metric = {
        name: "",
        target: "",
        current: "",
        unit: "",
        status: "on-track"
      };
      
      setEditingOutcome({
        ...editingOutcome,
        metrics: [...editingOutcome.metrics, newMetric]
      });
    }
  };

  const handleUpdateMetric = (index: number, field: keyof Metric, value: string) => {
    if (isAddingMeasurements) {
      // Updating metrics for a newly accepted outcome
      const updatedMetrics = [...acceptedMetrics];
      updatedMetrics[index] = {
        ...updatedMetrics[index],
        [field]: value
      };
      
      setAcceptedMetrics(updatedMetrics);
    } else if (editingOutcome) {
      // Updating metrics for an existing outcome being edited
      const updatedMetrics = [...editingOutcome.metrics];
      updatedMetrics[index] = {
        ...updatedMetrics[index],
        [field]: value
      };
      
      setEditingOutcome({
        ...editingOutcome,
        metrics: updatedMetrics
      });
    }
  };

  const handleRemoveMetric = (index: number) => {
    if (editingOutcome) {
      // Show confirmation dialog
      setConfirmMessage("Are you sure you want to remove this measurement?");
      setConfirmAction(() => () => {
        // Removing metrics from an existing outcome being edited
        const updatedMetrics = editingOutcome.metrics.filter((_, i) => i !== index);
        
        setEditingOutcome({
          ...editingOutcome,
          metrics: updatedMetrics
        });
        setShowConfirmDialog(false);
      });
      setShowConfirmDialog(true);
    }
  };

  const handleOutcomeTextChange = (value: string) => {
    if (!editingOutcome) return;
    
    setEditingOutcome({
      ...editingOutcome,
      title: value
    });
    
    // Validate as user types
    const validation = validateOutcome(value);
    setValidationFeedback(validation);
  };

  const handleOutcomeDescriptionChange = (value: string) => {
    if (!editingOutcome) return;
    
    setEditingOutcome({
      ...editingOutcome,
      description: value
    });
  };

  const handleMidTermOutcomeChange = (value: string) => {
    if (!editingOutcome) return;
    
    setEditingOutcome({
      ...editingOutcome,
      alignedMidTermIndex: parseInt(value)
    } as any);
  };

  // Calculate which mid-term outcomes align with which long-term outcomes
  // For this example, we'll assume a simple mapping where each mid-term outcome
  // is aligned with a specific long-term outcome based on index
  const getOutcomeAlignments = () => {
    // Create a mapping of mid-term outcomes to their parent long-term outcomes
    // In a real app, this would come from your data model
    const alignments: { [midTermIndex: number]: number } = {
      0: 0, // First mid-term outcome aligns with first long-term outcome
      1: 0, // Second mid-term outcome also aligns with first long-term outcome
      2: 1, // Third mid-term outcome aligns with second long-term outcome
    };
    
    return alignments;
  };

  const outcomeAlignments = getOutcomeAlignments();

  // Toggle expanded state for an outcome in the accepted panel
  const toggleOutcomeExpanded = (index: number) => {
    if (expandedOutcomeIndex === index) {
      setExpandedOutcomeIndex(null);
    } else {
      setExpandedOutcomeIndex(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            Step 1: Define Short-Term Outcomes & Measurements
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Define what your team aims to achieve in the next 90 days
          </p>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-2">Outcome Alignment</h3>
            <div className="bg-gray-50 p-8 rounded-lg relative" ref={hierarchyContainerRef}>
              {/* Org Chart Style Tree View */}
              <div className="flex flex-col items-center">
                {/* Hierarchical Labels */}
                <div className="absolute left-4 top-1/4 transform -translate-y-1/2">
                  <div className="text-sm font-medium text-gray-700">Company Mission</div>
                </div>
                
                <div className="absolute left-4 top-[45%] transform -translate-y-1/2">
                  <div className="text-sm font-medium text-gray-700">Long-Term Outcomes<br />(3-5 years)</div>
                </div>
                
                <div className="absolute left-4 bottom-[20%] transform -translate-y-1/2">
                  <div className="text-sm font-medium text-gray-700">Mid-Term Outcomes<br />(12-18 months)</div>
                </div>
                
                {/* Company Mission - Root Node */}
                <div 
                  ref={missionRef}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-80 text-center mb-16"
                >
                  <p className="text-sm text-blue-700 mt-1 text-center">Health for all, Hunger for none</p>
                </div>
                
                {/* Long-term Outcomes - Second Level */}
                <div className="mb-20 flex justify-center">
                  <div className="flex space-x-24">
                    {longTermOutcomes.map((outcome, index) => (
                      <div 
                        key={index} 
                        className="flex flex-col items-center" 
                        ref={el => longTermRefs.current[index] = el}
                      >
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 w-64 flex flex-col items-center">
                          <p className="text-sm text-indigo-700 text-center">{outcome.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Mid-term Outcomes - Third Level */}
                <div className="flex justify-center">
                  <div className="grid grid-cols-3 gap-12">
                    {midTermOutcomes.map((outcome, index) => (
                      <div 
                        key={index} 
                        className="flex flex-col items-center"
                        ref={el => midTermRefs.current[index] = el}
                      >
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 w-64 flex flex-col items-center">
                          <p className="text-sm text-purple-700 text-center">{outcome.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* SVG for connector lines */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {connectorPaths.map((connector, index) => (
                    <path
                      key={index}
                      d={connector.path}
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-medium text-gray-900">Your Short-Term Outcomes (90 days)</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleCreateNewOutcome}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Outcome
                </button>
              </div>
            </div>
            
            {/* AI Suggestions - Always shown */}
            <div className="mb-6 border border-blue-200 rounded-lg bg-blue-50 p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-blue-800">AI-Suggested Outcomes</h4>
                <button
                  onClick={handleRegenerateAISuggestions}
                  disabled={isLoadingSuggestions}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md ${
                    isLoadingSuggestions 
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                      : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                  }`}
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
                  {isLoadingSuggestions ? 'Generating...' : 'Regenerate Suggestions'}
                </button>
              </div>
              
              {isLoadingSuggestions ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-sm text-blue-600">Generating suggestions...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestedOutcomes.map((outcome, index) => (
                    <div key={index} className="bg-white border border-blue-200 rounded-lg p-3">
                      <div className="flex justify-between">
                        <h5 className="text-sm font-medium text-gray-900">{outcome.title}</h5>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditSuggestion(index)}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Edit suggestion"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleAddSuggestedOutcome(outcome)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{outcome.description}</p>
                      
                      {/* Show aligned mid-term outcome */}
                      {typeof outcome.alignedMidTermIndex === 'number' && midTermOutcomes[outcome.alignedMidTermIndex] && (
                        <div className="mt-2 flex items-center">
                          <div className="bg-purple-100 rounded-full w-1.5 h-1.5 mr-2"></div>
                          <span className="text-xs text-purple-700 font-medium">
                            Aligns with mid-term outcome: 
                          </span>
                          <span className="text-xs text-purple-700 ml-1">
                            {midTermOutcomes[outcome.alignedMidTermIndex].title}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Accepted Outcomes Panel */}
            {showAcceptedPanel && acceptedOutcomes.length > 0 && (
              <div className="mb-6 border border-green-200 rounded-lg bg-green-50 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-green-800">Accepted Outcomes</h4>
                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    {acceptedOutcomes.length} outcome{acceptedOutcomes.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {acceptedOutcomes.map((outcome, index) => (
                    <div key={index} className="bg-white border border-green-200 rounded-lg overflow-hidden">
                      <div className="p-3 flex justify-between items-center">
                        <h5 
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => toggleOutcomeExpanded(index)}
                        >
                          {outcome.title}
                        </h5>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAcceptedOutcome(index)}
                            className="text-gray-400 hover:text-blue-600"
                            aria-label="Edit outcome"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAcceptedOutcome(index)}
                            className="text-gray-400 hover:text-red-600"
                            aria-label="Delete outcome"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button 
                            onClick={() => toggleOutcomeExpanded(index)}
                            className="text-gray-500"
                          >
                            {expandedOutcomeIndex === index ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded content with measurements */}
                      {expandedOutcomeIndex === index && (
                        <div className="border-t border-green-100 p-3 bg-green-50">
                          <p className="text-xs text-gray-600 mb-3">{outcome.description}</p>
                          
                          {/* Show aligned mid-term outcome */}
                          {typeof outcome.alignedMidTermIndex === 'number' && midTermOutcomes[outcome.alignedMidTermIndex] && (
                            <div className="mb-3 flex items-center">
                              <div className="bg-purple-100 rounded-full w-1.5 h-1.5 mr-2"></div>
                              <span className="text-xs text-purple-700 font-medium">
                                Aligns with mid-term outcome: 
                              </span>
                              <span className="text-xs text-purple-700 ml-1">
                                {midTermOutcomes[outcome.alignedMidTermIndex].title}
                              </span>
                            </div>
                          )}
                          
                          <div className="mt-2">
                            <h6 className="text-xs font-medium text-gray-700 mb-2">Measurements</h6>
                            {outcome.metrics.length > 0 ? (
                              <div className="bg-white rounded border border-green-100 overflow-hidden">
                                <table className="min-w-full divide-y divide-green-100">
                                  <thead className="bg-green-50">
                                    <tr>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Metric</th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Baseline</th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Target</th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-green-100">
                                    {outcome.metrics.map((metric, metricIndex) => (
                                      <tr key={metricIndex}>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{metric.name}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{metric.current}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{metric.target}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{metric.unit}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">No measurements defined</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Outcome Editing Modal */}
          {isEditing && editingOutcome && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isEditingSuggestion ? 'Edit Suggested Outcome' : 
                     editingAcceptedOutcomeIndex !== null ? 'Edit Accepted Outcome' :
                     editingOutcome.title ? 'Edit Outcome' : 'Create New Outcome'}
                  </h3>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Mid-term outcome selection - now first field and required */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aligned Mid-Term Outcome <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={(editingOutcome as any).alignedMidTermIndex || 0}
                      onChange={(e) => handleMidTermOutcomeChange(e.target.value)}
                      required
                    >
                      {midTermOutcomes.map((midTerm, idx) => (
                        <option key={idx} value={idx}>
                          {midTerm.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="outcome-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Outcome Statement
                    </label>
                    <textarea
                      id="outcome-title"
                      value={editingOutcome.title}
                      onChange={(e) => handleOutcomeTextChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="e.g., Engineering teams will have access to standardized metrics dashboards, enabling data-driven decisions"
                    />
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center">
                        {validationFeedback.who.valid ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-xs ${validationFeedback.who.valid ? 'text-green-600' : 'text-red-600'}`}>
                          Who will be impacted: {validationFeedback.who.message}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {validationFeedback.what.valid ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-xs ${validationFeedback.what.valid ? 'text-green-600' : 'text-red-600'}`}>
                          What impact is targeted: {validationFeedback.what.message}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {validationFeedback.why.valid ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-xs ${validationFeedback.why.valid ? 'text-green-600' : 'text-red-600'}`}>
                          Why this matters: {validationFeedback.why.message}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="outcome-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="outcome-description"
                      value={editingOutcome.description}
                      onChange={(e) => handleOutcomeDescriptionChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Provide additional context about this outcome"
                    />
                  </div>
                  
                  {!isEditingSuggestion && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Measurements
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={generateAISuggestedMetricsForEditing}
                            disabled={isLoadingMeasurements}
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                              isLoadingMeasurements 
                                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                                : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                            }`}
                          >
                            <RefreshCw className={`h-3 w-3 mr-1 ${isLoadingMeasurements ? 'animate-spin' : ''}`} />
                            {isLoadingMeasurements ? 'Generating...' : 'Generate AI Measurements'}
                          </button>
                          <button
                            onClick={handleAddMetric}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 hover:bg-blue-50"
                          >
                            <PlusCircle className="h-3 w-3 mr-1" />
                            Add Measurement
                          </button>
                        </div>
                      </div>
                      
                      {editingOutcome.metrics.length > 0 ? (
                        <div>
                          {/* Table header - only shown once */}
                          <div className="grid grid-cols-12 gap-3 items-center bg-gray-100 p-3 rounded-t mb-1">
                            <div className="col-span-5">
                              <label className="text-xs font-medium text-gray-700">Name</label>
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center">
                                <label className="text-xs font-medium text-gray-700 mr-1">Baseline Value</label>
                                <div className="relative group">
                                  <HelpCircle className="h-3 w-3 text-gray-400 cursor-help" />
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    Starting point used to compare progress against over time
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center">
                                <label className="text-xs font-medium text-gray-700 mr-1">Target Value</label>
                                <div className="relative group">
                                  <HelpCircle className="h-3 w-3 text-gray-400 cursor-help" />
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    Value the team aims to achieve by the end of the cycle
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center">
                                <label className="text-xs font-medium text-gray-700 mr-1">Unit</label>
                                <div className="relative group">
                                  <HelpCircle className="h-3 w-3 text-gray-400 cursor-help" />
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    Unit of measure for the baseline and target values (e.g., %, €, points)
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-1">
                              <span className="text-xs font-medium text-gray-700">Actions</span>
                            </div>
                          </div>
                          
                          {/* Metric rows */}
                          <div className="space-y-1">
                            {editingOutcome.metrics.map((metric, index) => (
                              <div key={index} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded">
                                <div className="col-span-5">
                                  <input
                                    type="text"
                                    value={metric.name}
                                    onChange={(e) => handleUpdateMetric(index, 'name', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="Metric name"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    value={metric.current}
                                    onChange={(e) => handleUpdateMetric(index, 'current', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="0"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    value={metric.target}
                                    onChange={(e) => handleUpdateMetric(index, 'target', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="0"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <input
                                    type="text"
                                    value={metric.unit || ''}
                                    onChange={(e) => handleUpdateMetric(index, 'unit', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="%, €, points"
                                  />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                  <button
                                    onClick={() => handleRemoveMetric(index)}
                                    className="text-gray-400 hover:text-red-600"
                                    aria-label="Remove metric"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-500">No measurements added yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      // Show confirmation dialog
                      setConfirmMessage("Are you sure you want to cancel? Any changes will be lost.");
                      setConfirmAction(() => () => {
                        setIsEditing(false);
                        setIsEditingSuggestion(false);
                        setEditingOutcome(null);
                        setEditingSuggestionIndex(null);
                        setEditingAcceptedOutcomeIndex(null);
                        setShowConfirmDialog(false);
                      });
                      setShowConfirmDialog(true);
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={isEditingSuggestion ? handleSaveSuggestionEdit : handleSaveOutcome}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {isEditingSuggestion ? 'Update Suggestion' : 'Save Outcome'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Add Measurements Modal (after accepting an outcome) */}
          {isAddingMeasurements && outcomeForMeasurements && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Add Measurements for Outcome
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {outcomeForMeasurements.title}
                  </p>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* AI Suggested Measurements */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700">
                          AI-Recommended Measurements
                        </label>
                        {isLoadingMeasurements && (
                          <div className="ml-2 flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            <span className="ml-1 text-xs text-blue-600">Generating...</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleRegenerateAISuggestedMetrics}
                        disabled={isLoadingMeasurements || isRegeneratingMetrics}
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                          isLoadingMeasurements || isRegeneratingMetrics
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                            : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                        }`}
                      >
                        <RefreshCw className={`h-3 w-3 mr-1 ${(isLoadingMeasurements || isRegeneratingMetrics) ? 'animate-spin' : ''}`} />
                        {(isLoadingMeasurements || isRegeneratingMetrics) ? 'Generating...' : 'Regenerate Suggestions'}
                      </button>
                    </div>
                    
                    {isLoadingMeasurements ? (
                      <div className="flex items-center justify-center p-8 bg-gray-50 rounded">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-sm text-blue-600">Analyzing outcome and generating recommended measurements...</span>
                      </div>
                    ) : suggestedMetrics.length > 0 ? (
                      <div className="space-y-2">
                        {suggestedMetrics.map((metric, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{metric.name}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Baseline: {metric.current} {metric.unit} → Target: {metric.target} {metric.unit}
                              </div>
                            </div>
                            <button
                              onClick={() => handleAcceptSuggestedMetric(metric)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Accept
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-500">No AI suggestions available</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Accepted Measurements */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Accepted Measurements
                      </label>
                      <button
                        onClick={handleAddMetric}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 hover:bg-blue-50"
                      >
                        <PlusCircle className="h-3 w-3 mr-1" />
                        Add Custom Measurement
                      </button>
                    </div>
                    
                    {acceptedMetrics.length > 0 ? (
                      <div>
                        {/* Table header - only shown once */}
                        <div className="grid grid-cols-12 gap-3 items-center bg-gray-100 p-3 rounded-t mb-1">
                          <div className="col-span-5">
                            <label className="text-xs font-medium text-gray-700">Name</label>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center">
                              <label className="text-xs font-medium text-gray-700 mr-1">Baseline Value</label>
                              <div className="relative group">
                                <HelpCircle className="h-3 w-3 text-gray-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                  Starting point used to compare progress against over time
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center">
                              <label className="text-xs font-medium text-gray-700 mr-1">Target Value</label>
                              <div className="relative group">
                                <HelpCircle className="h-3 w-3 text-gray-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                  Value the team aims to achieve by the end of the cycle
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center">
                              <label className="text-xs font-medium text-gray-700 mr-1">Unit</label>
                              <div className="relative group">
                                <HelpCircle className="h-3 w-3 text-gray-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                  Unit of measure for the baseline and target values (e.g., %, €, points)
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1">
                            <span className="text-xs font-medium text-gray-700">Actions</span>
                          </div>
                        </div>
                        
                        {/* Metric rows */}
                        <div className="space-y-1">
                          {acceptedMetrics.map((metric, index) => (
                            <div key={index} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded">
                              <div className="col-span-5">
                                <input
                                  type="text"
                                  value={metric.name}
                                  onChange={(e) => handleUpdateMetric(index, 'name', e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                  placeholder="Metric name"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={metric.current}
                                  onChange={(e) => handleUpdateMetric(index, 'current', e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                  placeholder="0"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={metric.target}
                                  onChange={(e) => handleUpdateMetric(index, 'target', e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                  placeholder="0"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="text"
                                  value={metric.unit || ''}
                                  onChange={(e) => handleUpdateMetric(index, 'unit', e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                  placeholder="%, €, points"
                                />
                              </div>
                              <div className="col-span-1 flex justify-center">
                                <button
                                  onClick={() => handleRemoveAcceptedMetric(index)}
                                  className="text-gray-400 hover:text-red-600"
                                  aria-label="Remove metric"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-500">No measurements accepted yet</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
                  <button
                    onClick={handleCancelMeasurements}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveMeasurements}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Save Measurements
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">Confirm Action</h3>
                </div>
                <div className="px-4 py-4">
                  <p className="text-sm text-gray-600">{confirmMessage}</p>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2"
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={confirmAction}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Yes, Continue
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onNext}
              disabled={shortTermOutcomes.length === 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                shortTermOutcomes.length === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Continue to Innovation Sprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefineOutcomesStep;
