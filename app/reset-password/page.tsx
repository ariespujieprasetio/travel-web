'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaEnvelope, FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import LogoIcon from '@/src/LogoIcon'
import GradientButton from '@/src/components/GradientButton'
import Link from 'next/link'
import usePasswordReset from '@/src/hooks/usePasswordReset'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get token and email from URL if present
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  
  // Password reset hook
  const {
    loading, 
    success, 
    error, 
    isComplete,
    requestReset,
    validateToken,
    resetPassword,
  } = usePasswordReset()
  
  // Set the mode based on whether token and email are present
  const [mode, setMode] = useState<'request' | 'reset' | 'complete'>('request')
  
  // Form state for request mode
  const [requestEmail, setRequestEmail] = useState(email || '')
  
  // Form state for reset mode
  const [resetForm, setResetForm] = useState({
    email: email || '',
    token: token || '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // Password validation state
  
  // Validate token if provided
  useEffect(() => {
    const checkToken = async () => {
      if (token && email) {
        try {
          const isValid = await validateToken(email, token)
          
          if (isValid) {
            setMode('reset')
            setResetForm(prev => ({
              ...prev,
              email: email,
              token: token
            }))
          } else {
            setMode('request')
          }
        } catch (err) {
          // If validation fails, stay in request mode
          setMode('request')
          console.log(err)
        }
      }
    }
    
    checkToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email])
  
  // Update mode when reset is complete
  useEffect(() => {
    if (isComplete) {
      setMode('complete')
    }
  }, [isComplete])
  
  // Handle request form submission
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!requestEmail.trim()) return
    
    await requestReset(requestEmail)
  }
  
  // Handle reset form submission
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords match
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      // We need to handle this manually since it's a client-side validation
      return
    }
    
    // Validate password length
    if (resetForm.newPassword.length < 8) {
      // We need to handle this manually since it's a client-side validation
      return
    }
    
    await resetPassword(resetForm.email, resetForm.token, resetForm.newPassword)
  }
  
  const handleResetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setResetForm(prev => ({
      ...prev,
      [name]: value
    }))
    
   
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
            <LogoIcon width={28} height={28} color="white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'request' && 'Reset your password'}
          {mode === 'reset' && 'Create new password'}
          {mode === 'complete' && 'Password reset complete'}
        </h2>
        <p className="mt-2 text-center text-gray-600 max-w">
          {mode === 'request' && "Enter your email and we'll send you a link to reset your password"}
          {mode === 'reset' && "Enter your new password below"}
          {mode === 'complete' && "Your password has been successfully reset"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <FaExclamationTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {mode === 'request' && success && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
              <p className="text-gray-600 mb-6">
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={resetForm.newPassword}
                    onChange={handleResetInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
                <div className="mt-1">
                  
                  {/* {passwordErrors.length > 0 && (
                    <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                      {passwordErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )} */}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={resetForm.confirmPassword}
                    onChange={handleResetInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
                {/* {passwordsMatchError && (
                  <p className="mt-1 text-sm text-red-600">
                    Passwords do not match
                  </p>
                )} */}
              </div>

              <input type="hidden" name="email" value={resetForm.email} />
              <input type="hidden" name="token" value={resetForm.token} />

              <div>
                <GradientButton
                  type="submit"
                  fullWidth
                  disabled={loading || 
                            // passwordErrors.length > 0 || 
                            // passwordsMatchError ||
                            !resetForm.newPassword ||
                            !resetForm.confirmPassword}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </GradientButton>
              </div>
            </form>
          )}
          
          {mode === 'complete' && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Password Reset Complete</h3>
              <p className="text-gray-600 mb-6">
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
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}