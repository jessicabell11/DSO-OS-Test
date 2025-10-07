import React, { useState } from 'react';
import { Users, ExternalLink, MessageSquare, Calendar, Award, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { RelatedTeam } from '../types';
import TeamAIAssistantModal from './TeamAIAssistantModal';

interface RelatedTeamsSectionProps {
  relatedTeams: RelatedTeam[];
}

const RelatedTeamsSection: React.FC<RelatedTeamsSectionProps> = ({ relatedTeams }) => {
  const [activeTeam, setActiveTeam] = useState<RelatedTeam | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'outcome' | 'capability' | 'backlog'>('all');

  const filteredTeams = relatedTeams.filter(team => 
    filter === 'all' || team.relationshipType === filter || team.relationshipType === 'multiple'
  );

  const getRelationshipTypeLabel = (type: string) => {
    switch (type) {
      case 'outcome':
        return 'Shared Outcomes';
      case 'capability':
        return 'Provides Capabilities';
      case 'backlog':
        return 'Related Backlog Items';
      case 'multiple':
        return 'Multiple Relationships';
      default:
        return type;
    }
  };

  const getRelationshipTypeIcon = (type: string) => {
    switch (type) {
      case 'outcome':
        return <Award size={16} className="text-purple-500" />;
      case 'capability':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'backlog':
        return <Clock size={16} className="text-blue-500" />;
      case 'multiple':
        return <Users size={16} className="text-indigo-500" />;
      default:
        return null;
    }
  };

  const getRelationshipStrengthColor = (strength: string) => {
    switch (strength) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityIcon = (capacity: string) => {
    switch (capacity) {
      case 'high':
        return <div className="w-2 h-6 bg-green-500 rounded-sm mr-1"></div>;
      case 'medium':
        return <div className="w-2 h-4 bg-yellow-500 rounded-sm mr-1"></div>;
      case 'low':
        return <div className="w-2 h-2 bg-orange-500 rounded-sm mr-1"></div>;
      case 'none':
        return <div className="w-2 h-2 bg-red-500 rounded-sm mr-1"></div>;
      default:
        return null;
    }
  };

  const getCapacityLabel = (capacity: string) => {
    switch (capacity) {
      case 'high':
        return 'High Capacity';
      case 'medium':
        return 'Medium Capacity';
      case 'low':
        return 'Low Capacity';
      case 'none':
        return 'No Capacity';
      default:
        return capacity;
    }
  };

  const getCapacityColor = (capacity: string) => {
    switch (capacity) {
      case 'high':
        return 'text-green-700';
      case 'medium':
        return 'text-yellow-700';
      case 'low':
        return 'text-orange-700';
      case 'none':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const handleOpenAIAssistant = (team: RelatedTeam) => {
    setActiveTeam(team);
    setShowAIModal(true);
  };

  return (
    <section id="related-teams-section" className="bg-white rounded-lg shadow mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Related Teams</h2>
        <p className="mt-1 text-sm text-gray-500">
          Teams with related outcomes, capabilities, or backlog items that could help achieve our goals
        </p>
      </div>

      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Relationships
          </button>
          <button
            onClick={() => setFilter('outcome')}
            className={`px-3 py-1 text-xs font-medium rounded-md flex items-center ${
              filter === 'outcome'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Award size={14} className="mr-1" />
            Shared Outcomes
          </button>
          <button
            onClick={() => setFilter('capability')}
            className={`px-3 py-1 text-xs font-medium rounded-md flex items-center ${
              filter === 'capability'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckCircle size={14} className="mr-1" />
            Provides Capabilities
          </button>
          <button
            onClick={() => setFilter('backlog')}
            className={`px-3 py-1 text-xs font-medium rounded-md flex items-center ${
              filter === 'backlog'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock size={14} className="mr-1" />
            Related Backlog
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeams.map((team) => (
            <div key={team.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-32 bg-gray-200 relative">
                <img 
                  src={team.logo} 
                  alt={`${team.name} logo`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-lg font-medium">{team.name}</h3>
                    <div className="flex items-center mt-1">
                      {getRelationshipTypeIcon(team.relationshipType)}
                      <span className="text-xs ml-1">
                        {getRelationshipTypeLabel(team.relationshipType)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">{team.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationshipStrengthColor(team.relationshipStrength)}`}>
                    {team.relationshipStrength === 'high' ? 'Strong Relationship' : 
                     team.relationshipStrength === 'medium' ? 'Medium Relationship' : 'Light Relationship'}
                  </span>
                  
                  <div className="flex items-center">
                    {getCapacityIcon(team.capacity)}
                    <span className={`text-xs ${getCapacityColor(team.capacity)}`}>
                      {getCapacityLabel(team.capacity)}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Key Capabilities</h4>
                  <div className="flex flex-wrap gap-1">
                    {team.capabilities.slice(0, 3).map((capability, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {capability}
                      </span>
                    ))}
                    {team.capabilities.length > 3 && (
                      <span className="inline-flex items-center bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{team.capabilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                {team.upcomingMilestones && team.upcomingMilestones.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Upcoming Milestones</h4>
                    <ul className="text-xs text-gray-600">
                      {team.upcomingMilestones.map((milestone, index) => (
                        <li key={index} className="flex items-start mb-1">
                          <Calendar size={12} className="mr-1 mt-0.5 text-gray-400" />
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    <img 
                      src={team.contactPerson.avatar} 
                      alt={team.contactPerson.name} 
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{team.contactPerson.name}</p>
                      <p className="text-xs text-gray-500">{team.contactPerson.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <button 
                      onClick={() => handleOpenAIAssistant(team)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      title="Chat with team AI assistant"
                    >
                      <MessageSquare size={18} />
                    </button>
                    <a 
                      href={`mailto:${team.contactPerson.email}`}
                      className="text-gray-600 hover:text-gray-800"
                      title="Contact team lead"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAIModal && activeTeam && (
        <TeamAIAssistantModal 
          team={activeTeam} 
          onClose={() => setShowAIModal(false)} 
        />
      )}
    </section>
  );
};

export default RelatedTeamsSection;
