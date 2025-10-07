import React from 'react';
import { CheckCircle, ArrowLeft, Calendar, Target, ListTodo, Users } from 'lucide-react';
import { Outcome, BacklogItem, RelatedTeam } from '../../types';
import { relatedTeamsData } from '../../data/relatedTeamsData';

interface PlanSummaryStepProps {
  shortTermOutcomes: Outcome[];
  upcomingCycleItems: BacklogItem[];
  selectedTeams?: string[]; // New prop for selected teams
  onBack: () => void;
  onFinalize: () => void;
}

const PlanSummaryStep: React.FC<PlanSummaryStepProps> = ({
  shortTermOutcomes,
  upcomingCycleItems,
  selectedTeams = [], // Default to empty array if not provided
  onBack,
  onFinalize
}) => {
  // Get the upcoming quarter and year for naming
  const getUpcomingQuarter = () => {
    const now = new Date();
    let quarter = Math.floor(now.getMonth() / 3) + 1;
    let year = now.getFullYear();
    
    // Get next quarter
    quarter += 1;
    if (quarter > 4) {
      quarter = 1;
      year += 1;
    }
    
    return `Q${quarter} ${year}`;
  };
  
  const upcomingQuarter = getUpcomingQuarter();
  
  // Calculate start and end dates for the upcoming quarter
  const getQuarterDates = () => {
    const now = new Date();
    let quarter = Math.floor(now.getMonth() / 3) + 1;
    let year = now.getFullYear();
    
    // Get next quarter
    quarter += 1;
    if (quarter > 4) {
      quarter = 1;
      year += 1;
    }
    
    const startMonth = (quarter - 1) * 3;
    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, startMonth + 3, 0);
    
    return {
      start: startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      end: endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
  };
  
  const quarterDates = getQuarterDates();
  
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

  // Get selected team details
  const selectedTeamDetails = relatedTeamsData.filter(team => selectedTeams.includes(team.id));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
            Step 5: Review & Finalize Your 90-Day Cycle Plan
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review your plan for the upcoming 90-day cycle and finalize it
          </p>
        </div>
        
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-md font-medium text-blue-800">{upcomingQuarter} Cycle Plan</h3>
              </div>
              <p className="mt-1 text-sm text-blue-600">
                {quarterDates.start} - {quarterDates.end}
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Outcomes Summary */}
              <div>
                <div className="flex items-center mb-4">
                  <Target className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-md font-medium text-gray-900">Short-Term Outcomes</h3>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {shortTermOutcomes.map((outcome, index) => (
                      <li key={index} className="p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                              {index + 1}
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">{outcome.title}</p>
                            <p className="mt-1 text-sm text-gray-500">{outcome.description}</p>
                            
                            {outcome.metrics.length > 0 && (
                              <div className="mt-2">
                                <h4 className="text-xs font-medium text-gray-700 mb-1">Key Measurements:</h4>
                                <ul className="space-y-1">
                                  {outcome.metrics.map((metric, mIndex) => (
                                    <li key={mIndex} className="text-xs text-gray-600">
                                      • {metric.name}: {metric.target} (currently {metric.current})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Backlog Summary */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <ListTodo className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-md font-medium text-gray-900">{upcomingQuarter} Backlog Items</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {upcomingCycleItems.length} items
                  </span>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {upcomingCycleItems.map((item, index) => (
                      <li key={item.id} className="p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-medium">
                              {index + 1}
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">{item.title}</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                            
                            <div className="mt-2 flex items-center space-x-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Effort: {item.effort}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Impact: {item.impact}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Team Connections Summary - Enhanced with selected teams */}
              <div>
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-md font-medium text-gray-900">Team Connections</h3>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  {selectedTeamDetails.length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        You've selected the following teams to collaborate with during this cycle:
                      </p>
                      <div className="space-y-4">
                        {selectedTeamDetails.map(team => (
                          <div key={team.id} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-shrink-0 mr-3">
                              <img 
                                src={team.logo} 
                                alt={`${team.name} logo`}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900">{team.name}</h4>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                                  {team.relationshipType === 'outcome' ? 'Outcome Alignment' : 
                                   team.relationshipType === 'backlog' ? 'Backlog Synergy' :
                                   team.relationshipType === 'capability' ? 'Capability Provider' : 'Multiple Connections'}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-gray-500">{team.description}</p>
                              <div className="mt-2 flex items-center">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full overflow-hidden mr-2">
                                  <img 
                                    src={team.contactPerson.avatar} 
                                    alt={team.contactPerson.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="text-xs text-gray-600">
                                  Contact: {team.contactPerson.name}, {team.contactPerson.role}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      No teams have been selected for collaboration in this cycle. Consider connecting with relevant teams to help achieve your outcomes.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Next Steps */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-2">Next Steps</h3>
                <p className="text-sm text-gray-600">
                  After finalizing your 90-day cycle plan, you should:
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Share the plan with your team and stakeholders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Break down backlog items into smaller tasks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Set up regular check-ins to track progress against outcomes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Schedule mid-cycle review to assess progress and make adjustments</span>
                  </li>
                  {selectedTeamDetails.length > 0 && (
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm text-gray-600">Reach out to connected teams to establish collaboration</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Team Connections
              </button>
              <button
                onClick={onFinalize}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Finalize 90-Day Cycle Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSummaryStep;
