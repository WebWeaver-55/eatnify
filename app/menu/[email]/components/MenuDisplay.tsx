'use client'

import { motion } from 'framer-motion'
import { RestaurantProfile, Category, MenuItem } from '../page'

interface MenuDisplayProps {
  menuData: { category: Category; items: MenuItem[] }[]
  selectedCategory: string
  setSelectedCategory: (id: string) => void
  addToCart: (item: MenuItem) => void
  darkMode: boolean
  restaurantProfile: RestaurantProfile | null
}

export default function MenuDisplay({
  menuData,
  selectedCategory,
  setSelectedCategory,
  addToCart,
  darkMode,
  restaurantProfile
}: MenuDisplayProps) {
  // Get all items for "All Items" filter
  const allItems = menuData.flatMap(group => group.items)
  
  // Filter items based on selected category
  const getFilteredItems = () => {
    if (selectedCategory === 'all') return allItems
    if (selectedCategory === 'veg') return allItems.filter(item => item.is_vegetarian)
    if (selectedCategory === 'nonveg') return allItems.filter(item => item.is_nonveg)
    
    // Find items for specific category
    const categoryGroup = menuData.find(group => group.category.id === selectedCategory)
    return categoryGroup ? categoryGroup.items : []
  }

  const filteredItems = getFilteredItems()

  // Get all unique dietary filters
  const hasVeg = allItems.some(item => item.is_vegetarian)
  const hasNonVeg = allItems.some(item => item.is_nonveg)

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Restaurant Header - Mobile Optimized */}
      {restaurantProfile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 pt-4"
        >
          <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {restaurantProfile.restaurant_name}
          </h1>
          <p className={`text-base mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {restaurantProfile.cuisine_type}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-2`}>
            {restaurantProfile.description}
          </p>
        </motion.div>
      )}

      {/* Category Tabs - Horizontal Scroll */}
      <div className="mb-6">
        <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-2">
          {/* All Items Filter */}
          <motion.button
            onClick={() => setSelectedCategory('all')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            All Items
          </motion.button>

          {/* Dietary Filters */}
          {hasVeg && (
            <motion.button
              onClick={() => setSelectedCategory('veg')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                selectedCategory === 'veg'
                  ? 'bg-green-600 text-white shadow-lg'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              🌱 Veg
            </motion.button>
          )}

          {hasNonVeg && (
            <motion.button
              onClick={() => setSelectedCategory('nonveg')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                selectedCategory === 'nonveg'
                  ? 'bg-red-600 text-white shadow-lg'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              🍗 Non-Veg
            </motion.button>
          )}

          {/* Category Tabs */}
          {menuData.map((group) => (
            <motion.button
              key={group.category.id}
              onClick={() => setSelectedCategory(group.category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                selectedCategory === group.category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              {group.category.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid - Enhanced Mobile Design */}
      <motion.div 
        key={selectedCategory}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 gap-4 pb-8"
      >
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } hover:shadow-xl`}
          >
            <div className="flex p-4">
              {/* Item Image */}
              <div className="w-20 h-20 flex-shrink-0 mr-4">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center rounded-xl ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <span className={`text-2xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      🍽️
                    </span>
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-bold mb-1 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.name}
                    </h3>
                    <p className={`text-sm line-clamp-2 mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                  </div>
                  <span className={`text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent ml-2 flex-shrink-0`}>
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  {/* Dietary Badges */}
                  <div className="flex space-x-1">
                    {item.is_vegetarian && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        🌱 Veg
                      </span>
                    )}
                    {item.is_nonveg && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        🍗 Non-Veg
                      </span>
                    )}
                  </div>

                  <motion.button
                    onClick={() => addToCart(item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredItems.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No items found
          </h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {selectedCategory === 'all' 
              ? 'No menu items available yet.' 
              : `No ${selectedCategory === 'veg' ? 'vegetarian' : selectedCategory === 'nonveg' ? 'non-vegetarian' : ''} items found.`}
          </p>
        </motion.div>
      )}
    </div>
  )
}