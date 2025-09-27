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

      localStorage.setItem('signupData', JSON.stringify(signupData))
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
        {/* Dark Blue Texture Overlays */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/30 via-slate-800/20 to-blue-800/30 animate-pulse"></div>
        </div>
        
        {/* Animated Geometric Patterns - Dark Blue Theme */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-slate-700/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-slate-700/20 to-blue-700/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-blue-500/15 to-slate-600/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Enhanced Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.4) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Flowing Lines - Dark Blue Theme */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'rgb(59, 130, 246)', stopOpacity: 0.15}} />
                <stop offset="100%" style={{stopColor: 'rgb(30, 58, 138)', stopOpacity: 0.08}} />
              </linearGradient>
            </defs>
            <path d="M0,200 Q300,100 600,200 T1200,200 L1200,250 Q900,150 600,250 T0,250 Z" fill="url(#grad1)" className="animate-pulse" />
            <path d="M0,400 Q400,300 800,400 T1200,400 L1200,450 Q800,350 400,450 T0,450 Z" fill="url(#grad1)" className="animate-pulse" style={{animationDelay: '1.5s'}} />
          </svg>
        </div>

        {/* Additional Dark Blue Texture Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-slate-950/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-blue-900/20 to-slate-950/30"></div>
      </div>

      {/* Glassmorphism Navigation Dots */}
      <div className="absolute top-24 right-8 flex space-x-3 z-10">
        <div className="w-3 h-3 bg-blue-400/30 backdrop-blur-sm rounded-full border border-blue-300/20"></div>
        <div className="w-3 h-3 bg-slate-400/30 backdrop-blur-sm rounded-full border border-slate-300/20"></div>
        <div className="w-3 h-3 bg-blue-500/30 backdrop-blur-sm rounded-full border border-blue-400/20"></div>
      </div>

      {/* Main Content - Fixed positioning */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg mx-auto">
          {/* Floating Header */}
          <div className="text-center mb-12 relative">
            {/* Glowing Logo Background - Dark Blue Theme */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-600/20 to-slate-600/20 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative">
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-slate-200 bg-clip-text text-transparent mb-4 tracking-tight">
                Eatnify
              </h1>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              </div>
              <p className="text-xl text-blue-100/90 font-light tracking-wide">
                The Future of Restaurant Digital Presence
              </p>
            </div>
          </div>

          {/* Glassmorphism Form Container */}
          <div className="relative group">
            {/* Glow Effect - Dark Blue Theme */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-slate-600/30 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60"></div>
            
            <div className="relative bg-white/8 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl p-8 md:p-10">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-3">
                  Create Your Account
                </h2>
                <p className="text-blue-200/80 font-light">Join the next generation of restaurants</p>
              </div>
              
              {/* Success Message */}
              {success && (
                <div className="mb-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 animate-pulse rounded-2xl"></div>
                  <div className="relative bg-gradient-to-r from-emerald-50/90 to-green-50/90 backdrop-blur-sm border border-emerald-200/50 text-emerald-800 rounded-2xl p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-bounce">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Account Created Successfully!</h3>
                    <p className="text-sm opacity-80">Preparing your personalized experience...</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 animate-pulse rounded-2xl"></div>
                  <div className="relative bg-gradient-to-r from-red-50/90 to-pink-50/90 backdrop-blur-sm border border-red-200/50 text-red-800 rounded-2xl p-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span className="font-semibold">{error}</span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-blue-100 mb-3 tracking-wide">
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
                      className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-white placeholder-blue-200/50 font-medium"
                      placeholder="Enter your full name"
                    />
                    {focusedField === 'name' && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 -z-10 blur-sm"></div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-blue-100 mb-3 tracking-wide">
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
                      className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-white placeholder-blue-200/50 font-medium"
                      placeholder="Enter your email address"
                    />
                    {focusedField === 'email' && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 -z-10 blur-sm"></div>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-blue-100 mb-3 tracking-wide">
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
                      className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-white placeholder-blue-200/50 font-medium"
                      placeholder="Enter your phone number"
                    />
                    {focusedField === 'phone' && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 -z-10 blur-sm"></div>
                    )}
                  </div>
                </div>

                {/* Restaurant Name */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-blue-100 mb-3 tracking-wide">
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
                      className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-white placeholder-blue-200/50 font-medium"
                      placeholder="Enter your restaurant name"
                    />
                    {focusedField === 'restaurant' && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 -z-10 blur-sm"></div>
                    )}
                  </div>
                  {formData.restaurant_name && (
                    <div className="mt-4 relative overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-slate-500/10"></div>
                      <div className="relative bg-white/5 backdrop-blur-sm border border-blue-300/20 rounded-2xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-slate-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-blue-200 text-sm font-medium">Your Digital Address</p>
                            <p className="text-white font-mono text-sm">
                              {formData.restaurant_name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}.eatnify.com
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-blue-100 mb-3 tracking-wide">
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
                      className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-white placeholder-blue-200/50 font-medium"
                      placeholder="Create a secure password"
                    />
                    {focusedField === 'password' && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 -z-10 blur-sm"></div>
                    )}
                  </div>
                  <p className="text-blue-200/60 text-xs mt-2 tracking-wide">
                    Minimum 6 characters required
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="group relative w-full overflow-hidden"
                  >
                    {/* Button Glow - Dark Blue Theme */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-70 group-hover:opacity-100"></div>
                    
                    {/* Button Content */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform group-hover:scale-[1.02] group-active:scale-[0.98] shadow-2xl">
                      {loading ? (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="text-lg tracking-wide">Creating Account...</span>
                        </div>
                      ) : success ? (
                        <div className="flex items-center justify-center space-x-3">
                          <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="text-lg tracking-wide">Success! Redirecting...</span>
                        </div>
                      ) : (
                        <span className="text-lg tracking-wide">Continue to Plan Selection</span>
                      )}
                    </div>
                  </button>
                </div>
              </form>

              {/* Footer Links */}
              <div className="text-center mt-8 pt-6 border-t border-white/10">
                <p className="text-blue-200/60 text-sm tracking-wide">
                  Already part of the future? 
                  <a href="/login" className="text-blue-300 hover:text-white font-semibold ml-2 transition-colors duration-200 underline decoration-blue-400/50 underline-offset-4 hover:decoration-white">
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Legal Text */}
          <div className="text-center mt-8">
            <p className="text-blue-300/50 text-xs tracking-wide leading-relaxed">
              By joining Eatnify, you agree to our 
              <span className="text-blue-300 font-medium"> Terms of Service </span> 
              and 
              <span className="text-blue-300 font-medium"> Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements - Dark Blue Theme */}
      <div className="absolute bottom-8 left-8 opacity-30">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
      </div>
      <div className="absolute top-1/3 left-8 opacity-20">
        <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      <div className="absolute bottom-1/3 right-8 opacity-25">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  )
}