'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'

export default function DashboardHeader() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloadReady, setDownloadReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Get user email from localStorage
  const getUserEmail = () => {
    return localStorage.getItem('userEmail') || 'default@example.com'
  }

  // Get base URL for Netlify
  const getBaseUrl = () => {
    return 'https://eatnify.netlify.app'
  }

  // Generate QR code with email
  const generateQRCode = async (email: string) => {
    const baseUrl = getBaseUrl()
    const menuUrl = `${baseUrl}/menu/${(email)}`
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 512,
      margin: 3,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
    
    return qrCodeDataUrl
  }

  // Prepare canvas for download
  const prepareCanvasForDownload = async (email: string) => {
    if (canvasRef.current) {
      try {
        const baseUrl = getBaseUrl()
        const menuUrl = `${baseUrl}/menu/${(email)}`
        await QRCode.toCanvas(canvasRef.current, menuUrl, {
          width: 512,
          margin: 3,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        })
        setDownloadReady(true)
      } catch (error) {
        console.error('Error preparing canvas for download:', error)
        setDownloadReady(false)
      }
    }
  }

  // Load QR code when modal opens
  useEffect(() => {
    const loadQRCode = async () => {
      if (showQR) {
        try {
          setLoading(true)
          setDownloadReady(false)
          const email = getUserEmail()
          setUserEmail(email)

          // Generate QR code
          const qrUrl = await generateQRCode(email)
          setQrCodeUrl(qrUrl)

          // Prepare canvas for download
          await prepareCanvasForDownload(email)
        } catch (error) {
          console.error('Error loading QR code:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadQRCode()
  }, [showQR])

  const downloadQRCode = () => {
    if (canvasRef.current && downloadReady) {
      try {
        // Create a new canvas with higher resolution for download
        const downloadCanvas = document.createElement('canvas')
        downloadCanvas.width = 1024
        downloadCanvas.height = 1024
        const ctx = downloadCanvas.getContext('2d')
        
        if (ctx) {
          // Scale up the QR code for better quality
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(canvasRef.current, 0, 0, 1024, 1024)
          
          // Create download link
          const pngUrl = downloadCanvas.toDataURL('image/png')
          const downloadLink = document.createElement('a')
          downloadLink.href = pngUrl
          downloadLink.download = `menu-qr-code-${userEmail.replace(/[^a-zA-Z0-9]/g, '-')}.png`
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        }
      } catch (error) {
        console.error('Error downloading QR code:', error)
        // Fallback: try to download the displayed image
        if (qrCodeUrl) {
          const downloadLink = document.createElement('a')
          downloadLink.href = qrCodeUrl
          downloadLink.download = `menu-qr-code-${userEmail.replace(/[^a-zA-Z0-9]/g, '-')}.png`
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        }
      }
    } else if (qrCodeUrl) {
      // Fallback: download the displayed image directly
      const downloadLink = document.createElement('a')
      downloadLink.href = qrCodeUrl
      downloadLink.download = `menu-qr-code-${userEmail.replace(/[^a-zA-Z0-9]/g, '-')}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } else {
      alert('QR code is not ready for download. Please wait a moment and try again.')
    }
  }

  const copyMenuLink = async () => {
    const baseUrl = getBaseUrl()
    const menuUrl = `${baseUrl}/menu/${userEmail}`
    try {
      await navigator.clipboard.writeText(menuUrl)
      alert('Menu link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = menuUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Menu link copied to clipboard!')
    }
  }

  const navItems = [
    { href: "/owner/dashboard/starter", label: "Dashboard", icon: "📊" },
    { href: "/owner/dashboard/starter/menu", label: "Menu", icon: "🍽️" },
    { href: "/owner/dashboard/starter/categories", label: "Categories", icon: "📁" },
    { href: "/owner/dashboard/starter/profile", label: "Profile", icon: "⚙️" }
  ]

  return (
    <header className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 backdrop-blur-3xl border-b border-slate-700 sticky top-0 z-50">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/10 via-blue-800/10 to-slate-800/10 animate-pulse"></div>
      
      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500 animate-pulse"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-slate-600 via-blue-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-xl">E</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black bg-gradient-to-r from-slate-200 via-blue-200 to-slate-100 bg-clip-text text-transparent tracking-tight">
                Eatnify
              </h1>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-xs font-medium text-slate-300 tracking-wider uppercase">Starter Plan</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 bg-slate-800/50 rounded-2xl p-1.5 backdrop-blur-xl border border-slate-600/30">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-5 py-2.5 rounded-xl text-slate-300 hover:text-white transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/0 via-blue-600/0 to-slate-600/0 group-hover:from-slate-600/20 group-hover:via-blue-600/20 group-hover:to-slate-600/20 transition-all duration-500"></div>
                <span className="relative flex items-center space-x-2.5">
                  <span className="text-lg filter drop-shadow-lg">{item.icon}</span>
                  <span className="font-semibold tracking-wide">{item.label}</span>
                </span>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-slate-400 via-blue-400 to-slate-400 group-hover:w-4/5 transition-all duration-500 rounded-full blur-sm"></div>
              </Link>
            ))}
            
            {/* QR Code Button */}
            <button
              onClick={() => setShowQR(true)}
              className="group relative px-5 py-2.5 rounded-xl text-slate-300 hover:text-white transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600/0 via-blue-600/0 to-slate-600/0 group-hover:from-slate-600/20 group-hover:via-blue-600/20 group-hover:to-slate-600/20 transition-all duration-500"></div>
              <span className="relative flex items-center space-x-2.5">
                <span className="text-lg filter drop-shadow-lg">📱</span>
                <span className="font-semibold tracking-wide">QR Code</span>
              </span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-slate-400 via-blue-400 to-slate-400 group-hover:w-4/5 transition-all duration-500 rounded-full blur-sm"></div>
            </button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSignOut}
              className="hidden sm:flex items-center space-x-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-600/40 hover:border-red-500/60 text-red-300 hover:text-red-200 transition-all duration-300 group backdrop-blur-xl shadow-lg shadow-red-600/20"
            >
              <span className="text-lg group-hover:rotate-12 transition-transform duration-300">🚪</span>
              <span className="font-semibold tracking-wide">Sign Out</span>
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl bg-gradient-to-br from-slate-700/30 to-slate-600/20 hover:from-slate-700/40 hover:to-slate-600/30 border border-slate-600/30 text-slate-300 transition-all duration-300 backdrop-blur-xl shadow-lg"
            >
              <div className="w-6 h-6 relative flex flex-col justify-center items-center">
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45' : '-translate-y-2'}`}></span>
                <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}></span>
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45' : 'translate-y-2'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-out ${isMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="border-t border-slate-600/20 pt-4">
            <nav className="grid grid-cols-2 gap-3">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-br from-slate-700/30 to-slate-600/20 hover:from-slate-700/40 hover:to-slate-600/30 border border-slate-600/30 hover:border-blue-500/50 text-slate-300 hover:text-white transition-all duration-300 overflow-hidden backdrop-blur-xl"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600/0 to-blue-600/0 group-hover:from-slate-600/10 group-hover:to-blue-600/10 transition-all duration-500"></div>
                  <span className="relative text-2xl filter drop-shadow-lg">{item.icon}</span>
                  <span className="relative font-semibold tracking-wide">{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile QR Code Button */}
              <button
                onClick={() => {
                  setShowQR(true)
                  setIsMenuOpen(false)
                }}
                className="group relative flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-br from-slate-700/30 to-slate-600/20 hover:from-slate-700/40 hover:to-slate-600/30 border border-slate-600/30 hover:border-blue-500/50 text-slate-300 hover:text-white transition-all duration-300 overflow-hidden backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600/0 to-blue-600/0 group-hover:from-slate-600/10 group-hover:to-blue-600/10 transition-all duration-500"></div>
                <span className="relative text-2xl filter drop-shadow-lg">📱</span>
                <span className="relative font-semibold tracking-wide">QR Code</span>
              </button>

              <button
                onClick={handleSignOut}
                className="group relative flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-600/40 hover:border-red-500/60 text-red-300 hover:text-red-200 transition-all duration-300 col-span-2 overflow-hidden backdrop-blur-xl shadow-lg shadow-red-600/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 to-red-700/0 group-hover:from-red-600/10 group-hover:to-red-700/10 transition-all duration-500"></div>
                <span className="relative text-2xl group-hover:rotate-12 transition-transform duration-300">🚪</span>
                <span className="relative font-semibold tracking-wide">Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Bottom glowing border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent"></div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowQR(false)}></div>
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-600 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-3">Menu QR Code</h3>
            <p className="text-slate-400 text-center mb-6">
              Scan this QR code to view your digital menu
            </p>
            
            {/* QR Code Preview */}
            <div className="bg-white p-6 rounded-2xl mb-6 flex justify-center">
              <div className="w-48 h-48 flex items-center justify-center">
                {loading ? (
                  <div className="w-full h-full bg-slate-200 animate-pulse rounded flex items-center justify-center">
                    <span className="text-slate-400">Loading QR...</span>
                  </div>
                ) : qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Menu QR Code" 
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 rounded flex items-center justify-center">
                    <span className="text-slate-400">QR Code</span>
                  </div>
                )}
                {/* Hidden canvas for download */}
                <canvas 
                  ref={canvasRef} 
                  width="512" 
                  height="512"
                  className="hidden"
                />
              </div>
            </div>

            {/* Menu Link */}
            {userEmail && (
              <div className="mb-6">
                <p className="text-slate-400 text-sm mb-2">Menu Link:</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                         value={`https://eatnify.netlify.app/menu/${userEmail}`}
                    readOnly
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-300 text-sm"
                  />
                  <button
                    onClick={copyMenuLink}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 text-slate-300 rounded-lg font-semibold transition-all hover:bg-slate-600 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowQR(false)}
                className="flex-1 px-6 py-3 bg-slate-700 border border-slate-600 text-slate-300 rounded-xl font-semibold transition-all hover:bg-slate-600"
              >
                Close
              </button>
              <button 
                onClick={downloadQRCode}
                disabled={loading || !downloadReady}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Download QR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}