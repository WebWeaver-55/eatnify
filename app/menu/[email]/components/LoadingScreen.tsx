'use client'

import { motion } from 'framer-motion'

interface LoadingScreenProps {
  darkMode: boolean
  restaurantName?: string
}

export default function LoadingScreen({ darkMode, restaurantName }: LoadingScreenProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-blue-900' 
        : 'bg-gradient-to-br from-blue-50 to-gray-100'
    }`}>
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent`}
          >
            EatNify
          </motion.h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
        >
          {restaurantName ? `Loading ${restaurantName}...` : 'Loading menu...'}
        </motion.div>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '200px' }}
          transition={{ delay: 0.8, duration: 1 }}
          className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mt-4"
        />
      </div>
    </div>
  )
}