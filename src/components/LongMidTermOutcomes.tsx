import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';
import { Outcome, Metric } from '../types';

interface LongMidTermOutcomesProps {
  // Props can be added as needed
}

const LongMidTermOutcomes: React.FC<LongMidTermOutcomesProps> = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId?: string }>();
  const [activeTab, setActiveTab] = useState('long-mid-term-outcomes');
  const [activeSection, setActiveSection] = useState('long-term');
  const [showAddOutcomeModal, setShowAddOutcomeModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [outcomeToDelete, setOutcomeToDelete] = useState<Outcome | null>(null);
  const [editingOutcome, setEditingOutcome] = useState<Outcome | null>(null);
  const [expandedOutcomeId, setExpandedOutcomeId] = useState<string | null>(null);
  const [validationFeedback, setValidationFeedback] = useState<{
    who: { valid: boolean; message: string };
    what: { valid: boolean; message: string };
    why: { valid: boolean; message: string };
  }>({
    who: { valid: true, message: '' },
    what: { valid: true, message: '' },
    why: { valid: true, message: '' }
  });
  const [metricToDelete, setMetricToDelete] = useState<{ index: number; name: string } | null>(null);
  const [showConfirmDeleteMetric, setShowConfirmDeleteMetric] = useState(false);

  // Sample data for long-term outcomes (3-5 years)
  const [longTermOutcomes, setLongTermOutcomes] = useState<Outcome[]>([
    {
      id: 'lto-001',
      title: 'Engineering teams will have a unified platform for measuring and improving delivery performance, enabling data-driven decisions across the organization',
      description: 'Create a centralized platform that provides engineering teams with metrics and insights to improve their delivery performance and make data-driven decisions.',
      metrics: [
        {
          name: 'Teams using platform',
          current: '0',
          target: '100',
          unit: '%',
          status: 'on-track'
        },
        {
          name: 'Data-driven decisions',
          current: '25',
          target: '90',
          unit: '%',
          status: 'on-track'
        },
        {
          name: 'Delivery performance improvement',
          current: '0',
          target: '30',
          unit: '%',
          status: 'on-track'
        }
      ],
      timeframe: 'long-term'
    },
    {
      id: 'lto-002',
      title: 'Product teams will have comprehensive user insights integrated into their workflow, resulting in features that better address customer needs',
      description: 'Integrate user research and feedback directly into the product development process to ensure features are aligned with actual customer needs and pain points.',
      metrics: [
        {
          name: 'Feature success rate',
          current: '65',
          target: '90',
          unit: '%',
          status: 'on-track'
        },
        {
          name: 'User satisfaction',
          current: '3.8',
          target: '4.5',
          unit: 'out of 5',
          status: 'on-track'
        },
        {
          name: 'Research-backed decisions',
          current: '40',
          target: '95',
          unit: '%',
          status: 'on-track'
        }
      ],
      timeframe: 'long-term'
    }
  ]);

  // Sample data for mid-term outcomes (12-18 months)
  const [midTermOutcomes, setMidTermOutcomes] = useState<Outcome[]>([
    {
      id: 'mto-001',
      title: 'Engineering Insights Platform',
      description: 'Build a platform that collects, analyzes, and visualizes engineering metrics to provide actionable insights for teams.',
      metrics: [
        {
          name: 'Data sources integrated',
          current: '2',
          target: '8',
          unit: 'sources',
          status: 'on-track'
        },
        {
          name: 'Metrics dashboard adoption',
          current: '15',
          target: '80',
          unit: '%',
          status: 'on-track'
        },
        {
          name: 'Automated insights generated',
          current: '5',
          target: '50',
          unit: 'per sprint',
          status: 'on-track'
        }
      ],
      timeframe: 'mid-term',
      parentOutcomeId: 'lto-001'
    },
    {
      id: 'mto-002',
      title: 'Cross-Team Collaboration Metrics',
      description: 'Develop metrics and tools to measure and improve collaboration between teams.',
      metrics: [
        {
          name: 'Cross-team dependencies',
          current: '45',
          target: '20',
          unit: 'per quarter',
          status: 'on-track'
        },
        {
          name: 'Shared planning sessions',
          current: '4',
          target: '12',
          unit: 'per quarter',
          status: 'on-track'
        },
        {
          name: 'Collaboration satisfaction',
          current: '3.2',
          target: '4.5',
          unit: 'out of 5',
          status: 'on-track'
        }
      ],
      timeframe: 'mid-term',
      parentOutcomeId: 'lto-001'
    },
    {
      id: 'mto-003',
      title: 'User Research Integration',
      description: 'Create a system to integrate user research findings directly into the product development process.',
      metrics: [
        {
          name: 'Research sessions',
          current: '8',
          target: '24',
          unit: 'per quarter',
          status: 'on-track'
        },
        {
          name: 'Research insights used',
          current: '30',
          target: '90',
          unit: '%',
          status: 'on-track'
        },
        {
          name: 'Time from insight to implementation',
          current: '45',
          target: '15',
          unit: 'days',
          status: 'on-track'
        }
      ],
      timeframe: 'mid-term',
      parentOutcomeId: 'lto-002'
    }
  ]);

  // New outcome template
  const newOutcomeTemplate = (timeframe: 'long-term' | 'mid-term'): Outcome => ({
    id: timeframe === 'long-term' ? `lto-${String(longTermOutcomes.length + 1).padStart(3, '0')}` : `mto-${String(midTermOutcomes.length + 1).padStart(3, '0')}`,
    title: '',
    description: '',
    metrics: [],
    timeframe: timeframe,
    parentOutcomeId: timeframe === 'mid-term' ? longTermOutcomes[0]?.id : undefined
  });

  // Handle adding a new outcome
  const handleAddOutcome = (timeframe: 'long-term' | 'mid-term') => {
    setEditingOutcome(newOutcomeTemplate(timeframe));
    setShowAddOutcomeModal(true);
  };

  // Handle editing an existing outcome
  const handleEditOutcome = (outcome: Outcome) => {
    setEditingOutcome({ ...outcome });
    setShowAddOutcomeModal(true);
  };

  // Handle deleting an outcome
  const handleDeleteOutcome = (outcome: Outcome) => {
    setOutcomeToDelete(outcome);
    setShowConfirmDelete(true);
  };

  // Confirm deletion of an outcome
  const confirmDeleteOutcome = () => {
    if (!outcomeToDelete) return;

    if (outcomeToDelete.timeframe === 'long-term') {
      // Also delete any mid-term outcomes that are linked to this long-term outcome
      const updatedMidTermOutcomes = midTermOutcomes.filter(
        mto => mto.parentOutcomeId !== outcomeToDelete.id
      );
      setMidTermOutcomes(updatedMidTermOutcomes);
      
      // Delete the long-term outcome
      setLongTermOutcomes(longTermOutcomes.filter(lto => lto.id !== outcomeToDelete.id));
    } else {
      // Delete just the mid-term outcome
      setMidTermOutcomes(midTermOutcomes.filter(mto => mto.id !== outcomeToDelete.id));
    }

    setShowConfirmDelete(false);
    setOutcomeToDelete(null);
  };

  // Handle saving an outcome (new or edited)
  const handleSaveOutcome = () => {
    if (!editingOutcome) return;

    // Validate outcome
    const validation = validateOutcome(editingOutcome.title);
    setValidationFeedback(validation);

    // Check if all validations pass
    if (!validation.who.valid || !validation.what.valid || !validation.why.valid) {
      // Allow saving anyway, but keep validation feedback visible
      console.log("Outcome has validation issues but saving anyway");
    }

    if (editingOutcome.timeframe === 'long-term') {
      // Check if this is a new outcome or an edit
      const existingIndex = longTermOutcomes.findIndex(lto => lto.id === editingOutcome.id);
      
      if (existingIndex >= 0) {
        // Update existing outcome
        const updatedOutcomes = [...longTermOutcomes];
        updatedOutcomes[existingIndex] = editingOutcome;
        setLongTermOutcomes(updatedOutcomes);
      } else {
        // Add new outcome
        setLongTermOutcomes([...longTermOutcomes, editingOutcome]);
      }
    } else {
      // Check if this is a new outcome or an edit
      const existingIndex = midTermOutcomes.findIndex(mto => mto.id === editingOutcome.id);
      
      if (existingIndex >= 0) {
        // Update existing outcome
        const updatedOutcomes = [...midTermOutcomes];
        updatedOutcomes[existingIndex] = editingOutcome;
        setMidTermOutcomes(updatedOutcomes);
      } else {
        // Add new outcome
        setMidTermOutcomes([...midTermOutcomes, editingOutcome]);
      }
    }

    setShowAddOutcomeModal(false);
    setEditingOutcome(null);
  };

  // Handle adding a metric to an outcome
  const handleAddMetric = () => {
    if (!editingOutcome) return;

    const newMetric: Metric = {
      name: '',
      current: '',
      target: '',
      unit: '',
      status: 'on-track'
    };

    setEditingOutcome({
      ...editingOutcome,
      metrics: [...editingOutcome.metrics, newMetric]
    });
  };

  // Handle updating a metric
  const handleUpdateMetric = (index: number, field: keyof Metric, value: string) => {
    if (!editingOutcome) return;

    const updatedMetrics = [...editingOutcome.metrics];
    updatedMetrics[index] = {
      ...updatedMetrics[index],
      [field]: value
    };

    setEditingOutcome({
      ...editingOutcome,
      metrics: updatedMetrics
    });
  };

  // Handle initiating metric deletion (show confirmation)
  const handleInitiateMetricDelete = (index: number) => {
    if (!editingOutcome) return;
    
    const metricName = editingOutcome.metrics[index].name || 'this measurement';
    setMetricToDelete({ index, name: metricName });
    setShowConfirmDeleteMetric(true);
  };

  // Handle confirming metric deletion
  const confirmDeleteMetric = () => {
    if (!editingOutcome || metricToDelete === null) return;

    const updatedMetrics = editingOutcome.metrics.filter((_, i) => i !== metricToDelete.index);
    
    setEditingOutcome({
      ...editingOutcome,
      metrics: updatedMetrics
    });

    setShowConfirmDeleteMetric(false);
    setMetricToDelete(null);
  };

  // Toggle expanded state for an outcome
  const toggleOutcomeExpanded = (id: string) => {
    if (expandedOutcomeId === id) {
      setExpandedOutcomeId(null);
    } else {
      setExpandedOutcomeId(id);
    }
  };

  // Validate outcome text
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

  // Handle outcome text change and validate
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

  // Get child outcomes for a given parent outcome
  const getChildOutcomes = (parentId: string) => {
    return midTermOutcomes.filter(outcome => outcome.parentOutcomeId === parentId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(teamId ? `/teams/${teamId}` : '/')} 
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Target className="h-6 w-6 mr-2 text-blue-500" />
                  Long & Mid-Term Outcomes
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Define and manage your team's long-term (3-5 years) and mid-term (12-18 months) outcomes
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="px-4 py-5 border-b border-gray-200">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Outcome Hierarchy</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Visualize how your outcomes align from long-term to mid-term
                </p>
              </div>
              <div className="p-4">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeSection === 'long-term' 
                        ? 'border-b-2 border-blue-500 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveSection('long-term')}
                  >
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Long-Term Outcomes (3-5 years)
                    </div>
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeSection === 'mid-term' 
                        ? 'border-b-2 border-blue-500 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveSection('mid-term')}
                  >
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Mid-Term Outcomes (12-18 months)
                    </div>
                  </button>
                </div>

                {/* Long-Term Outcomes Section */}
                {activeSection === 'long-term' && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Long-Term Outcomes</h3>
                      <button
                        onClick={() => handleAddOutcome('long-term')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Long-Term Outcome
                      </button>
                    </div>

                    {/* Long-Term Outcomes List */}
                    <div className="space-y-4">
                      {longTermOutcomes.length > 0 ? (
                        longTermOutcomes.map((outcome) => (
                          <div key={outcome.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="p-4 bg-white">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 
                                    className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                    onClick={() => toggleOutcomeExpanded(outcome.id)}
                                  >
                                    {outcome.title}
                                  </h4>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                  <button
                                    onClick={() => handleEditOutcome(outcome)}
                                    className="text-gray-400 hover:text-blue-600"
                                    aria-label="Edit outcome"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOutcome(outcome)}
                                    className="text-gray-400 hover:text-red-600"
                                    aria-label="Delete outcome"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => toggleOutcomeExpanded(outcome.id)}
                                    className="text-gray-500"
                                  >
                                    {expandedOutcomeId === outcome.id ? (
                                      <ChevronUp size={16} />
                                    ) : (
                                      <ChevronDown size={16} />
                                    )}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Expanded content with measurements */}
                              {expandedOutcomeId === outcome.id && (
                                <div className="mt-4">
                                  <p className="text-sm text-gray-600 mb-4">{outcome.description}</p>
                                  
                                  {/* Metrics */}
                                  <div className="mt-4">
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Measurements</h5>
                                    {outcome.metrics.length > 0 ? (
                                      <div className="bg-gray-50 rounded border border-gray-200 overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                          <thead className="bg-gray-50">
                                            <tr>
                                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Metric</th>
                                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Baseline</th>
                                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Target</th>
                                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                                            </tr>
                                          </thead>
                                          <tbody className="bg-white divide-y divide-gray-200">
                                            {outcome.metrics.map((metric, metricIndex) => (
                                              <tr key={metricIndex}>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{metric.name}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{metric.current}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{metric.target}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{metric.unit}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    metric.status === 'on-track' 
                                                      ? 'bg-green-100 text-green-800' 
                                                      : metric.status === 'at-risk' 
                                                        ? 'bg-yellow-100 text-yellow-800' 
                                                        : 'bg-red-100 text-red-800'
                                                  }`}>
                                                    {metric.status === 'on-track' ? 'On Track' : metric.status === 'at-risk' ? 'At Risk' : 'Off Track'}
                                                  </span>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500">No measurements defined</p>
                                    )}
                                  </div>
                                  
                                  {/* Related Mid-Term Outcomes */}
                                  <div className="mt-6">
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Related Mid-Term Outcomes</h5>
                                    {getChildOutcomes(outcome.id).length > 0 ? (
                                      <div className="space-y-2">
                                        {getChildOutcomes(outcome.id).map((childOutcome) => (
                                          <div key={childOutcome.id} className="bg-gray-50 border border-gray-200 rounded p-3">
                                            <h6 className="text-sm font-medium text-gray-900">{childOutcome.title}</h6>
                                            <p className="text-xs text-gray-600 mt-1">{childOutcome.description}</p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500">No mid-term outcomes linked to this long-term outcome</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                            <Target className="h-6 w-6 text-gray-600" />
                          </div>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No long-term outcomes yet</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Add your team's long-term outcomes (3-5 years).
                          </p>
                          <button
                            onClick={() => handleAddOutcome('long-term')}
                            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Plus size={16} className="mr-1" />
                            Add Long-Term Outcome
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mid-Term Outcomes Section */}
                {activeSection === 'mid-term' && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Mid-Term Outcomes</h3>
                      <button
                        onClick={() => handleAddOutcome('mid-term')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Mid-Term Outcome
                      </button>
                    </div>

                    {/* Mid-Term Outcomes List */}
                    <div className="space-y-4">
                      {midTermOutcomes.length > 0 ? (
                        midTermOutcomes.map((outcome) => {
                          // Find parent outcome
                          const parentOutcome = longTermOutcomes.find(lto => lto.id === outcome.parentOutcomeId);
                          
                          return (
                            <div key={outcome.id} className="border border-gray-200 rounded-lg overflow-hidden">
                              <div className="p-4 bg-white">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 
                                      className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                      onClick={() => toggleOutcomeExpanded(outcome.id)}
                                    >
                                      {outcome.title}
                                    </h4>
                                    {parentOutcome && (
                                      <div className="mt-1 flex items-center">
                                        <div className="bg-blue-100 rounded-full w-1.5 h-1.5 mr-2"></div>
                                        <span className="text-xs text-blue-700 font-medium">
                                          Aligns with long-term outcome: 
                                        </span>
                                        <span className="text-xs text-blue-700 ml-1">
                                          {parentOutcome.title.length > 60 
                                            ? `${parentOutcome.title.substring(0, 60)}...` 
                                            : parentOutcome.title}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex space-x-2 ml-4">
                                    <button
                                      onClick={() => handleEditOutcome(outcome)}
                                      className="text-gray-400 hover:text-blue-600"
                                      aria-label="Edit outcome"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteOutcome(outcome)}
                                      className="text-gray-400 hover:text-red-600"
                                      aria-label="Delete outcome"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => toggleOutcomeExpanded(outcome.id)}
                                      className="text-gray-500"
                                    >
                                      {expandedOutcomeId === outcome.id ? (
                                        <ChevronUp size={16} />
                                      ) : (
                                        <ChevronDown size={16} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Expanded content with measurements */}
                                {expandedOutcomeId === outcome.id && (
                                  <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-4">{outcome.description}</p>
                                    
                                    {/* Metrics */}
                                    <div className="mt-4">
                                      <h5 className="text-sm font-medium text-gray-700 mb-2">Measurements</h5>
                                      {outcome.metrics.length > 0 ? (
                                        <div className="bg-gray-50 rounded border border-gray-200 overflow-hidden">
                                          <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                              <tr>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Metric</th>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Baseline</th>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Target</th>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                                              </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                              {outcome.metrics.map((metric, metricIndex) => (
                                                <tr key={metricIndex}>
                                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{metric.name}</td>
                                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{metric.current}</td>
                                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{metric.target}</td>
                                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{metric.unit}</td>
                                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                      metric.status === 'on-track' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : metric.status === 'at-risk' 
                                                          ? 'bg-yellow-100 text-yellow-800' 
                                                          : 'bg-red-100 text-red-800'
                                                    }`}>
                                                      {metric.status === 'on-track' ? 'On Track' : metric.status === 'at-risk' ? 'At Risk' : 'Off Track'}
                                                    </span>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-500">No measurements defined</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                            <Target className="h-6 w-6 text-gray-600" />
                          </div>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No mid-term outcomes yet</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Add your team's mid-term outcomes (12-18 months).
                          </p>
                          <button
                            onClick={() => handleAddOutcome('mid-term')}
                            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Plus size={16} className="mr-1" />
                            Add Mid-Term Outcome
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-5 border-b border-gray-200">
                <div className="flex items-center">
                  <RefreshCw className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Outcome Best Practices</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Guidelines for creating effective outcomes
                </p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Outcome Structure</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Well-structured outcomes follow this pattern:
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-800">
                        <span className="text-blue-600">[Who]</span> will <span className="text-green-600">[What]</span>, <span className="text-purple-600">[Why]</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Example: "Engineering teams will have access to standardized metrics dashboards, enabling data-driven decisions that improve delivery performance"
                      </p>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">1</span>
                          </div>
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">Who</p>
                          <p className="text-xs text-gray-500">Clearly identify who will be impacted by the outcome</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-green-600">2</span>
                          </div>
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">What</p>
                          <p className="text-xs text-gray-500">Describe what will change or be achieved</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="h-4 w-4 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-purple-600">3</span>
                          </div>
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">Why</p>
                          <p className="text-xs text-gray-500">Explain why this matters and the impact it will have</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Effective Measurements</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Good outcome measurements should be:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span><span className="font-medium">Specific:</span> Clear and precise about what is being measured</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span><span className="font-medium">Measurable:</span> Quantifiable with a clear baseline and target</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span><span className="font-medium">Relevant:</span> Directly tied to the outcome being measured</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span><span className="font-medium">Time-bound:</span> Measured within a specific timeframe</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span><span className="font-medium">Actionable:</span> Provides insights that can drive decisions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <AIAssistant />

      {/* Add/Edit Outcome Modal */}
      {showAddOutcomeModal && editingOutcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingOutcome.id.includes('new') ? 'Add New Outcome' : 'Edit Outcome'}
              </h3>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Outcome Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Outcome Type
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="long-term"
                      name="outcome-type"
                      checked={editingOutcome.timeframe === 'long-term'}
                      onChange={() => setEditingOutcome({...editingOutcome, timeframe: 'long-term'})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="long-term" className="ml-2 text-sm text-gray-700">
                      Long-Term (3-5 years)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="mid-term"
                      name="outcome-type"
                      checked={editingOutcome.timeframe === 'mid-term'}
                      onChange={() => setEditingOutcome({...editingOutcome, timeframe: 'mid-term'})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="mid-term" className="ml-2 text-sm text-gray-700">
                      Mid-Term (12-18 months)
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Parent Outcome Selection (only for mid-term outcomes) */}
              {editingOutcome.timeframe === 'mid-term' && (
                <div>
                  <label htmlFor="parent-outcome" className="block text-sm font-medium text-gray-700 mb-1">
                    Aligned Long-Term Outcome <span className="text-red-500">*</span>
                  </label>
                  <select 
                    id="parent-outcome"
                    value={editingOutcome.parentOutcomeId || ''}
                    onChange={(e) => setEditingOutcome({...editingOutcome, parentOutcomeId: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>Select a long-term outcome</option>
                    {longTermOutcomes.map((lto) => (
                      <option key={lto.id} value={lto.id}>
                        {lto.title.length > 60 ? `${lto.title.substring(0, 60)}...` : lto.title}
                      </option>
                    ))}
                  </select>
                  {longTermOutcomes.length === 0 && (
                    <p className="mt-1 text-xs text-red-500">
                      You need to create at least one long-term outcome first.
                    </p>
                  )}
                </div>
              )}
              
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
                  onChange={(e) => setEditingOutcome({...editingOutcome, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Provide additional context about this outcome"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Measurements
                  </label>
                  <button
                    onClick={handleAddMetric}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 hover:bg-blue-50"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Measurement
                  </button>
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
                              Value the team aims to achieve by the end of the timeframe
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
                              type="text"
                              value={metric.current}
                              onChange={(e) => handleUpdateMetric(index, 'current', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="text"
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
                              onClick={() => handleInitiateMetricDelete(index)}
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
            </div>
            
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddOutcomeModal(false);
                  setEditingOutcome(null);
                }}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOutcome}
                disabled={editingOutcome.timeframe === 'mid-term' && !editingOutcome.parentOutcomeId}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  editingOutcome.timeframe === 'mid-term' && !editingOutcome.parentOutcomeId
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Save Outcome
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Outcome Modal */}
      {showConfirmDelete && outcomeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm text-gray-600">
                {outcomeToDelete.timeframe === 'long-term' 
                  ? `Are you sure you want to delete this long-term outcome? This will also delete any mid-term outcomes linked to it.`
                  : `Are you sure you want to delete this mid-term outcome?`}
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">{outcomeToDelete.title}</p>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setOutcomeToDelete(null);
                }}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOutcome}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Metric Modal */}
      {showConfirmDeleteMetric && metricToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete Measurement</h3>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this measurement?
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {metricToDelete.name || 'Unnamed measurement'}
              </p>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowConfirmDeleteMetric(false);
                  setMetricToDelete(null);
                }}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMetric}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LongMidTermOutcomes;
