import React from 'react';
import { SystemHealth as SystemHealthType } from '@/src/services/dashboardApi';

interface SystemHealthProps {
  systemHealth: SystemHealthType;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ systemHealth }) => {
  const getStatusColor = (value: number) => {
    if (value > 80) return 'bg-red-500';
    if (value > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">System Health</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-gray-500 text-sm">CPU Usage</h3>
          <div className="mt-2 flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${getStatusColor(systemHealth.cpuUsage)}`}
                style={{ width: `${systemHealth.cpuUsage}%` }}
              ></div>
            </div>
            <span className="ml-2 text-gray-700">{systemHealth.cpuUsage}%</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-gray-500 text-sm">Memory Usage</h3>
          <div className="mt-2 flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${getStatusColor(systemHealth.memoryUsage)}`}
                style={{ width: `${systemHealth.memoryUsage}%` }}
              ></div>
            </div>
            <span className="ml-2 text-gray-700">{systemHealth.memoryUsage}%</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-gray-500 text-sm">Disk Usage</h3>
          <div className="mt-2 flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${getStatusColor(systemHealth.diskUsage)}`}
                style={{ width: `${systemHealth.diskUsage}%` }}
              ></div>
            </div>
            <span className="ml-2 text-gray-700">{systemHealth.diskUsage}%</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <div className={`h-3 w-3 rounded-full ${
          systemHealth.status === 'healthy' ? 'bg-green-500' :
          systemHealth.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>
        <span className="ml-2 text-sm font-medium">
          System Status: <span className="capitalize">{systemHealth.status}</span>
        </span>
      </div>
    </div>
  );
};

export default SystemHealth;