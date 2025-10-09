'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, User, Phone, Sparkles } from 'lucide-react'

interface CustomerDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (details: { name: string; phone: string }) => void
  darkMode: boolean
}

export default function CustomerDetailsModal({ isOpen, onClose, onConfirm, darkMode }: CustomerDetailsModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && phone.trim()) {
      setIsSubmitting(true)
      // Simulate a brief loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      onConfirm({ name: name.trim(), phone: phone.trim() })
      setIsSubmitting(false)
      setName('')
      setPhone('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-xl" />
            
            <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50' 
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'
            }`}>
              
              {/* Header */}
              <div className="relative p-6 text-center border-b border-gray-700/30">
                {/* Animated Background Effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600" />
                
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-2 border-2 border-blue-400/30 rounded-3xl"
                    />
                  </div>
                </div>
                
                <h2 className={`text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  Welcome to EatNify!
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Please share your details to start ordering
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name Field */}
                <div className="space-y-3">
                  <label className={`flex items-center text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    Your Name
                  </label>
                  <div className="relative">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:border-blue-500 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: name ? 1 : 0 }}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${
                        name ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-3">
                  <label className={`flex items-center text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Phone className="w-4 h-4 mr-2 text-blue-500" />
                    Phone Number
                  </label>
                  <div className="relative">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:border-blue-500 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                      placeholder="Enter your phone number"
                      required
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: phone ? 1 : 0 }}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${
                        phone ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Features List */}
                <div className={`p-4 rounded-xl ${
                  darkMode ? 'bg-gray-800/50' : 'bg-blue-50'
                }`}>
                  <div className="flex items-center text-sm text-blue-500 mb-2">
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Why we need this?</span>
                  </div>
                  <ul className={`text-xs space-y-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <li>• Faster order processing</li>
                    <li>• Personalized experience</li>
                    <li>• Order updates via WhatsApp</li>
                    <li>• Quick reordering in future</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
                      darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Maybe Later
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    disabled={!name.trim() || !phone.trim() || isSubmitting}
                    whileHover={{ scale: name.trim() && phone.trim() ? 1.02 : 1 }}
                    whileTap={{ scale: name.trim() && phone.trim() ? 0.98 : 1 }}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                      name.trim() && phone.trim()
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25'
                        : 'bg-gray-400 cursor-not-allowed'
                    } relative overflow-hidden`}
                  >
                    {isSubmitting ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      </motion.div>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start Ordering
                      </span>
                    )}
                    
                    {/* Animated shine effect */}
                    <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 400, opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
                    />
                  </motion.button>
                </div>
              </form>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-200/50 text-gray-500 hover:text-gray-700'
                }`}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}