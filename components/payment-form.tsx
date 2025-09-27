'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
      document.body.removeChild(script)
    }
  }, [router])

  const generateSubdomain = (restaurantName: string): string => {
    return restaurantName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15) + Date.now().toString().slice(-4)
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

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: signupData.price,
        currency: 'INR',
        name: 'EATNIFY',
        description: `${signupData.plan} Plan Subscription`,
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
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Payment</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Restaurant:</span>
            <span>{signupData.restaurant_name}</span>
          </div>
          <div className="flex justify-between">
            <span>Plan:</span>
            <span className="capitalize">{signupData.plan}</span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span>{signupData.email}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total Amount:</span>
            <span>₹{signupData.price / 100}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay ₹${signupData.price / 100}`}
        </button>

        <button
          onClick={handleGoBack}
          className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
        >
          Go Back to Home
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Secure payment powered by Razorpay</p>
        <p>Your data is encrypted and secure</p>
      </div>
    </div>
  )
}