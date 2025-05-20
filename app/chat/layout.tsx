"use client"
// app/chat/layout.tsx
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import "../globals.css"
import Typography from "@/src/components/Typography"
import GradientButton from "@/src/components/GradientButton"
import { useAuthStore } from "@/src/store/authStore"
import { ChatSession, updateSessionTitle } from "@/src/services/api"
import { sessionManager } from "@/src/services/sessionService"
import { formatDate } from "@/src/utils/chatUtils"
import Image from 'next/image'
import Link from "next/link"


interface Session {
  id: string;
  title?: string;
  tagline?: string;
  updatedAt: string;
}

// Props untuk komponen
interface ChatHistoryProps {
  sessions: Session[];
  switchSession: (id: string) => void;
  updateSessionTitleInParent: (sessionId: string, title: string, tagline: string) => Promise<void>;
}

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(false)
  const [startingNewChat, setStartingNewChat] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const router = useRouter()

  // Load sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        if (!isAuthenticated()) {
          router.push('/login')
          return
        }

        // Register for session updates
        sessionManager.onSessionsUpdated((updatedSessions) => {
          setSessions(updatedSessions)
        })

        // Initial load
        const chatSessions = await sessionManager.loadSessions()
        setSessions(chatSessions)
      } catch (error) {
        console.error("Failed to load sessions:", error)
      }
    }

    loadSessions()

    // Listen for session updates from other components
    const handleSessionsUpdated = (event: CustomEvent) => {
      setSessions(event.detail)
    }

    window.addEventListener('sessionsUpdated', handleSessionsUpdated as EventListener)

    // Listen for sidebar toggle events from chat page
    const handleToggleSidebar = () => {
      setSidebarOpen(!sidebarOpen)
    }

    window.addEventListener('toggleSidebar', handleToggleSidebar)

    // Close sidebar on window resize if screen becomes larger
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('sessionsUpdated', handleSessionsUpdated as EventListener)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('toggleSidebar', handleToggleSidebar)
    }
  }, [isAuthenticated, router, sidebarOpen])

  // Handle logout
  const handleLogout = () => {
    // Clean up state
    logout()

    // Redirect to login
    router.push('/login')
  }

  // Start a new chat session
  const startNewChat = async () => {
    try {
      setLoading(true)
      setStartingNewChat(true)

      // Create a new chat session via the session manager
      const newSession = await sessionManager.createSession()

      // Set as active session in storage
      sessionStorage.setItem('activeSessionId', newSession.id)
      setLoading(false)
      setStartingNewChat(false)

      // Reload the page instead of using the event system
      // This ensures a completely fresh state for the new chat
      // window.location.href = '/chat'

    } catch (err) {
      console.error("Failed to start new chat:", err)
      setLoading(false)
      setStartingNewChat(false)
    }
  }

  // Switch to a different chat session
  const switchSession = (sessionId: string) => {
    // Store the session ID in sessionStorage
    sessionStorage.setItem('activeSessionId', sessionId)

    const event = new CustomEvent('sessionSelected', { detail: sessionId })
    window.dispatchEvent(event)

    // Close sidebar on mobile after selecting a session
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }


  // update history title
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titles, setTitles] = useState<Record<string, string>>({});

  const handleTitleChange = (sessionId: string, value: string) => {
    setTitles((prev) => ({ ...prev, [sessionId]: value }));
  };

  const saveTitle = async (session: ChatSession) => {
    const newTitle = titles[session.id];
    if (!newTitle || newTitle === session.title) {
      setEditingId(null);
      return;
    }
    try {
      const updated = await updateSessionTitle(session.id, newTitle, session.tagline ?? '');
      // Update sessions state lokal agar UI langsung berubah
      setSessions((prev) =>
        prev.map((s) =>
          s.id === session.id ? { ...s, title: updated.title, updatedAt: updated.updatedAt } : s
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error('Failed to update title:', err);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-30 lg:z-auto
          w-[280px] sm:w-[320px] lg:w-[25%] 
          min-h-screen bg-white border-r shadow-md 
          flex flex-col
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'left-0' : '-left-[320px] lg:left-0'}
        `}
      >
        {/* Chatbot Name */}
        <div className="flex items-center gap-2 mb-6 p-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white">
            <Image src={"/android-chrome-512x512.png"} width={240} height={240} alt="logo" />
          </div>
          <Link href={"/dashboard"}>
            <Typography variant="h1" className="text-xl font-bold">VELUTARA</Typography>
          </Link>

          {/* Close Sidebar Button (Mobile Only) */}
          <button
            className="ml-auto text-gray-500 hover:text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-6">
          <button
            className={`py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow hover:shadow-md transition w-full text-left flex gap-2 items-center ${startingNewChat ? 'opacity-75' : ''}`}
            onClick={startNewChat}
            disabled={loading || startingNewChat}
          >
            {loading || startingNewChat ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span className="text-white font-bold">+</span>
                <span>New Chat</span>
              </>
            )}
          </button>
        </div>

        {/* History Section */}
        <div className="mt-6 text-gray-600 px-6 flex-grow overflow-hidden flex flex-col">
      <div className="font-medium text-sm uppercase tracking-wider mb-3 text-gray-500">
        Recent Conversations
      </div>
      <div className="max-h-[calc(100vh-380px)] overflow-y-auto space-y-3 pr-2 flex-grow">
        {sessions.length === 0 && (
          <div className="text-sm text-gray-500 italic p-4 text-center border border-dashed border-gray-200 rounded-lg">
            No chat history yet
          </div>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            className="py-3 px-4 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors border border-gray-100 hover:border-purple-200"
            onClick={() => switchSession(session.id)}
          >
            {editingId === session.id ? (
              <input
                className="font-medium text-gray-800 bg-white rounded px-2 py-1 text-sm w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                autoFocus
                value={titles[session.id] ?? session.title ?? ""}
                onChange={(e) => handleTitleChange(session.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    await saveTitle(session);
                    setEditingId(null);
                  }
                }}
                onBlur={() => setEditingId(null)}
              />
            ) : (
              <div
                className="font-medium text-gray-800 truncate"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setEditingId(session.id);
                  setTitles((prev) => ({ ...prev, [session.id]: session.title ?? "" }));
                }}
              >
                {session.title || "New Conversation"}
              </div>
            )}

            {session.tagline && (
              <div className="text-xs text-gray-600 truncate max-w-full">{session.tagline}</div>
            )}
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500 truncate max-w-[70%]">Last updated</div>
              <div className="text-xs text-gray-400">{new Date(session.updatedAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

        {/* User Info */}
        <div className="mt-auto pt-4 border-t border-gray-100 px-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg">
              {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U'}
            </div>
            <div>
              <p className="font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || ''}</p>
            </div>
          </div>

          {/* Logout Button */}
          <GradientButton
            onClick={handleLogout}
            fullWidth
            leadingIcon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            }
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
            }}
          >
            Log Out
          </GradientButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full lg:w-[75%] bg-gray-50 min-h-full">
        {!loading && children}
      </main>
    </div>
  )
}