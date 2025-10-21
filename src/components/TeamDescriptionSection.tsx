import React from 'react';
import { Calendar, Clock, Users, Briefcase, BarChart, Activity, Layers, Building } from 'lucide-react';
import { Team } from '../types';
import { allBusinessCapabilities } from '../data/businessCapabilitiesData';
import { getPlatformColor } from '../data/platformsData';

interface TeamDescriptionSectionProps {
  team?: Team;
}

const TeamDescriptionSection: React.FC<TeamDescriptionSectionProps> = ({ team }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getCapabilityNames = (capabilityIds: string[] = []) => {
    return capabilityIds
      .map(id => allBusinessCapabilities.find(cap => cap.id === id))
      .filter(cap => cap !== undefined)
      .map(cap => cap?.name);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Team Description</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Overview and key information about the team
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="prose max-w-none text-gray-700">
          <p>{team?.description || "The Accelerator Team is focused on driving innovation and accelerating digital transformation across the organization. We work on high-impact projects that help teams adopt modern engineering practices and deliver value faster."}</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-2">Team Information</h4>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(team?.createdAt)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(team?.updatedAt)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    Team Size
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{team?.members?.length || 0} members</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                    Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      team?.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : team?.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {team?.status?.charAt(0).toUpperCase() + (team?.status?.slice(1) || '')}
                    </span>
                  </dd>
                </div>
                {team?.platform && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Layers className="h-4 w-4 mr-1 text-gray-400" />
                      Platform
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(team?.platform)}`}>
                        {team?.platform}
                      </span>
                    </dd>
                  </div>
                )}
                {team?.unit && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Building className="h-4 w-4 mr-1 text-gray-400" />
                      Unit
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {team?.unit}
                      </span>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            
            {team?.metrics && (
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-2">Key Metrics</h4>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Activity className="h-4 w-4 mr-1 text-gray-400" />
                      Cycle Time
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{team.metrics.cycleTime} days</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      Lead Time
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{team.metrics.leadTime} days</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <BarChart className="h-4 w-4 mr-1 text-gray-400" />
                      Team Health
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              team.metrics.teamHealth >= 80 
                                ? 'bg-green-500' 
                                : team.metrics.teamHealth >= 60 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${team.metrics.teamHealth}%` }}
                          ></div>
                        </div>
                        <span>{team.metrics.teamHealth}%</span>
                      </div>
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Activity className="h-4 w-4 mr-1 text-gray-400" />
                      Deployment Frequency
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{team.metrics.deploymentFrequency}/week</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
          
          {team?.businessCapabilities && team.businessCapabilities.length > 0 && (
            <div className="mt-6">
              <h4 className="text-base font-medium text-gray-900 mb-2">Business Capabilities</h4>
              <div className="flex flex-wrap gap-2">
                {getCapabilityNames(team.businessCapabilities).map((name, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    <Briefcase className="h-3 w-3 mr-1" />
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDescriptionSection;
