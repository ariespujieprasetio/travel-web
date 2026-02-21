"use client"
// src/services/sessionService.ts
import * as apiService from "@/src/services/api";
import { ChatSession } from "@/src/services/api";
import { ApiMessage, formatApiMessagesToUiMessages } from "@/src/utils/chatUtils";
import { ChatMessage } from "@/src/utils/chatUtils";
import { getSocket, setupChatListener, sendMessage as socketSendMessage } from "@/src/services/socketService";

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

interface ChatSessionWindow extends Window {
  setChatSession?: (sessionId: string) => void;
  chatSessions?: ChatSession[];
}

export class SessionManager {
  private currentSessionId: string = "";
  private currentSessionSaved: boolean = false;
  private sessionsUpdatedCallback: ((sessions: ChatSession[]) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      (window as ChatSessionWindow).setChatSession = (sessionId: string) => {
        this.switchSession(sessionId);
      };
    }
  }

  public setupTitleUpdateListener(
    sessionId: string,
    onTitleUpdate: (title: string, tagline: string) => void
  ): () => void {

    if (isDemo) return () => {};

    if (!sessionId) return () => {};

    const socket = getSocket();
    if (!socket) return () => {};

    const eventName = `update-title-tagline-${sessionId}`;
    const handleTitleUpdate = (data: { title: string; tagline: string }) => {
      this.updateSessionInCache(sessionId, {
        title: data.title,
        tagline: data.tagline
      });
      onTitleUpdate?.(data.title, data.tagline);
    };

    socket.on(eventName, handleTitleUpdate);

    return () => {
      socket.off(eventName, handleTitleUpdate);
    };
  }

  private updateSessionInCache(sessionId: string, updates: Partial<ChatSession>): void {
    const sessions = this.loadSessionsFromStorage();
    if (!sessions) return;

    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return session;
    });

    this.saveSessionsToStorage(updatedSessions);
    this.notifySessionsUpdated(updatedSessions);
  }

  private loadSessionsFromStorage(): ChatSession[] | null {
    if (typeof window === 'undefined') return null;
    try {
      const sessionsJSON = sessionStorage.getItem('chatSessions');
      return sessionsJSON ? JSON.parse(sessionsJSON) : null;
    } catch {
      return null;
    }
  }

  private saveSessionsToStorage(sessions: ChatSession[]): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('chatSessions', JSON.stringify(sessions));
  }

  public onSessionsUpdated(callback: (sessions: ChatSession[]) => void): void {
    this.sessionsUpdatedCallback = callback;
  }

  public getCurrentSessionId(): string {
    return this.currentSessionId;
  }

  public getCurrentSessionSaved(): boolean {
    return this.currentSessionSaved;
  }

  public setCurrentSessionId(sessionId: string): void {
    this.currentSessionId = sessionId;
  }

  public setCurrentSessionSaved(save: boolean): void {
    this.currentSessionSaved = save;
  }

  private notifySessionsUpdated(sessions: ChatSession[]): void {
    this.sessionsUpdatedCallback?.(sessions);

    if (typeof window !== 'undefined') {
      (window as ChatSessionWindow).chatSessions = sessions;
      window.dispatchEvent(new CustomEvent('sessionsUpdated', { detail: sessions }));
    }
  }

  public async loadSessions(): Promise<ChatSession[]> {

    if (isDemo) {
      const now = new Date().toISOString()

      const demoSessions: ChatSession[] = [
        {
          id: "demo-1",
          title: "Exploring Japan Adventures",
          tagline: "Explore your next destination",
          updatedAt: now,
          createdAt: now,
          userId: "demo-user",
          save: false
        },
        {
          id: "demo-2",
          title: "Exploring Bali Getaway",
          tagline: "Plan your dream vacation",
          updatedAt: now,
          createdAt: now,
          userId: "demo-user",
          save: false
        }
      ];

      this.notifySessionsUpdated(demoSessions);
      return demoSessions;
    }

    const sessions = await apiService.getChatSessions();
    this.notifySessionsUpdated(sessions);
    return sessions;
  }

  public async createSession(): Promise<ChatSession> {

    if (isDemo) {
      const now = new Date().toISOString()

      const fakeSession: ChatSession = {
        id: `demo-${Date.now()}`,
        title: "New Demo Conversation",
        tagline: "UI Preview Only",
        updatedAt: now,
        createdAt: now,
        userId: "demo-user",
        save: false
      };

      this.setCurrentSessionId(fakeSession.id);
      this.setCurrentSessionSaved(false);
      sessionStorage.setItem('activeSessionId', fakeSession.id);

      return fakeSession;
    }

    sessionStorage.setItem('activeSessionId',"");

    const newSession = await apiService.createChatSession();
    this.setCurrentSessionId(newSession.id);
    this.setCurrentSessionSaved(newSession.save ?? false);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('activeSessionId', newSession.id);
    }

    await this.loadSessions();
    return newSession;
  }

  public async loadSession(sessionId: string): Promise<ChatMessage[]> {

    if (isDemo) {
      this.setCurrentSessionId(sessionId);
      return [
        {
          sender: "bot",
          text: "Hello! 👋 I'm your AI Travel Planner. Where would you like to go?"
        }
      ];
    }

    const sessionWithMessages = await apiService.getChatSession(sessionId);
    this.setCurrentSessionId(sessionId);

    return formatApiMessagesToUiMessages(
      (sessionWithMessages.messages ?? []) as ApiMessage[]
    );
  }

  public async switchSession(
    sessionId: string,
    onMessagesLoaded?: (messages: ChatMessage[]) => void
  ): Promise<void> {
    if (sessionId === this.currentSessionId) return;
    const messages = await this.loadSession(sessionId);
    onMessagesLoaded?.(messages);
  }

  public async sendMessage(message: string, updateTitle = false): Promise<void> {

    if (!this.currentSessionId) {
      throw new Error("No active session to send message to");
    }

    if (isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 300);
      });
    }

    return socketSendMessage(this.currentSessionId, message, updateTitle);
  }

  public setupMessageListener(
    onMessageChunk: (msg: string) => void,
    onMessageComplete: () => void
  ): () => void {

    if (isDemo) {

      const demoText =
`Sure! Here's a suggested 5-day itinerary ✈️

Day 1 — Arrival & City Walk  
Day 2 — Cultural Landmarks  
Day 3 — Local Cuisine Tour  
Day 4 — Nature Exploration  
Day 5 — Shopping & Departure`;

      let i = 0;

      const interval = setInterval(() => {
        if (i >= demoText.length) {
          clearInterval(interval);
          onMessageComplete();
          return;
        }
        onMessageChunk(demoText[i]);
        i++;
      }, 18);

      return () => clearInterval(interval);
    }

    if (!this.currentSessionId) return () => {};

    return setupChatListener(
      this.currentSessionId,
      onMessageChunk,
      onMessageComplete
    );
  }

  public removeSession(sessionId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const sessionsJSON = sessionStorage.getItem('chatSessions')
      if (!sessionsJSON) return

      const sessions: ChatSession[] = JSON.parse(sessionsJSON)
      const updatedSessions = sessions.filter(s => s.id !== sessionId)

      sessionStorage.setItem('chatSessions', JSON.stringify(updatedSessions))
      this.notifySessionsUpdated(updatedSessions)

      const activeSessionId = sessionStorage.getItem('activeSessionId')
      if (activeSessionId === sessionId) {
        sessionStorage.setItem('activeSessionId', '')
        this.setCurrentSessionId('')
      }

    } catch (e) {
      console.error('removeSession failed:', e)
    }
  }

  public cleanup(): void {
    if (typeof window !== 'undefined') {
      (window as ChatSessionWindow).setChatSession = undefined;
    }
  }
}

export const sessionManager = new SessionManager();