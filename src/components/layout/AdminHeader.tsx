import React from 'react';

interface AdminHeaderProps {
  activeSection: string;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  activeSection, 
  setSidebarOpen, 
  sidebarOpen 
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-500 focus:outline-none lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="text-xl font-semibold text-gray-700">
          {activeSection === 'dashboard' && 'Dashboard Overview'}
          {activeSection === 'analytics' && 'System Analytics'}
          {activeSection === 'users' && 'User Management'}
          {activeSection === 'security' && 'Security & Access Control'}
          {activeSection === 'settings' && 'System Settings'}
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <span className="absolute top-0 right-0 bg-red-500 border-2 border-white text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
              3
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;