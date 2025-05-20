// src/services/passwordResetService.ts
import apiClient from './apiClient';

export interface RequestPasswordResetResponse {
  success: boolean;
  message: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Password reset service containing all functionality for handling the password reset flow
 */
const passwordResetService = {
  /**
   * Request a password reset for a specific email
   * @param email The user's email address
   * @returns Promise resolving to a response indicating success or failure
   */
  requestReset: async (email: string): Promise<RequestPasswordResetResponse> => {
    try {
      const response = await apiClient.post<RequestPasswordResetResponse>(
        '/api/password-reset/request',
        { email },
        { authenticated: false }
      );
      
      return response;
    } catch (error) {
      // If the API call fails, we still return a standardized response
      // The actual error message would have been thrown by apiClient
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to request password reset'
      };
    }
  },
  
  /**
   * Validate a password reset token
   * @param email The user's email address
   * @param token The reset token from the URL
   * @returns Promise resolving to a validation result
   */
  validateToken: async (email: string, token: string): Promise<ValidateTokenResponse> => {
    try {
      const response = await apiClient.get<ValidateTokenResponse>(
        `/api/password-reset/validate?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
        { authenticated: false }
      );
      
      return response;
    } catch (error) {
      // If validation fails, return invalid status
      console.log(error)
      return { valid: false };
    }
  },
  
  /**
   * Reset a user's password with a valid token
   * @param email The user's email address
   * @param token The valid reset token
   * @param newPassword The new password to set
   * @returns Promise resolving to a response indicating success or failure
   */
  resetPassword: async (
    email: string,
    token: string,
    newPassword: string
  ): Promise<ResetPasswordResponse> => {
    try {
      const response = await apiClient.post<ResetPasswordResponse>(
        '/api/password-reset/reset',
        { email, token, newPassword },
        { authenticated: false }
      );
      
      return response;
    } catch (error) {
      // If the API call fails, we return a standardized response object
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to reset password'
      };
    }
  }
};

export default passwordResetService;