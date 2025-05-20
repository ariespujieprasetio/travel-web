import React from 'react';
import { useAnalytics } from '@/src/hooks/useAnalytics';
import Loading from '../ui/Loading';

const AnalyticsSection: React.FC = () => {
  const { loading, error, analyticsData, changePeriod } = useAnalytics();

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changePeriod(parseInt(e.target.value));
  };

  if (loading) {
    return <Loading message="Loading analytics data..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => changePeriod(analyticsData.selectedPeriod)}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Analytics</h2>
          <div>
            <label htmlFor="period" className="mr-2 text-sm text-gray-600">Time Period:</label>
            <select
              id="period"
              value={analyticsData.selectedPeriod}
              onChange={handlePeriodChange}
              className="border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Message Analytics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Message Activity</h2>
        <div className="h-64 bg-gray-50 rounded-lg p-6 flex items-center justify-center">
          {/* In a real app, you would implement a chart here using Chart.js or similar */}
          <p className="text-gray-500 text-sm">
            Message chart would display data for {analyticsData.messageStats.length} days
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800 mb-1">Total Messages</h3>
            <p className="text-2xl font-bold text-purple-700">
              {analyticsData.messageStats.reduce((sum, day) => sum + day.total, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-1">User Messages</h3>
            <p className="text-2xl font-bold text-blue-700">
              {analyticsData.messageStats.reduce((sum, day) => sum + day.user, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-1">Assistant Messages</h3>
            <p className="text-2xl font-bold text-green-700">
              {analyticsData.messageStats.reduce((sum, day) => sum + day.assistant, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      {/* Session Analytics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Session Stats</h2>
        <div className="h-64 bg-gray-50 rounded-lg p-6 flex items-center justify-center">
          {/* In a real app, you would implement a chart here using Chart.js or similar */}
          <p className="text-gray-500 text-sm">
            Session chart would display data for {analyticsData.sessionStats.length} days
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-indigo-800 mb-1">Total Sessions</h3>
            <p className="text-2xl font-bold text-indigo-700">
              {analyticsData.sessionStats.reduce((sum, day) => sum + day.sessions, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-pink-800 mb-1">Unique Users</h3>
            <p className="text-2xl font-bold text-pink-700">
              {Math.max(...analyticsData.sessionStats.map(day => day.uniqueUsers)).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tool Usage Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tool Usage</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool Name</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analyticsData.toolUsageStats.map((tool) => (
                <tr key={tool.name}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tool.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                    {tool.count.toLocaleString()}
                  </td>
                </tr>
              ))}
              
              {analyticsData.toolUsageStats.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-sm text-gray-500">
                    No tool usage data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;