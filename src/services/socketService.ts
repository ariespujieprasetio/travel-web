"use client"
// src/services/socketService.ts - Updated with file upload support
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/src/store/authStore";

// API and WebSocket configuration
const API_URL = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5600';

// Socket singleton to avoid multiple connections
let socket: Socket | null = null;

/**
 * Get or initialize Socket.io connection with auth token from store
 * @returns Socket instance or null if not authenticated
 */
export function getSocket(): Socket | null {
  const { token, isAuthenticated } = useAuthStore.getState();
  
  // Only create a socket if we're authenticated
  if (!isAuthenticated() || !token) {
    return null;
  }
  
  if (!socket) {
    socket = io(API_URL, { 
      transports: ["websocket"],
      auth: {
        token: token
      }
    });
    
    // Setup global error handling
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
    
    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
    
    socket.on("error", (errorMsg) => {
      console.error("Socket general error:", errorMsg);
    });
  }
  
  return socket;
}

/**
 * Setup socket listener for a specific chat session
 * @param sessionId - The ID of the chat session
 * @param onMessageChunk - Callback for handling message chunks
 * @param onMessageComplete - Callback for handling message completion
 * @returns A cleanup function that removes the event listener
 */
export function setupChatListener(
  sessionId: string,
  onMessageChunk: (msg: string) => void,
  onMessageComplete: () => void
): () => void {
  const socketInstance = getSocket();
  
  if (!socketInstance) {
    console.error("Cannot setup listener: Socket not connected");
    return () => {};
  }
  
  const eventName = `msg-${sessionId}`;
  const errorEventName = `error-${sessionId}`;
  
  // Handler function for incoming messages
  const handleMessage = (msg: string) => {
    if (msg === "\n\0") {
      // End of message marker
      onMessageComplete();
    } else {
      // Check if this is a document message - if it is and it replaces a temporary one,
      // we need to handle it specially
      if (msg.includes('[Uploaded ') && msg.includes('file:') && msg.includes('Content:')) {
        // First send the chunk
        onMessageChunk(msg);
        
        // Then immediately complete the message to avoid streaming behavior for documents
        // This ensures the full document content appears at once
        onMessageComplete();
      } else {
        // Regular message chunk
        onMessageChunk(msg);
      }
    }
  };
  
  // Handler for session-specific errors
  const handleError = (errorMsg: string) => {
    console.error(`Error in session ${sessionId}:`, errorMsg);
  };
  
  // Register event handlers
  socketInstance.on(eventName, handleMessage);
  socketInstance.on(errorEventName, handleError);
  
  // Return cleanup function
  return () => {
    socketInstance.off(eventName, handleMessage);
    socketInstance.off(errorEventName, handleError);
  };
}

/**
 * Send a message through the socket
 * @param sessionId - The ID of the chat session
 * @param message - The message to send
 * @returns Promise that resolves when the message is sent
 */
export function sendMessage(sessionId: string, message: string, updateTitle:boolean = false): Promise<void> {
  return new Promise((resolve, reject) => {
    const socketInstance = getSocket();
    
    if (!socketInstance) {
      reject(new Error("Cannot send message: Socket not connected"));
      return;
    }
    
    try {
      socketInstance.emit("chat message", JSON.stringify({
        id: sessionId,
        msg: message,
        updateTitle,
      }));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Upload a document through the socket
 * @param sessionId - The ID of the chat session
 * @param fileData - Base64 encoded file data
 * @param fileName - Name of the file
 * @param fileType - MIME type of the file
 * @returns Promise that resolves when the file is uploaded
 */
export function uploadDocument(
  sessionId: string,
  fileData: string,
  fileName: string,
  fileType: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const socketInstance = getSocket();
    
    if (!socketInstance) {
      reject(new Error("Cannot upload document: Socket not connected"));
      return;
    }
    
    try {
      // Setup one-time error handler for this upload
      const errorHandler = (errorMsg: string) => {
        socketInstance.off(`error-${sessionId}`, errorHandler);
        reject(new Error(errorMsg));
      };
      
      socketInstance.once(`error-${sessionId}`, errorHandler);
      
      // Send the file data
      socketInstance.emit("upload_document", {
        sessionId,
        fileData,
        fileName,
        fileType
      });
      
      // Resolve immediately as the response will come through the message channel
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Disconnect the socket
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}