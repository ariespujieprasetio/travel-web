'use client'

import LogoIcon from '@/src/LogoIcon'
import GradientButton from '@/src/components/GradientButton'
import Typography from '@/src/components/Typography'
import { motion } from 'framer-motion'
import Link from 'next/link'


export default function LandingPage() {

  // Handle scroll for navbar transparency
  // Navigation to login/signup pages
  const navigateToLogin = () => {
    window.location.href = '/login'
  }

  const navigateToSignup = () => {
    window.location.href = '/login?signup=true'
  }



  // Features of the app
  const features = [
    {
      icon: '✈️',
      title: 'Personalized Itineraries',
      description: 'Get custom trip plans based on your preferences, budget, and time constraints.'
    },
    {
      icon: '🏨',
      title: 'Accommodation Finder',
      description: 'Find the perfect place to stay with recommendations tailored to your needs.'
    },
    {
      icon: '🍽️',
      title: 'Local Cuisine Guide',
      description: 'Discover the best local dishes and restaurants at your destination.'
    },
    {
      icon: '🗺️',
      title: 'Interactive Maps',
      description: 'Explore your destination with detailed interactive maps and points of interest.'
    },
    {
      icon: '💰',
      title: 'Budget Planning',
      description: 'Keep track of your travel expenses and get tips to save money.'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Assistance',
      description: 'Ask any travel-related question and get instant, knowledgeable answers.'
    },
  ]

  // FAQ items
  const faqItems = [
    {
      question: 'What is Velutara?',
      answer: 'Velutara is an AI-powered travel assistant that helps you plan trips, find accommodations, discover attractions, and answer any travel-related questions you might have.'
    },
    {
      question: 'Is Velutara free to use?',
      answer: 'Velutara offers both free and premium plans. The free plan gives you access to basic travel assistance, while the premium plan unlocks advanced features like detailed itineraries, offline access, and priority support.'
    },
    {
      question: 'How accurate is the travel information?',
      answer: 'Velutara uses up-to-date information from reliable sources. However, we recommend verifying critical details like opening hours and travel restrictions directly with official websites, especially during peak travel seasons or unusual circumstances.'
    },
    {
      question: 'Can I use Velutara for business travel planning?',
      answer: 'Absolutely! Velutara is great for planning both leisure and business trips. You can ask for business-friendly accommodations, meeting venues, transportation options, and more.'
    },
    {
      question: 'Does Velutara work offline?',
      answer: 'The premium version of Velutara allows you to download your trip plans for offline access. The free version requires an internet connection to function.'
    }
  ]

  // Mock chat messages for demonstration

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 291 295" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.99998 126.327L107.49 65.6723" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M92.9844 280.443L158.89 241.433" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M27.7543 65.6723L130.244 5" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M164.679 289.021L252.906 236.806" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M158.7 39.296L201.851 13.7343" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M238.92 95.9998L267.307 79.207" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M6.16108 178.612L57.5618 148.198" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M53.2987 253.166L92.9844 229.683" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M138.268 100.124L241.035 39.296" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M215.923 209.026L285.625 167.763" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M182.875 178.612L285.625 117.784" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M24.6522 219.355L185.475 124.161" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <path d="M120.192 153.709L76.6422 118.667C76.2783 118.373 76.5902 117.784 77.0408 117.922L145.616 138.58" fill="white" />
                  <path d="M127.228 167.885L136.309 223.029C136.379 223.497 137.037 223.514 137.141 223.046L152.877 153.171" fill="white" />
                </svg>
              </div>
              <div className="ml-2 font-bold text-xl">VELUTARA</div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-700 hover:text-purple-700">Features</a>
              <a href="#destinations" className="text-gray-700 hover:text-purple-700">Destinations</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-700">How It Works</a>
              <a href="#faq" className="text-gray-700 hover:text-purple-700">FAQ</a>
            </div>

            {/* Login / Get Started */}
            <div className="flex items-center space-x-4">
              <button
                onClick={navigateToLogin}
                className="text-purple-700 font-medium">Log In</button>

              <button
                onClick={navigateToSignup}

                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium">Get Started</button>

            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Your AI Travel Companion for Perfect Trips
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Plan your dream vacation with Velutara, your personalized AI travel assistant that helps you discover destinations, create itineraries, and answer all your travel questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/login">
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium">
                  Start Planning Now
                </button></a>
              <a href="#how-it-works">
                <button className="border-2 border-purple-600 text-purple-700 px-6 py-3 rounded-lg font-medium">
                  Learn How It Works
                </button>
              </a>
            </div>
          </div>

          {/* Right Column - Chat Demo */}
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 291 295" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.99998 126.327L107.49 65.6723" stroke="white" strokeWidth="5" strokeLinecap="round" />
                  <path d="M92.9844 280.443L158.89 241.433" stroke="white" strokeWidth="5" strokeLinecap="round" />
                  <path d="M27.7543 65.6723L130.244 5" stroke="white" strokeWidth="5" strokeLinecap="round" />
                  <path fill="white" d="M120.192 153.709L76.6422 118.667C76.2783 118.373 76.5902 117.784 77.0408 117.922L145.616 138.58" />
                  <path fill="white" d="M127.228 167.885L136.309 223.029C136.379 223.497 137.037 223.514 137.141 223.046L152.877 153.171" />
                </svg>
              </div>
              <p className="ml-2 font-semibold">Velutara Travel Assistant</p>
            </div>

            <div className="space-y-3 mb-4 h-80 overflow-y-auto">
              {/* User message */}
              <div className="bg-purple-100 p-3 rounded-lg ml-10">
                <p className="text-sm">I want to plan a 3-day trip to Paris for next month.</p>
              </div>

              {/* Bot message */}
              <div className="bg-gray-100 p-3 rounded-lg mr-10">
                <p className="text-sm">
                  Great choice! For a 3-day Paris trip, I suggest focusing on these highlights:
                  Day 1 - Eiffel Tower, Louvre Museum, Seine River cruise.
                  Day 2 - Notre Dame Cathedral, Montmartre, Sacré-Cœur.
                  Day 3 - Versailles Palace, Latin Quarter, and shopping on Champs-Élysées.
                  When exactly are you planning to visit?
                </p>
              </div>

              {/* User message */}
              <div className="bg-purple-100 p-3 rounded-lg ml-10">
                <p className="text-sm">Mid-June, and I&apos;m interested in good food spots too!</p>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Ask about your next trip..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-2">
            <p className="text-base font-medium text-purple-600">TRUSTED BY TRAVELERS WORLDWIDE</p>
          </div>
          {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
            <div className="h-8">
              <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
                <path d="M5.9,11.6H2.5v9h3.4c2.9,0,4.5-1.8,4.5-4.5C10.5,13.4,8.8,11.6,5.9,11.6z M5.8,18.5H5.2v-4.9h0.7c1.4,0,2.2,0.9,2.2,2.4C8.1,17.6,7.2,18.5,5.8,18.5z M11.2,20.6h2.7v-3.5h2.5v-1.9h-2.5v-1.6h3.1v-1.9h-5.8V20.6z M18.8,20.6h2.7v-3h0.3l2,3h3l-2.4-3.5c1.2-0.4,1.8-1.4,1.8-2.7c0-2-1.3-3.2-3.5-3.2h-4V20.6z M21.5,15.7v-2.1h0.8c0.9,0,1.3,0.4,1.3,1.1c0,0.7-0.4,1-1.3,1H21.5z M27.9,20.6h2.7v-9h-2.7V20.6z M33.8,13.6h2.5v7h2.7v-7h2.5v-1.9h-7.7V13.6z M43.2,20.6h2.7v-9h-2.7V20.6z M54.5,18.3h-3.6l0.6-1.7l0.6-1.9l0.6,1.9L54.5,18.3z M55.7,20.6h2.9l-3.6-9h-3.2l-3.6,9h2.9l0.5-1.3h3.7L55.7,20.6z M65.9,20.6h2.7v-3.5h2.5v-1.9h-2.5v-1.6h3.1v-1.9h-5.8V20.6z M76.8,15.7v-2.1h0.8c0.9,0,1.3,0.4,1.3,1.1c0,0.7-0.4,1-1.3,1H76.8z M74.1,20.6h2.7v-3h0.3l2,3h3l-2.4-3.5c1.2-0.4,1.8-1.4,1.8-2.7c0-2-1.3-3.2-3.5-3.2h-4V20.6z M86.8,20.6h5.9v-1.9h-3.2v-7h-2.7V20.6z M95.9,11.6c-2.7,0-4.7,2-4.7,4.5c0,2.6,2,4.6,4.7,4.6c2.7,0,4.7-2,4.7-4.6C100.6,13.6,98.6,11.6,95.9,11.6z M95.9,18.6c-1.3,0-2-1-2-2.4c0-1.4,0.7-2.4,2-2.4c1.3,0,2,1,2,2.4C97.9,17.6,97.2,18.6,95.9,18.6z" />
              </svg>
            </div>
            <div className="h-8">
              <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
                <path d="M21.3,18.4c0,0.8-0.1,1.8-0.3,2.4c-0.5,1.9-2.3,3.3-4.3,3.3c-2.4,0-4.4-2-4.4-4.4c0-2.4,2-4.4,4.4-4.4c1.3,0,2.5,0.6,3.3,1.5l-1.3,1.3c-0.5-0.5-1.2-0.8-2-0.8c-1.5,0-2.7,1.2-2.7,2.7c0,1.5,1.2,2.7,2.7,2.7c1.1,0,2-0.6,2.4-1.5c0.2-0.4,0.2-0.8,0.2-1.2h-2.6v-1.7H21.3z M26.4,23.8h-1.7v-7.9h-3.1v-1.7h7.9v1.7h-3.1V23.8z M32.9,23.8v-9.6h1.7v9.6H32.9z M42.7,23.8h-1.7v-7.9h-3.1v-1.7h7.9v1.7h-3.1V23.8z M53.1,22.1c-0.8,1.3-2.2,2-3.7,2c-2.4,0-4.4-2-4.4-4.4c0-2.4,2-4.4,4.4-4.4c1.5,0,3,0.8,3.7,2l-1.5,0.9c-0.4-0.7-1.3-1.2-2.2-1.2c-1.5,0-2.7,1.2-2.7,2.7c0,1.5,1.2,2.7,2.7,2.7c0.9,0,1.8-0.5,2.2-1.2L53.1,22.1z M59.9,23.8h-1.7v-3.9h-3.9v3.9h-1.7v-9.6h1.7v4h3.9v-4h1.7V23.8z M61.3,23.8v-9.6H67v1.7h-4v2.4h3.6v1.7H63v2.3h4v1.7H61.3z M75.5,23.8h-1.8l-1.9-3.9h-0.1h-1.4v3.9h-1.7v-9.6h3.9c2,0,3.4,1.3,3.4,3c0,1.3-0.9,2.4-2.1,2.8L75.5,23.8z M70.3,18.3h1.4c1.2,0,1.9-0.5,1.9-1.4c0-0.9-0.7-1.4-1.9-1.4h-1.4V18.3z M81.6,16h-2.7v-1.7h7.1V16h-2.7v7.9h-1.7V16z M86.4,19c0-2.8,2.2-5,5-5c2.8,0,5,2.2,5,5c0,2.8-2.2,5-5,5C88.6,24,86.4,21.8,86.4,19z M88.1,19c0,1.8,1.5,3.3,3.3,3.3c1.8,0,3.3-1.5,3.3-3.3c0-1.8-1.5-3.3-3.3-3.3C89.6,15.8,88.1,17.2,88.1,19z" />
              </svg>
            </div>
            <div className="h-7">
              <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
                <path d="M13.1,6.6l-3.5,11.4L5.9,6.6H1l6.6,17.3h4l3.5-11.2l3.5,11.2h4L29.2,6.6h-4.8l-3.8,11.4L17.2,6.6H13.1z M29.5,15.3c0,5.2,3.3,8.9,8.5,8.9c1.3,0,2.4-0.2,3.3-0.5v-4.1c-0.7,0.5-1.6,0.8-2.7,0.8c-2.7,0-4.4-1.9-4.4-5.1s1.8-5.1,4.4-5.1c1.1,0,2,0.3,2.7,0.8V6.8c-0.9-0.3-2-0.5-3.2-0.5C32.9,6.3,29.5,10.1,29.5,15.3z M50.1,6.6L47.3,17l-2.9-10.4h-4.6l5.8,17.3h3.6l2.7-9.9l2.8,9.9h3.6l5.7-17.3h-4.6L56.6,17l-2.9-10.4H50.1z M73.3,6.3c-5.2,0-8.8,3.6-8.8,9c0,5.2,3.7,8.9,8.9,8.9c3.3,0,5.7-1.3,7.2-3.3l-3-2.4c-0.9,1.2-2.4,1.9-4,1.9c-2.4,0-4.2-1.6-4.5-4.1h12.2c0.1-0.4,0.1-0.8,0.1-1.2C81.5,9.8,78.4,6.3,73.3,6.3z M69.1,13.2c0.5-2.2,2-3.2,4-3.2c2.1,0,3.4,1,3.9,3.2H69.1z M91.4,6.3c-2.3,0-4.5,0.9-5.7,2.3l2.7,2.8c0.6-0.8,1.7-1.2,2.9-1.2c1.5,0,2.3,0.7,2.3,1.8v0.4c-0.8-0.4-1.7-0.6-2.9-0.6c-3.2,0-6.2,1.6-6.2,5c0,3.1,2.5,4.9,5.1,4.9c1.6,0,2.9-0.6,4-1.7v1.4h4.4V12.3C98,8.3,95.5,6.3,91.4,6.3z M93.5,18.1c-0.9,0.8-2,1.3-3.2,1.3c-1.3,0-2.2-0.6-2.2-1.6c0-1.1,1.1-1.8,2.9-1.8c1,0,1.9,0.2,2.5,0.5V18.1z" />
              </svg>
            </div>
            <div className="h-5">
              <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
                <path d="M15.4,16.4c0,2.7-2,4.8-4.9,4.8H3.3V7.5h7.1c2.7,0,4.7,1.9,4.7,4.5c0,1.3-0.6,2.4-1.6,3.1C14.6,15.6,15.4,16.4,15.4,16.4z M6.9,10.7v2.1h2.8c0.7,0,1.2-0.5,1.2-1.1c0-0.6-0.5-1.1-1.2-1.1H6.9z M10.1,17.9c0.8,0,1.3-0.5,1.3-1.2c0-0.7-0.5-1.2-1.3-1.2H6.9v2.3H10.1z M22.8,21.2l-4-5.6v5.6h-3.6V7.5h3.6v5.1l3.8-5.1h4.3l-4.8,6.1l5.2,7.6H22.8z M34.2,21.4c-4,0-7.1-3-7.1-7c0-4,3.1-7,7.1-7c4,0,7.1,3,7.1,7C41.3,18.4,38.2,21.4,34.2,21.4z M34.2,10.8c-2,0-3.5,1.5-3.5,3.6c0,2.1,1.5,3.6,3.5,3.6c2,0,3.5-1.5,3.5-3.6C37.7,12.4,36.2,10.8,34.2,10.8z M49.5,21.4c-4,0-7.1-3-7.1-7c0-4,3.1-7,7.1-7c4,0,7.1,3,7.1,7C56.5,18.4,53.5,21.4,49.5,21.4z M49.5,10.8c-2,0-3.5,1.5-3.5,3.6c0,2.1,1.5,3.6,3.5,3.6c2,0,3.5-1.5,3.5-3.6C52.9,12.4,51.4,10.8,49.5,10.8z M65.3,21.2v-1c-0.8,0.8-2,1.3-3.3,1.3c-3.8,0-6.8-3-6.8-7c0-4,3-7,6.8-7c1.3,0,2.5,0.4,3.3,1.3v-1h3.6v13.4H65.3z M62.3,10.8c-2,0-3.5,1.5-3.5,3.6c0,2.1,1.5,3.6,3.5,3.6c2,0,3.5-1.5,3.5-3.6C65.8,12.4,64.3,10.8,62.3,10.8z M78.2,7.4c1.3,0,2.5,0.4,3.3,1.2v-1h3.6v12.9c0,3.5-2.7,6.2-6.9,6.2c-3.6,0-6.1-1.9-6.9-4.7l3.5-0.7c0.5,1.4,1.7,2,3.4,2c1.9,0,3.3-1.1,3.3-3.5v-0.9c-0.8,0.8-2,1.3-3.3,1.3c-3.8,0-6.8-3-6.8-7C71.4,10.4,74.4,7.4,78.2,7.4z M78.5,17.9c2,0,3.5-1.5,3.5-3.6c0-2.1-1.5-3.6-3.5-3.6c-2,0-3.5,1.5-3.5,3.6C75,16.4,76.6,17.9,78.5,17.9z M97.5,21.2v-1c-0.8,0.8-2,1.3-3.3,1.3c-3.8,0-6.8-3-6.8-7c0-4,3-7,6.8-7c1.3,0,2.5,0.4,3.3,1.3v-1h3.6v13.4H97.5z M94.6,10.8c-2,0-3.5,1.5-3.5,3.6c0,2.1,1.5,3.6,3.5,3.6c2,0,3.5-1.5,3.5-3.6C98,12.4,96.5,10.8,94.6,10.8z" />
              </svg>
            </div>
            <div className="h-7">
              <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
                <path d="M43.1,15.3c0-2.6-2.1-4.8-4.7-4.8c-2.6,0-4.7,2.1-4.7,4.8c0,2.6,2.1,4.8,4.7,4.8C41,20.1,43.1,17.9,43.1,15.3z M66.4,20.1V10.6h-3.6v1.1c-0.8-0.9-2-1.3-3.3-1.3c-3.8,0-6.8,3-6.8,7c0,4,3,7,6.8,7c1.3,0,2.5-0.5,3.3-1.3v1H66.4z M54.4,17.5c0-2.1,1.5-3.6,3.5-3.6c2,0,3.5,1.5,3.5,3.6c0,2.1-1.5,3.6-3.5,3.6C55.9,21.1,54.4,19.6,54.4,17.5z M83,7.5h6.1c3.6,0,6.1,2.4,6.1,5.7c0,2.5-1.5,4.4-3.8,5.3l3.2,6.3H90l-2.8-5.5h-0.5v5.5H83V7.5z M86.7,15.9h1.6c1.8,0,2.9-0.9,2.9-2.6c0-1.7-1.1-2.6-2.9-2.6h-1.6V15.9z M14.6,7.5H5.3v24.3h3.7v-7.1h5.5c4.1,0,7.2-3.2,7.2-8.6C21.8,10.7,18.7,7.5,14.6,7.5z M14.2,21.1h-5.3v-9.9h5.3c3,0,4.5,2,4.5,5C18.8,19.1,17.3,21.1,14.2,21.1z" />
              </svg>
            </div>
            <div className="h-7">
              <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
                <path d="M42.6,6.1H37L27.7,23.8h6.1l1.3-2.6h7.7l1.3,2.6h6.1L42.6,6.1z M37.4,16.7l2-4l2,4H37.4z M68.1,23.8h-5.5v-1c-1.2,1-2.9,1.5-4.9,1.5c-3.8,0-6.1-2.2-6.1-5.5c0-2.8,1.8-5.1,6.3-5.1h4.4v-0.5c0-1.5-1.2-2.3-3.4-2.3c-1.8,0-3.9,0.6-6,1.7V8.3c2.4-1,4.9-1.5,7.5-1.5c5.5,0,8.2,2.2,8.2,6.8v10.2H68.1z M62.4,19.2v-1.8h-2.9c-1.7,0-2.3,0.6-2.3,1.7c0,1,0.8,1.7,2.1,1.7C60.6,20.8,61.7,20.2,62.4,19.2z M16.1,23.8h-5.5v-1c-1.2,1-3,1.5-5,1.5c-3.8,0-6.1-2.2-6.1-5.5c0-2.8,1.8-5.1,6.3-5.1h4.4v-0.5c0-1.5-1.2-2.3-3.4-2.3c-1.8,0-3.9,0.6-6,1.7V8.3c2.4-1,4.9-1.5,7.5-1.5c5.5,0,8.2,2.2,8.2,6.8v10.2H16.1z M10.4,19.2v-1.8H7.5c-1.7,0-2.3,0.6-2.3,1.7c0,1,0.8,1.7,2.1,1.7C8.6,20.8,9.7,20.2,10.4,19.2z M93.4,14.8h-9.8c0.5-2.1,2.2-3.1,4.4-3.1c2.5,0,4.4,1.1,5.3,3.1H93.4z M100,16.5h-5.7c-0.4,2.5-2.6,4.1-5.5,4.1c-3.4,0-5.9-2.3-5.9-5.9c0-3.5,2.4-6,5.7-6c3.5,0,5.9,2.3,5.9,5.8v1.1h-6.1c0.7,1.3,2,2,3.8,2c1.2,0,2.1-0.3,2.8-1C95.7,16,99.9,16.2,100,16.5z M24.5,13.8c0-4.2-3.2-7.1-7.7-7.1h-8.5v17h3.7v-5.2h4.9c4.4,0,7.7-2.7,7.7-7C24.5,14.4,24.5,13.8,24.5,13.8z M12,11.5h3.8c2.1,0,3.6,1.1,3.6,2.8c0,1.7-1.4,2.8-3.6,2.8H12V11.5z M81,23.9h-5.3V6.8H81V23.9z" />
              </svg>
            </div>
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Typography variant="h2" component="h2" className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need For Perfect Travel Planning
            </Typography>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Velutara combines AI intelligence with extensive travel data to help you create memorable journeys without the stress of planning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16 bg-white" id="destinations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore Popular Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover top cities for business travel — from global financial hubs to well-connected urban centers built for productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

  {/* Bangkok */}
  <a href="https://en.wikipedia.org/wiki/Bangkok" target="_blank" rel="noopener noreferrer"
     className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative bg-white border border-gray-100">
    <div className="h-48 bg-pink-50 flex items-center justify-center">
      <img src="/icons/bangkok.png" alt="Bangkok" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold mb-1 group-hover:text-purple-700 transition-colors">Bangkok, Thailand</h3>
    </div>
  </a>

  {/* Dubai */}
  <a href="https://en.wikipedia.org/wiki/Dubai" target="_blank" rel="noopener noreferrer"
     className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative bg-white border border-gray-100">
    <div className="h-48 bg-yellow-50 flex items-center justify-center">
      <img src="/icons/dubai.png" alt="Dubai" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold mb-1 group-hover:text-purple-700 transition-colors">Dubai, UAE</h3>
    </div>
  </a>

  {/* Jakarta */}
  <a href="https://en.wikipedia.org/wiki/Jakarta" target="_blank" rel="noopener noreferrer"
     className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative bg-white border border-gray-100">
    <div className="h-48 bg-orange-50 flex items-center justify-center">
      <img src="/icons/jakarta.png" alt="Jakarta" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold mb-1 group-hover:text-purple-700 transition-colors">Jakarta, Indonesia</h3>
    </div>
  </a>

  {/* Kuala Lumpur */}
  <a href="https://en.wikipedia.org/wiki/Kuala_Lumpur" target="_blank" rel="noopener noreferrer"
     className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative bg-white border border-gray-100">
    <div className="h-48 bg-green-100 flex items-center justify-center">
      <img src="/icons/kualalumpur.png" alt="Kuala Lumpur" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold mb-1 group-hover:text-purple-700 transition-colors">Kuala Lumpur, Malaysia</h3>
    </div>
  </a>

  {/* Manila */}
  <a href="https://en.wikipedia.org/wiki/Manila" target="_blank" rel="noopener noreferrer"
     className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative bg-white border border-gray-100">
    <div className="h-48 bg-blue-50 flex items-center justify-center">
      <img src="/icons/manila.png" alt="Manila" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold mb-1 group-hover:text-purple-700 transition-colors">Manila, Philippines</h3>
    </div>
  </a>

  {/* Seoul */}
  <a href="https://en.wikipedia.org/wiki/Seoul" target="_blank" rel="noopener noreferrer"
     className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative bg-white border border-gray-100">
    <div className="h-48 bg-purple-50 flex items-center justify-center">
      <img src="/icons/seoul.png" alt="Seoul" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold mb-1 group-hover:text-purple-700 transition-colors">Seoul, South Korea</h3>
    </div>
  </a>

  {/* Singapore */}
  <a href="https://en.wikipedia.org/wiki/Singapore" target="_blank" rel="noopener noreferrer"
     className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative bg-white border border-gray-100">
    <div className="h-48 bg-green-50 flex items-center justify-center">
      <img src="/icons/singapore.png" alt="Singapore" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold mb-1 group-hover:text-purple-700 transition-colors">Singapore</h3>
    </div>
  </a>

  {/* Tokyo */}
  <a href="https://en.wikipedia.org/wiki/Tokyo" target="_blank" rel="noopener noreferrer"
     className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative bg-white border border-gray-100">
    <div className="h-48 bg-red-50 flex items-center justify-center">
      <img src="/icons/tokyo.png" alt="Tokyo" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold mb-1 group-hover:text-purple-700 transition-colors">Tokyo, Japan</h3>
    </div>
  </a>

</div>


          <div className="mt-10 text-center">
            <button
              onClick={navigateToSignup}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-700 text-white font-medium rounded-lg hover:bg-indigo-800 transition-colors">
              Discover More Destinations
            </button>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Typography variant="h2" component="h2" className="text-3xl sm:text-4xl font-bold mb-4">
              How Velutara Works
            </Typography>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Planning your perfect trip is easy with our AI-powered assistant.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Tell Us Your Travel Plans</h3>
              <p className="text-gray-600">
                Seamless travel arrangements tailored for busy professionals. Where do you want to go next?
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Get Personalized Recommendations</h3>
              <p className="text-gray-600">
                Our AI analyzes your requirements and generates tailored itineraries, accommodation options, and activities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Perfect Trip</h3>
              <p className="text-gray-600">
                Save your itinerary, make adjustments as needed, and access your travel plans anytime from any device.
              </p>
            </motion.div>
          </div>

          <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 sm:p-10 flex items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Start Your Travel Adventure Today</h3>
                  <p className="text-gray-600 mb-6">
                    Join thousands of satisfied travelers who have discovered the joy of stress-free travel planning with Velutara.
                  </p>
                  <GradientButton
                    onClick={navigateToSignup}
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    Create Your Free Account
                  </GradientButton>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 sm:p-10 text-white flex items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Why Travelers Love Velutara:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Saves hours of research time</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Personalized to your unique travel style</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Discovers hidden gems not found in guidebooks</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>24/7 assistance during your trip</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Typography variant="h2" component="h2" className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </Typography>
            <p className="text-xl text-gray-600">
              Everything you need to know about Velutara
            </p>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </motion.div>
            ))}
          </div>
{/* 
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button className="text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Contact Support
            </button>
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Travel Experience?</h2>
          <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
            Join thousands of travelers who plan better trips with Velutara. Your next adventure awaits!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={navigateToSignup}
              className="px-8 py-3 bg-white text-purple-700 font-bold rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg"
            >
              Sign Up Free
            </button>
            <a href="#how-it-works">
              <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                  <LogoIcon width={24} height={24} color="white" />
                </div>
                <Typography variant="h1" className="text-xl font-bold text-white">VELUTARA</Typography>
              </div>
              <p className="text-gray-400">
                Your AI-powered travel companion for creating unforgettable journeys around the world.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#destinations" className="text-gray-400 hover:text-white transition-colors">Destinations</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>


            {/* Company Section */}
            {/* <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-gray-400 hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div> */}

            {/* Legal Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                {/* <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li> */}
                {/* <li>
                  <Link href="/gdpr" className="text-gray-400 hover:text-white transition-colors">
                    GDPR
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 Velutara. All rights reserved.</p>
            {/* <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}