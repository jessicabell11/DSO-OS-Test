import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Users, CheckCircle, X } from 'lucide-react';
import { RelatedTeam, BacklogItem, Outcome } from '../../types';
import { relatedTeamsData } from '../../data/relatedTeamsData';

interface TeamConnectionsStepProps {
  shortTermOutcomes: Outcome[];
  upcomingCycleItems: BacklogItem[];
  selectedTeams: string[];
  setSelectedTeams: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  onBack: () => void;
}

const TeamConnectionsStep: React.FC<TeamConnectionsStepProps> = ({
  shortTermOutcomes,
  upcomingCycleItems,
  selectedTeams,
  setSelectedTeams,
  onNext,
  onBack
}) => {
  const [recommendedTeams, setRecommendedTeams] = useState<RelatedTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate AI recommendation process
  useEffect(() => {
    const simulateAIRecommendations = () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Filter teams based on relationship to outcomes and backlog
        const filteredTeams = relatedTeamsData.filter(team => {
          // Check for outcome relationships
          const hasRelatedOutcomes = team.sharedOutcomes.some(outcome => 
            shortTermOutcomes.some(teamOutcome => 
              teamOutcome.title.toLowerCase().includes(outcome.toLowerCase()) ||
              outcome.toLowerCase().includes(teamOutcome.title.toLowerCase())
            )
          );
          
          // Check for backlog relationships
          const hasRelatedBacklog = upcomingCycleItems.some(item => 
            team.capabilities.some(capability => 
              item.title.toLowerCase().includes(capability.toLowerCase()) ||
              item.description.toLowerCase().includes(capability.toLowerCase())
            )
          );
          
          return hasRelatedOutcomes || hasRelatedBacklog;
        });
        
        setRecommendedTeams(filteredTeams.length > 0 ? filteredTeams : relatedTeamsData.slice(0, 3));
        setIsLoading(false);
      }, 1500);
    };
    
    simulateAIRecommendations();
  }, [shortTermOutcomes, upcomingCycleItems]);

  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId) 
        : [...prev, teamId]
    );
  };

  const getRelationshipTypeLabel = (type: string) => {
    switch (type) {
      case 'outcome':
        return 'Outcome Alignment';
      case 'backlog':
        return 'Backlog Synergy';
      case 'capability':
        return 'Capability Provider';
      case 'multiple':
        return 'Multiple Connections';
      default:
        return 'Related Team';
    }
  };

  const getRelationshipStrengthClass = (strength: string) => {
    switch (strength) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityClass = (capacity: string) => {
    switch (capacity) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'none':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Step 4: Team Connections
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Discover and connect with teams that can help achieve your outcomes
          </p>
        </div>
        
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-md font-medium text-blue-800 mb-2">Why Connect with Other Teams?</h3>
              <p className="text-sm text-blue-600">
                Collaborating with other teams can accelerate your progress, provide access to specialized capabilities, 
                and help align work across the organization. Our AI has analyzed your outcomes and backlog to recommend 
                teams that could be valuable partners for your upcoming cycle.
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Analyzing team connections...</p>
                <p className="text-sm text-gray-500 mt-2">Our AI is finding the best teams to help achieve your outcomes</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Recommended Team Connections</h3>
                
                {recommendedTeams.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-gray-600">No team connections found</p>
                    <p className="text-sm text-gray-500 mt-2">Try adjusting your outcomes or backlog items</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {recommendedTeams.map(team => (
                      <div 
                        key={team.id} 
                        className={`border rounded-lg overflow-hidden transition-all ${
                          selectedTeams.includes(team.id) 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex justify-between items-center p-4 bg-white">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden">
                              <img 
                                src={team.logo} 
                                alt={`${team.name} logo`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-medium text-gray-900">{team.name}</h4>
                              <p className="text-sm text-gray-500">{team.description}</p>
                            </div>
                          </div>
                          
                          <div>
                            <button
                              onClick={() => toggleTeamSelection(team.id)}
                              className={`p-2 rounded-full ${
                                selectedTeams.includes(team.id)
                                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {selectedTeams.includes(team.id) ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <Users className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <div className="flex items-center mb-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationshipStrengthClass(team.relationshipStrength)} mr-2`}>
                                  {team.relationshipStrength} match
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {getRelationshipTypeLabel(team.relationshipType)}
                                </span>
                              </div>
                              
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Shared Outcomes</h5>
                              <ul className="space-y-1 mb-4">
                                {team.sharedOutcomes.map((outcome, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    {outcome}
                                  </li>
                                ))}
                              </ul>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Capacity</h5>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCapacityClass(team.capacity)}`}>
                                    {team.capacity} availability
                                  </span>
                                </div>
                                
                                <div className="text-right">
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Last Collaboration</h5>
                                  <span className="text-sm text-gray-600">
                                    {new Date(team.lastCollaboration).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Key Capabilities</h5>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {team.capabilities.map((capability, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                    {capability}
                                  </span>
                                ))}
                              </div>
                              
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Upcoming Milestones</h5>
                              <ul className="space-y-1 mb-4">
                                {team.upcomingMilestones.map((milestone, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    {milestone}
                                  </li>
                                ))}
                              </ul>
                              
                              <div className="flex items-center mt-2">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden">
                                  <img 
                                    src={team.contactPerson.avatar} 
                                    alt={team.contactPerson.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{team.contactPerson.name}</p>
                                  <p className="text-xs text-gray-500">{team.contactPerson.role}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium text-gray-900">Selected Teams</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''} selected for collaboration
                      </p>
                    </div>
                    
                    {selectedTeams.length > 0 && (
                      <button
                        onClick={() => setSelectedTeams([])}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  
                  {selectedTeams.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No teams selected yet</p>
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedTeams.map(teamId => {
                        const team = recommendedTeams.find(t => t.id === teamId);
                        return team ? (
                          <div 
                            key={teamId}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            <img 
                              src={team.logo} 
                              alt={`${team.name} logo`}
                              className="h-5 w-5 rounded-full mr-2 object-cover"
                            />
                            {team.name}
                            <button
                              onClick={() => toggleTeamSelection(teamId)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Backlog Planning
          </button>
          <button
            onClick={onNext}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue to Review & Finalize
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamConnectionsStep;
