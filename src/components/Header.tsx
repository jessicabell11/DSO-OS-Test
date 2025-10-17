import React from 'react';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';
import { teamsData } from '../data/teamsData';

interface HeaderProps {
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, toggleSidebar }) => {
  const { teamId } = useParams<{ teamId: string }>();
  const location = useLocation();
  
  // Check if we're on one of the pages where team name should be hidden from header
  const hideTeamName = React.useMemo(() => {
    const path = location.pathname;
    
    // Check if we're on team dashboard, sprint review, cycle retrospective, or daily standup
    if (teamId) {
      return (
        path === `/teams/${teamId}` || // Team dashboard
        path === `/teams/${teamId}/sprint-review` || // Sprint Review & Demo
        path === `/teams/${teamId}/cycle-retrospective` || // 90-Day Cycle Retrospective
        path === `/teams/${teamId}/daily-standup` // Daily Standup
      );
    }
    return false;
  }, [location.pathname, teamId]);
  
  // Get the team name if teamId is available and we're not on a page where it should be hidden
  const teamName = React.useMemo(() => {
    if (teamId && !hideTeamName) {
      const team = teamsData.find(t => t.id === teamId);
      return team ? team.name : 'Team Dashboard';
    }
    return 'Dashboard'; // Changed from 'Accelerator' to 'Dashboard'
  }, [teamId, hideTeamName]);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center md:justify-start">
            {!hideTeamName && (
              <h1 className="text-lg font-medium text-gray-900">{teamName}</h1>
            )}
          </div>
          {toggleSidebar && (
            <div className="hidden md:flex">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
