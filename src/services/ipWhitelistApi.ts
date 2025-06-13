// src/services/ipWhitelistApi.ts

import { useAuthStore } from '../store/authStore';
import { IpWhitelistEntry } from './dashboardApi';

// API URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND;

// Helper function to get auth header
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
 * Get all whitelisted IP addresses
 */
export async function getWhitelistedIps(): Promise<IpWhitelistEntry[]> {
  try {
    const response = await fetch(`${API_URL}/api/ip-whitelist`, {
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
      
      throw new Error('Failed to fetch IP whitelist');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching IP whitelist:', error);
    throw error;
  }
}

/**
 * Add an IP address to the whitelist
 */
export async function addIpToWhitelist(ipAddress: string, description: string): Promise<{ message: string; ip: IpWhitelistEntry }> {
  try {
    const response = await fetch(`${API_URL}/api/ip-whitelist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ ipAddress, description })
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      // Handle validation errors
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid IP address data');
      }
      
      throw new Error('Failed to add IP to whitelist');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding IP to whitelist:', error);
    throw error;
  }
}

/**
 * Remove an IP address from the whitelist
 */
export async function removeIpFromWhitelist(id: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_URL}/api/ip-whitelist/${id}`, {
      method: 'DELETE',
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
      
      // Handle not found error
      if (response.status === 404) {
        throw new Error('IP whitelist entry not found');
      }
      
      throw new Error('Failed to remove IP from whitelist');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing IP from whitelist:', error);
    throw error;
  }
}

/**
 * Update an IP whitelist entry (activate/deactivate)
 */
export async function updateIpWhitelistStatus(id: string, active: boolean, description?: string): Promise<{ message: string; ip: IpWhitelistEntry }> {
  try {
    const response = await fetch(`${API_URL}/api/ip-whitelist/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ 
        active,
        ...(description !== undefined && { description })
      })
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      // Handle not found error
      if (response.status === 404) {
        throw new Error('IP whitelist entry not found');
      }
      
      throw new Error('Failed to update IP whitelist status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating IP whitelist status:', error);
    throw error;
  }
}

/**
 * Get the whitelist status (enabled/disabled)
 */
export async function getWhitelistStatus(): Promise<{ enabled: boolean }> {
  try {
    const response = await fetch(`${API_URL}/api/ip-whitelist/status`, {
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
      
      throw new Error('Failed to get whitelist status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting whitelist status:', error);
    throw error;
  }
}

/**
 * Update the whitelist status (enable/disable)
 */
export async function updateWhitelistStatus(enabled: boolean): Promise<{ enabled: boolean }> {
  try {
    const response = await fetch(`${API_URL}/api/system/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        config: {
          security: {
            enableIpWhitelist: enabled
          }
        }
      })
    });
    
    if (!response.ok) {
      // Check for unauthorized response
      if (response.status === 401) {
        // Logout if unauthorized
        useAuthStore.getState().logout();
        throw new Error('Authentication expired');
      }
      
      throw new Error('Failed to update whitelist status');
    }
    
    // The response will include the full system config, but we just return the whitelist status
    const config = await response.json();
    return { enabled: config.security.enableIpWhitelist };
  } catch (error) {
    console.error('Error updating whitelist status:', error);
    throw error;
  }
}