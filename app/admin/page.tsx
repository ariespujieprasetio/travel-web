"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/authStore';
import AdminSidebar from '@/src/components/layout/AdminSidebar';
import AdminHeader from '@/src/components/layout/AdminHeader';
import DashboardOverview from '@/src/components/dashboard/DashboardOverview';
import AnalyticsSection from '@/src/components/dashboard/AnalyticsSection';
import UsersSection from '@/src/components/dashboard/UsersSection';
import SecuritySection from '@/src/components/dashboard/SecuritySection';
import SettingsSection from '@/src/components/dashboard/SettingsSection';
import Loading from '@/src/components/ui/Loading';
import { useDashboardData } from '@/src/hooks/useDashboardData';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { loading, error, dashboardData } = useDashboardData();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return <Loading message="Loading Dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-red-600">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md w-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      {user && <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        sidebarOpen={sidebarOpen} 
        user={user}
        handleLogout={handleLogout}
      />}
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        {/* Top Navigation */}
        <AdminHeader 
          activeSection={activeSection} 
          setSidebarOpen={setSidebarOpen} 
          sidebarOpen={sidebarOpen} 
        />
        
        {/* Dashboard Content */}
        <div className="p-6">
          {activeSection === 'dashboard' && (
            <DashboardOverview dashboardData={dashboardData} />
          )}
          
          {activeSection === 'security' && (
            <SecuritySection />
          )}
          
          {activeSection === 'analytics' && (
            <AnalyticsSection />
          )}
          
          {activeSection === 'users' && (
            <UsersSection />
          )}
          
          {activeSection === 'settings' && (
            <SettingsSection />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;