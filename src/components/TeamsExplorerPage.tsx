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
  Save,
  Hash,
  Layers,
  Building,
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Team, BusinessCapability } from '../types';
import { teamsData } from '../data/teamsData';
import { allBusinessCapabilities } from '../data/businessCapabilitiesData';
import { platformsList, getPlatformColor, platformCategories, getPlatformCategory } from '../data/platformsData';
import { unitsByPlatform, addUnitToPlatform } from '../data/unitsData';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';

const TeamsExplorerPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([...teamsData]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([...teamsData]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'archived'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [newTeamPlatform, setNewTeamPlatform] = useState('');
  const [newTeamUnit, setNewTeamUnit] = useState('');
  const [isAddingNewUnit, setIsAddingNewUnit] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [sidebarActiveTab, setSidebarActiveTab] = useState('teams-explorer');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [groupByPlatform, setGroupByPlatform] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{
    teamName?: string;
    platform?: string;
  }>({});
  const [teamNameTouched, setTeamNameTouched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Reset unit when platform changes
  useEffect(() => {
    setNewTeamUnit('');
  }, [newTeamPlatform]);

  // Check if there's a team ID in the query string on component mount
  useEffect(() => {
    const teamId = searchParams.get('teamId');
    if (teamId) {
      // Verify the team exists
      const teamExists = teams.some(team => team.id === teamId);
      if (teamExists) {
        // Navigate to the team dashboard
        handleViewTeam(teamId);
      } else {
        // If team doesn't exist, remove the query parameter
        searchParams.delete('teamId');
        setSearchParams(searchParams);
        
        // Show an error message
        setSuccessMessage(`Team with ID ${teamId} not found`);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    }
  }, []);

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
    
    // Apply platform filter
    if (platformFilter !== 'all') {
      result = result.filter(team => team.platform === platformFilter);
    }
    
    setFilteredTeams(result);
  }, [teams, searchQuery, statusFilter, platformFilter]);

  // Validate team name when it changes
  useEffect(() => {
    if (teamNameTouched) {
      validateTeamName();
    }
  }, [newTeamName]);

  const validateTeamName = () => {
    const errors = { ...validationErrors };
    
    if (!newTeamName.trim()) {
      errors.teamName = 'Team name is required';
    } else {
      delete errors.teamName;
    }
    
    setValidationErrors(errors);
    return !errors.teamName;
  };

  const validateForm = () => {
    const errors: {
      teamName?: string;
      platform?: string;
    } = {};
    
    if (!newTeamName.trim()) {
      errors.teamName = 'Team name is required';
    }
    
    if (!newTeamPlatform) {
      errors.platform = 'Platform selection is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTeam = () => {
    setTeamNameTouched(true);
    
    if (!validateForm()) {
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
      businessCapabilities: [],
      platform: newTeamPlatform,
      unit: newTeamUnit || undefined
    };

    // Update both the local state and the imported teamsData array
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    
    // Update the teamsData array directly so other components can access the new team
    // This is a workaround since we don't have a proper state management solution
    teamsData.push(newTeam);
    
    setNewTeamName('');
    setNewTeamDescription('');
    setNewTeamPlatform('');
    setNewTeamUnit('');
    setIsAddingTeam(false);
    setTeamNameTouched(false);
    setValidationErrors({});
    
    showSuccess(`Team "${newTeamName}" created successfully`);
    
    // Navigate to the Long & Mid-Term Outcomes screen for the new team
    navigate(`/teams/${newTeam.id}/long-mid-term-outcomes`);
  };

  const handleAddNewUnit = () => {
    if (!newUnitName.trim()) {
      alert('Unit name cannot be empty');
      return;
    }

    if (!newTeamPlatform) {
      alert('Please select a platform first');
      return;
    }

    // Add the new unit to the platform
    addUnitToPlatform(newTeamPlatform, newUnitName);
    
    // Select the newly added unit
    setNewTeamUnit(newUnitName);
    
    // Reset the new unit form
    setNewUnitName('');
    setIsAddingNewUnit(false);
    
    showSuccess(`Added new unit "${newUnitName}" to ${newTeamPlatform}`);
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

  // Handle viewing team (selects team and navigates to dashboard)
  const handleViewTeam = (teamId: string) => {
    // Update the query string with the selected team ID
    searchParams.set('teamId', teamId);
    setSearchParams(searchParams);
    
    // Show success message
    const teamName = teams.find(t => t.id === teamId)?.name;
    showSuccess(`Selected team: ${teamName}`);
    
    // Navigate to the team dashboard
    navigate(`/teams/${teamId}`);
  };

  // Extract team ID number from team.id (e.g., "team-001" -> "001")
  const getTeamIdNumber = (teamId: string): string => {
    const match = teamId.match(/team-(\d+)/);
    return match ? match[1] : '';
  };

  // Group teams by platform
  const getTeamsByPlatform = () => {
    const groupedTeams: Record<string, Team[]> = {};
    
    filteredTeams.forEach(team => {
      const platform = team.platform || 'Uncategorized';
      if (!groupedTeams[platform]) {
        groupedTeams[platform] = [];
      }
      groupedTeams[platform].push(team);
    });
    
    return groupedTeams;
  };

  // Get all platforms that have teams
  const getUsedPlatforms = () => {
    const platforms = new Set<string>();
    teams.forEach(team => {
      if (team.platform) {
        platforms.add(team.platform);
      }
    });
    return Array.from(platforms);
  };

  // Group platforms by category
  const getPlatformsByCategory = () => {
    const usedPlatforms = getUsedPlatforms();
    const result: Record<string, string[]> = {};
    
    usedPlatforms.forEach(platform => {
      const category = getPlatformCategory(platform);
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(platform);
    });
    
    return result;
  };

  // Get units for the selected platform
  const getUnitsForPlatform = () => {
    if (!newTeamPlatform) return [];
    return unitsByPlatform[newTeamPlatform] || [];
  };

  // Handle modal close and reset form
  const handleCloseModal = () => {
    setIsAddingTeam(false);
    setNewTeamName('');
    setNewTeamDescription('');
    setNewTeamPlatform('');
    setNewTeamUnit('');
    setTeamNameTouched(false);
    setValidationErrors({});
  };

  // Render team card
  const renderTeamCard = (team: Team) => (
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
                <div className="ml-2 flex items-center">
                  {getTeamStatusBadge(team.status)}
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Hash className="h-3 w-3 mr-1" />
                    {getTeamIdNumber(team.id)}
                  </span>
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-500 max-w-2xl">
                {team.description}
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {team.platform && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(team.platform)}`}>
                    <Layers className="h-3 w-3 mr-1" />
                    {team.platform}
                  </span>
                )}
                {team.unit && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    <Building className="h-3 w-3 mr-1" />
                    {team.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => handleViewTeam(team.id)}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md ${
                searchParams.get('teamId') === team.id 
                  ? 'text-blue-700 bg-blue-100 hover:bg-blue-200' 
                  : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <Eye className="mr-1 h-4 w-4" />
              View Team
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
        </div>
      </div>
    </li>
  );

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
              <div className="flex items-center">
                <Layers className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Platforms</option>
                  {Object.entries(platformCategories).map(([category, platforms]) => (
                    <optgroup key={category} label={category}>
                      {platforms.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setGroupByPlatform(!groupByPlatform)}
                  className={`inline-flex items-center px-3 py-2 border ${
                    groupByPlatform 
                      ? 'border-blue-500 text-blue-700 bg-blue-50' 
                      : 'border-gray-300 text-gray-700 bg-white'
                  } rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  <Layers className="h-4 w-4 mr-1" />
                  {groupByPlatform ? 'Grouped by Platform' : 'Flat List'}
                </button>
              </div>
            </div>

            {/* Selected Team Indicator */}
            {searchParams.get('teamId') && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-blue-700">
                    Selected Team: <strong>{teams.find(t => t.id === searchParams.get('teamId'))?.name}</strong>
                  </span>
                </div>
                <button 
                  onClick={() => {
                    searchParams.delete('teamId');
                    setSearchParams(searchParams);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Teams List */}
            {groupByPlatform ? (
              // Grouped by platform
              Object.entries(getTeamsByPlatform()).map(([platform, platformTeams]) => (
                <div key={platform} className="mb-8">
                  <div className="flex items-center mb-2">
                    <Layers className="h-5 w-5 text-gray-600 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">{platform}</h2>
                    <span className="ml-2 text-sm text-gray-500">({platformTeams.length} teams)</span>
                  </div>
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {platformTeams.map(team => renderTeamCard(team))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              // Flat list
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredTeams.length > 0 ? (
                    filteredTeams.map(team => renderTeamCard(team))
                  ) : (
                    <li className="px-4 py-12 text-center">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No teams found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchQuery || statusFilter !== 'all' || platformFilter !== 'all'
                          ? 'Try adjusting your search or filter criteria' 
                          : 'Get started by creating a new team'}
                      </p>
                      {!searchQuery && statusFilter === 'all' && platformFilter === 'all' && (
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
            )}
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
                          onBlur={() => setTeamNameTouched(true)}
                          className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            validationErrors.teamName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Digital Innovation Team"
                        />
                        {validationErrors.teamName && (
                          <div className="mt-1 flex items-center text-sm text-red-600">
                            <AlertCircleIcon className="h-4 w-4 mr-1" />
                            {validationErrors.teamName}
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="team-platform" className="block text-sm font-medium text-gray-700">
                          Platform <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="team-platform"
                          value={newTeamPlatform}
                          onChange={(e) => setNewTeamPlatform(e.target.value)}
                          className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            validationErrors.platform ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select a platform</option>
                          {Object.entries(platformCategories).map(([category, platforms]) => (
                            <optgroup key={category} label={category}>
                              {platforms.map(platform => (
                                <option key={platform} value={platform}>{platform}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        {validationErrors.platform && (
                          <div className="mt-1 flex items-center text-sm text-red-600">
                            <AlertCircleIcon className="h-4 w-4 mr-1" />
                            {validationErrors.platform}
                          </div>
                        )}
                      </div>
                      {newTeamPlatform && (
                        <div>
                          <div className="flex justify-between items-center">
                            <label htmlFor="team-unit" className="block text-sm font-medium text-gray-700">
                              Unit (Optional)
                            </label>
                            {!isAddingNewUnit && (
                              <button
                                type="button"
                                onClick={() => setIsAddingNewUnit(true)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                + Add New Unit
                              </button>
                            )}
                          </div>
                          {isAddingNewUnit ? (
                            <div className="mt-1 flex space-x-2">
                              <input
                                type="text"
                                value={newUnitName}
                                onChange={(e) => setNewUnitName(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter new unit name"
                              />
                              <button
                                type="button"
                                onClick={handleAddNewUnit}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Add
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingNewUnit(false);
                                  setNewUnitName('');
                                }}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <select
                              id="team-unit"
                              value={newTeamUnit}
                              onChange={(e) => setNewTeamUnit(e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="">Select a unit (optional)</option>
                              {getUnitsForPlatform().map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}
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
                  onClick={handleCloseModal}
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
