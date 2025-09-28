'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import LogoIcon from '@/src/LogoIcon'
import Typography from '@/src/components/Typography'
import { useAuthStore } from '@/src/store/authStore'
import { ChatSession } from '@/src/services/api'
import { sessionManager } from '@/src/services/sessionService'
import Link from 'next/link'

export default function Dashboard() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
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

        setLoading(true)
        const chatSessions = await sessionManager.loadSessions()
        setSessions(chatSessions)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load sessions:', error)
        setLoading(false)
      }
    }

    loadSessions()
  }, [isAuthenticated, router])

  // Start a new chat session
  const startNewChat = async () => {
    try {
      setLoading(true)
      await sessionManager.createSession()

      // Navigate to chat page with the new session
      router.push('/chat')
      setLoading(false)
    } catch (error) {
      console.error('Failed to start new chat:', error)
      setLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const now = new Date()
    const messageDate = new Date(dateString)

    // For today's dates, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return `Today at ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }

    // For yesterday
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }

    // For this week
    const diffTime = Math.abs(now.getTime() - messageDate.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    }

    // For older dates
    return messageDate.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    })
  }

  // Get tag based on title/tagline content (for demo filtering)
  const getSessionTag = (session: ChatSession) => {
    const title = (session.title || '').toLowerCase()
    const tagline = (session.tagline || '').toLowerCase()
    
    if (title.includes('europe') || title.includes('paris') || title.includes('rome') || 
        tagline.includes('europe') || tagline.includes('paris') || tagline.includes('rome')) {
      return 'Europe'
    }
    
    if (title.includes('asia') || title.includes('tokyo') || title.includes('japan') || 
        tagline.includes('asia') || tagline.includes('tokyo') || tagline.includes('japan')) {
      return 'Asia'
    }
    
    if (title.includes('america') || title.includes('york') || title.includes('costa') || 
        tagline.includes('america') || tagline.includes('york') || tagline.includes('costa')) {
      return 'Americas'
    }
    
    return 'Recent'
  }

  // Generate a preview text based on title/tagline
  const generatePreviewText = (session: ChatSession) => {
    // If no title/tagline, return default text
    if (!session.title && !session.tagline) {
      return "New conversation with Velutara. Ask me about your travel plans!"
    }
    
    // If we have a tagline, use it
    if (session.tagline) {
      return session.tagline
    }
    
    // Otherwise create a preview based on title
    return `Your conversation about ${session.title}. Continue the discussion or start a new topic.`
  }
  // Filter sessions based on search and active tag
  const filteredSessions = sessions?.filter((session) => {
    const title = session.title || 'New Conversation'
    const tag = getSessionTag(session)

    const matchesSearch = searchQuery === '' ||
      title.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag = !activeTag || activeTag === 'All' || tag === activeTag

    return matchesSearch && matchesTag
  })

  // Handle user logout
  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                <LogoIcon width={24} height={24} color="white" />
              </div>
              <div>
                <Typography variant="h1" className="text-xl font-bold">Velutara <span className="text-xl font-bold text-neutral-300">3.0</span></Typography>
                <Typography variant="body2" className="text-gray-500">Your travel AI assistant</Typography>
              </div>
            </div>

            {user && (
              <div className="flex items-center">
                <div className="hidden md:flex flex-col items-end mr-3">
                  <Typography className="font-medium">{user.name || user.email}</Typography>
                  {/* <Typography variant="body2" className="text-gray-500">Premium Account</Typography> */}
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U'}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Dashboard Header */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                  </path>
                </svg>
              </div>
              <div>
                <Typography variant="h2" className="text-xl font-bold text-gray-900">Your Chat History</Typography>
                <Typography variant="body2" className="text-gray-500">Review your conversations with Velutara</Typography>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startNewChat}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Start New Chat
            </motion.button>
          </div>

          {/* Search and Filter Section */}
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search your conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                />
              </div>

              {/* <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${tag === activeTag
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div> */}
            </div>
          </div>

          {/* Chat Count */}
          <div className="px-6 py-3 bg-white border-b border-gray-100">
            <div className="text-gray-600 text-sm">
              {loading ? 'Loading chats...' :
                `You have ${sessions.length} previous chats with Velutara`}
              {filteredSessions.length > 0 && sessions.length !== filteredSessions.length && (
                <span className="ml-2 text-purple-600">
                  ({filteredSessions.length} filtered)
                </span>
              )}
            </div>
          </div>

          {/* Chat List */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin h-8 w-8 border-t-2 border-b-2 border-purple-600 rounded-full"></div>
                <p className="mt-2 text-gray-600">Loading your conversations...</p>
              </div>
            ) : sessions.length === 0 ? (
              // Empty state
              <div className="py-20 px-6">
                <div className="max-w-md mx-auto text-center">
                  <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
                  <p className="text-gray-500 mb-6">Start your journey with Velutara by beginning a new chat</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={startNewChat}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Start your first chat
                  </motion.button>
                </div>
              </div>
            ) : filteredSessions.length === 0 ? (
              // No results from filtering
              <div className="p-12 text-center">
                <p className="text-gray-600 mb-4">No chats match your search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTag(null);
                  }}
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              // Chat list with items
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {filteredSessions.map((session, index) => {
                  const tag = getSessionTag(session);
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -4, boxShadow: '0 12px 20px -10px rgba(0, 0, 0, 0.1)' }}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-purple-300 transition-all cursor-pointer"
                      onClick={() => {
                        // Store active session ID
                        sessionStorage.setItem('activeSessionId', session.id);
                        
                        // Notify other components that a session was selected
                        const event = new CustomEvent('sessionSelected', { detail: session.id });
                        window.dispatchEvent(event);
                        
                        // Navigate to chat page
                        router.push('/chat');
                      }}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {session.title || "New Conversation"}
                            </h3>
                            <div className="text-xs text-gray-500">{formatDate(session.updatedAt)}</div>
                          </div>
                        <span className="px-2 py-1 bg-gray-100 text-xs font-medium rounded-full text-gray-600">{tag}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {generatePreviewText(session)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-500">
                © 2025 Velutara. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Terms
              </Link>
              {/* <Link
                href="/support"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Support
              </Link> */}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}