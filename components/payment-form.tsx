'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Shield, ArrowLeft, Check, AlertCircle, Crown, Zap, Building } from "lucide-react"

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentForm() {
  const [signupData, setSignupData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const storedData = typeof window !== 'undefined' ? localStorage.getItem('completeSignupData') : null
    if (!storedData) {
      router.push('/signup')
      return
    }
    setSignupData(JSON.parse(storedData))

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [router])

  const generateSubdomain = (restaurantName: string): string => {
    return restaurantName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15) + Date.now().toString().slice(-4)
  }

  const getPlanInfo = (planName: string) => {
    const plans = {
      starter: {
        name: 'Starter',
        icon: Zap,
        color: 'from-green-500 to-emerald-600',
        features: ['Basic Features', 'Email Support', '1 Restaurant']
      },
      growth: {
        name: 'Growth',
        icon: Building,
        color: 'from-blue-500 to-blue-600',
        features: ['Advanced Features', 'Priority Support', '5 Restaurants', 'Analytics']
      },
      enterprise: {
        name: 'Enterprise',
        icon: Crown,
        color: 'from-purple-500 to-purple-600',
        features: ['All Features', '24/7 Support', 'Unlimited Restaurants', 'Custom Integration']
      }
    }
    return plans[planName.toLowerCase() as keyof typeof plans] || plans.starter
  }

  const handlePayment = async () => {
    if (!signupData) return

    setLoading(true)
    setError('')

    try {
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: signupData.price,
          currency: 'INR'
        })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order')
      }

      const orderData = await orderResponse.json()
      const subdomain = generateSubdomain(signupData.restaurant_name)
      const normalizedPlan = signupData.plan.toLowerCase()
      const planInfo = getPlanInfo(normalizedPlan)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: signupData.price,
        currency: 'INR',
        name: 'EATNIFY',
        description: `${planInfo.name} Plan Subscription`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userData: {
                  ...signupData,
                  plan: normalizedPlan,
                  subdomain,
                  payment_status: 'completed'
                }
              })
            })

            if (verifyResponse.ok) {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('signupData')
                localStorage.removeItem('completeSignupData')
              }
              router.push('/payment-success')
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            setError('Payment verification failed. Please contact support.')
            setLoading(false)
          }
        },
        prefill: {
          name: signupData.name,
          email: signupData.email,
          contact: signupData.phone_number
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        setError('Payment failed. Please try again.')
        setLoading(false)
      })

      rzp.open()
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    router.push('/')
  }

  if (!signupData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg">Loading payment details...</p>
        </div>
      </div>
    )
  }

  const planInfo = getPlanInfo(signupData.plan)
  const PlanIcon = planInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Subtle background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      
      <div className="w-full max-w-lg mx-auto relative z-10">
        {/* Header - Mobile optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl blur opacity-60"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-2.5 sm:py-3 shadow-xl">
                <span className="text-white font-bold text-xl sm:text-2xl tracking-wide">EATNIFY</span>
              </div>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
          <p className="text-sm sm:text-base text-white/70">Secure checkout powered by Razorpay</p>
        </div>

        {/* Main Card - Enhanced mobile UI */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-5 sm:pt-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-gray-900">
              <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r ${planInfo.color} flex-shrink-0`}>
                <PlanIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold truncate">{planInfo.name} Plan</h2>
                <p className="text-xs sm:text-sm text-gray-600 font-normal">Perfect for your business needs</p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-5 sm:pb-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Order Summary - Compact mobile view */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                Order Summary
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-700">Restaurant</span>
                  <span className="font-semibold text-xs sm:text-sm text-gray-900 truncate max-w-[60%] text-right">{signupData.restaurant_name}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-700">Plan</span>
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium text-white bg-gradient-to-r ${planInfo.color}`}>
                    {planInfo.name}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-700">Email</span>
                  <span className="font-medium text-xs sm:text-sm text-gray-900 truncate max-w-[60%] text-right">{signupData.email}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-700">Phone</span>
                  <span className="font-medium text-xs sm:text-sm text-gray-900">{signupData.phone_number}</span>
                </div>
                
                <hr className="my-3 sm:my-4 border-gray-200" />
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm sm:text-base text-gray-900">Total Amount</span>
                  <span className="font-bold text-xl sm:text-2xl text-blue-600">₹{signupData.price / 100}</span>
                </div>
              </div>
            </div>

            {/* Plan Features - Mobile grid */}
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">What's included:</h4>
              <div className="grid grid-cols-1 gap-2">
                {planInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Buttons - Mobile optimized */}
            <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:from-blue-700 active:to-blue-600 text-white font-semibold py-3 sm:py-4 text-sm sm:text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl disabled:opacity-50 disabled:cursor-not-allowed h-12 sm:h-14 touch-manipulation"
              >
                {loading ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base">Pay ₹{signupData.price / 100} Securely</span>
                  </div>
                )}
              </Button>

              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 py-3 rounded-xl h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                Go Back to Home
              </Button>
            </div>

            {/* Security Info - Responsive */}
            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs sm:text-sm pt-1 sm:pt-2">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-center">256-bit SSL encrypted • PCI DSS compliant</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}