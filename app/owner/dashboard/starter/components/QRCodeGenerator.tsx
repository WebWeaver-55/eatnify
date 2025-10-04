'use client'

import { useState } from 'react'
import QRCode from 'qrcode.react'

interface QRCodeGeneratorProps {
  email: string
  restaurantName: string
}

export default function QRCodeGenerator({ email, restaurantName }: QRCodeGeneratorProps) {
  const [showQR, setShowQR] = useState(false)
  
  const menuUrl = `${window.location.origin}/menu/${encodeURIComponent(email)}`

  const downloadQRCode = () => {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `${restaurantName}-menu-qr.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">📱 Digital Menu QR Code</h3>
      
      {!showQR ? (
        <button
          onClick={() => setShowQR(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
        >
          Generate QR Code
        </button>
      ) : (
        <div className="text-center space-y-4">
          <div className="bg-white p-4 rounded-2xl inline-block">
            <QRCode 
              id="qrcode"
              value={menuUrl}
              size={200}
              level="H"
              includeMargin
            />
          </div>
          
          <p className="text-blue-200 text-sm">
            Scan this QR code to view your digital menu
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={downloadQRCode}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-all"
            >
              Download QR
            </button>
            <button
              onClick={() => setShowQR(false)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}