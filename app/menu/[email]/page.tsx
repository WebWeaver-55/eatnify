'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

// Components
import Cart from './components/Cart'
import RestaurantProfile from './components/RestaurantProfile'
import MenuDisplay from './components/MenuDisplay'
import LoadingScreen from './components/LoadingScreen'
import CustomerDetailsModal from './components/CustomerDetailsModal'

export interface Category {
  id: string
  name: string
  email: string
  display_order?: number
}

export interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string
  image_url: string | null
  email: string
  is_vegetarian: boolean
  is_nonveg: boolean
  is_available: boolean
  created_at?: string
}

export interface RestaurantProfile {
  id: string
  restaurant_name: string
  cuisine_type: string | null
  ambiance: string | null
  description: string | null
  specialty_dish: string | null
  email: string
  phone: string | null
  website_url: string | null
  address: string | null
  opening_time: string | null
  closing_time: string | null
  days_open: string | null
  average_meal: string | null
  price_range: string | null
  rating: string | null
  total_reviews: string | null
  seating_capacity: string | null
  delivery_available: boolean
  takeaway_available: boolean
  parking_available: boolean
  wifi_available: boolean
  outdoor_seating: boolean
  reservations_available: boolean
  instagram_url: string | null
  facebook_url: string | null
  twitter_url: string | null
  cover_image: string | null
  logo_image: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string | null
}

interface CustomerDetails {
  name: string
  phone: string
}

export default function MenuPage({ params }: { params: { email: string } }) {
  const [menuData, setMenuData] = useState<{category: Category, items: MenuItem[]}[]>([])
  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [activeView, setActiveView] = useState<'menu' | 'cart' | 'profile'>('menu')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ name: '', phone: '' })
  const [tempItem, setTempItem] = useState<MenuItem | null>(null)
  const [hasAskedForDetails, setHasAskedForDetails] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = decodeURIComponent(params.email)

        // Fetch restaurant profile
        const { data: profile, error: profileError } = await supabase
          .from('restaurant_profiles')
          .select('*')
          .eq('email', email)
          .single()

        if (!profileError && profile) {
          setRestaurantProfile(profile)
        }

        // Fetch user phone number
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('phone_number')
          .eq('email', email)
          .single()

        if (!userError && userData) {
          setPhoneNumber(userData.phone_number || '')
        }

        // Fetch categories
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('email', email)
          .order('display_order', { ascending: true })

        // Fetch menu items
        const { data: items, error: itemsError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('email', email)
          .eq('is_available', true)

        // Combine data
        if (categories && items) {
          const combined = categories.map(category => ({
            category,
            items: items.filter(item => item.category_id === category.id)
          })).filter(group => group.items.length > 0)

          setMenuData(combined)
        }

      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.email])

  const handleAddToCart = (item: MenuItem) => {
    if (!hasAskedForDetails && customerDetails.name === '') {
      setTempItem(item)
      setShowCustomerModal(true)
    } else {
      addItemToCart(item)
    }
  }

const confirmCustomerDetails = async (details: CustomerDetails) => {
  setCustomerDetails(details)
  setHasAskedForDetails(true)

  // Check if customer already exists with this phone number
  try {
    const { data: existingCustomer, error: checkError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone_number', details.phone)
      .eq('email', params.email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing customer:', checkError)
    }

    // If customer doesn't exist, insert new record
    if (!existingCustomer) {
      const { error } = await supabase
        .from('customers')
        .insert([
          {
            name: details.name,
            phone_number: details.phone,
            email: params.email,
            restaurant_name: restaurantProfile?.restaurant_name || 'Unknown Restaurant',
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        console.error('Error saving customer details:', error)
      } else {
        console.log('New customer saved successfully')
      }
    } else {
      console.log('Customer already exists, skipping duplicate insert')
    }
  } catch (error) {
    console.error('Error in customer details process:', error)
  }

  if (tempItem) {
    addItemToCart(tempItem)
  }

  setShowCustomerModal(false)
  setTempItem(null)
}

  const addItemToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id)
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prev, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image_url: item.image_url
      }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const sendWhatsAppOrder = () => {
    if (!phoneNumber) {
      alert('Restaurant contact not available')
      return
    }

    const orderText = cart.map(item => 
      `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('%0A')
    
    const total = getTotalPrice().toFixed(2)
    const customerInfo = `Customer: ${customerDetails.name}%0APhone: ${customerDetails.phone}`
    const message = `🍽️ *NEW ORDER* 🍽️%0A%0A${orderText}%0A%0A*Total: $${total}*%0A%0A${customerInfo}`
    
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '')
    window.open(`https://wa.me/${cleanPhoneNumber}?text=${message}`, '_blank')
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  if (loading) {
    return <LoadingScreen darkMode={darkMode} restaurantName={restaurantProfile?.restaurant_name} />
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-blue-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-gray-100 text-gray-900'
    }`}>
      {/* Header - Mobile Optimized */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
          darkMode 
            ? 'bg-gray-900/95 border-blue-800' 
            : 'bg-white/95 border-blue-200'
        }`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm`}>
                E
              </div>
              <span className={`text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent`}>
                EatNify
              </span>
            </motion.div>

            {/* Navigation - Mobile Optimized */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView('menu')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeView === 'menu'
                    ? 'bg-blue-600 text-white' 
                    : darkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Menu
              </button>

              <button
                onClick={() => setActiveView('profile')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeView === 'profile'
                    ? 'bg-blue-600 text-white' 
                    : darkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
              
              {/* Cart Button */}
              <motion.button
                onClick={() => setActiveView('cart')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeView === 'cart'
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600 text-white'
                }`}
              >
                Cart
                {getTotalItems() > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-all duration-300 ml-2 ${
                  darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ x: darkMode ? 20 : 0 }}
                  className={`w-4 h-4 rounded-full bg-white shadow-lg`}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pb-20">
        <AnimatePresence mode="wait">
          {activeView === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MenuDisplay
                menuData={menuData}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                addToCart={handleAddToCart}
                darkMode={darkMode}
                restaurantProfile={restaurantProfile}
              />
            </motion.div>
          )}

          {activeView === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Cart
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                getTotalPrice={getTotalPrice}
                sendWhatsAppOrder={sendWhatsAppOrder}
                darkMode={darkMode}
                restaurantProfile={restaurantProfile}
                customerDetails={customerDetails}
              />
            </motion.div>
          )}

          {activeView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RestaurantProfile
                profile={restaurantProfile}
                darkMode={darkMode}
                setActiveView={setActiveView}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={showCustomerModal}
        onClose={() => {
          setShowCustomerModal(false)
          setTempItem(null)
        }}
        onConfirm={confirmCustomerDetails}
        darkMode={darkMode}
      />
    </div>
  )
}