/**
 * Authentication utilities for managing tokens and user sessions
 */

// The token storage key in localStorage
const TOKEN_KEY = 'travel_assistant_token';

/**
 * Set the authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Get the authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Check if a user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Parse JWT token to get user information
 * Note: This is not a secure way to validate tokens, just to extract info
 */

interface JwtPayload {
    userId: string;
    email: string;
    [key: string]: unknown;
  }
  
export const parseJwt = (token: string): JwtPayload | null => {
    try {
      return JSON.parse(atob(token.split('.')[1])) as JwtPayload;
    } catch {
      return null;
    }
  };

/**
 * Get user info from the token
 */
export const getUserInfo = (): { userId?: string; email?: string } | null => {
  const token = getAuthToken();
  if (!token) return null;
  
  const parsed = parseJwt(token);
  return parsed ? { userId: parsed.userId, email: parsed.email } : null;
};