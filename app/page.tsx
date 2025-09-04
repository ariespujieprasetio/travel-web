'use client'

import LogoIcon from '@/src/LogoIcon'
import GradientButton from '@/src/components/GradientButton'
import Typography from '@/src/components/Typography'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React, { useState } from 'react'

export default function LandingPage() {

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

  // Data destinasi populer
  const destinations = [
    {
      name: "Bangkok, Thailand",
      url: "https://en.wikipedia.org/wiki/Bangkok",
      img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFuZ2tva3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Dubai, UAE",
      url: "https://en.wikipedia.org/wiki/Dubai",
      img: "https://plus.unsplash.com/premium_photo-1697729914552-368899dc4757?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnVyaiUyMGtoYWxpZmF8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Jakarta, Indonesia",
      url: "https://en.wikipedia.org/wiki/Jakarta",
      img: "https://images.unsplash.com/photo-1662808782878-941ea16adbdc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9uYXN8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Kuala Lumpur, Malaysia",
      url: "https://en.wikipedia.org/wiki/Kuala_Lumpur",
      img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a3VhbGElMjBsdW1wdXJ8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Manila, Philippines",
      url: "https://en.wikipedia.org/wiki/Manila",
      img: "https://images.unsplash.com/photo-1655016268120-383558788b37?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFuaWxhJTIwZmlsaXBpbmF8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Seoul, South Korea",
      url: "https://en.wikipedia.org/wiki/Seoul",
      img: "https://plus.unsplash.com/premium_photo-1661886333708-877148b43ae1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2VvdWx8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Singapore",
      url: "https://en.wikipedia.org/wiki/Singapore",
      img: "https://images.unsplash.com/photo-1697438167040-ccfd469c40f2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Tokyo, Japan",
      url: "https://en.wikipedia.org/wiki/Tokyo",
      img: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG9reW98ZW58MHx8MHx8fDA%3D",
    },
  ];

  function DestinationsSlider() {
    const [slide, setSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
    const perPage = 4;
    const totalSlides = Math.ceil(destinations.length / perPage);

    const handleSlide = (dir: 'next' | 'prev') => {
      if (isAnimating) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setSlide((s) =>
          dir === 'next' ? (s + 1) % totalSlides : (s - 1 + totalSlides) % totalSlides
        );
        setIsAnimating(false);
      }, 350); // durasi animasi
    };

    const visible = destinations.slice(slide * perPage, slide * perPage + perPage);
    const cards =
      visible.length < perPage
        ? [...visible, ...destinations.slice(0, perPage - visible.length)]
        : visible;

    return (
      <div className="relative">
        <div
          className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300
            ${isAnimating && direction === 'next' ? 'opacity-0 -translate-x-8' : ''}
            ${isAnimating && direction === 'prev' ? 'opacity-0 translate-x-8' : ''}
            ${!isAnimating ? 'opacity-100 translate-x-0' : ''}
          `}
        >
          {cards.map((d, i) => (
            <a
              key={d.name}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow hover:scale-105 bg-white relative"
            >
              <img src={d.img} alt={d.name} className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 w-full px-4 py-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{d.name}</h3>
              </div>
            </a>
          ))}
        </div>
        {/* Navigasi panah */}
        <button
          onClick={() => handleSlide('prev')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-lg w-12 h-12 flex items-center justify-center z-10 hover:bg-gray-100 transition"
          aria-label="Previous"
          disabled={isAnimating}
        >
          <svg width="28" height="28" fill="none" stroke="#1a2c1a" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button
          onClick={() => handleSlide('next')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-lg w-12 h-12 flex items-center justify-center z-10 hover:bg-gray-100 transition"
          aria-label="Next"
          disabled={isAnimating}
        >
          <svg width="28" height="28" fill="none" stroke="#1a2c1a" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    );
  }

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
          <DestinationsSlider />
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
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 Velutara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}