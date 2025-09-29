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
    // Get complete signup data
    const storedData = localStorage.getItem('completeSignupData')
    if (!storedData) {
      router.push('/signup')
      return
    }
    setSignupData(JSON.parse(storedData))

    // Load Razorpay script
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
      // Create Razorpay order
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

      // Generate subdomain
      const subdomain = generateSubdomain(signupData.restaurant_name)

      // Normalize plan name for consistency
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
          // Payment successful, verify and store user data
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
                  plan: normalizedPlan, // Store normalized plan name
                  subdomain,
                  payment_status: 'completed'
                }
              })
            })

            if (verifyResponse.ok) {
              // Clear localStorage
              localStorage.removeItem('signupData')
              localStorage.removeItem('completeSignupData')
              
              // Redirect to success page
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading payment details...</p>
        </div>
      </div>
    )
  }

  const planInfo = getPlanInfo(signupData.plan)
  const PlanIcon = planInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-2xl px-6 py-3 shadow-2xl">
                <span className="text-white font-bold text-2xl tracking-wider">EATNIFY</span>
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
          <p className="text-white/70">Secure checkout powered by Razorpay</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${planInfo.color}`}>
                <PlanIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{planInfo.name} Plan</h2>
                <p className="text-sm text-gray-600 font-normal">Perfect for your business needs</p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl flex items-center gap-3 bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Restaurant Name</span>
                  <span className="font-semibold text-gray-900">{signupData.restaurant_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Plan</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${planInfo.color}`}>
                    {planInfo.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Email</span>
                  <span className="font-medium text-gray-900">{signupData.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Phone</span>
                  <span className="font-medium text-gray-900">{signupData.phone_number}</span>
                </div>
                
                <hr className="my-4 border-gray-200" />
                
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-bold text-2xl text-blue-600">₹{signupData.price / 100}</span>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-3">What's included:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {planInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Button */}
            <div className="space-y-4 pt-2">
              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 text-base sm:text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-14"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pay ₹{signupData.price / 100} Securely
                  </div>
                )}
              </Button>

              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl h-12"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back to Home
              </Button>
            </div>

            {/* Security Info */}
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm pt-2">
              <Shield className="h-4 w-4" />
              <span>256-bit SSL encrypted • PCI DSS compliant</span>
            </div>
          </CardContent>
        </Card>

        {/* Additional floating elements for visual appeal */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-purple-600/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  )
}