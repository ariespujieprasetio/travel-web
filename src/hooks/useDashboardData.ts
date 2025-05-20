import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/authStore';
import { 
  getDashboardSummary, 
  getRecentActivity,
  getSystemHealth,
  DashboardSummary,
  RecentActivity,
  SystemHealth
} from '@/src/services/dashboardApi';

type DashboardData = DashboardSummary & {
  recentSessions: RecentActivity['recentSessions'];
  recentIpChanges: RecentActivity['recentIpChanges'];
  systemHealth: SystemHealth;
};

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    totalSessions: 0,
    totalMessages: 0,
    ipWhitelistEntries: 0,
    activeUsers: 0,
    messageStats: [],
    sessionStats: [],
    recentSessions: [],
    recentIpChanges: [],
    systemHealth: {
      status: 'healthy',
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      uptime: 0,
      lastUpdate: ''
    }
  });
  
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!isAuthenticated()) {
          router.push('/login');
          return;
        }
        
        setLoading(true);
        setError(null);
        
        // Fetch all dashboard data in parallel
        const [summaryData, activityData, healthData] = await Promise.all([
          getDashboardSummary(),
          getRecentActivity(),
          getSystemHealth()
        ]);
        
        // Combine all data
        setDashboardData({
          ...summaryData,
          recentSessions: activityData.recentSessions,
          recentIpChanges: activityData.recentIpChanges,
          systemHealth: healthData
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isAuthenticated, router]);

  return { loading, error, dashboardData };
};