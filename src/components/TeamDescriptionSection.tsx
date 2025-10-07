import React from 'react';
import { Target, Settings } from 'lucide-react';

const TeamDescriptionSection: React.FC = () => {
  return (
    <section id="team-description-section" className="bg-white rounded-lg shadow mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Team Description</h2>
        <p className="mt-1 text-sm text-gray-500">
          Overview of our team's mission and focus
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Team Mission</h3>
              <p className="mt-1 text-sm text-gray-500">
                To build and maintain a comprehensive engineering metrics platform that enables data-driven decision making, 
                improves engineering productivity, and provides visibility into the software development lifecycle across the organization.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Settings className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Core Capabilities</h3>
              <ul className="mt-1 text-sm text-gray-500 list-disc list-inside space-y-1">
                <li>Data integration from engineering tools and systems</li>
                <li>DORA and engineering productivity metrics</li>
                <li>Analytics dashboards and visualization</li>
                <li>Cross-team collaboration insights</li>
                <li>Predictive analytics for engineering performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamDescriptionSection;
