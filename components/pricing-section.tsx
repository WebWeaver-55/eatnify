"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Star, Zap, Shield, Rocket, Crown } from "lucide-react"
import { useEffect, useRef } from "react"

const plans = [
  {
    name: "Starter",
    price: "₹5,000",
    period: "/year",
    description: "Perfect for small restaurants starting their digital journey",
    features: [
      "Digital Menu (QR based)",
      "Subdomain Hosting (restaurant.eatnify.com)",
      "Basic Analytics (visits, scans)",
      "AI Menu Description Generator (30 items)",
      "Mobile-optimized menu design",
      "Email support",
      "SSL certificate included",
    ],
    notIncluded: [
      "Custom Domain",
      "Custom Theme",
      "AI Review Summarizer",
      "AI Chatbot for Customers", 
      "AI Smart Replies",
      "AI Food Image Enhancer",
      "Marketing Campaign Generator",
      "Priority Support",
    ],
    popular: false,
    icon: Shield,
  },
  {
    name: "Enterprise",
    price: "₹20,000",
    period: "/year", 
    description: "Complete AI-powered solution for modern restaurants",
    features: [
      "Digital Menu (QR based)",
      "Subdomain + Custom Domain",
      "Fully Customizable Theme",
      "Advanced Analytics with Competitor Compare",
      "AI Menu Description Generator (Unlimited)",
      "AI Review Summarizer (Weekly insights)",
      "AI Chatbot (3000 chats/mo, custom-trained)",
      "AI Smart Replies (500/month, priority queue)",
      "AI Food Image Enhancer (100 dishes/year)",
      "Multi-channel Marketing with A/B testing",
      "24/7 Priority Support",
      "Multi-Branch Support",
    ],
    notIncluded: [],
    popular: true,
    icon: Crown,
  },
  {
    name: "Growth",
    price: "₹10,000", 
    period: "/year",
    description: "Enhanced features for growing restaurants",
    features: [
      "Digital Menu (QR based)",
      "Custom Domain (if available)",
      "3 Preset Custom Themes",
      "Basic Analytics (visits, scans)",
      "AI Menu Description Generator (100 items)",
      "AI Review Summarizer (Monthly)",
      "AI Chatbot (500 chats/mo)",
      "AI Smart Replies (100/month)",
      "AI Food Image Enhancer (20 dishes/year)",
      "Basic Marketing Campaign Templates",
      "Email support",
    ],
    notIncluded: [
      "Fully Customizable Theme",
      "Competitor Analytics",
      "Custom-trained Chatbot",
      "Priority Support Queue",
      "Multi-Branch Support",
      "Advanced A/B Testing",
    ],
    popular: false,
    icon: Rocket,
  },
]

// Reorder plans to put Enterprise in the middle
const orderedPlans = [plans[0], plans[1], plans[2]]

// Optimized Particle Animation Component
const ParticleBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId

    // Enhanced mobile detection
    const isMobile = window.innerWidth < 640
    const isSmallMobile = window.innerWidth < 380
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      
      ctx.scale(dpr, dpr)
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Optimized particle settings for mobile
    const particles = []
    const particleCount = isSmallMobile ? 15 : isMobile ? 20 : isTablet ? 30 : 50
    const connectionDistance = isSmallMobile ? 60 : isMobile ? 70 : isTablet ? 90 : 120
    const maxConnections = isSmallMobile ? 2 : isMobile ? 3 : 4

    // Create particles with mobile optimization
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width / (window.devicePixelRatio || 1),
        y: Math.random() * canvas.height / (window.devicePixelRatio || 1),
        vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
        vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
        size: Math.random() * (isMobile ? 1.2 : 1.8) + (isMobile ? 0.8 : 1.2),
        connections: 0,
      })
    }

    // Throttled animation for mobile performance
    let lastTime = 0
    const targetFPS = isMobile ? 30 : 60
    const frameDelay = 1000 / targetFPS

    const animate = (currentTime) => {
      if (currentTime - lastTime < frameDelay) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }
      lastTime = currentTime

      const canvasWidth = canvas.width / (window.devicePixelRatio || 1)
      const canvasHeight = canvas.height / (window.devicePixelRatio || 1)

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      // Reset connection counts
      particles.forEach(p => p.connections = 0)

      // Update and draw particles with mobile optimizations
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Boundary collision
        if (particle.x < 0 || particle.x > canvasWidth) {
          particle.vx *= -1
          particle.x = Math.max(0, Math.min(canvasWidth, particle.x))
        }
        if (particle.y < 0 || particle.y > canvasHeight) {
          particle.vy *= -1
          particle.y = Math.max(0, Math.min(canvasHeight, particle.y))
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = isMobile ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.8)'
        ctx.fill()

        // Simplified glow for mobile
        if (!isMobile) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 1.8, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(59, 130, 246, 0.15)'
          ctx.fill()
        }

        // Optimized connections
        if (particle.connections < maxConnections) {
          for (let j = i + 1; j < Math.min(particles.length, i + (isMobile ? 8 : 12)); j++) {
            const otherParticle = particles[j]
            if (otherParticle.connections >= maxConnections) continue

            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < connectionDistance) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              const opacity = (isMobile ? 0.3 : 0.4) * (1 - distance / connectionDistance)
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
              ctx.lineWidth = isMobile ? 0.8 : 1
              ctx.stroke()
              
              particle.connections++
              otherParticle.connections++
              break
            }
          }
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  )
}

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-8 sm:py-12 md:py-20 bg-gray-900 overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Header Section - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary/20 text-primary px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 md:mb-6 border border-primary/30 backdrop-blur-sm">
            <Zap className="w-3 sm:w-4 h-3 sm:h-4" />
            Choose Your Plan
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 px-2">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Transform your restaurant with our AI-powered digital menu solutions. Choose the plan that fits your needs
            and scale as you grow.
          </p>
        </div>

        {/* Cards Grid - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {orderedPlans.map((plan, index) => {
            const IconComponent = plan.icon
            const isEnterprise = plan.name === "Enterprise"
            
            return (
              <Card
                key={index}
                className={`relative bg-gray-800/60 backdrop-blur-sm border-2 transform transition-all duration-300 ${
                  isEnterprise
                    ? "border-primary shadow-xl shadow-primary/20 ring-1 ring-primary/20 sm:scale-105 z-20"
                    : "border-gray-700/70 hover:border-primary/40 hover:shadow-lg"
                } ${isEnterprise ? 'sm:-mt-2 sm:mb-2 md:-mt-4 md:mb-4' : ''}`}
              >
                {/* Popular Badge - Mobile Optimized */}
                {isEnterprise && (
                  <div className="absolute -top-2 sm:-top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 sm:px-4 md:px-6 py-1 md:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg border border-primary/30 backdrop-blur-sm">
                      <Crown className="inline w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card Header - Mobile Optimized */}
                <CardHeader className="text-center pb-4 sm:pb-6 pt-5 sm:pt-6 md:pt-8 px-3 sm:px-4 md:px-6">
                  <div className={`mx-auto mb-2 sm:mb-3 md:mb-4 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                    isEnterprise ? 'bg-primary/20' : 'bg-gray-700/50'
                  }`}>
                    <IconComponent className={`w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 ${
                      isEnterprise ? 'text-primary' : 'text-gray-300'
                    }`} />
                  </div>
                  <CardTitle className={`text-xl sm:text-2xl md:text-3xl font-bold mb-2 ${
                    isEnterprise ? 'text-white' : 'text-gray-100'
                  }`}>{plan.name}</CardTitle>
                  <div className="mt-2 sm:mt-3 md:mt-4">
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 text-sm sm:text-base md:text-lg">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2 sm:mt-3 md:mt-4 text-sm md:text-base leading-relaxed px-1 sm:px-2 text-gray-300">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                {/* Card Content - Mobile Optimized */}
                <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 md:pb-8">
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    {/* Features Header */}
                    <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                      <h4 className="font-semibold text-gray-100 text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        What's included
                      </h4>
                      {plan.features.length > 0 && (
                        <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 sm:py-1 rounded-full font-medium">
                          {plan.features.length} features
                        </div>
                      )}
                    </div>
                    
                    {/* Features List - Mobile Optimized Scrolling */}
                    <div className="space-y-2 sm:space-y-3 max-h-52 sm:max-h-64 md:max-h-80 overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="group flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-blue-500/5 transition-all duration-200">
                          <div className={`flex-shrink-0 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 rounded-full flex items-center justify-center mt-0.5 transition-all duration-200 group-hover:scale-110 ${
                            isEnterprise ? 'bg-blue-500/30 shadow-blue-500/50 shadow-sm' : 
                            plan.name === 'Growth' ? 'bg-blue-500/25' : 'bg-blue-500/20'
                          }`}>
                            <Check className={`h-2.5 sm:h-3 md:h-4 w-2.5 sm:w-3 md:w-4 font-bold ${
                              isEnterprise ? 'text-blue-400' : 'text-blue-500'
                            }`} />
                          </div>
                          <span className={`text-xs sm:text-sm md:text-base leading-relaxed group-hover:text-white transition-colors duration-200 ${
                            isEnterprise ? 'text-gray-100 font-medium' :
                            plan.name === 'Growth' ? 'text-gray-200' : 'text-gray-300'
                          }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Not Included Section - Mobile Optimized */}
                    {plan.notIncluded.length > 0 && (
                      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700/50">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <h4 className="font-medium text-gray-400 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-500 rounded-full"></div>
                            Not included
                          </h4>
                          <div className="bg-gray-600/20 text-gray-500 text-xs px-2 py-0.5 sm:py-1 rounded-full">
                            {plan.notIncluded.length} features
                          </div>
                        </div>
                        <div className="space-y-1.5 sm:space-y-2 max-h-24 sm:max-h-32 md:max-h-40 overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                          {plan.notIncluded.slice(0, isEnterprise ? 0 : 3).map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-2 sm:gap-3 p-1 sm:p-2 rounded-lg opacity-60 hover:opacity-80 transition-opacity duration-200">
                              <div className="flex-shrink-0 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 bg-gray-700/50 rounded-full flex items-center justify-center mt-0.5">
                                <X className="h-2.5 sm:h-3 md:h-4 w-2.5 sm:w-3 md:w-4 text-gray-500" />
                              </div>
                              <span className="text-gray-500 text-xs sm:text-sm line-through">{feature}</span>
                            </div>
                          ))}
                          {plan.notIncluded.length > 3 && !isEnterprise && (
                            <p className="text-xs text-gray-500 pl-6 sm:pl-8 italic">+{plan.notIncluded.length - 3} more premium features</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button - Mobile Optimized */}
                  <div className="mt-4 sm:mt-6 md:mt-8">
                    <Button
                      className={`w-full transform hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base md:text-lg py-3 sm:py-4 md:py-6 font-semibold shadow-lg hover:shadow-xl ${
                        isEnterprise 
                          ? 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white ring-1 ring-primary/30 hover:ring-primary/50' 
                          : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-primary/50'
                      }`}
                      size="lg"
                    >
                      {isEnterprise ? (
                        <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                          <Crown className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
                          Get Started with {plan.name}
                        </span>
                      ) : (
                        `Get Started with ${plan.name}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Trust Section - Mobile Optimized */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto shadow-xl">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3 md:mb-4">
              Trusted by 500+ restaurants across India
            </p>
            <div className="flex justify-center items-center gap-1 md:gap-2 mb-2 sm:mb-3 md:mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 fill-primary text-primary" />
              ))}
              <span className="text-gray-300 ml-1.5 sm:ml-2 font-medium text-xs sm:text-sm md:text-base">4.9/5 customer satisfaction</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">
              Join successful restaurants who've increased their revenue by 40% with Eatnify
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Scrollbar Styling */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(107, 114, 128, 0.5) rgba(55, 65, 81, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.4);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 2px;
          }
        }
      `}</style>
    </section>
  )
}

export default PricingSection