import { useState, useEffect } from 'react';
import { 
  getWhitelistedIps, 
  addIpToWhitelist, 
  removeIpFromWhitelist, 
  updateIpWhitelistStatus,
  getWhitelistStatus,
  updateWhitelistStatus
} from '@/src/services/ipWhitelistApi';
import { IpWhitelistEntry } from '@/src/services/dashboardApi';

export const useIpWhitelist = () => {
  const [ipWhitelist, setIpWhitelist] = useState<IpWhitelistEntry[]>([]);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState('');
  const [newIpDescription, setNewIpDescription] = useState('');
  const [ipError, setIpError] = useState('');
  const [ipSuccess, setIpSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWhitelistData = async () => {
      try {
        setLoading(true);
        
        // Fetch IP whitelist data and status in parallel
        const [ips, status] = await Promise.all([
          getWhitelistedIps(),
          getWhitelistStatus()
        ]);
        
        setIpWhitelist(ips);
        setWhitelistEnabled(status.enabled);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching IP whitelist data:', error);
        setIpError('Failed to fetch IP whitelist data');
        setLoading(false);
      }
    };

    fetchWhitelistData();
  }, []);

  // Handle adding a new IP to the whitelist
  const handleAddIp = async () => {
    // Basic validation
    if (!newIpAddress.trim()) {
      setIpError("IP address is required");
      return;
    }
    
    if (!newIpDescription.trim()) {
      setIpError("Description is required");
      return;
    }
    
    try {
      setIpError('');
      
      const result = await addIpToWhitelist(newIpAddress, newIpDescription);
      
      // Update the list with the new IP
      setIpWhitelist(prev => [result.ip, ...prev]);
      
      // Reset the form
      setNewIpAddress('');
      setNewIpDescription('');
      
      // Show success message
      setIpSuccess('IP address added to whitelist successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setIpSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error adding IP to whitelist:', error);
      setIpError(error instanceof Error ? error.message : 'Failed to add IP to whitelist');
    }
  };
  
  // Handle removing an IP from the whitelist
  const handleRemoveIp = async (id: string) => {
    try {
      await removeIpFromWhitelist(id);
      
      // Remove the IP from the list
      setIpWhitelist(prev => prev.filter(ip => ip.id !== id));
      
      // Show success message
      setIpSuccess('IP address removed from whitelist successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setIpSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error removing IP from whitelist:', error);
      setIpError(error instanceof Error ? error.message : 'Failed to remove IP from whitelist');
    }
  };
  
  // Handle toggling IP status (activate/deactivate)
  const handleToggleIpStatus = async (id: string, currentStatus: boolean) => {
    try {
      const result = await updateIpWhitelistStatus(id, !currentStatus);
      
      // Update the IP in the list
      setIpWhitelist(prev => prev.map(ip => 
        ip.id === id ? result.ip : ip
      ));
      
      // Show success message
      setIpSuccess(`IP address ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setIpSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating IP whitelist status:', error);
      setIpError(error instanceof Error ? error.message : 'Failed to update IP whitelist status');
    }
  };
  
  // Handle toggling whitelist feature (enable/disable)
  const handleToggleWhitelist = async () => {
    try {
      const result = await updateWhitelistStatus(!whitelistEnabled);
      setWhitelistEnabled(result.enabled);
      
      // Show success message
      setIpSuccess(`IP whitelist ${result.enabled ? 'enabled' : 'disabled'} successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setIpSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating whitelist status:', error);
      setIpError(error instanceof Error ? error.message : 'Failed to update whitelist status');
    }
  };

  return {
    ipWhitelist,
    whitelistEnabled,
    newIpAddress,
    setNewIpAddress,
    newIpDescription,
    setNewIpDescription,
    ipError,
    setIpError,
    ipSuccess,
    loading,
    handleAddIp,
    handleRemoveIp,
    handleToggleIpStatus,
    handleToggleWhitelist
  };
};