"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const router = useRouter()
  const supabase = createClientComponentClient()

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ text: "", type: "" })

    try {
      console.log('Attempting login with:', formData.email) // Debug log

      // Query the users table directly
      const { data, error } = await supabase
        .from('users')
        .select('email, password, payment_status, first_login, plan')
        .eq('email', formData.email)
        .eq('password', formData.password)
        .single()

      console.log('Login response:', { data, error }) // Debug log

      if (error || !data) {
        console.error('Login failed:', error)
        setMessage({
          text: "Invalid email or password. Please try again.",
          type: "error"
        })
        setIsLoading(false)
        return
      }

      // Store user session in localStorage
      localStorage.setItem('userEmail', data.email)
      localStorage.setItem('userLoggedIn', 'true')
      
      console.log('Login successful, localStorage set') // Debug log

      // Success - show success message and redirect
      setMessage({
        text: "Login successful! Redirecting to admin panel...",
        type: "success"
      })

      // Redirect after a short delay to show success message
      setTimeout(() => {
        console.log('Redirecting to /owner') // Debug log
        router.push("/owner/")
      }, 1500)

    } catch (error) {
      console.error('Login error:', error)
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error"
      })
      setIsLoading(false)
    }
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-2xl px-6 py-3 shadow-2xl">
                  <span className="text-white font-bold text-2xl tracking-wider">EATNIFY</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-sm sm:text-base">
              Sign in to your Eatnify admin panel
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error/Success Message */}
            {message.text && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                message.type === 'error' 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                {message.type === 'error' ? (
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium text-sm sm:text-base">
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
                    className="h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold h-12 text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link 
                  href="/signup" 
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional floating elements for visual appeal */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-purple-600/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-20 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}