// src/hooks/usePasswordReset.ts
import { useState, useCallback } from 'react';
import passwordResetService from '@/src/services/passwordResetService';

interface PasswordResetState {
  loading: boolean;
  success: boolean;
  error: string | null;
  validToken: boolean | null;
  isComplete: boolean;
}

/**
 * Hook for managing password reset operations
 */
export function usePasswordReset() {
  const [state, setState] = useState<PasswordResetState>({
    loading: false,
    success: false,
    error: null,
    validToken: null,
    isComplete: false
  });

  /**
   * Request a password reset for a specific email
   */
  const requestReset = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await passwordResetService.requestReset(email);
      
      setState(prev => ({
        ...prev,
        loading: false,
        success: response.success,
        error: response.success ? null : response.message
      }));
      
      return response.success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to request password reset'
      }));
      
      return false;
    }
  }, []);

  /**
   * Validate a password reset token
   */
  const validateToken = useCallback(async (email: string, token: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await passwordResetService.validateToken(email, token);
      
      setState(prev => ({
        ...prev,
        loading: false,
        validToken: response.valid,
        error: response.valid ? null : 'Invalid or expired reset token'
      }));
      
      return response.valid;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        validToken: false,
        error: error instanceof Error ? error.message : 'Failed to validate token'
      }));
      
      return false;
    }
  }, []);

  /**
   * Reset a user's password with a valid token
   */
  const resetPassword = useCallback(async (email: string, token: string, newPassword: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await passwordResetService.resetPassword(email, token, newPassword);
      
      setState(prev => ({
        ...prev,
        loading: false,
        success: response.success,
        error: response.success ? null : response.message,
        isComplete: response.success
      }));
      
      return response.success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset password'
      }));
      
      return false;
    }
  }, []);

  /**
   * Clear the current state
   */
  const clearState = useCallback(() => {
    setState({
      loading: false,
      success: false,
      error: null,
      validToken: null,
      isComplete: false
    });
  }, []);

  return {
    ...state,
    requestReset,
    validateToken,
    resetPassword,
    clearState
  };
}

export default usePasswordReset;