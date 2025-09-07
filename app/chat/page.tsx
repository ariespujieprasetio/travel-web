"use client"
// app/chat/page.tsx - Updated with title and tagline support
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { useRouter } from "next/navigation";
import LogoIcon from "@/src/LogoIcon";
import { useAuthStore } from "@/src/store/authStore";
import { sessionManager } from "@/src/services/sessionService";
import { 
  ChatMessage, 
} from "@/src/utils/chatUtils";
import ChatMessageComponent from "@/src/components/ChatMessage";
import FileUploadButton from "@/src/components/FileUploadButton";
import { exportModeledItineraryToPDF } from "@/src/services/exportService";

export default function ChatPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentBotMessage, setCurrentBotMessage] = useState("");
  const [input, setInput] = useState("");
  const [showPrompts, setShowPrompts] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // New state for title and tagline
  const [sessionTitle, setSessionTitle] = useState("Travel Assistant");
  const [sessionTagline, setSessionTagline] = useState("");
  
  // Auth and router
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  // Sample quick prompts
  const quickPrompts = [
    "Suggest a 5-day Paris itinerary",
    "Suggest a 6-day Tokyo exploration",
    "Suggest a 7-day Rome journey",
    "Suggest a 5-day Berlin adventure",
    "Suggest a 6-day New York expedition",
    "Suggest a 7-day Barcelona cultural tour",
    "Suggest a 5-day London research trip",
    "Suggest a 6-day Sydney urban exploration",
    "Suggest a 7-day Cairo historical journey",
    "Suggest a 5-day Singapore innovation tour"
  ];
  
  
  // Handle authentication and initialization
  useEffect(() => {
    const initChat = async () => {
      try {
        if (!isAuthenticated()) {
          router.push('/login');
          return;
        }
        
        setLoading(true);
        
        // Load or create a session
        const sessions = await sessionManager.loadSessions();
        
        if (sessions.length > 0) {
          // Try to load the session from storage or use the first one
          const storedSessionId = sessionStorage.getItem('activeSessionId');
     
          
       
          const sessionMessages = await sessionManager.loadSession(storedSessionId!);
          setMessages(sessionMessages);
        } else {
          // Create a new session if none exist
          await sessionManager.createSession();
          
          // Tell the server to initialize (empty first message)
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setError("Failed to initialize chat. Please refresh and try again.");
        setLoading(false);
      }
    };
    
    initChat();
  }, [isAuthenticated, router]);
  
  // Set up title update listener for the active session
  useEffect(() => {
    const currentSessionId = sessionManager.getCurrentSessionId();
    if (!currentSessionId) return;
    
    // Set up listener for title updates
    const titleUpdateCleanup = sessionManager.setupTitleUpdateListener(
      currentSessionId,
      (title, tagline) => {
        console.log("Title update received:", title, tagline);
        setSessionTitle(title);
        setSessionTagline(tagline);
      }
    );
    
    return () => {
      titleUpdateCleanup();
    };
  }, [messages.length]); // Re-establish when messages change or session changes
  
  // Set up message listener for the active session
  useEffect(() => {
    // Only setup listener when we have an active session
    if (sessionManager.getCurrentSessionId()) {
      const cleanup = sessionManager.setupMessageListener(
        // Handle message chunk
        (msg: string) => {
          // Append to current message
          setCurrentBotMessage(prev => prev + msg);
          
          // Scroll to bottom
          if (containerRef.current) {
            containerRef.current.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }
        },
        // Handle message complete
        () => {
          // Add complete message to list and clear current
          setCurrentBotMessage(prevMsg => {
            if (prevMsg.trim() !== "") {
              setMessages(prev => [...prev, { sender: "bot", text: prevMsg }]);
            }
            return "";
          });
        }
      );
      
      // Return cleanup function
      return cleanup;
    }
  }, [messages.length]); // Re-establish listener when messages change
  
  // Handle session switching from external sources
  useEffect(() => {
    const handleSessionSwitch = async (event: Event) => {
      try {
        interface SessionSelectedEvent extends CustomEvent {
          detail: string; // The session ID
        }
        const sessionEvent = event as SessionSelectedEvent;
        const sessionId = sessionEvent.detail;
        if (!sessionId) return;
        
        setLoading(true);
        
        // Get session data to update the title and tagline
        const sessions = await sessionManager.loadSessions();
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          setSessionTitle(session.title || "Travel Assistant");
          setSessionTagline(session.tagline || "");
        }
        
        await sessionManager.switchSession(sessionId, (loadedMessages) => {
          setMessages(loadedMessages);
          setCurrentBotMessage("");
        });
        setLoading(false);
      } catch (err) {
        console.error("Error switching session:", err);
        setError("Failed to switch chat session. Please try again.");
        setLoading(false);
      }
    };
    
    // Add event listener for session switching
    window.addEventListener('sessionSelected', handleSessionSwitch);
    
    return () => {
      window.removeEventListener('sessionSelected', handleSessionSwitch);
    };
  }, []);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (input.trim() === "" || loading || uploading) return;
    
    try {
      // Add user message to UI immediately
      setMessages(prev => [...prev, { sender: "user", text: input }]);
      
      // Clear input
      setInput("");
      
      // Hide prompts after sending
      setShowPrompts(false);
      
      // Send message
      await sessionManager.sendMessage(input, messages.length == 0);
      
      // Scroll to bottom
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
    }
  };
  
  // Handle file upload events
  const handleUploadStart = () => {
    setUploading(true);
    setUploadError(null);
  };
  
  const handleUploadComplete = () => {
    setUploading(false);
  };
  
  const handleUploadError = (errorMsg: string) => {
    setUploading(false);
    setUploadError(errorMsg);
    
    // Clear error after 5 seconds
    setTimeout(() => setUploadError(null), 5000);
  };
  
  // Handle file uploaded by adding a temporary message to chat
  const handleFileUploaded = (fileName: string) => {
    // Get file extension from filename
    const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'FILE';
    
    // Create a temporary upload message to show immediately
    const uploadMessage: ChatMessage = {
      sender: 'user',
      text: `[Uploaded ${fileExtension} file: ${fileName}]\n\nContent: Processing document...`
    };
    
    // Add message to chat history
    setMessages(prev => [...prev, uploadMessage]);
    
    // Scroll to bottom after adding message
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };
  
  // Handle quick prompt selection
  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    setShowPrompts(false);
  };
  
  // Handle new chat
  const handleNewChat = async () => {
    try {
      setLoading(true);
      // Create a new session
      await sessionManager.createSession();
      // Clear messages
      setMessages([]);
      setCurrentBotMessage("");
      // Reset title and tagline for new chat
      setSessionTitle("Travel Assistant");
      setSessionTagline("");
      setLoading(false);
    } catch (err) {
      console.error("Failed to create new chat:", err);
      setError("Failed to create new chat. Please try again.");
      setLoading(false);
    }
  };
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      // Nothing specific to clean up here since our services handle their own cleanup
    };
  }, []);
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Loading Travel Assistant...</h2>
          <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-red-600">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md w-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col h-[100vh]">
      {/* Chat Header - Desktop version (hidden on mobile) */}
      <div className="hidden lg:flex justify-between p-4 text-lg font-bold shadow-sm bg-white">
        <div>
          <header>{sessionTitle}</header>
          {sessionTagline && (
            <p className="text-sm font-normal text-gray-500">{sessionTagline}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">
            Connected
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={containerRef}
        className="flex-grow flex flex-col gap-3 p-4 overflow-y-auto bg-gray-50"
        style={{ height: 'calc(100vh - 180px)' }}
      >
        {messages.map((msg, i) => (
          <ChatMessageComponent key={i} message={msg} />
        ))}
        
        {currentBotMessage && (
          <div className="max-w-full sm:max-w-[85%] md:max-w-3xl mr-auto">
            <div className="flex gap-1 items-center">
              <div>
                <LogoIcon width={20} height={20} color="#1F2937" />
              </div>
              <h3 className="font-semibold">
                Travel Assistant
                <span className="ml-2 font-normal text-xs sm:text-sm text-gray-500">typing...</span>
              </h3>
            </div>
            <div className="mt-1 p-3 sm:p-4 rounded-lg bg-white text-gray-700 shadow-sm">
              <Markdown  
                components={{
                  table: ({ ...props }) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-200" {...props} />
                    </div>
                  ),
                  thead: ({ ...props }) => (
                    <thead className="bg-gray-100" {...props} />
                  ),
                  tbody: ({ ...props }) => (
                    <tbody className="bg-indigo-100" {...props} />
                  ),
                  th: ({ ...props }) => (
                    <th className="px-2 sm:px-4 py-2 border border-gray-200 text-left text-xs sm:text-sm font-medium text-gray-700" {...props} />
                  ),
                  td: ({ ...props }) => (
                    <td className="px-2 sm:px-4 py-2 border border-gray-200 text-xs sm:text-sm text-gray-900" {...props} />
                  ),
                }} 
                remarkPlugins={[remarkGfm]}
              >
                {currentBotMessage}
              </Markdown>
            </div>
          </div>
        )}
        
        {/* Upload Error Message */}
        {uploadError && (
          <div className="mx-auto px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm">
            <p className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {uploadError}
            </p>
          </div>
        )}
      </div>

      {/* Quick Prompts Panel */}
      {showPrompts && (
        <div className="absolute bottom-[76px] left-0 right-0 bg-white shadow-md rounded-t-lg mx-2 sm:mx-10 md:mx-20 overflow-hidden z-10">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Quick Prompts</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowPrompts(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b text-sm transition"
                onClick={() => handleQuickPrompt(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Header with Sidebar Toggle */}
      <div className="flex items-center p-4 border-b bg-white lg:hidden">
        <button
          className="text-gray-700 mr-3"
          onClick={() => {
            // This toggles sidebar - we assume this function is defined in the layout
            // Dispatch a custom event that layout can listen for
            const event = new CustomEvent('toggleSidebar');
            window.dispatchEvent(event);
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">{sessionTitle}</h1>
          {sessionTagline && (
            <p className="text-xs text-gray-500">{sessionTagline}</p>
          )}
        </div>
      </div>

      {/* Bottom Menu and Chat Input */}
      <div className="w-full bg-white border-t mt-auto">
        {/* Bottom Menu */}
        <div className="grid grid-cols-4 divide-x border-b">
          <button 
            onClick={handleNewChat}
            className="flex flex-col items-center justify-center py-2 text-gray-600 hover:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs">New Chat</span>
          </button>
          
          <button 
            onClick={() => setShowPrompts(!showPrompts)}
            className={`flex flex-col items-center justify-center py-2 transition ${showPrompts ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-xs">Prompts</span>
          </button>
          
          <button 
            className="flex flex-col items-center justify-center py-2 text-gray-600 hover:bg-gray-50 transition"
            onClick={() => router.push('/settings')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">Settings</span>
          </button>
          
          {/* <button 
            className="flex flex-col items-center justify-center py-2 text-gray-600 hover:bg-gray-50 transition"
            onClick={() => window.open('/help', '_blank')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">Help</span>
          </button> */}
        </div>
        
        {/* Chat Input */}
        <div className="px-2 sm:px-6 md:px-10 lg:px-20 py-3">
          <div className="p-2 shadow-md flex items-center border border-gray-300 rounded-lg bg-white">
            {/* File Upload Button */}
            {sessionManager.getCurrentSessionId() && (
              <div className="ml-1 mr-2">
                <FileUploadButton
                  sessionId={sessionManager.getCurrentSessionId()}
                  onUploadStart={handleUploadStart}
                  onUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  onFileUploaded={handleFileUploaded}
                />
              </div>
            )}
            
            <input
              type="text"
              placeholder="Ask about travel destinations..."
              className="flex-1 p-2 outline-none text-sm sm:text-base"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={loading || uploading}
            />
            <button 
              onClick={handleSendMessage} 
              className={`ml-2 px-3 sm:px-4 py-2 text-white rounded-md transition disabled:bg-gray-400 text-sm sm:text-base
                ${loading || uploading ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              disabled={loading || uploading || input.trim() === ""}
            >
              {loading || uploading ? (
                <span className="flex items-center gap-1">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span className="hidden sm:inline">{uploading ? 'Uploading...' : 'Sending...'}</span>
                </span>
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
        </div>
      </div>

      
      <div className="hidden lg:flex justify-between p-4 text-lg font-bold shadow-sm bg-white">
        <div>
          <header>{sessionTitle}</header>
          {sessionTagline && <p className="text-sm font-normal text-gray-500">{sessionTagline}</p>}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">Connected</span>

          {/* Export Modeled Itinerary (sesuai sys-new.txt) */}
          <button
            onClick={() =>
              exportModeledItineraryToPDF(
                // kirim raw messages; parser akan ambil pesan bot terbaru yg berisi itinerary modeled
                messages.map(m => ({ sender: m.sender, text: m.text })),
                `velutara-itinerary-${sessionManager.getCurrentSessionId()}.pdf`,
              )
            }
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
          >
            Export Itinerary (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}