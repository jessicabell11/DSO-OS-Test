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
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navigateToDashboardSection = (sectionId: string, tabId: string) => {
    // Set the active tab immediately for better UX
    setActiveTab(tabId);
    
    // Then navigate to the section
    navigate('/', { state: { scrollToSection: sectionId } });
  };

  const navItems = [
    { id: 'dashboard', name: 'Team Description', icon: <LayoutDashboard size={20} />, action: () => navigateToDashboardSection('team-description-section', 'dashboard'), isLink: false },
    { id: 'team-setup', name: 'Team Setup', icon: <Settings size={20} />, path: '/team-setup', isLink: true },
    { id: 'team', name: 'Team Members', icon: <Users size={20} />, action: () => navigateToDashboardSection('team-members-section', 'team'), isLink: false },
    { id: 'outcomes', name: 'Outcomes', icon: <Target size={20} />, action: () => navigateToDashboardSection('outcomes-section', 'outcomes'), isLink: false },
    { id: 'progress', name: 'Platform Operating Model', icon: <TrendingUp size={20} />, action: () => navigateToDashboardSection('progress-section', 'progress'), isLink: false },
    { id: 'adoption', name: 'Product Adoption', icon: <BarChart size={20} />, action: () => navigateToDashboardSection('product-adoption-section', 'adoption'), isLink: false },
    { id: 'accomplishments', name: 'Release Notes', icon: <Award size={20} />, action: () => navigateToDashboardSection('release-notes-section', 'accomplishments'), isLink: false },
    { id: 'backlog', name: 'Output Backlog', icon: <ListTodo size={20} />, action: () => navigateToDashboardSection('backlog-section', 'backlog'), isLink: false },
    { id: 'related-teams', name: 'Related Teams', icon: <Share2 size={20} />, action: () => navigateToDashboardSection('related-teams-section', 'related-teams'), isLink: false },
    { id: '90-day-cycle', name: '90-Day Cycle Plan', icon: <Calendar size={20} />, path: '/90-day-cycle', isLink: true },
    { id: 'sprint-plan', name: 'Sprint Plan', icon: <Clock size={20} />, path: '/sprint-plan', isLink: true },
    { id: 'daily-standup', name: 'Daily Standup', icon: <MessageSquare size={20} />, path: '/daily-standup', isLink: true },
    { id: 'sprint-review', name: 'Sprint Review & Demo', icon: <CheckSquare size={20} />, path: '/sprint-review', isLink: true },
    { id: 'cycle-retrospective', name: '90-Day Cycle Retrospective', icon: <RefreshCw size={20} />, path: '/cycle-retrospective', isLink: true },
  ];

  return (
    <div className={`hidden md:flex flex-col ${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out relative`}>
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-800">Accelerator</span>
          </div>
        )}
        {collapsed && (
          <Activity className="h-8 w-8 text-blue-600" />
        )}
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            item.isLink ? (
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
            )
          ))}
        </nav>
      </div>
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
};

export default Sidebar;
