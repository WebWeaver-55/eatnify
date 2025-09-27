'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Plan {
  id: string
  name: string
  price: number
  originalPrice?: number
  features: { name: string; included: boolean; limit?: string }[]
  popular?: boolean
  description: string
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 500000, // ₹50
    description: 'Perfect for small restaurants starting their digital journey',
    features: [
      { name: 'Digital Menu (QR based)', included: true },
      { name: 'Subdomain Hosting (restaurant.eatnify.com)', included: true },
      { name: 'Custom Domain (if available)', included: false },
      { name: 'Basic Analytics (visits, scans)', included: true },
      { name: 'Custom Theme for Menu/Website', included: false },
      { name: 'AI Menu Description Generator', included: true, limit: '30 items' },
      { name: 'AI Review Summarizer', included: false },
      { name: 'AI Chatbot for Customers', included: false },
      { name: 'AI Smart Replies (emails/WhatsApp)', included: false },
      { name: 'AI Food Image Enhancer + Auto Description', included: false },
      { name: 'Marketing Campaign Generator', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Multi-Branch Support', included: false }
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 1000000, // ₹100
    originalPrice: 1200000,
    popular: true,
    description: 'Most popular choice for growing restaurants',
    features: [
      { name: 'Digital Menu (QR based)', included: true },
      { name: 'Subdomain Hosting (restaurant.eatnify.com)', included: true },
      { name: 'Custom Domain (if available)', included: true },
      { name: 'Basic Analytics (visits, scans)', included: true },
      { name: 'Custom Theme for Menu/Website', included: true, limit: '3 preset themes' },
      { name: 'AI Menu Description Generator', included: true, limit: '100 items' },
      { name: 'AI Review Summarizer', included: true, limit: 'monthly' },
      { name: 'AI Chatbot for Customers', included: true, limit: '500 chats/mo' },
      { name: 'AI Smart Replies (emails/WhatsApp)', included: true, limit: '100/month' },
      { name: 'AI Food Image Enhancer + Auto Description', included: true, limit: '20 dishes/year' },
      { name: 'Marketing Campaign Generator', included: true, limit: 'basic templates' },
      { name: 'Priority Support', included: false },
      { name: 'Multi-Branch Support', included: false }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 2000000, // ₹200
    description: 'Ultimate solution for restaurant chains and enterprises',
    features: [
      { name: 'Digital Menu (QR based)', included: true },
      { name: 'Subdomain Hosting (restaurant.eatnify.com)', included: true },
      { name: 'Custom Domain (if available)', included: true },
      { name: 'Basic Analytics (visits, scans)', included: true },
      { name: 'Custom Theme for Menu/Website', included: true, limit: 'fully customizable' },
      { name: 'AI Menu Description Generator', included: true, limit: 'unlimited' },
      { name: 'AI Review Summarizer', included: true, limit: 'weekly insights + competitor compare' },
      { name: 'AI Chatbot for Customers', included: true, limit: '3000 chats/mo, custom-trained' },
      { name: 'AI Smart Replies (emails/WhatsApp)', included: true, limit: '500/month, priority queue' },
      { name: 'AI Food Image Enhancer + Auto Description', included: true, limit: '100 dishes/year' },
      { name: 'Marketing Campaign Generator', included: true, limit: 'multi-channel, A/B testing' },
      { name: 'Priority Support', included: true, limit: '24/7' },
      { name: 'Multi-Branch Support', included: true }
    ]
  }
]

export default function PlanSelectionForm() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [signupData, setSignupData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showMobile, setShowMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedData = localStorage.getItem('signupData')
    if (!storedData) {
      router.push('/signup')
      return
    }
    setSignupData(JSON.parse(storedData))

    // Check if mobile
    const checkMobile = () => {
      setShowMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [router])

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
  }

  const handleContinue = async () => {
    if (!selectedPlan || !signupData) return

    setLoading(true)

    const completeData = {
      ...signupData,
      plan: selectedPlan.id,
      price: selectedPlan.price
    }

    localStorage.setItem('completeSignupData', JSON.stringify(completeData))
    
    setTimeout(() => {
      router.push('/payment')
    }, 1500)
  }

  if (!signupData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ paddingTop: '80px' }}>
      {/* Same Background as Signup Form */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/30 via-slate-800/20 to-blue-800/30 animate-pulse"></div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-slate-700/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-slate-700/20 to-blue-700/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-blue-500/15 to-slate-600/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.4) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute top-24 right-8 flex space-x-3 z-10">
        <div className="w-3 h-3 bg-blue-400/30 backdrop-blur-sm rounded-full border border-blue-300/20"></div>
        <div className="w-3 h-3 bg-slate-400/30 backdrop-blur-sm rounded-full border border-slate-300/20"></div>
        <div className="w-3 h-3 bg-blue-500/30 backdrop-blur-sm rounded-full border border-blue-400/20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] p-4 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-600/20 to-slate-600/20 rounded-full blur-2xl"></div>
              </div>
              <h1 className="relative text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-slate-200 bg-clip-text text-transparent tracking-tight">
                Choose Your Plan
              </h1>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </div>
            <p className="text-xl text-blue-100/90 font-light tracking-wide mb-4">
              Select the perfect plan for {signupData.restaurant_name}
            </p>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 font-medium">Your domain: {signupData.preview_subdomain}</span>
            </div>
          </div>

          {/* Plans Grid */}
          <div className={`grid gap-8 mb-12 ${showMobile ? 'grid-cols-1' : 'lg:grid-cols-3 md:grid-cols-2'}`}>
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
                  selectedPlan?.id === plan.id ? 'scale-[1.02]' : ''
                }`}
                onClick={() => handlePlanSelect(plan)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Plan Card Glow */}
                <div className={`absolute -inset-1 rounded-3xl blur-lg transition-all duration-300 ${
                  selectedPlan?.id === plan.id 
                    ? 'bg-gradient-to-r from-blue-500/40 to-cyan-500/40' 
                    : 'bg-gradient-to-r from-blue-600/20 to-slate-600/20 group-hover:from-blue-500/30 group-hover:to-slate-500/30'
                } opacity-60`}></div>
                
                {/* Plan Card */}
                <div className={`relative h-full bg-white/8 backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
                  selectedPlan?.id === plan.id 
                    ? 'border-blue-400/50 bg-white/12' 
                    : 'border-white/15 group-hover:border-white/25'
                }`}>
                  
                  {/* Card Header */}
                  <div className="p-8 pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {plan.name}
                      </h3>
                      {selectedPlan?.id === plan.id && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-bounce">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-blue-200/80 text-sm mb-6 leading-relaxed">
                      {plan.description}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline space-x-2">
                        {plan.originalPrice && (
                          <span className="text-xl text-slate-400 line-through">
                            ₹{plan.originalPrice / 100}
                          </span>
                        )}
                        <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                          ₹{plan.price / 100}
                        </span>
                        <span className="text-blue-200/70 font-medium">/month</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="mt-2">
                          <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                            SAVE ₹{(plan.originalPrice - plan.price) / 100}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="px-8 pb-8">
                    <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3 group">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                            feature.included 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                              : 'bg-slate-600/50'
                          }`}>
                            {feature.included ? (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`text-sm font-medium transition-colors ${
                              feature.included ? 'text-white' : 'text-slate-400'
                            }`}>
                              {feature.name}
                            </span>
                            {feature.limit && feature.included && (
                              <div className="text-xs text-blue-300 mt-1 font-medium">
                                {feature.limit}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select Button */}
                  <div className="p-8 pt-0">
                    <button className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                      selectedPlan?.id === plan.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30'
                    }`}>
                      {selectedPlan?.id === plan.id ? 'Selected ✓' : 'Select Plan'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Plan Summary & Continue Button */}
          {selectedPlan && (
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-3xl blur-lg"></div>
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Perfect Choice!</h3>
                <div className="bg-white/5 rounded-2xl p-6 mb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Plan:</span>
                    <span className="text-white font-semibold">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Restaurant:</span>
                    <span className="text-white font-semibold">{signupData.restaurant_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Monthly Price:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      ₹{selectedPlan.price / 100}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleContinue}
                  disabled={loading}
                  className="group relative w-full overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-70 group-hover:opacity-100"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform group-hover:scale-[1.02] group-active:scale-[0.98] shadow-2xl">
                    {loading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-lg">Preparing Payment...</span>
                      </div>
                    ) : (
                      <span className="text-lg">Continue to Payment</span>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/signup')}
              className="inline-flex items-center space-x-2 text-blue-300 hover:text-white transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Back to Signup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-8 left-8 opacity-30">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
      </div>
      <div className="absolute top-1/3 left-8 opacity-20">
        <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      <div className="absolute bottom-1/3 right-8 opacity-25">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  )
}