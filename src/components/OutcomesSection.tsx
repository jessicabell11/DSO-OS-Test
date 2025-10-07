import React, { useState } from 'react';
import { OutcomeData } from '../types';

interface OutcomesSectionProps {
  outcomes: OutcomeData;
}

const OutcomesSection: React.FC<OutcomesSectionProps> = ({ outcomes }) => {
  const [activeTab, setActiveTab] = useState('short-term');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'off-track':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="outcomes-section" className="bg-white rounded-lg shadow mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Outcomes</h2>
        <p className="mt-1 text-sm text-gray-500">
          Key outcomes and measurements we're working towards
        </p>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('short-term')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'short-term'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Short-term (90 days)
          </button>
          <button
            onClick={() => setActiveTab('mid-term')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'mid-term'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mid-term (1-2 years)
          </button>
          <button
            onClick={() => setActiveTab('long-term')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'long-term'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Long-term (3-5 years)
          </button>
        </nav>
      </div>
      
      <div className="p-4">
        {activeTab === 'short-term' && (
          <div className="space-y-6">
            {outcomes.shortTerm.map((outcome, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900">{outcome.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{outcome.description}</p>
                <div className="mt-4 space-y-3">
                  {outcome.metrics.map((metric, mIndex) => (
                    <div key={mIndex} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{metric.name}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">Target: {metric.target}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="text-xs text-gray-500">Current: {metric.current}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                        {metric.status === 'on-track' ? 'On Track' : metric.status === 'at-risk' ? 'At Risk' : 'Off Track'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'mid-term' && (
          <div className="space-y-6">
            {outcomes.midTerm.map((outcome, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900">{outcome.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{outcome.description}</p>
                <div className="mt-4 space-y-3">
                  {outcome.metrics.map((metric, mIndex) => (
                    <div key={mIndex} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{metric.name}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">Target: {metric.target}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="text-xs text-gray-500">Current: {metric.current}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                        {metric.status === 'on-track' ? 'On Track' : metric.status === 'at-risk' ? 'At Risk' : 'Off Track'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'long-term' && (
          <div className="space-y-6">
            {outcomes.longTerm.map((outcome, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900">{outcome.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{outcome.description}</p>
                <div className="mt-4 space-y-3">
                  {outcome.metrics.map((metric, mIndex) => (
                    <div key={mIndex} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{metric.name}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">Target: {metric.target}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="text-xs text-gray-500">Current: {metric.current}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                        {metric.status === 'on-track' ? 'On Track' : metric.status === 'at-risk' ? 'At Risk' : 'Off Track'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OutcomesSection;
