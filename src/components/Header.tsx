import React from 'react';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, toggleSidebar }) => {
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
          <div className="flex-1"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
