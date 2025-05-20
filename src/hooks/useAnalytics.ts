import { useState, useEffect } from 'react';
import { 
  getMessageStats, 
  getSessionStats,
  getUserActivityStats,
  getToolUsageStats,
  MessageStatsByDay,
  SessionStatsByDay,
  UserActivityStats,
  ToolUsageStats
} from '@/src/services/dashboardApi';

interface AnalyticsData {
  messageStats: MessageStatsByDay[];
  sessionStats: SessionStatsByDay[];
  userActivityStats: UserActivityStats[];
  toolUsageStats: ToolUsageStats[];
  selectedPeriod: number;
}

export const useAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    messageStats: [],
    sessionStats: [],
    userActivityStats: [],
    toolUsageStats: [],
    selectedPeriod: 30, // Default to 30 days
  });

  const fetchAnalyticsData = async (period: number = 30) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all analytics data in parallel for the selected period
      const [messages, sessions, userActivity, toolUsage] = await Promise.all([
        getMessageStats(period),
        getSessionStats(period),
        getUserActivityStats(period),
        getToolUsageStats(period)
      ]);
      
      setAnalyticsData({
        messageStats: messages,
        sessionStats: sessions,
        userActivityStats: userActivity,
        toolUsageStats: toolUsage,
        selectedPeriod: period
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to load analytics data:", err);
      setError("Failed to load analytics data. Please try again.");
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData(analyticsData.selectedPeriod);
  }, [analyticsData]);

  // Function to change the selected period
  const changePeriod = (period: number) => {
    if (period !== analyticsData.selectedPeriod) {
      fetchAnalyticsData(period);
    }
  };

  return {
    loading,
    error,
    analyticsData,
    changePeriod
  };
};