import React from 'react';
import StatsCard from './StatsCard';
import SystemHealth from './SystemHealth';
import RecentActivity from './RecentActivity';
import { DashboardSummary } from '@/src/services/dashboardApi';
// Import the types we defined

interface DashboardOverviewProps {
  dashboardData: DashboardSummary;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ dashboardData }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          change={12}
          bgColor="bg-purple-100"
          textColor="text-purple-500"
        />
        <StatsCard
          title="Total Sessions"
          value={dashboardData.totalSessions}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
          change={5}
          bgColor="bg-indigo-100"
          textColor="text-indigo-500"
        />
        <StatsCard
          title="Total Messages"
          value={dashboardData.totalMessages}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
          change={8}
          bgColor="bg-yellow-100"
          textColor="text-yellow-500"
        />
        <StatsCard
          title="Active Users Now"
          value={dashboardData.activeUsers}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          change={3}
          changeTimeframe="hour"
          bgColor="bg-red-100"
          textColor="text-red-500"
        />
      </div>
      {/* System Health */}
      <SystemHealth systemHealth={dashboardData.systemHealth} />
      {/* Recent Activity */}
      <RecentActivity
        recentSessions={dashboardData.recentSessions}
        recentIpChanges={dashboardData.recentIpChanges}
      />
    </div>
  );
};

export default DashboardOverview;