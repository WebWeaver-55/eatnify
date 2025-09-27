"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    setIsVisible(true)
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particles = []

    // Create connected particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.3 + 0.2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.speedY *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`
        ctx.fill()

        // Draw connections
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) + 
              Math.pow(particle.y - otherParticle.y, 2)
            )
            
            if (distance < 100) {
              const opacity = (1 - distance / 100) * 0.15
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      />

      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 lg:w-96 h-32 sm:h-64 lg:h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-72 lg:w-80 h-40 sm:h-72 lg:h-80 bg-indigo-600/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 sm:w-48 lg:w-64 h-20 sm:h-48 lg:h-64 bg-blue-500/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8 sm:pt-12 lg:pt-16">
        <div className="text-center max-w-6xl mx-auto">
          
          {/* Premium Badge */}
          <div className={`inline-flex items-center gap-2 bg-blue-900/20 border border-blue-700/30 text-blue-300 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-sm transition-all duration-1000 hover:bg-blue-900/30 hover:border-blue-600/40 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold">AI-Powered Restaurant Solutions</span>
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
          </div>

          {/* Hero Headline - Mobile Optimized */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 sm:mb-8 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="text-white block sm:inline">Transform Your</span>
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent block sm:inline mt-2 sm:mt-0">
              Restaurant Experience
            </span>
            <br />
            <span className="text-slate-300 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl block mt-2 sm:mt-4">
              With Smart AI Menus
            </span>
          </h1>

          {/* Enhanced Subtitle - Mobile Responsive */}
          <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4 lg:px-0 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Revolutionize your restaurant with AI-powered digital menus that 
            <span className="text-blue-400 font-semibold"> boost sales</span>, 
            <span className="text-blue-400 font-semibold"> engage customers</span>, and provide 
            <span className="text-blue-400 font-semibold"> intelligent insights</span> to grow your business.
          </p>

          {/* Feature Highlights */}
          <div className={`flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {[
              { icon: Zap, text: "Instant Setup" },
              { icon: Star, text: "AI-Powered" },
              { icon: ArrowRight, text: "Real-time Analytics" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/30 px-3 py-2 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
                <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-slate-300 text-xs sm:text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button - Simplified */}
          <div className={`flex flex-col items-center justify-center gap-4 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Primary CTA */}
            <Button
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl lg:text-2xl font-bold rounded-xl sm:rounded-2xl shadow-2xl shadow-blue-900/25 hover:shadow-blue-900/40 transform hover:scale-105 transition-all duration-300"
              onClick={scrollToPricing}
            >
              <span>Get Started</span>
              <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>

            {/* Secondary Info */}
            <div className="text-slate-400 text-sm sm:text-base">
              <span className="text-green-400">✓</span> No setup fees • <span className="text-green-400">✓</span> AI Powered Menus
            </div>
          </div>

          {/* Trust Indicators */}
          <div className={`mt-12 sm:mt-16 lg:mt-20 transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6">Trusted by 1000+ restaurants worldwide</p>
            
           
          </div>

        </div>
      </div>

      {/* Bottom fade for seamless section transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  )
}