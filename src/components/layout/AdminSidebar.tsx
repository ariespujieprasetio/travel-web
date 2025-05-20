import React from 'react';
import LogoIcon from '@/src/LogoIcon';
import { User } from '@/src/types';

// Icon components
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const SecurityIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarOpen: boolean;
  user: User; // Use the User interface instead of any
  handleLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  sidebarOpen, 
  user, 
  handleLogout 
}) => {
  return (
    <aside
      className={`
        fixed lg:relative z-30 lg:z-auto
        w-64 min-h-screen bg-white shadow-md 
        flex flex-col
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'left-0' : '-left-64 lg:left-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white">
          <LogoIcon width={24} height={24} color="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">VELUTARA</h1>
          <p className="text-xs text-gray-500">Admin Dashboard</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-4">
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main</p>
        <a 
          href="#" 
          onClick={() => setActiveSection('dashboard')}
          className={`flex items-center px-4 py-3 text-gray-700 ${activeSection === 'dashboard' ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-700' : 'hover:bg-gray-100'}`}
        >
          <DashboardIcon />
          <span className="ml-3">Dashboard</span>
        </a>
        <a 
          href="#" 
          onClick={() => setActiveSection('analytics')}
          className={`flex items-center px-4 py-3 text-gray-700 ${activeSection === 'analytics' ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-700' : 'hover:bg-gray-100'}`}
        >
          <AnalyticsIcon />
          <span className="ml-3">Analytics</span>
        </a>
        <a 
          href="#" 
          onClick={() => setActiveSection('users')}
          className={`flex items-center px-4 py-3 text-gray-700 ${activeSection === 'users' ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-700' : 'hover:bg-gray-100'}`}
        >
          <UsersIcon />
          <span className="ml-3">User Management</span>
        </a>
        
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">System</p>
        <a 
          href="#" 
          onClick={() => setActiveSection('security')}
          className={`flex items-center px-4 py-3 text-gray-700 ${activeSection === 'security' ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-700' : 'hover:bg-gray-100'}`}
        >
          <SecurityIcon />
          <span className="ml-3">Security & Access</span>
        </a>
        <a 
          href="#" 
          onClick={() => setActiveSection('settings')}
          className={`flex items-center px-4 py-3 text-gray-700 ${activeSection === 'settings' ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-700' : 'hover:bg-gray-100'}`}
        >
          <SettingsIcon />
          <span className="ml-3">System Settings</span>
        </a>
      </nav>
      
      {/* User Info */}
      <div className="border-t p-4">
        {user && (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
              {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="font-medium">{user.name || user.email}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;