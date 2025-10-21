import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Activity,
  Target,
  TrendingUp,
  Award,
  ListTodo,
  BarChart,
  Share2,
  Settings,
  Calendar,
  Clock,
  MessageSquare,
  CheckSquare,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Grid,
  Rocket,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { teamsData } from '../data/teamsData';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [dsoToolsExpanded, setDsoToolsExpanded] = React.useState(false);
  const [showTeamRequiredTooltip, setShowTeamRequiredTooltip] = React.useState(false);
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId?: string }>();
  const [team, setTeam] = React.useState<any>(null);

  React.useEffect(() => {
    // Find the team data based on the teamId
    if (teamId) {
      const foundTeam = teamsData.find(t => t.id === teamId);
      if (foundTeam) {
        setTeam(foundTeam);
      }
    } else {
      setTeam(null);
    }
  }, [teamId]);

  React.useEffect(() => {
    // Auto-expand DSO Tools section if any of its items are active
    const dsoToolIds = ['long-mid-term-outcomes', 'team-setup', '90-day-cycle', 'sprint-plan', 'daily-standup', 'sprint-review', 'cycle-retrospective'];
    if (dsoToolIds.includes(activeTab)) {
      setDsoToolsExpanded(true);
    }
  }, [activeTab]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleDsoTools = () => {
    setDsoToolsExpanded(!dsoToolsExpanded);
  };

  const navigateToDashboardSection = (sectionId: string, tabId: string) => {
    // Set the active tab immediately for better UX
    setActiveTab(tabId);
    
    // Then navigate to the section
    const basePath = teamId ? `/teams/${teamId}` : '/';
    navigate(basePath, { state: { scrollToSection: sectionId } });
  };

  const getNavPath = (path: string) => {
    return teamId ? `/teams/${teamId}${path}` : path;
  };

  const handleDsoToolClick = (e: React.MouseEvent, itemId: string) => {
    if (!teamId) {
      e.preventDefault();
      setShowTeamRequiredTooltip(true);
      
      // Hide the tooltip after 3 seconds
      setTimeout(() => {
        setShowTeamRequiredTooltip(false);
      }, 3000);
      
      // Navigate to teams explorer
      navigate('/teams');
      return;
    }
    
    setActiveTab(itemId);
  };

  const mainNavItems = [
    { id: 'teams-explorer', name: 'Teams Explorer', icon: <Grid size={20} />, path: '/teams', isLink: true, alwaysShow: true },
    { id: 'dashboard', name: 'Team Description', icon: <LayoutDashboard size={20} />, action: () => navigateToDashboardSection('team-description-section', 'dashboard'), isLink: false },
    { id: 'team', name: 'Team Members', icon: <Users size={20} />, action: () => navigateToDashboardSection('team-members-section', 'team'), isLink: false },
    { id: 'outcomes', name: 'Outcomes', icon: <Target size={20} />, action: () => navigateToDashboardSection('outcomes-section', 'outcomes'), isLink: false },
    { id: 'progress', name: 'Platform Operating Model', icon: <TrendingUp size={20} />, action: () => navigateToDashboardSection('progress-section', 'progress'), isLink: false },
    { id: 'adoption', name: 'Product Adoption', icon: <BarChart size={20} />, action: () => navigateToDashboardSection('product-adoption-section', 'adoption'), isLink: false },
    { id: 'accomplishments', name: 'Release Notes', icon: <Award size={20} />, action: () => navigateToDashboardSection('release-notes-section', 'accomplishments'), isLink: false },
    { id: 'backlog', name: 'Output Backlog', icon: <ListTodo size={20} />, action: () => navigateToDashboardSection('backlog-section', 'backlog'), isLink: false },
    { id: 'related-teams', name: 'Related Teams', icon: <Share2 size={20} />, action: () => navigateToDashboardSection('related-teams-section', 'related-teams'), isLink: false },
  ];

  const dsoToolsItems = [
    { id: 'long-mid-term-outcomes', name: 'Long & Mid-Term Outcomes', icon: <Target size={20} />, path: getNavPath('/long-mid-term-outcomes'), isLink: true },
    { id: 'team-setup', name: 'Team Setup', icon: <Settings size={20} />, path: getNavPath('/team-setup'), isLink: true },
    { id: '90-day-cycle', name: '90-Day Cycle Plan', icon: <Calendar size={20} />, path: getNavPath('/90-day-cycle'), isLink: true },
    { id: 'sprint-plan', name: 'Sprint Plan', icon: <Clock size={20} />, path: getNavPath('/sprint-plan'), isLink: true },
    { id: 'daily-standup', name: 'Daily Standup', icon: <MessageSquare size={20} />, path: getNavPath('/daily-standup'), isLink: true },
    { id: 'sprint-review', name: 'Sprint Review & Demo', icon: <CheckSquare size={20} />, path: getNavPath('/sprint-review'), isLink: true },
    { id: 'cycle-retrospective', name: '90-Day Cycle Retrospective', icon: <RefreshCw size={20} />, path: getNavPath('/cycle-retrospective'), isLink: true },
  ];

  return (
    <div className={`hidden md:flex flex-col ${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out relative`}>
      <div className="flex flex-col flex-1 overflow-y-auto pt-4">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {/* Main navigation items */}
          {mainNavItems.map((item) => {
            // Skip items that shouldn't be shown based on context
            if (!item.alwaysShow && item.id === 'teams-explorer' && !teamId) {
              return null;
            }
            
            return item.isLink ? (
              <Link
                key={item.id}
                to={item.path || '/'}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : ''}
                onClick={() => setActiveTab(item.id)}
              >
                <span className={collapsed ? '' : 'mr-3'}>{item.icon}</span>
                {!collapsed && item.name}
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={item.action}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : ''}
              >
                <span className={collapsed ? '' : 'mr-3'}>{item.icon}</span>
                {!collapsed && item.name}
              </button>
            );
          })}

          {/* DSO Journey Tools section */}
          <div className="pt-2">
            <button
              onClick={toggleDsoTools}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full text-gray-600 hover:bg-gray-100 ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? "DSO Journey Tools" : ''}
            >
              <span className={collapsed ? '' : 'mr-3'}><Rocket size={20} /></span>
              {!collapsed && (
                <>
                  <span className="flex-1">DSO Journey Tools</span>
                  {dsoToolsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </>
              )}
            </button>

            {/* DSO Journey Tools items */}
            {dsoToolsExpanded && !collapsed && (
              <div className="ml-4 mt-1 space-y-1">
                {dsoToolsItems.map((item) => (
                  <Link
                    key={item.id}
                    to={teamId ? item.path : '#'}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    } ${!teamId ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={(e) => handleDsoToolClick(e, item.id)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Show icons only when sidebar is collapsed */}
            {collapsed && dsoToolsItems.map((item) => (
              <Link
                key={item.id}
                to={teamId ? item.path : '#'}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full justify-center ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${!teamId ? 'opacity-70 cursor-not-allowed' : ''} mt-1`}
                title={item.name}
                onClick={(e) => handleDsoToolClick(e, item.id)}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Team Required Tooltip */}
      {showTeamRequiredTooltip && (
        <div className="absolute bottom-4 left-0 right-0 mx-auto w-56 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50 text-center">
          <div className="flex items-center justify-center mb-1">
            <AlertCircle className="h-5 w-5 mr-1" />
            <span className="font-medium">Team Required</span>
          </div>
          <p className="text-xs">Please select a team first to access DSO Journey Tools</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
