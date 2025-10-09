'use client'

import { motion } from 'framer-motion'
import { RestaurantProfile as RestaurantProfileType } from '../page'

interface RestaurantProfileProps {
  profile: RestaurantProfileType | null
  darkMode: boolean
  setActiveView: (view: 'menu' | 'cart' | 'profile') => void
}

export default function RestaurantProfile({ profile, darkMode, setActiveView }: RestaurantProfileProps) {
  if (!profile) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-6xl mb-4">🏪</div>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Restaurant not found
        </h3>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          The restaurant profile is not available.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header Section - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl mb-6"
      >
        {/* Cover Image */}
        <div className="relative h-48 w-full">
          {profile.cover_image ? (
            <img
              src={profile.cover_image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' 
                : 'bg-gradient-to-r from-blue-100 to-purple-100'
            } flex items-center justify-center`}>
              <div className="text-4xl">🏪</div>
            </div>
          )}
          {/* Overlay */}
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent' 
              : 'bg-gradient-to-t from-white/80 via-white/40 to-transparent'
          }`}></div>
        </div>

        {/* Profile Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end space-x-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              {profile.logo_image ? (
                <img
                  src={profile.logo_image}
                  alt="Logo"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white/20 shadow-lg"
                />
              ) : (
                <div className={`w-16 h-16 rounded-xl ${
                  darkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                } border-2 border-white/20 shadow-lg flex items-center justify-center`}>
                  <span className="text-xl">🍽️</span>
                </div>
              )}
            </div>

            {/* Restaurant Details */}
            <div className="flex-1 text-white pb-1">
              <h1 className="text-xl font-bold mb-1 drop-shadow-lg truncate">
                {profile.restaurant_name}
              </h1>
              <div className="flex flex-wrap items-center gap-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                  darkMode ? 'bg-white/20' : 'bg-black/20'
                }`}>
                  {profile.cuisine_type || 'Restaurant'}
                </span>
                {profile.rating && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                    darkMode ? 'bg-amber-500/20' : 'bg-amber-500/30'
                  }`}>
                    ⭐ {profile.rating}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-4 shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            About Us
          </h2>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {profile.description || `${profile.restaurant_name} offers a unique dining experience with ${profile.cuisine_type || 'delicious'} cuisine in a ${profile.ambiance || 'welcoming'} atmosphere.`}
          </p>
        </motion.div>

        {/* Contact & Hours Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-4 shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              📞 Contact
            </h3>
            <div className="space-y-2">
              {profile.phone && (
                <div className="flex items-center">
                  <span className="w-6 text-sm">📞</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {profile.phone}
                  </span>
                </div>
              )}
              {profile.address && (
                <div className="flex items-start">
                  <span className="w-6 text-sm mt-0.5">📍</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {profile.address}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl p-4 shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🕒 Hours
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {profile.days_open || 'Mon - Sun'}
                </span>
                <span className={`text-sm font-semibold ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {profile.opening_time || '9:00'} - {profile.closing_time || '22:00'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl p-4 shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🚀 Services
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { condition: profile.delivery_available, label: '🚚 Delivery' },
              { condition: profile.takeaway_available, label: '🥡 Takeaway' },
              { condition: profile.parking_available, label: '🅿️ Parking' },
              { condition: profile.wifi_available, label: '📶 WiFi' },
              { condition: profile.outdoor_seating, label: '🌳 Outdoor' },
              { condition: profile.reservations_available, label: '📅 Reservations' },
            ].map((feature, index) => (
              feature.condition && (
                <div
                  key={index}
                  className={`flex items-center p-2 rounded-lg text-sm ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{feature.label.split(' ')[0]}</span>
                  <span className={`font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {feature.label.split(' ')[1]}
                  </span>
                </div>
              )
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl p-4 shadow-lg text-center ${
            darkMode
              ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-400/30'
              : 'bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200'
          }`}
        >
          <div className="text-3xl mb-2">🎯</div>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to Order?
          </h4>
          <p className={`text-sm mb-3 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
            Browse our delicious menu and place your order
          </p>
          <button
            onClick={() => setActiveView('menu')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-300"
          >
            View Menu
          </button>
        </motion.div>
      </div>
    </div>
  )
}