// src/services/dashboardApi.ts

import { useAuthStore } from '../store/authStore';

// API URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5600';
// Dashboard interfaces
export interface DashboardSummary {
  totalUsers: number;
  totalSessions: number;
  totalMessages: number;
  ipWhitelistEntries: number;
  activeUsers: number;
  messageStats: MessageStatsByDay[];
  sessionStats: SessionStatsByDay[];
  systemHealth: SystemHealth;
  recentSessions: RecentSession[];
  recentIpChanges: IpWhitelistEntry[];
}

export interface MessageStatsByDay {
  date: string;
  total: number;
  user: number;
  assistant: number;
  tool: number;
}

export interface SessionStatsByDay {
  date: string;
  sessions: number;
  uniqueUsers: number;
}

export interface RecentActivity {
  recentSessions: RecentSession[];
  recentIpChanges: IpWhitelistEntry[];
}

export interface RecentSession {
  id: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface IpWhitelistEntry {
  id: string;
  ipAddress: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number;
  lastUpdate: string;
}

export interface SystemConfig {
  server: {
    port: number;
  };
  security: {
    enableIpWhitelist: boolean;
  };
  openai: {
    apiKeyConfigured: boolean;
  };
  google: {
    apiKeyConfigured: boolean;
  };
  database: {
    urlConfigured: boolean;
  };
}

export interface UserActivityStats {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  sessionCount: number;
  messageCount: number;
}

export interface ToolUsageStats {
  name: string;
  count: number;
}

// Helper function to get auth header (same as in api.ts)
const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  return {
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Get dashboard summary data
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const response = await fetch(`${API_URL}/api/dashboard/summary`, {
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      throw new Error('Failed to fetch dashboard summary');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
}

/**
 * Get recent activity data
 */
export async function getRecentActivity(): Promise<RecentActivity> {
  try {
    const response = await fetch(`${API_URL}/api/dashboard/recent-activity`, {
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      throw new Error('Failed to fetch recent activity');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
}

/**
 * Get system health information
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  try {
    const response = await fetch(`${API_URL}/api/system/health`, {
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      throw new Error('Failed to fetch system health');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching system health:', error);
    throw error;
  }
}

/**
 * Get system configuration
 */
export async function getSystemConfig(): Promise<SystemConfig> {
  try {
    const response = await fetch(`${API_URL}/api/system/config`, {
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      throw new Error('Failed to fetch system configuration');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching system configuration:', error);
    throw error;
  }
}

/**
 * Update system configuration
 */
export async function updateSystemConfig(config: Partial<SystemConfig>): Promise<SystemConfig> {
  try {
    const response = await fetch(`${API_URL}/api/system/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ config })
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      throw new Error('Failed to update system configuration');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating system configuration:', error);
    throw error;
  }
}

/**
 * Get message statistics for a specific time period
 */
export async function getMessageStats(period: number = 30): Promise<MessageStatsByDay[]> {
  try {
    const response = await fetch(`${API_URL}/api/analytics/messages?period=${period}`, {
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      throw new Error('Failed to fetch message statistics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching message statistics:', error);
    throw error;
  }
}

/**
 * Get session statistics for a specific time period
 */
export async function getSessionStats(period: number = 30): Promise<SessionStatsByDay[]> {
  try {
    const response = await fetch(`${API_URL}/api/analytics/sessions?period=${period}`, {
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      throw new Error('Failed to fetch session statistics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching session statistics:', error);
    throw error;
  }
}

/**
 * Get user activity statistics for a specific time period
 */
export async function getUserActivityStats(period: number = 30): Promise<UserActivityStats[]> {
  try {
    const response = await fetch(`${API_URL}/api/analytics/user-activity?period=${period}`, {
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      throw new Error('Failed to fetch user activity statistics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user activity statistics:', error);
    throw error;
  }
}

/**
 * Get tool usage statistics for a specific time period
 */
export async function getToolUsageStats(period: number = 30): Promise<ToolUsageStats[]> {
  try {
    const response = await fetch(`${API_URL}/api/analytics/tool-usage?period=${period}`, {
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      throw new Error('Failed to fetch tool usage statistics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tool usage statistics:', error);
    throw error;
  }
}