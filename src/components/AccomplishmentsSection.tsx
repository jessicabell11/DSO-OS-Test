import React, { useState } from 'react';
import { Calendar, Award, Lightbulb } from 'lucide-react';
import { AccomplishmentData } from '../types';

interface AccomplishmentsSectionProps {
  accomplishments: AccomplishmentData[];
}

const AccomplishmentsSection: React.FC<AccomplishmentsSectionProps> = ({ accomplishments }) => {
  const [filter, setFilter] = useState<'all' | 'accomplishment' | 'learning'>('all');
  
  const filteredAccomplishments = accomplishments.filter(item => 
    filter === 'all' || item.type === filter
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <section id="accomplishments-section" className="bg-white rounded-lg shadow mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Accomplishments & Learnings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Recent achievements and key learnings from our team
        </p>
      </div>
      
      <div className="border-b border-gray-200 px-4 py-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('accomplishment')}
            className={`px-3 py-1 text-sm font-medium rounded-md flex items-center ${
              filter === 'accomplishment'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Award size={16} className="mr-1" />
            Accomplishments
          </button>
          <button
            onClick={() => setFilter('learning')}
            className={`px-3 py-1 text-sm font-medium rounded-md flex items-center ${
              filter === 'learning'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Lightbulb size={16} className="mr-1" />
            Learnings
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {filteredAccomplishments.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className={`p-2 rounded-md mr-3 ${
                  item.type === 'accomplishment' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {item.type === 'accomplishment' ? 
                    <Award size={20} className="text-green-600" /> : 
                    <Lightbulb size={20} className="text-blue-600" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(item.date)}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700">Impact:</h4>
                    <p className="text-sm text-gray-600">{item.impact}</p>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700">Teams Involved:</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.team.map((team, tIndex) => (
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
    </section>
  );
};

export default AccomplishmentsSection;
