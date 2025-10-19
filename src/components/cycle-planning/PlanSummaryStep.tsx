import React from 'react';
import { ArrowLeft, CheckCircle, Calendar, Target, Users, ListTodo } from 'lucide-react';
import { BacklogItem, Outcome } from '../../types';

interface PlanSummaryStepProps {
  shortTermOutcomes: Outcome[];
  upcomingCycleItems: BacklogItem[];
  selectedTeams: string[];
  onBack: () => void;
  onFinalize: () => void;
  upcomingQuarter?: string; // Make this prop optional with a default value
}

const PlanSummaryStep: React.FC<PlanSummaryStepProps> = ({
  shortTermOutcomes,
  upcomingCycleItems,
  selectedTeams,
  onBack,
  onFinalize,
  upcomingQuarter = "Q4 2025" // Default value if not provided
}) => {
  // Calculate total story points
  const totalStoryPoints = upcomingCycleItems.reduce((total, item) => total + (item.estimate || 0), 0);
  
  // Count epics and features
  const epicCount = upcomingCycleItems.filter(item => item.workPackageType === 'epic').length;
  const featureCount = upcomingCycleItems.filter(item => item.workPackageType === 'feature').length;
  
  // Group items by priority
  const highPriorityItems = upcomingCycleItems.filter(item => item.priority === 'high');
  const mediumPriorityItems = upcomingCycleItems.filter(item => item.priority === 'medium');
  const lowPriorityItems = upcomingCycleItems.filter(item => item.priority === 'low');
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
            Step 5: Review & Finalize Your Plan
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review your 90-day cycle plan before finalizing
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              {upcomingQuarter} Cycle Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Work Packages</h4>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-blue-900">{upcomingCycleItems.length}</span>
                  <span className="ml-2 text-sm text-blue-700">total items</span>
                </div>
                <div className="mt-2 text-xs text-blue-700">
                  <div className="flex justify-between">
                    <span>Epics:</span>
                    <span className="font-medium">{epicCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Features:</span>
                    <span className="font-medium">{featureCount}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-1">Story Points</h4>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-green-900">{totalStoryPoints}</span>
                  <span className="ml-2 text-sm text-green-700">total points</span>
                </div>
                <div className="mt-2 text-xs text-green-700">
                  <div className="flex justify-between">
                    <span>Avg per item:</span>
                    <span className="font-medium">
                      {upcomingCycleItems.length > 0 
                        ? (totalStoryPoints / upcomingCycleItems.length).toFixed(1) 
                        : '0'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-800 mb-1">Priority Breakdown</h4>
                <div className="mt-2 text-xs text-purple-700">
                  <div className="flex justify-between">
                    <span>High Priority:</span>
                    <span className="font-medium">{highPriorityItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Priority:</span>
                    <span className="font-medium">{mediumPriorityItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Priority:</span>
                    <span className="font-medium">{lowPriorityItems.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Target className="h-4 w-4 mr-2 text-blue-500" />
              Short-Term Outcomes
            </h3>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {shortTermOutcomes.map((outcome, index) => (
                  <li key={index} className="p-4">
                    <h4 className="text-sm font-medium text-gray-900">{outcome}</h4>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <ListTodo className="h-4 w-4 mr-2 text-blue-500" />
              Backlog Items
            </h3>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {upcomingCycleItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.workPackageType === 'epic' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.workPackageType === 'epic' ? 'Epic' : 'Feature'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.priority === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : item.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {item.estimate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Connected Teams
            </h3>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              {selectedTeams.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedTeams.map((team, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {team}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No teams connected to this cycle plan.</p>
              )}
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
              Finalize {upcomingQuarter} Plan
              <CheckCircle className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSummaryStep;
