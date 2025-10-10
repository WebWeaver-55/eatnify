'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'

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
  const [message, setMessage] = useState({ text: '', type: '' })

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
    if (message.text) setMessage({ text: '', type: '' })
  }

  const checkDuplicate = async (field: string, value: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(field)
        .eq(field, value)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking duplicate:', error)
        return false
      }

      return !!data // Returns true if data exists (duplicate found)
    } catch (error) {
      console.error('Error checking duplicate:', error)
      return false
    }
  }

  const validateForm = async () => {
    if (!formData.name.trim()) {
      setMessage({ text: 'Name is required', type: 'error' })
      return false
    }
    if (!formData.email.trim()) {
      setMessage({ text: 'Email is required', type: 'error' })
      return false
    }
    if (!formData.phone_number.trim()) {
      setMessage({ text: 'Phone number is required', type: 'error' })
      return false
    }
    if (!formData.restaurant_name.trim()) {
      setMessage({ text: 'Restaurant name is required', type: 'error' })
      return false
    }
    if (!formData.password || formData.password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters long', type: 'error' })
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' })
      return false
    }

    // Check for duplicates
    const emailExists = await checkDuplicate('email', formData.email.trim().toLowerCase())
    if (emailExists) {
      setMessage({ text: 'An account with this email already exists', type: 'error' })
      return false
    }

    const phoneExists = await checkDuplicate('phone_number', formData.phone_number.trim())
    if (phoneExists) {
      setMessage({ text: 'An account with this phone number already exists', type: 'error' })
      return false
    }

    const restaurantExists = await checkDuplicate('restaurant_name', formData.restaurant_name.trim())
    if (restaurantExists) {
      setMessage({ text: 'An account with this restaurant name already exists', type: 'error' })
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage({ text: '', type: '' })
    setSuccess(false)

    try {
      const isValid = await validateForm()
      if (!isValid) {
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
      
      setMessage({ 
        text: 'Account created successfully! Redirecting to plan selection...', 
        type: 'success' 
      })
      setSuccess(true)

      setTimeout(() => {
        router.push('/plan-selection')
      }, 2000)

    } catch (err: any) {
      console.error('Signup form error:', err)
      setMessage({ 
        text: err.message || 'Something went wrong. Please try again.', 
        type: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-4 sm:left-10 w-20 h-20 sm:w-24 sm:h-24 bg-blue-600/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-4 sm:right-10 w-28 h-28 sm:w-36 sm:h-36 bg-purple-600/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-8 sm:right-20 w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-8 sm:left-16 w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/10 rounded-full blur-lg animate-pulse delay-1500"></div>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="bg-slate-800/40 backdrop-blur-xl border border-blue-400/20 shadow-2xl rounded-3xl overflow-hidden">
          {/* Gradient Top Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          
          <div className="space-y-1 pb-6 pt-8 px-6 sm:px-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl px-5 py-3 sm:px-6 sm:py-3 shadow-2xl border border-blue-400/30">
                  <span className="text-white font-bold text-xl sm:text-2xl tracking-wider">EATNIFY</span>
                </div>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-white">
              Create Your Account
            </h1>
            <p className="text-center text-blue-200 text-sm sm:text-base">
              Join the next generation of restaurants
            </p>
          </div>
          
          <div className="space-y-6 px-6 sm:px-8 pb-8">
            {/* Enhanced Error/Success Message */}
            {message.text && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 border-2 backdrop-blur-sm transition-all duration-300 ${
                message.type === 'error' 
                  ? 'bg-red-500/10 border-red-500/30 text-red-300 shadow-lg shadow-red-500/10' 
                  : 'bg-green-500/10 border-green-500/30 text-green-300 shadow-lg shadow-green-500/10'
              }`}>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  message.type === 'error' ? 'bg-red-500/20' : 'bg-green-500/20'
                }`}>
                  {message.type === 'error' ? (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${
                    message.type === 'error' ? 'text-red-300' : 'text-green-300'
                  }`}>
                    {message.type === 'error' ? 'Registration Failed' : 'Success!'}
                  </p>
                  <p className="text-sm mt-1">{message.text}</p>
                </div>
                <button
                  onClick={() => setMessage({ text: "", type: "" })}
                  className="flex-shrink-0 text-blue-300 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-3">
                <label className="text-blue-300 font-medium text-sm sm:text-base">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  required
                  disabled={loading}
                  className="w-full h-12 bg-slate-700/50 border-blue-400/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 rounded-xl text-sm sm:text-base transition-all backdrop-blur-sm px-4"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-blue-300 font-medium text-sm sm:text-base">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  required
                  disabled={loading}
                  className="w-full h-12 bg-slate-700/50 border-blue-400/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 rounded-xl text-sm sm:text-base transition-all backdrop-blur-sm px-4"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-3">
                <label className="text-blue-300 font-medium text-sm sm:text-base">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField('')}
                  required
                  disabled={loading}
                  className="w-full h-12 bg-slate-700/50 border-blue-400/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 rounded-xl text-sm sm:text-base transition-all backdrop-blur-sm px-4"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Restaurant Name */}
              <div className="space-y-3">
                <label className="text-blue-300 font-medium text-sm sm:text-base">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  name="restaurant_name"
                  value={formData.restaurant_name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('restaurant')}
                  onBlur={() => setFocusedField('')}
                  required
                  disabled={loading}
                  className="w-full h-12 bg-slate-700/50 border-blue-400/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 rounded-xl text-sm sm:text-base transition-all backdrop-blur-sm px-4"
                  placeholder="Enter your restaurant name"
                />
                {formData.restaurant_name && (
                  <div className="mt-3 relative overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-slate-500/10"></div>
                    <div className="relative bg-slate-700/50 backdrop-blur-sm border border-blue-400/20 rounded-xl p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">🌐</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-blue-300 text-xs font-medium">Your Digital Address</p>
                          <p className="text-white font-mono text-xs truncate">
                            {formData.restaurant_name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}.eatnify.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label className="text-blue-300 font-medium text-sm sm:text-base">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full h-12 bg-slate-700/50 border-blue-400/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 rounded-xl text-sm sm:text-base transition-all backdrop-blur-sm px-4"
                  placeholder="Create a secure password"
                />
                <p className="text-blue-300/60 text-xs">
                  Minimum 6 characters required
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold h-12 text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-blue-400/30"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : success ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Success! Redirecting...
                  </div>
                ) : (
                  "Continue to Plan Selection"
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-blue-400/20">
              <p className="text-sm text-blue-300">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline"
                >
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Text */}
        <div className="text-center mt-6 px-4">
          <p className="text-blue-300/50 text-xs">
            By joining Eatnify, you agree to our{' '}
            <span className="text-blue-300 font-medium">Terms of Service</span> and{' '}
            <span className="text-blue-300 font-medium">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}