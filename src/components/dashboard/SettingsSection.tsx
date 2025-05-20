import React, { useState, useEffect } from 'react';
import { useSystemHealth } from '@/src/hooks/useSystemHealth';
import { getWhitelistStatus, updateWhitelistStatus } from '@/src/services/ipWhitelistApi';
import Loading from '../ui/Loading';

const SettingsSection: React.FC = () => {
  const { loading: systemLoading, error: systemError, systemConfig, updateConfig } = useSystemHealth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    serverPort: 0,
    debugMode: false,
    autoBackup: false,
    sendAlerts: false
  });
  
  // Set initial form data and fetch IP whitelist status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Only fetch whitelist status when systemConfig is loaded
        if (systemConfig) {
          const whitelistStatus = await getWhitelistStatus();
          setWhitelistEnabled(whitelistStatus.enabled);
          
          setFormData({
            serverPort: systemConfig.server.port,
            debugMode: false, // Default values as these aren't in the config
            autoBackup: false,
            sendAlerts: false
          });
          
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching whitelist status:', err);
        setError('Failed to load all settings. Please try again.');
        setLoading(false);
      }
    };
    
    if (systemConfig) {
      fetchData();
    }
  }, [systemConfig]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleToggleWhitelist = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      
      // Use the dedicated API for updating whitelist status
      const result = await updateWhitelistStatus(!whitelistEnabled);
      setWhitelistEnabled(result.enabled);
      
      setSuccessMessage(`IP whitelist ${result.enabled ? 'enabled' : 'disabled'} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsUpdating(false);
    } catch (err) {
      console.error('Error updating whitelist status:', err);
      setError('Failed to update IP whitelist status. Please try again.');
      setIsUpdating(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    
    try {
      // Update system configuration
      const success = await updateConfig({
        server: {
          ...systemConfig.server,
          port: Number(formData.serverPort)
        }
      });
      
      if (success) {
        setSuccessMessage('Settings updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update system settings. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleRegenerateApiKey = () => {
    // In a real app, this would call an API endpoint to regenerate the key
    alert('API Key would be regenerated here.');
  };
  
  if (loading || systemLoading) {
    return <Loading message="Loading system settings..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">System Settings</h2>
          <p className="mt-2 text-sm text-gray-600">
            Configure system-wide settings and preferences.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {(error || systemError) && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error || systemError}
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                {successMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-4">General Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="serverPort" className="block text-sm font-medium text-gray-700 mb-1">
                      Server Port
                    </label>
                    <input
                      type="number"
                      id="serverPort"
                      name="serverPort"
                      value={formData.serverPort}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                
                  <div>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        name="debugMode"
                        checked={formData.debugMode}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" 
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable debug mode</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        name="autoBackup"
                        checked={formData.autoBackup}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" 
                      />
                      <span className="ml-2 text-sm text-gray-700">Auto-backup database daily</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        name="sendAlerts"
                        checked={formData.sendAlerts}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" 
                      />
                      <span className="ml-2 text-sm text-gray-700">Send system alerts to admins</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-4">API Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      id="apiKey"
                      value="••••••••••••••••••••••"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <button 
                      type="button"
                      onClick={handleRegenerateApiKey}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Regenerate API Key
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className={`bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUpdating ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-800">IP Whitelist</h3>
              <p className="text-sm text-gray-600 mt-1">
                When enabled, only requests from whitelisted IP addresses will be allowed to access the system.
              </p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm">
                {whitelistEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button 
                onClick={handleToggleWhitelist}
                disabled={isUpdating}
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                  whitelistEnabled ? 'bg-purple-600' : 'bg-gray-300'
                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span 
                  className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                    whitelistEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-600">
              Manage IP whitelist entries in the <a href="#" onClick={() => {}} className="text-purple-600 hover:text-purple-800">Security & Access</a> section.
            </p>
          </div>
        </div>
      </div>
      
      {/* System Configuration Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">System Configuration Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">API Services</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <span className={`h-2 w-2 rounded-full ${systemConfig.openai.apiKeyConfigured ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                OpenAI API: {systemConfig.openai.apiKeyConfigured ? 'Configured' : 'Not Configured'}
              </li>
              <li className="flex items-center text-sm">
                <span className={`h-2 w-2 rounded-full ${systemConfig.google.apiKeyConfigured ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                Google API: {systemConfig.google.apiKeyConfigured ? 'Configured' : 'Not Configured'}
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Database</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <span className={`h-2 w-2 rounded-full ${systemConfig.database.urlConfigured ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                Database Connection: {systemConfig.database.urlConfigured ? 'Configured' : 'Not Configured'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;