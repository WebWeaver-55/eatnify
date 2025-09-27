"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Menu, X, Sparkles, Zap } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "#features", label: "Features", icon: Sparkles },
    { href: "#pricing", label: "Pricing", icon: Zap },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-100 ${
      isScrolled 
        ? 'border-b border-gray-800/80 bg-gray-950/98 backdrop-blur-xl shadow-2xl shadow-black/20' 
        : 'border-b border-gray-800/30 bg-gray-950/90 backdrop-blur-xl shadow-lg shadow-black/5'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Eatnify
              </span>
            </Link>
          </div>

          {/* Mobile Layout - Login + Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/50 bg-transparent text-sm px-3 h-8 transition-all duration-100"
            >
              <Link href="/login">Login</Link>
            </Button>
            
            <button 
              className="p-2.5 rounded-lg hover:bg-gray-800/80 transition-all duration-100 border border-gray-700/50 backdrop-blur-sm bg-gray-900/30"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X size={18} className="text-gray-300" />
              ) : (
                <Menu size={18} className="text-gray-300" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navigationLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-300 hover:text-blue-300 hover:bg-gray-800/60 transition-all duration-100 text-sm font-medium"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-gray-600/50 text-gray-300 hover:bg-blue-700/20 hover:text-blue-300 hover:border-blue-700/50 bg-gray-900/30 backdrop-blur-sm font-medium transition-all duration-100"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button 
              asChild
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all duration-100 font-medium"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
            <div className="py-4 px-2">
              {/* Navigation Links */}
              <nav className="space-y-1 mb-4">
                {navigationLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-blue-300 hover:bg-gray-800/60 transition-all duration-100 text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Button */}
              <div className="pt-3 border-t border-gray-800/50">
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl text-sm h-10 font-medium transition-all duration-100"
                >
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    Get Started Free
                  </Link>
                </Button>
              </div>

              {/* Additional Mobile Info */}
              <div className="mt-4 pt-3 border-t border-gray-800/50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Free 14-day trial</span>
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}