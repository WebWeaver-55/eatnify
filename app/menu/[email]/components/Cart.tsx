'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RestaurantProfile, CartItem } from '../page'

interface CartProps {
  cart: CartItem[]
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  getTotalPrice: () => number
  sendWhatsAppOrder: () => void
  darkMode: boolean
  restaurantProfile: RestaurantProfile | null
  customerDetails: { name: string; phone: string }
}

export default function Cart({
  cart,
  updateQuantity,
  removeFromCart,
  getTotalPrice,
  sendWhatsAppOrder,
  darkMode,
  restaurantProfile,
  customerDetails
}: CartProps) {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 pt-4"
      >
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Cart
        </h1>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          {restaurantProfile?.restaurant_name}
        </p>
      </motion.div>

      <div className={`rounded-2xl shadow-xl overflow-hidden mb-20 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <AnimatePresence>
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🛒</div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your cart is empty
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Add some delicious items from the menu!
              </p>
            </motion.div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="max-h-96 overflow-y-auto">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center p-4 border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden mr-4 flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <span className="text-lg">🍽️</span>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </h3>
                      <p className={`text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent`}>
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 ml-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        -
                      </motion.button>
                      
                      <span className={`w-8 text-center font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.quantity}
                      </span>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        +
                      </motion.button>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-500 hover:text-red-400 transition-colors p-1"
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Cart Summary - Sticky Bottom */}
              <div className="sticky bottom-0 bg-inherit border-t border-gray-200 dark:border-gray-700">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4"
                >
                  {/* Customer Info */}
                  {customerDetails.name && (
                    <div className={`mb-4 p-3 rounded-xl ${
                      darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                    }`}>
                      <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                        Order for: {customerDetails.name}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-500'}`}>
                        Phone: {customerDetails.phone}
                      </p>
                    </div>
                  )}

                  <div className={`flex justify-between items-center mb-4 p-3 rounded-xl ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Total:
                    </span>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>

                  <motion.button
                    onClick={sendWhatsAppOrder}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-300"
                  >
                    📱 Order via WhatsApp
                  </motion.button>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}