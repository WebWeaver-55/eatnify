"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle, CheckCircle2, Sparkles } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Clear message when user starts typing again
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message.text])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ text: "", type: "" })

    try {
      console.log('Attempting login with:', formData.email)

      // Query the users table directly
      const { data, error } = await supabase
        .from('users')
        .select('email, password, payment_status, first_login, plan')
        .eq('email', formData.email)
        .eq('password', formData.password)
        .single()

      console.log('Login response:', { data, error })

      if (error || !data) {
        console.error('Login failed:', error)
        setMessage({
          text: "Invalid email or password. Please check your credentials.",
          type: "error"
        })
        setIsLoading(false)
        return
      }

      // Store user session in localStorage
      localStorage.setItem('userEmail', data.email)
      localStorage.setItem('userLoggedIn', 'true')
      
      console.log('Login successful, localStorage set')

      // Success - show success message
      setMessage({
        text: "Login successful! Welcome back!",
        type: "success"
      })

      setIsRedirecting(true)

      // Redirect after a short delay to show success message
      setTimeout(() => {
        console.log('Redirecting to /owner')
        router.push("/owner/")
      }, 2000)

    } catch (error) {
      console.error('Login error:', error)
      setMessage({
        text: "An unexpected error occurred. Please try again.",
        type: "error"
      })
      setIsLoading(false)
      setIsRedirecting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear any existing messages when user starts typing
    if (message.text) {
      setMessage({ text: "", type: "" })
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Prevent any interaction during redirect
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Welcome Back!</h3>
          <p className="text-blue-200 text-lg">Redirecting to your dashboard...</p>
          <div className="mt-4 flex justify-center">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>
    )
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
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-blue-400/20 shadow-2xl rounded-3xl overflow-hidden">
          {/* Gradient Top Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          
          <CardHeader className="space-y-1 pb-6 pt-8 px-6 sm:px-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl px-5 py-3 sm:px-6 sm:py-3 shadow-2xl border border-blue-400/30">
                  <span className="text-white font-bold text-xl sm:text-2xl tracking-wider">EATNIFY</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-blue-200 text-sm sm:text-base">
              Sign in to your restaurant admin panel
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 px-6 sm:px-8 pb-8">
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
                    {message.type === 'error' ? 'Login Failed' : 'Success!'}
                  </p>
                  <p className="text-sm mt-1">{message.text}</p>
                </div>
                <button
                  onClick={() => setMessage({ text: "", type: "" })}
                  className="flex-shrink-0 text-blue-300 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-blue-300 font-medium text-sm sm:text-base">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-12 bg-slate-700/50 border-blue-400/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 rounded-xl text-sm sm:text-base transition-all backdrop-blur-sm"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-blue-300 font-medium text-sm sm:text-base">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="h-12 bg-slate-700/50 border-blue-400/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 rounded-xl pr-12 text-sm sm:text-base transition-all backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-blue-500/10 rounded-r-xl transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-blue-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-blue-300" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold h-12 text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-blue-400/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-blue-400/20">
              <p className="text-sm text-blue-300">
                Don't have an account?{" "}
                <Link 
                  href="/signup" 
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}