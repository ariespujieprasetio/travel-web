import { useState, useEffect } from 'react';
import { getSystemHealth, getSystemConfig, updateSystemConfig, SystemHealth, SystemConfig } from '@/src/services/dashboardApi';

export const useSystemHealth = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    uptime: 0,
    lastUpdate: ''
  });
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    server: {
      port: 3000,
    },
    security: {
      enableIpWhitelist: false,
    },
    openai: {
      apiKeyConfigured: false,
    },
    google: {
      apiKeyConfigured: false,
    },
    database: {
      urlConfigured: false,
    }
  });

  // Fetch system health and config
  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch system health and config in parallel
        const [health, config] = await Promise.all([
          getSystemHealth(),
          getSystemConfig()
        ]);
        
        setSystemHealth(health);
        setSystemConfig(config);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to load system data:", err);
        setError("Failed to load system data. Please try again.");
        setLoading(false);
      }
    };
    
    fetchSystemData();
    
    // Set up polling for system health every 30 seconds
    const interval = setInterval(() => {
      getSystemHealth()
        .then(health => setSystemHealth(health))
        .catch(err => console.error("Error refreshing system health:", err));
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Update system configuration
  const updateConfig = async (newConfig: Partial<SystemConfig>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedConfig = await updateSystemConfig(newConfig);
      setSystemConfig(updatedConfig);
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to update system configuration:", err);
      setError("Failed to update system configuration. Please try again.");
      setLoading(false);
      return false;
    }
  };

  return {
    loading,
    error,
    systemHealth,
    systemConfig,
    updateConfig
  };
};