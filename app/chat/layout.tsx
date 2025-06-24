"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import "../globals.css"
import Typography from "@/src/components/Typography"
import GradientButton from "@/src/components/GradientButton"
import { useAuthStore } from "@/src/store/authStore"
import { ChatSession, updateSessionTitle, deleteChatSession } from "@/src/services/api"
import { sessionManager } from "@/src/services/sessionService"
import Image from 'next/image'
import Link from "next/link"

interface Session {
  id: string
  title?: string
  tagline?: string
  updatedAt: string
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(false)
  const [startingNewChat, setStartingNewChat] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [titles, setTitles] = useState<Record<string, string>>({})
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null)

  const { isAuthenticated, user, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const loadSessions = async () => {
      try {
        if (!isAuthenticated()) {
          router.push('/login')
          return
        }
        sessionManager.onSessionsUpdated((updatedSessions) => {
          setSessions(updatedSessions)
        })
        const chatSessions = await sessionManager.loadSessions()
        setSessions(chatSessions)
      } catch (error) {
        console.error("Failed to load sessions:", error)
      }
    }

    loadSessions()

    const handleSessionsUpdated = (event: CustomEvent) => {
      setSessions(event.detail)
    }

    const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen)

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('sessionsUpdated', handleSessionsUpdated as EventListener)
    window.addEventListener('toggleSidebar', handleToggleSidebar)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('sessionsUpdated', handleSessionsUpdated as EventListener)
      window.removeEventListener('toggleSidebar', handleToggleSidebar)
      window.removeEventListener('resize', handleResize)
    }
  }, [isAuthenticated, router, sidebarOpen])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const startNewChat = async () => {
    try {
      setLoading(true)
      setStartingNewChat(true)
      const newSession = await sessionManager.createSession()
      sessionStorage.setItem('activeSessionId', newSession.id)
      setLoading(false)
      setStartingNewChat(false)
    } catch (err) {
      console.error("Failed to start new chat:", err)
      setLoading(false)
      setStartingNewChat(false)
    }
  }

  const switchSession = (sessionId: string) => {
    sessionStorage.setItem('activeSessionId', sessionId)
    window.dispatchEvent(new CustomEvent('sessionSelected', { detail: sessionId }))
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  const handleTitleChange = (sessionId: string, value: string) => {
    setTitles((prev) => ({ ...prev, [sessionId]: value }))
  }

  const saveTitle = async (session: ChatSession) => {
    const newTitle = titles[session.id]
    if (!newTitle || newTitle === session.title) {
      setEditingId(null)
      return
    }
    try {
      const updated = await updateSessionTitle(session.id, newTitle, session.tagline ?? '')
      setSessions((prev) =>
        prev.map((s) =>
          s.id === session.id ? { ...s, title: updated.title, updatedAt: updated.updatedAt } : s
        )
      )
      setEditingId(null)
    } catch (err) {
      console.error('Failed to update title:', err)
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!sessionToDelete) return
    try {
      await deleteChatSession(sessionToDelete.id)
      setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete.id))
      const activeId = sessionStorage.getItem('activeSessionId')
      if (activeId === sessionToDelete.id) sessionStorage.removeItem('activeSessionId')
    } catch (err) {
      console.error("Gagal menghapus sesi:", err)
      alert("Gagal menghapus sesi. Coba lagi.")
    }
    setSessionToDelete(null)
  }

  return (
    <div className="flex min-h-screen relative">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:relative z-30 lg:z-auto w-[280px] sm:w-[320px] lg:w-[25%] 
        min-h-screen bg-white border-r shadow-md flex flex-col 
        transition-all duration-300 ease-in-out ${sidebarOpen ? 'left-0' : '-left-[320px] lg:left-0'}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 p-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white">
            <Image src={"/android-chrome-512x512.png"} width={240} height={240} alt="logo" />
          </div>
          <Link href={"/dashboard"}>
            <Typography variant="h1" className="text-xl font-bold">VELUTARA</Typography>
          </Link>
          <button className="ml-auto text-gray-500 hover:text-gray-700 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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

        {/* Session List */}
        <div className="mt-6 text-gray-600 px-6 flex-grow overflow-hidden flex flex-col">
          <div className="font-medium text-sm uppercase tracking-wider mb-3 text-gray-500">
            Recent Conversations
          </div>
          <div className="max-h-[calc(100vh-380px)] overflow-y-auto space-y-3 pr-2 flex-grow">
            {sessions.length === 0 ? (
              <div className="text-sm text-gray-500 italic p-4 text-center border border-dashed border-gray-200 rounded-lg">
                No chat history yet
              </div>
            ) : sessions.map((session) => (
              <div
                key={session.id}
                className="py-3 px-4 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors border border-gray-100 hover:border-purple-200 relative"
                onClick={() => switchSession(session.id)}
              >
                {/* Delete Button */}
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSessionToDelete(session)
                  }}
                >
                  🗑️
                </button>

                {/* Editable title */}
                {editingId === session.id ? (
                  <input
                    className="font-medium text-gray-800 bg-white rounded px-2 py-1 text-sm w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                    autoFocus
                    value={titles[session.id] ?? session.title ?? ""}
                    onChange={(e) => handleTitleChange(session.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        await saveTitle(session)
                        setEditingId(null)
                      }
                    }}
                    onBlur={() => setEditingId(null)}
                  />
                ) : (
                  <div
                    className="font-medium text-gray-800 truncate"
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      setEditingId(session.id)
                      setTitles((prev) => ({ ...prev, [session.id]: session.title ?? "" }))
                    }}
                  >
                    {session.title || "New Conversation"}
                  </div>
                )}

                {session.tagline && (
                  <div className="text-xs text-gray-600 truncate">{session.tagline}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">{new Date(session.updatedAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* User Info & Logout */}
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
          <GradientButton
            onClick={handleLogout}
            fullWidth
            style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: "0.75rem" }}
          >
            Log Out
          </GradientButton>
        </div>
      </aside>

      <main className="w-full lg:w-[75%] bg-gray-50 min-h-full">
        {!loading && children}
      </main>

      {/* Modal Hapus Session */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Hapus Sesi Chat?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Apakah kamu yakin ingin menghapus sesi <strong>{sessionToDelete.title || 'New Conversation'}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
