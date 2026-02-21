'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LogoIcon from '@/src/LogoIcon'
import Typography from '@/src/components/Typography'
import GradientButton from '@/src/components/GradientButton'
import Link from 'next/link'

export default function HelpPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('getting-started')
  
  // Help categories and their content
  const helpCategories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      articles: [
        {
          id: 'welcome',
          title: 'Welcome to Velutara',
          content: 'Velutara is your AI-powered travel assistant designed to help you plan trips, find accommodations, discover attractions, and answer all your travel-related questions. This guide will help you get started and make the most of your experience.'
        },
        {
          id: 'account-setup',
          title: 'Account Setup',
          content: 'To get started with Velutara, create your account by signing up with your email address. Once registered, you can personalize your profile and set your travel preferences to get the most relevant recommendations.'
        },
        {
          id: 'first-chat',
          title: 'Your First Chat',
          content: 'Start a new chat by clicking the "New Chat" button. You can ask Velutara anything related to travel planning, such as "I want to plan a trip to Japan in April" or "What are the best beaches in Thailand?" Be specific to get the most helpful responses.'
        }
      ]
    },
    {
      id: 'features',
      name: 'Features',
      articles: [
        {
          id: 'itinerary-planning',
          title: 'Itinerary Planning',
          content: "Velutara can create personalized travel itineraries based on your preferences, budget, and time constraints. Simply tell Velutara where you want to go, how long you'll be there, and any specific interests you have."
        },
        {
          id: 'accommodation-finder',
          title: 'Accommodation Finder',
          content: 'Looking for places to stay? Ask Velutara for hotel, hostel, or rental recommendations in your destination. Specify your budget, desired amenities, and location preferences for tailored suggestions.'
        },
        {
          id: 'local-tips',
          title: 'Local Tips & Cuisine',
          content: 'Get insights on local customs, etiquette, and must-try dishes. Velutara can recommend restaurants, street food, and culinary experiences that match your taste preferences.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      articles: [
        {
          id: 'connection-issues',
          title: 'Connection Issues',
          content: 'If you experience connection problems, try refreshing the page or checking your internet connection. If problems persist, clearing your browser cache or using a different browser may help resolve the issue.'
        },
        {
          id: 'message-not-sending',
          title: 'Messages Not Sending',
          content: "If your messages aren't sending, make sure you're logged in and have a stable internet connection. Try refreshing the page or restarting the app if the problem continues."
        },
        {
          id: 'export-problems',
          title: 'Export Problems',
          content: 'Having trouble exporting your itinerary or recommendations? Make sure you have the necessary permissions and try using a different format (PDF, CSV, or XLSX). If issues persist, try using a different browser.'
        }
      ]
    },
    {
      id: 'account',
      name: 'Account & Billing',
      articles: [
        {
          id: 'subscription-management',
          title: 'Managing Your Subscription',
          content: 'You can view and manage your subscription from the Account Settings page. Here you can upgrade, downgrade, or cancel your subscription at any time.'
        },
        {
          id: 'payment-methods',
          title: 'Payment Methods',
          content: 'Velutara accepts major credit cards, PayPal, and certain regional payment methods. To update your payment information, go to Account Settings > Billing and select "Update Payment Method".'
        },
        {
          id: 'account-deletion',
          title: 'Account Deletion',
          content: 'To delete your account, go to Account Settings > Privacy and select "Delete Account". This action is permanent and will remove all your data from our systems.'
        }
      ]
    }
  ]
  
  // Find current category
  const currentCategory = helpCategories.find(c => c.id === activeCategory) || helpCategories[0]
  
  return (
<div className="relative flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* Header */}
      <header className="relative bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                <LogoIcon width={24} height={24} color="white" />
              </div>
              <div>
              <Typography variant="h1" className="text-xl font-bold text-white">Velutara</Typography>
              <Typography variant="body2" className="text-gray-400">Your travel AI assistant</Typography>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
      <div className="border-b border-white/10 p-6">
      <h1 className="text-3xl font-bold text-white">Help Center</h1>
      <p className="text-gray-400 mt-2">
              Find answers to common questions and learn how to make the most of Velutara
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white/5 border-r border-white/10 p-4 backdrop-blur-xl">
              <div className="space-y-1">
                {helpCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      activeCategory === category.id 
                        ? 'bg-purple-500/20 text-purple-300 font-medium'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <h3 className="font-medium text-indigo-300 mb-2">Need more help?</h3>
              <p className="text-indigo-300/80 text-sm mb-3">
                  We&apos;re here to assist you with any questions about using Velutara.
                </p>
                <Link
                  href="/support"
                  className="text-indigo-300 hover:text-indigo-200 font-medium text-sm flex items-center"
                >
                  Contact Support
                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </aside>
            
            {/* Content */}
            <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">{currentCategory.name}</h2>
              
              <div className="space-y-8">
                {currentCategory.articles.map(article => (
                  <article key={article.id} className="border-b border-white/10 pb-6 last:border-0">
                    <h3 className="text-xl font-semibold mb-2 text-white">{article.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{article.content}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <GradientButton onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </GradientButton>
          
          <GradientButton onClick={() => router.push('/chat')}>
            Go to Chat
          </GradientButton>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative mt-auto py-6 border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-400">
                © 2025 Velutara. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms
              </Link>
              {/* <Link href="/support" className="text-sm text-gray-400 hover:text-white">
                Support
              </Link> */}
            </div>
          </div>
        </div>
        <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-purple-600/30 blur-3xl" />
      </footer>
    </div>
  )
}