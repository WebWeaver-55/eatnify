'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    restaurant_name: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState('')

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.phone_number.trim()) {
      setError('Phone number is required')
      return false
    }
    if (!formData.restaurant_name.trim()) {
      setError('Restaurant name is required')
      return false
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      if (!validateForm()) {
        setLoading(false)
        return
      }

      const generatePreviewSubdomain = (restaurantName: string): string => {
        const cleanName = restaurantName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        
        return `${cleanName}.eatnify.com`
      }

      const previewSubdomain = generatePreviewSubdomain(formData.restaurant_name)

      const signupData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone_number.trim(),
        restaurant_name: formData.restaurant_name.trim(),
        password: formData.password,
        preview_subdomain: previewSubdomain
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('signupData', JSON.stringify(signupData))
      }
      setSuccess(true)

      setTimeout(() => {
        router.push('/plan-selection')
      }, 2000)

    } catch (err: any) {
      console.error('Signup form error:', err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ paddingTop: '80px' }}>
      {/* Enhanced Dark Blue Background with Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/30 via-slate-800/20 to-blue-800/30 animate-pulse"></div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-slate-700/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-slate-700/20 to-blue-700/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.4) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-4 py-8 sm:py-12">
        <div className="w-full max-w-lg mx-auto">
          {/* Floating Header */}
          <div className="text-center mb-8 sm:mb-10 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-600/20 to-slate-600/20 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-slate-200 bg-clip-text text-transparent mb-3 sm:mb-4 tracking-tight">
                Eatnify
              </h1>
              <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
                <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              </div>
              <p className="text-base sm:text-xl text-blue-100/90 font-light tracking-wide px-4">
                The Future of Restaurant Digital Presence
              </p>
            </div>
          </div>

          {/* Glassmorphism Form Container */}
          <div className="relative group">
            <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-blue-600/30 to-slate-600/30 rounded-2xl sm:rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60"></div>
            
            <div className="relative bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10">
              {/* Form Header */}
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2 sm:mb-3">
                  Create Your Account
                </h2>
                <p className="text-sm sm:text-base text-blue-200/80 font-light">Join the next generation of restaurants</p>
              </div>
              
              {/* Success Message */}
              {success && (
                <div className="mb-6 sm:mb-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 animate-pulse rounded-xl sm:rounded-2xl"></div>
                  <div className="relative bg-gradient-to-r from-emerald-50/90 to-green-50/90 backdrop-blur-sm border border-emerald-200/50 text-emerald-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center mb-2 sm:mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-bounce">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Account Created Successfully!</h3>
                    <p className="text-xs sm:text-sm opacity-80">Preparing your personalized experience...</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 sm:mb-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 animate-pulse rounded-xl sm:rounded-2xl"></div>
                  <div className="relative bg-gradient-to-r from-red-50/90 to-pink-50/90 backdrop-blur-sm border border-red-200/50 text-red-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span className="font-semibold text-sm sm:text-base">{error}</span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Full Name */}
                <div className="relative group">
                  <label className="block text-xs sm:text-sm font-semibold text-blue-100 mb-2 sm:mb-2.5 tracking-wide">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-white placeholder-blue-200/50 text-sm sm:text-base font-medium"
                      placeholder="Enter your full name"
                    />
                    {focusedField === 'name' && (
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 -z-10 blur-sm"></div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="relative group">
                  <label className="block text-xs sm:text-sm font-semibold text-blue-100 mb-2 sm:mb-2.5 tracking-wide">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-white placeholder-blue-200/50 text-sm sm:text-base font-medium"
                      placeholder="Enter your email address"
                    />
                    {focusedField === 'email' && (
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 -z-10 blur-sm"></div>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="relative group">
                  <label className="block text-xs sm:text-sm font-semibold text-blue-100 mb-2 sm:mb-2.5 tracking-wide">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField('')}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-white placeholder-blue-200/50 text-sm sm:text-base font-medium"
                      placeholder="Enter your phone number"
                    />
                    {focusedField === 'phone' && (
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 -z-10 blur-sm"></div>
                    )}
                  </div>
                </div>

                {/* Restaurant Name */}
                <div className="relative group">
                  <label className="block text-xs sm:text-sm font-semibold text-blue-100 mb-2 sm:mb-2.5 tracking-wide">
                    Restaurant Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="restaurant_name"
                      value={formData.restaurant_name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('restaurant')}
                      onBlur={() => setFocusedField('')}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-white placeholder-blue-200/50 text-sm sm:text-base font-medium"
                      placeholder="Enter your restaurant name"
                    />
                    {focusedField === 'restaurant' && (
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 -z-10 blur-sm"></div>
                    )}
                  </div>
                  {formData.restaurant_name && (
                    <div className="mt-3 sm:mt-4 relative overflow-hidden rounded-xl sm:rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-slate-500/10"></div>
                      <div className="relative bg-white/5 backdrop-blur-sm border border-blue-300/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-blue-200 text-xs sm:text-sm font-medium">Your Digital Address</p>
                            <p className="text-white font-mono text-xs sm:text-sm truncate">
                              {formData.restaurant_name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}.eatnify.com
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password with strong underline */}
                <div className="relative group pb-1">
                  <label className="block text-xs sm:text-sm font-semibold text-blue-100 mb-2 sm:mb-2.5 tracking-wide">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      required
                      minLength={6}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-white placeholder-blue-200/50 text-sm sm:text-base font-medium"
                      placeholder="Create a secure password"
                    />
                    {focusedField === 'password' && (
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 -z-10 blur-sm"></div>
                    )}
                  </div>
                  <p className="text-blue-200/60 text-xs mt-1.5 sm:mt-2 tracking-wide">
                    Minimum 6 characters required
                  </p>
                  {/* Strong decorative underline */}
                  <div className="mt-4 sm:mt-5 h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
                </div>

                {/* Submit Button - Mobile optimized */}
                <div className="pt-3 sm:pt-4">
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="group relative w-full overflow-hidden touch-manipulation min-h-[48px] sm:min-h-[56px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-70 group-hover:opacity-100"></div>
                    
                    <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:from-blue-700 active:to-blue-600 text-white font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-2xl">
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="text-sm sm:text-base md:text-lg tracking-wide">Creating Account...</span>
                        </div>
                      ) : success ? (
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="text-sm sm:text-base md:text-lg tracking-wide">Success! Redirecting...</span>
                        </div>
                      ) : (
                        <span className="text-sm sm:text-base md:text-lg tracking-wide">Continue to Plan Selection</span>
                      )}
                    </div>
                  </button>
                </div>
              </form>

              {/* Footer Links */}
              <div className="text-center mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10">
                <p className="text-blue-200/60 text-xs sm:text-sm tracking-wide">
                  Already part of the future? 
                  <a href="/login" className="text-blue-300 hover:text-white font-semibold ml-2 transition-colors duration-200 underline decoration-blue-400/50 underline-offset-4 hover:decoration-white">
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Legal Text */}
          <div className="text-center mt-6 sm:mt-8 px-4">
            <p className="text-blue-300/50 text-xs tracking-wide leading-relaxed">
              By joining Eatnify, you agree to our 
              <span className="text-blue-300 font-medium"> Terms of Service </span> 
              and 
              <span className="text-blue-300 font-medium"> Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}