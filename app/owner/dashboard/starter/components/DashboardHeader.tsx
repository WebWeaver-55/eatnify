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
  const [restaurantName, setRestaurantName] = useState('')
  const [restaurantSlug, setRestaurantSlug] = useState('')
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

  // Fetch restaurant name from users table
  const fetchRestaurantName = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('restaurant_name')
        .eq('email', email)
        .single()

      if (error) {
        console.error('Error fetching restaurant name:', error)
        return null
      }

      return data?.restaurant_name || null
    } catch (error) {
      console.error('Error fetching restaurant name:', error)
      return null
    }
  }

  // Create slug from restaurant name
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  // Get base URL for Netlify
  const getBaseUrl = () => {
    return 'https://eatnify.netlify.app'
  }

  // Generate QR code with restaurant name
  const generateQRCode = async () => {
    const baseUrl = getBaseUrl()
    
    // Use restaurant slug if available, otherwise fallback to email
    let menuUrl
    if (restaurantSlug) {
      menuUrl = `${baseUrl}/menu/${restaurantSlug}`
    } else {
      // Fallback to email-based URL
      const email = getUserEmail()
      const emailSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
      menuUrl = `${baseUrl}/menu/${emailSlug}`
    }
    
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 512,
      margin: 3,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
    
    return { qrCodeDataUrl, menuUrl }
  }

  // Prepare canvas for download
  const prepareCanvasForDownload = async () => {
    if (canvasRef.current) {
      try {
        const baseUrl = getBaseUrl()
        let menuUrl
        if (restaurantSlug) {
          menuUrl = `${baseUrl}/menu/${restaurantSlug}`
        } else {
          const email = getUserEmail()
          const emailSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
          menuUrl = `${baseUrl}/menu/${emailSlug}`
        }

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

          // Fetch restaurant name
          const restaurantNameFromDB = await fetchRestaurantName(email)
          if (restaurantNameFromDB) {
            setRestaurantName(restaurantNameFromDB)
            const slug = createSlug(restaurantNameFromDB)
            setRestaurantSlug(slug)
          }

          // Generate QR code
          const { qrCodeDataUrl, menuUrl } = await generateQRCode()
          setQrCodeUrl(qrCodeDataUrl)

          // Prepare canvas for download
          await prepareCanvasForDownload()
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
        const downloadCanvas = document.createElement('canvas')
        downloadCanvas.width = 1024
        downloadCanvas.height = 1024
        const ctx = downloadCanvas.getContext('2d')
        
        if (ctx) {
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(canvasRef.current, 0, 0, 1024, 1024)
          
          const pngUrl = downloadCanvas.toDataURL('image/png')
          const downloadLink = document.createElement('a')
          const fileName = restaurantName 
            ? `menu-qr-code-${restaurantName.replace(/[^a-zA-Z0-9]/g, '-')}.png`
            : `menu-qr-code-${userEmail.replace(/[^a-zA-Z0-9]/g, '-')}.png`
          
          downloadLink.href = pngUrl
          downloadLink.download = fileName
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        }
      } catch (error) {
        console.error('Error downloading QR code:', error)
        if (qrCodeUrl) {
          const downloadLink = document.createElement('a')
          const fileName = restaurantName 
            ? `menu-qr-code-${restaurantName.replace(/[^a-zA-Z0-9]/g, '-')}.png`
            : `menu-qr-code-${userEmail.replace(/[^a-zA-Z0-9]/g, '-')}.png`
          
          downloadLink.href = qrCodeUrl
          downloadLink.download = fileName
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        }
      }
    } else if (qrCodeUrl) {
      const downloadLink = document.createElement('a')
      const fileName = restaurantName 
        ? `menu-qr-code-${restaurantName.replace(/[^a-zA-Z0-9]/g, '-')}.png`
        : `menu-qr-code-${userEmail.replace(/[^a-zA-Z0-9]/g, '-')}.png`
      
      downloadLink.href = qrCodeUrl
      downloadLink.download = fileName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } else {
      alert('QR code is not ready for download. Please wait a moment and try again.')
    }
  }

  const copyMenuLink = async () => {
    const baseUrl = getBaseUrl()
    let menuUrl
    if (restaurantSlug) {
      menuUrl = `${baseUrl}/menu/${restaurantSlug}`
    } else {
      const emailSlug = userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
      menuUrl = `${baseUrl}/menu/${emailSlug}`
    }

    try {
      await navigator.clipboard.writeText(menuUrl)
      alert('Menu link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
      const textArea = document.createElement('textarea')
      textArea.value = menuUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Menu link copied to clipboard!')
    }
  }

  const getDisplayUrl = () => {
    const baseUrl = getBaseUrl()
    if (restaurantSlug) {
      return `${baseUrl}/menu/${restaurantSlug}`
    } else if (userEmail) {
      const emailSlug = userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
      return `${baseUrl}/menu/${emailSlug}`
    }
    return `${baseUrl}/menu`
  }

  // ... rest of your component code (navItems, return JSX) remains the same until the QR modal part

  return (
    <>
      <header className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 backdrop-blur-3xl border-b border-slate-700 sticky top-0 z-50">
        {/* ... your existing header code ... */}
      </header>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-600 rounded-3xl p-6 max-w-md w-full shadow-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Menu QR Code</h3>
                  <p className="text-slate-400 text-sm">
                    {restaurantName ? `For ${restaurantName}` : 'Scan to view your digital menu'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <span className="text-2xl text-slate-400 hover:text-white">✕</span>
              </button>
            </div>

            {/* QR Code Preview */}
            <div className="bg-white p-4 rounded-2xl mb-6 flex justify-center">
              <div className="w-48 h-48 flex items-center justify-center">
                {loading ? (
                  <div className="w-full h-full bg-slate-200 animate-pulse rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <span className="text-slate-500 text-sm">Generating QR...</span>
                    </div>
                  </div>
                ) : qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Menu QR Code" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 rounded-xl flex items-center justify-center">
                    <span className="text-slate-500">QR Code</span>
                  </div>
                )}
                <canvas 
                  ref={canvasRef} 
                  width="512" 
                  height="512"
                  className="hidden"
                />
              </div>
            </div>

            {/* Menu Link Section */}
            <div className="mb-6">
              <p className="text-slate-400 text-sm mb-3 font-medium">Menu Link:</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 overflow-hidden">
                  <p className="text-slate-300 text-sm truncate select-all">
                    {getDisplayUrl()}
                  </p>
                </div>
                <button
                  onClick={copyMenuLink}
                  className="px-4 py-3 bg-slate-700 border border-slate-600 text-slate-300 rounded-xl font-semibold transition-all hover:bg-slate-600 hover:text-white min-w-[80px]"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => setShowQR(false)}
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 text-slate-300 rounded-xl font-semibold transition-all hover:bg-slate-600 hover:text-white"
              >
                Close
              </button>
              <button 
                onClick={downloadQRCode}
                disabled={loading || !downloadReady}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold transition-all hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    Download
                  </>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-300 text-xs text-center">
                💡 Print or display this QR code for customers to scan and view your menu
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}