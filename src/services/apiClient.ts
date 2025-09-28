import { useAuthStore } from '../store/authStore';

// API base URL - update this to match your backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND || 'https://backend.velutara.com';


interface RequestOptions extends RequestInit {
  authenticated?: boolean;
}

/**
 * API client for making authenticated and non-authenticated requests
 */
const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { authenticated = true, headers = {}, ...restOptions } = options;
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>)
    };
    
    if (authenticated) {
      const token = useAuthStore.getState().token;
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error('Authentication required but no token found');
      }
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: requestHeaders,
      ...restOptions,
    });
    
    if (!response.ok) {
      // Handle 401 Unauthorized by logging out
      if (response.status === 401) {
        useAuthStore.getState().logout();
      }
      
      // Try to get error details from response
      let errorMessage = 'API request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse JSON, use generic error with status
        errorMessage = `Request failed with status ${response.status} ${e}`;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  },
  
  // Convenience methods
  get<T>(endpoint: string, options: RequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },
  
  post<T>(endpoint: string, data: Record<string, unknown>, options: RequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  put<T>(endpoint: string, data: Record<string, unknown>, options: RequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete<T>(endpoint: string, options: RequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};

export default apiClient;