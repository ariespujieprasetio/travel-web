"use client"
// src/services/sessionService.ts
import * as apiService from "@/src/services/api";
import { ChatSession } from "@/src/services/api";
import { ApiMessage, formatApiMessagesToUiMessages } from "@/src/utils/chatUtils";
import { ChatMessage } from "@/src/utils/chatUtils";
import { getSocket, setupChatListener, sendMessage as socketSendMessage } from "@/src/services/socketService";


interface ChatSessionWindow extends Window {
  setChatSession?: (sessionId: string) => void;
  chatSessions?: ChatSession[];
}
/**
 * Manages chat sessions and their state
 */
export class SessionManager {
  private currentSessionId: string = "";
  private currentSessionSaved: boolean = false;
  private sessionsUpdatedCallback: ((sessions: ChatSession[]) => void) | null = null;
  
  /**
   * Initialize the session manager and link to global window
   */
  constructor() {
    // Register the session switcher on window
    if (typeof window !== 'undefined') {
      (window as ChatSessionWindow).setChatSession = (sessionId: string) => {
        console.log(sessionId)
        this.switchSession(sessionId);
      };
    }
  }

  
  // Add this method to your SessionManager class
  /**
   * Set up a listener for title updates on a specific session
   * @param sessionId - The ID of the session to listen for title updates on
   * @param onTitleUpdate - Callback for when the title is updated
   * @returns Cleanup function to remove the listener
   */
  public setupTitleUpdateListener(
    sessionId: string,
    onTitleUpdate: (title: string, tagline: string) => void
  ): () => void {
    if (!sessionId) {
      console.error("Cannot setup title listener: No active session");
      return () => {};
    }
    
    const socket = getSocket();
    if (!socket) {
      console.error("Cannot setup title listener: Socket not connected");
      return () => {};
    }
    
    // Set up event listener for title updates
    const eventName = `update-title-tagline-${sessionId}`;
    const handleTitleUpdate = (data: { title: string; tagline: string }) => {
      console.log(`Title updated for session ${sessionId}:`, data);
      
      // Update our local sessions list if we have one
      this.updateSessionInCache(sessionId, {
        title: data.title,
        tagline: data.tagline
      });
      
      // Call the callback with the new data
      if (onTitleUpdate) {
        onTitleUpdate(data.title, data.tagline);
      }
    };
    
    socket.on(eventName, handleTitleUpdate);
    
    // Return cleanup function
    return () => {
      socket.off(eventName, handleTitleUpdate);
    };
  }
  
  /**
   * Helper method to update a session in the local cache
   * @param sessionId - The ID of the session to update
   * @param updates - Object with properties to update
   */
  private updateSessionInCache(sessionId: string, updates: Partial<ChatSession>): void {
    // Load sessions
    const sessions = this.loadSessionsFromStorage();
    if (!sessions) return;
    
    // Find and update the session
    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          ...updates,
          updatedAt: new Date().toISOString() // Update the timestamp
        };
      }
      return session;
    });
    
    // Save updated sessions back to storage
    this.saveSessionsToStorage(updatedSessions);
    
    // Notify about the update
    this.notifySessionsUpdated(updatedSessions);
  }
  
  /**
   * Load sessions from storage
   * @returns Array of sessions or null if not available
   */
  private loadSessionsFromStorage(): ChatSession[] | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessionsJSON = sessionStorage.getItem('chatSessions');
      return sessionsJSON ? JSON.parse(sessionsJSON) : null;
    } catch (e) {
      console.error('Error loading sessions from storage:', e);
      return null;
    }
  }
  
  /**
   * Save sessions to storage
   * @param sessions - The sessions to save
   */
  private saveSessionsToStorage(sessions: ChatSession[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem('chatSessions', JSON.stringify(sessions));
    } catch (e) {
      console.error('Error saving sessions to storage:', e);
    }
  }
  
  /**
   * Set a callback for when sessions are updated
   * @param callback - Function to call when sessions change
   */
  public onSessionsUpdated(callback: (sessions: ChatSession[]) => void): void {
    this.sessionsUpdatedCallback = callback;
  }
  
  /**
   * Get the current session ID
   * @returns The current session ID
   */
  public getCurrentSessionId(): string {
    return this.currentSessionId;
  }
  public getCurrentSessionSaved(): boolean {
    return this.currentSessionSaved;
  }
  
  /**
   * Set the current session ID
   * @param sessionId - The session ID to set as current
   */
  public setCurrentSessionId(sessionId: string): void {
    this.currentSessionId = sessionId;
  }
  public setCurrentSessionSaved(save: boolean): void {
    this.currentSessionSaved = save;
  }
  /**
   * Notify about sessions update
   * @param sessions - The updated sessions list
   */
  private notifySessionsUpdated(sessions: ChatSession[]): void {
    if (this.sessionsUpdatedCallback) {
      this.sessionsUpdatedCallback(sessions);
    }
    
    // Also update the global window reference
    if (typeof window !== 'undefined') {
      (window as ChatSessionWindow).chatSessions = sessions;
      
      // Dispatch custom event for any other components listening
      const event = new CustomEvent('sessionsUpdated', { detail: sessions });
      window.dispatchEvent(event);
    }
  }
  
  /**
   * Load all chat sessions
   * @returns Promise resolving to all chat sessions
   */
  public async loadSessions(): Promise<ChatSession[]> {
    try {
      const sessions = await apiService.getChatSessions();
      this.notifySessionsUpdated(sessions);
      return sessions;
    } catch (error) {
      console.error("Failed to load sessions:", error);
      throw error;
    }
  }
  
  /**
   * Create a new chat session
   * @returns Promise resolving to the new session
   */
  public async createSession(): Promise<ChatSession> {
    try {
      sessionStorage.setItem('activeSessionId',"");

      const newSession = await apiService.createChatSession();
      
      // Update the current session ID
      this.setCurrentSessionId(newSession.id);
      this.setCurrentSessionSaved(newSession.save ?? false);
      
      // Store the session ID in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('activeSessionId', newSession.id);
      }
      
      // Update the sessions list
      await this.loadSessions();
      
      return newSession;
    } catch (error) {
      console.error("Failed to create new session:", error);
      throw error;
    }
  }
  /**
 * Load a specific session with its messages
 * @param sessionId - The ID of the session to load
 * @returns Promise resolving to formatted chat messages
 */
public async loadSession(sessionId: string): Promise<ChatMessage[]> {
  try {
    console.log(sessionId)
    // Get the session with messages
    const sessionWithMessages = await apiService.getChatSession(sessionId);
    
    // Store the session ID
    this.setCurrentSessionId(sessionId);
    
    if (typeof window !== 'undefined') {
      // sessionStorage.setItem('activeSessionId', sessionId);
    }
    
    // Format messages for UI - cast to ApiMessage[] since we know the structure is compatible
    return formatApiMessagesToUiMessages(
      (sessionWithMessages.messages ?? []) as ApiMessage[]
    );
  } catch (error) {
    console.error(`Failed to load session ${sessionId}:`, error);
    throw error;
  }
}
  /**
   * Switch to a different chat session
   * @param sessionId - The ID of the session to switch to
   * @param onMessagesLoaded - Callback for when messages are loaded
   * @returns Promise resolving when the switch is complete
   */
  public async switchSession(
    sessionId: string,
    onMessagesLoaded?: (messages: ChatMessage[]) => void
  ): Promise<void> {
    try {
      if (sessionId === this.currentSessionId) return; // Already on this session
      
      const messages = await this.loadSession(sessionId);
      
      if (onMessagesLoaded) {
        onMessagesLoaded(messages);
      }
    } catch (error) {
      console.error(`Failed to switch to session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Send a message in the current session
   * @param message - The message to send
   * @returns Promise resolving when the message is sent
   */
  public async sendMessage(message: string, updateTitle = false): Promise<void> {
    if (!this.currentSessionId) {
      throw new Error("No active session to send message to");
    }
    
    return socketSendMessage(this.currentSessionId, message, updateTitle);
  }
  
  /**
   * Set up a listener for incoming messages on the current session
   * @param onMessageChunk - Callback for each message chunk
   * @param onMessageComplete - Callback for when a message is complete
   * @returns Cleanup function to remove the listener
   */
  public setupMessageListener(
    onMessageChunk: (msg: string) => void,
    onMessageComplete: () => void
  ): () => void {
    if (!this.currentSessionId) {
      console.error("Cannot setup listener: No active session");
      return () => {};
    }
    
    return setupChatListener(
      this.currentSessionId,
      onMessageChunk,
      onMessageComplete
    );
  }
  
  /**
   * Clean up the session manager
   */
  public cleanup(): void {
    if (typeof window !== 'undefined') {
      (window as ChatSessionWindow).setChatSession = undefined;
    }
  }
  
}


// Create singleton instance
export const sessionManager = new SessionManager();
