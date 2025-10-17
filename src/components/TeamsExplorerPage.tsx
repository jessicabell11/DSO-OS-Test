import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  PlusCircle, 
  ArrowLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Briefcase,
  BarChart,
  Activity,
  Trash,
  Edit,
  Eye,
  X,
  Save
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Team, BusinessCapability } from '../types';
import { teamsData } from '../data/teamsData';
import { allBusinessCapabilities } from '../data/businessCapabilitiesData';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';

const TeamsExplorerPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(teamsData);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>(teamsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'archived'>('all');
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [sidebarActiveTab, setSidebarActiveTab] = useState('teams-explorer');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let result = teams;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(team => 
        team.name.toLowerCase().includes(query) || 
        team.description.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(team => team.status === statusFilter);
    }
    
    setFilteredTeams(result);
  }, [teams, searchQuery, statusFilter]);

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      alert('Team name is required');
      return;
    }

    const newTeam: Team = {
      id: `team-${String(teams.length + 1).padStart(3, '0')}`,
      name: newTeamName,
      description: newTeamDescription || 'No description provided',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      members: [],
      businessCapabilities: []
    };

    setTeams(prevTeams => [...prevTeams, newTeam]);
    setNewTeamName('');
    setNewTeamDescription('');
    setIsAddingTeam(false);
    
    showSuccess(`Team "${newTeamName}" created successfully`);
  };

  const getCapabilityNames = (capabilityIds: string[] = []): string => {
    if (!capabilityIds.length) return 'None';
    
    const capabilities = capabilityIds
      .map(id => allBusinessCapabilities.find(cap => cap.id === id))
      .filter(cap => cap !== undefined) as BusinessCapability[];
    
    if (capabilities.length <= 2) {
      return capabilities.map(cap => cap.name).join(', ');
    } else {
      return `${capabilities[0].name}, ${capabilities[1].name}, +${capabilities.length - 2} more`;
    }
  };

  const getTeamStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Inactive
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="h-3 w-3 mr-1" />
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Handle navigation to team dashboard
  const handleViewTeamDashboard = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={sidebarActiveTab} setActiveTab={setSidebarActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-500" />
                Teams Explorer
              </h1>
            </div>
            <button
              onClick={() => setIsAddingTeam(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add New Team
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Teams List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <li key={team.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {team.logo ? (
                              <img 
                                src={team.logo} 
                                alt={`${team.name} logo`} 
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Users className="h-6 w-6" />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-medium text-gray-900">{team.name}</h2>
                                <div className="ml-2">
                                  {getTeamStatusBadge(team.status)}
                                </div>
                              </div>
                              <div className="mt-1 text-sm text-gray-500 max-w-2xl">
                                {team.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleViewTeamDashboard(team.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              View Dashboard
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            <span>Created: {formatDate(team.createdAt)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            <span>Members: {team.members?.length || 0}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                            <span>Capabilities: {getCapabilityNames(team.businessCapabilities)}</span>
                          </div>
                          {team.metrics && (
                            <>
                              <div className="flex items-center text-sm text-gray-500">
                                <Activity className="h-4 w-4 mr-1 text-gray-400" />
                                <span>Cycle Time: {team.metrics.cycleTime} days</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <BarChart className="h-4 w-4 mr-1 text-gray-400" />
                                <span>Team Health: {team.metrics.teamHealth}%</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No teams found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria' 
                        : 'Get started by creating a new team'}
                    </p>
                    {!searchQuery && statusFilter === 'all' && (
                      <div className="mt-6">
                        <button
                          onClick={() => setIsAddingTeam(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Add New Team
                        </button>
                      </div>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>

      {/* Add New Team Modal */}
      {isAddingTeam && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <PlusCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Team</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="team-name" className="block text-sm font-medium text-gray-700">
                          Team Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="team-name"
                          value={newTeamName}
                          onChange={(e) => setNewTeamName(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., Digital Innovation Team"
                        />
                      </div>
                      <div>
                        <label htmlFor="team-description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="team-description"
                          value={newTeamDescription}
                          onChange={(e) => setNewTeamDescription(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Brief description of the team's purpose and focus"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateTeam}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Create Team
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingTeam(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 shadow-md rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{successMessage}</span>
        </div>
      )}

      <AIAssistant />
    </div>
  );
};

export default TeamsExplorerPage;
