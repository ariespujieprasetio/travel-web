import React from 'react';
import { IpWhitelistEntry } from '@/src/services/dashboardApi';

interface IpWhitelistManagerProps {
  ipWhitelist: IpWhitelistEntry[];
  whitelistEnabled: boolean;
  newIpAddress: string;
  setNewIpAddress: (value: string) => void;
  newIpDescription: string;
  setNewIpDescription: (value: string) => void;
  ipError: string;
  ipSuccess: string;
  handleAddIp: () => void;
  handleRemoveIp: (id: string) => void;
  handleToggleIpStatus: (id: string, currentStatus: boolean) => void;
  handleToggleWhitelist: () => void;
}

const IpWhitelistManager: React.FC<IpWhitelistManagerProps> = ({
  ipWhitelist,
  whitelistEnabled,
  newIpAddress,
  setNewIpAddress,
  newIpDescription,
  setNewIpDescription,
  ipError,
  ipSuccess,
  handleAddIp,
  handleRemoveIp,
  handleToggleIpStatus,
  handleToggleWhitelist
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">IP Whitelist</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm">
              {whitelistEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <button 
              onClick={handleToggleWhitelist}
              className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                whitelistEnabled ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span 
                className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                  whitelistEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          When enabled, only requests from these IP addresses will be allowed to access the system.
        </p>
      </div>
      
      <div className="p-6">
        <h3 className="text-md font-medium text-gray-800 mb-4">Add New IP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700 mb-1">
              IP Address
            </label>
            <input
              type="text"
              id="ipAddress"
              value={newIpAddress}
              onChange={(e) => setNewIpAddress(e.target.value)}
              placeholder="192.168.1.1"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={newIpDescription}
              onChange={(e) => setNewIpDescription(e.target.value)}
              placeholder="Office Network"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        {ipError && (
          <div className="mt-2 text-sm text-red-600">
            {ipError}
          </div>
        )}
        
        {ipSuccess && (
          <div className="mt-2 text-sm text-green-600">
            {ipSuccess}
          </div>
        )}
        
        <button
          onClick={handleAddIp}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Add IP
        </button>
      </div>
      
      <div className="p-6 border-t">
        <h3 className="text-md font-medium text-gray-800 mb-4">Whitelisted IPs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ipWhitelist.map((ip) => (
                <tr key={ip.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ip.ipAddress}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {ip.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ip.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ip.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ip.createdAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleToggleIpStatus(ip.id, ip.active)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      {ip.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleRemoveIp(ip.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              
              {ipWhitelist.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                    No IP addresses have been whitelisted yet.
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

export default IpWhitelistManager;