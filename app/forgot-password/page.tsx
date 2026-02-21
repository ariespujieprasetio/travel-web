'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa'
import LogoIcon from '@/src/LogoIcon'
import GradientButton from '@/src/components/GradientButton'
import Link from 'next/link'
import apiClient from '@/src/services/apiClient'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  
  const [mode, setMode] = useState<'request' | 'reset' | 'complete'>('request')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [requestEmail, setRequestEmail] = useState(email || '')
  
  const [resetForm, setResetForm] = useState({
    email: email || '',
    token: token || '',
    newPassword: '',
    confirmPassword: ''
  })
  
  useEffect(() => {
    const validateToken = async () => {
      if (token && email) {
        setLoading(true)
        try {
          const response = await apiClient.get<{ valid: boolean }>(
            `/api/password-reset/validate?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
            { authenticated: false }
          )
          
          if (response.valid) {
            setMode('reset')
          } else {
            setError('The password reset link is invalid or has expired. Please request a new one.')
            setMode('request')
          }
        } catch (err) {
          setError('Failed to validate reset token. Please request a new password reset link.' + String(err))
          setMode('request')
        } finally {
          setLoading(false)
        }
      }
    }
    
    validateToken()
  }, [token, email])
  
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await apiClient.post('/api/password-reset/request', 
        { email: requestEmail },
        { authenticated: false }
      )
      
      setSuccess('If a user with that email exists, a password reset link has been sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request password reset')
    } finally {
      setLoading(false)
    }
  }
  
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    
    if (resetForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }
    
    try {
      await apiClient.post('/api/password-reset/reset', 
        {
          email: resetForm.email,
          token: resetForm.token,
          newPassword: resetForm.newPassword
        },
        { authenticated: false }
      )
      
      setMode('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }
  
  const handleResetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setResetForm(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-16">
      
      <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-purple-600/30 blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
            <LogoIcon width={28} height={28} color="white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {mode === 'request' && 'Reset your password'}
          {mode === 'reset' && 'Create new password'}
          {mode === 'complete' && 'Password reset complete'}
        </h2>
        <p className="mt-2 text-center text-gray-400 max-w">
          {mode === 'request' && "Enter your email and we'll send you a link to reset your password"}
          {mode === 'reset' && "Enter your new password below"}
          {mode === 'complete' && "Your password has been successfully reset"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl px-8 py-10">
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md">
              {error}
            </div>
          )}
          
          {success && mode === 'request' && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Check Your Email</h3>
              <p className="text-gray-400 mb-6">
                If we found an account associated with {requestEmail}, we&apos;ve sent instructions to reset your password.
              </p>
              <p className="text-sm text-gray-500">
                Didn&apos;t receive an email? Check your spam folder or try again.
              </p>
            </div>
          )}
          
          {mode === 'request' && !success && (
            <form className="space-y-6" onSubmit={handleRequestSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-500/70" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <GradientButton
                  type="submit"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </GradientButton>
              </div>
            </form>
          )}
          
          {mode === 'reset' && (
            <form className="space-y-6" onSubmit={handleResetSubmit}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-500/70" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={resetForm.newPassword}
                    onChange={handleResetInputChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Password must be at least 8 characters
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-500/70" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={resetForm.confirmPassword}
                    onChange={handleResetInputChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>

              <input type="hidden" name="email" value={resetForm.email} />
              <input type="hidden" name="token" value={resetForm.token} />

              <div>
                <GradientButton
                  type="submit"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </GradientButton>
              </div>
            </form>
          )}
          
          {mode === 'complete' && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Password Reset Complete</h3>
              <p className="text-gray-400 mb-6">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <GradientButton
                onClick={() => router.push('/login')}
                fullWidth
              >
                Go to Login
              </GradientButton>
            </div>
          )}
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-500">
                  Or
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}