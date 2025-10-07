import React, { useState } from 'react';
import { Calendar, Package, Zap, Bug } from 'lucide-react';
import { ReleaseNote } from '../types';

interface ReleaseNotesSectionProps {
  releaseNotes: ReleaseNote[];
}

const ReleaseNotesSection: React.FC<ReleaseNotesSectionProps> = ({ releaseNotes }) => {
  const [expandedSprint, setExpandedSprint] = useState<number | null>(releaseNotes[0]?.sprintNumber || null);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getFeatureIcon = (type: 'feature' | 'enhancement' | 'bugfix') => {
    switch (type) {
      case 'feature':
        return <Package size={20} className="text-green-600" />;
      case 'enhancement':
        return <Zap size={20} className="text-blue-600" />;
      case 'bugfix':
        return <Bug size={20} className="text-amber-600" />;
    }
  };

  const getFeatureTypeLabel = (type: 'feature' | 'enhancement' | 'bugfix') => {
    switch (type) {
      case 'feature':
        return 'New Feature';
      case 'enhancement':
        return 'Enhancement';
      case 'bugfix':
        return 'Bug Fix';
    }
  };

  const getFeatureTypeColor = (type: 'feature' | 'enhancement' | 'bugfix') => {
    switch (type) {
      case 'feature':
        return 'bg-green-100';
      case 'enhancement':
        return 'bg-blue-100';
      case 'bugfix':
        return 'bg-amber-100';
    }
  };

  return (
    <section id="release-notes-section" className="bg-white rounded-lg shadow mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Release Notes</h2>
        <p className="mt-1 text-sm text-gray-500">
          Features and functionality shipped in each Sprint within the current 90-day cycle
        </p>
      </div>
      
      <div className="p-4">
        <div className="space-y-6">
          {releaseNotes.map((sprint) => (
            <div key={sprint.sprintNumber} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className={`px-4 py-3 flex justify-between items-center cursor-pointer ${
                  expandedSprint === sprint.sprintNumber ? 'bg-gray-50' : 'bg-white'
                }`}
                onClick={() => setExpandedSprint(expandedSprint === sprint.sprintNumber ? null : sprint.sprintNumber)}
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#de0043] text-white mr-3">
                    {sprint.sprintNumber}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{sprint.sprintName}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      Released: {formatDate(sprint.releaseDate)}
                    </div>
                  </div>
                </div>
                <div>
                  <svg 
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      expandedSprint === sprint.sprintNumber ? 'rotate-180' : ''
                    }`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {expandedSprint === sprint.sprintNumber && (
                <div className="px-4 py-3 border-t border-gray-200">
                  <div className="space-y-4">
                    {sprint.features.map((feature, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className={`p-2 rounded-md mr-3 ${getFeatureTypeColor(feature.type)}`}>
                            {getFeatureIcon(feature.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                                <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                                  feature.type === 'feature' ? 'bg-green-100 text-green-800' : 
                                  feature.type === 'enhancement' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {getFeatureTypeLabel(feature.type)}
                                </span>
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                            
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700">Impact & Value:</h4>
                              <p className="text-sm text-gray-600">{feature.impact}</p>
                            </div>
                            
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700">Teams Involved:</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {feature.team.map((team, tIndex) => (
                                  <span 
                                    key={tIndex} 
                                    className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {team}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReleaseNotesSection;
