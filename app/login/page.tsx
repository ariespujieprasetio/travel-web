//login/page.tsx 

'use client'

import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { motion, AnimatePresence, useAnimation  } from 'framer-motion'
import GradientButton from '@/src/components/GradientButton'
import LogoIcon from '@/src/LogoIcon'
import useAuth from '@/src/hooks/useAuth'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore"


const testimonials = [
  {
    initials: "JD",
    name: "Jessica Doe",
    rating: 5,
    review:
      "Velutara really feels like having a personal assistant during my vacation! I can plan a complete itinerary in just minutes. Super practical and accurate!",
  },
  {
    initials: "MR",
    name: "Michael Roe",
    rating: 4,
    review:
      "I was skeptical at first, but Velutara recommended local dining spots that are true hidden gems. It felt like traveling with a pro",
  },
  {
    initials: "AM",
    name: "Alice Monroe",
    rating: 5,
    review:
      "With Velutara, I don’t need to browse for hours anymore. All travel info is in one place — from tickets, hotels, to local tips!",
  },
  {
    initials: "DL",
    name: "Daniel Lim",
    rating: 5,
    review:
      "Awesome! I used Velutara for a solo trip to Japan, and the AI really helped me navigate places rarely talked about",
  },
  {
    initials: "EC",
    name: "Emma Carter",
    rating: 5,
    review:
      "I love the simple interface and the weather forecast is very accurate. My trip to Bali went so smoothly thanks to Velutara!",
  },
  {
    initials: "TS",
    name: "Tommy Sanders",
    rating: 4,
    review:
      "Velutara helped me plan my Europe backpacking trip faster than any other tool I’ve tried. Some suggestions could be more budget-focused, but overall great!",
  },
  {
    initials: "LS",
    name: "Lena Schmidt",
    rating: 5,
    review:
      "A lifesaver! I had less than a week to plan a trip to Seoul, and Velutara gave me a full itinerary, including transit maps and food recs.",
  },
  {
    initials: "BR",
    name: "Brian Richards",
    rating: 4,
    review:
      "Very convenient! Though I wish it had more offline features, Velutara still helped me enjoy every bit of my Thailand trip.",
  },
  {
    initials: "NL",
    name: "Nadia Lopez",
    rating: 5,
    review:
      "From booking to arrival, Velutara had everything covered. Even local phrases were suggested to help me get around!",
  },
  {
    initials: "HS",
    name: "Haruto Sato",
    rating: 5,
    review:
      "Perfect for travelers like me who prefer to avoid tourist traps. I found peaceful temples and authentic eateries thanks to Velutara.",
  },
];

export default function LoginPage() {
  // Auth state
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false) // New state for auth check
const [mounted, setMounted] = useState(false);

  const [gapi, setGapi] = useState<any>(null);

  const router = useRouter();

    const { token, user, isLoading, error, clearError, login, signup, loginRegisterWithGoogle } = useAuthStore();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    clearError();
  }, [mounted, clearError]);

  useEffect(() => {
    if (mounted && token && user) {
      router.push('/dashboard');
    }
  }, [mounted, token, user, router]);

  const googleBtnRef = useRef<HTMLDivElement>(null);

const renderGoogleButton = () => {
  if (typeof window === 'undefined') return;
  if (!window.google || !googleBtnRef.current) return;

  googleBtnRef.current.innerHTML = '';

  window.google.accounts.id.initialize({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    callback: async (res) => {
      console.log("Google Credential: ", res.credential);
      const ok = await loginRegisterWithGoogle(res.credential);
      if (ok) router.push('/dashboard');
    },
  });

  window.google.accounts.id.renderButton(googleBtnRef.current, {
    theme: 'outline',
    size: 'large',
    locale: "en",
    width: 'fill',
    text: 'continue_with',
  });
};



useEffect(() => {
  if (!mounted) return;

  const timeout = setTimeout(() => {
    renderGoogleButton();
  }, 100);

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      renderGoogleButton();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    clearTimeout(timeout);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [mounted, loginRegisterWithGoogle, router, isLogin]);

  useEffect(() => {
    clearError()
  }, [isLogin, clearError]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isLogin) {
        const success = await login(email, password, rememberMe);
        if (success) {
          router.push("/dashboard");
        }
      } else {
        const success = await signup(email, password, rememberMe, name,);
        if (success) {
          router.push("/dashboard");
        }
      }
    };


  const togglePasswordVisibility = (): void => {
    setPasswordVisible(!passwordVisible)
  }


  // create slider testimonials
  const cardWidth = 340
  const gap = 24
  const totalCardWidth = cardWidth + gap

  const [index, setIndex] = useState(0)
  const controls = useAnimation()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const slideTo = (newIndex: number) => {
    setIndex(newIndex)
    controls.start({ x: -newIndex * totalCardWidth })
  }

  const handlePrev = () => {
    const newIndex = index === 0 ? testimonials.length - 1 : index - 1
    slideTo(newIndex)
    resetAutoSlide()
  }

  const handleNext = () => {
    const newIndex = (index + 1) % testimonials.length
    slideTo(newIndex)
    resetAutoSlide()
  }

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setIndex(prev => {
        const nextIndex = (prev + 1) % testimonials.length
        controls.start({ x: -nextIndex * totalCardWidth })
        return nextIndex
      })
    }, 4000)
  }

  const resetAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    startAutoSlide()
  }

  useEffect(() => {
    startAutoSlide()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

    return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left side with background image */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-purple-600 to-indigo-700 items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 800 800">
            <defs>
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-md text-white px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex items-center">
              <LogoIcon width={40} height={40} color="white" />
              <h1 className="ml-3 text-3xl font-bold">VELUTARA</h1>
            </div>
            <h2 className="text-3xl font-bold mb-6">Your AI Travel Companion</h2>
            <p className="text-purple-100 text-lg mb-8">
              Join thousands of travelers who plan better trips with personalized recommendations,
              custom itineraries, and expert travel advice.
            </p>
            <div className="relative w-full overflow-hidden py-8 px-6">
              {/* Navigation buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full z-10"
              >
                <ChevronLeft className="text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full z-10"
              >
                <ChevronRight className="text-white" />
              </button>

              <div className="overflow-hidden w-full">
                <motion.div
                  animate={controls}
                  transition={{ duration: 0.5 }}
                  className="flex gap-6"
                  style={{
                    width: `${testimonials.length * totalCardWidth}px`,
                  }}
                >
                  {testimonials.map((t, i) => (
                    <div
                      key={i}
                      className="min-w-[300px] max-w-[340px] bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-lg text-white flex-shrink-0"
                      style={{ width: `${cardWidth}px` }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-lg">
                          {t.initials}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-white">{t.name}</p>
                          <div className="flex">
                            {Array(t.rating)
                              .fill(null)
                              .map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-4 h-4 text-yellow-300"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-white/90 italic text-sm leading-relaxed">{t.review}</p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo (visible only on mobile) */}
          <div className="flex items-center justify-center md:hidden mb-8">
            <LogoIcon width={36} height={36} color="#6366F1" />
            <h1 className="ml-2 text-2xl font-bold text-indigo-600">VELUTARA</h1>
          </div>

          <div className="text-center mb-8">
            <motion.h2
              key={isLogin ? 'login-title' : 'signup-title'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold mb-2 text-gray-800"
            >
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </motion.h2>
            <motion.p
              key={isLogin ? 'login-subtitle' : 'signup-subtitle'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-gray-600"
            >
              {isLogin ? 'Log in to access your travel plans' : 'Start planning your dream trips with Velutara'}
            </motion.p>
          </div>

          {/* Tab switching */}
          <div className="bg-gray-100 rounded-lg p-1 mb-8 flex relative">
            {/* Animated highlight */}
            <motion.div
              className="absolute top-1 bottom-1 rounded-md bg-white shadow-sm z-0"
              initial={false}
              animate={{
                x: isLogin ? '100%' : '0%',
                width: '50%'
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />

            <button
              className={`w-1/2 py-2 rounded-md text-sm font-medium transition-colors z-10 relative ${!isLogin ? 'text-gray-800' : 'text-gray-600'
                }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
            <button
              className={`w-1/2 py-2 rounded-md text-sm font-medium transition-colors z-10 relative ${isLogin ? 'text-gray-800' : 'text-gray-600'
                }`}
              onClick={() => setIsLogin(true)}
            >
              Log In
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start"
            >
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-form' : 'signup-form'}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? (
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="mt-1 text-sm text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  )}
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <div>
                      <a href="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                )}

                <GradientButton
                  type="submit"
                  fullWidth
                  style={{ padding: '0.75rem 0' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isLogin ? 'Logging in...' : 'Creating account...'}
                    </span>
                  ) : (
                    isLogin ? 'Log In' : 'Create Account'
                  )}
                </GradientButton>

                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">or</span>
                  </div>
                </div>
                <div ref={googleBtnRef} className="mt-6 full" />
              </form>
            </motion.div>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-purple-600 hover:text-purple-700"
            >
              {isLogin ? 'Sign up now' : 'Log in'}
            </button>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-xs text-gray-500"
          >
            Lorem ipsum dolor sit amet consectetur.
            <a href="/terms" className="underline hover:text-gray-700">Terms of Service</a> and{' '}
            <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a>.
          </motion.p>
        </div>
      </div>
    </div>
  )
}