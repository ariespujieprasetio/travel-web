import { useAuthStore } from '../store/authStore';

// API URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND || 'https://backend.velutara.com';

// Chat session interface


export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  tagline: string;
  createdAt: string;
  updatedAt: string;
  save?: boolean; // Added save flag to mark important conversations
  messages?: ChatMessage[];
}
// Chat message interface
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: string;
  content: string;
  createdAt: string;
}

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
 * Get all chat sessions for the current user
 */
export async function getChatSessions(): Promise<ChatSession[]> {
  try {
    const response = await fetch(`${API_URL}/api/chat/sessions`, {
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

      throw new Error('Failed to fetch chat sessions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    throw error;
  }
}

/**
 * Get a specific chat session with its messages
 */
export async function getChatSession(sessionId: string): Promise<ChatSession> {
  try {
    const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}`, {
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

      throw new Error(`Failed to fetch chat session: ${sessionId}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching chat session ${sessionId}:`, error);
    throw error;
  }
}

/**
 * Create a new chat session
 */
export async function createChatSession(): Promise<ChatSession> {
  try {
    const response = await fetch(`${API_URL}/api/chat/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

      throw new Error('Failed to create chat session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
}

/**
 * Delete a chat session
 */
export async function deleteChatSession(sessionId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}`, {
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

      throw new Error(`Failed to delete chat session: ${sessionId}`);
    }
  } catch (error) {
    console.error(`Error deleting chat session ${sessionId}:`, error);
    throw error;
  }

  // In src/services/sessionService.ts - Add this method to the SessionManager class

  /**
   * Toggle the save status of a chat session
   * @param sessionId - The ID of the session to toggle
   * @returns Promise resolving to the updated session
   */
  
}

export async function toggleSaveSession(sessionId: string): Promise<ChatSession> {
  try {
    if (!sessionId) {
      throw new Error("No session ID provided");
    }

    // Make API call to toggle save status
    const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}/toggle-save`, {
      method: 'PUT',
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

      throw new Error(`Failed to toggle save status for session: ${sessionId}`);
    }

    const result = await response.json();
    const updatedSession = result.session;



    return updatedSession;
  } catch (error) {
    console.error(`Failed to toggle save status for session ${sessionId}:`, error);
    throw error;
  }
}


/*
 * update a history title
*/
export async function updateSessionTitle(sessionId: string, title: string, tagline: string) {
  const res = await fetch(`${API_URL}/api/chat/sessions/${sessionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ title, tagline }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Update failed');
  }

  return res.json();
}


