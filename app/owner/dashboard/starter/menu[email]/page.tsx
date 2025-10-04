'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
}

export default function MenuPage({ params }: { params: { email: string } }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [restaurantName, setRestaurantName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // Decode the email from URL
        const email = decodeURIComponent(params.email)
        
        // Fetch restaurant data by email
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('name')
          .eq('owner_email', email)
          .single()

        if (restaurantData) {
          setRestaurantName(restaurantData.name)
        }

        // Fetch menu items for this restaurant
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('owner_email', email)
          .order('category')

        if (menuData) {
          setMenuItems(menuData)
        }
      } catch (error) {
        console.error('Error fetching menu data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [params.email])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-4 bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text">
            {restaurantName || 'Our Menu'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Menu Items */}
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🍽️</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">Menu Coming Soon</h3>
            <p className="text-slate-500">This restaurant is setting up their menu. Please check back later.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-3xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-slate-100">
                  {category}
                </h2>
                <div className="grid gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.name}</h3>
                        <p className="text-slate-600 mb-3">{item.description}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-green-600">${item.price}</span>
                        </div>
                      </div>
                      {item.image_url && (
                        <div className="ml-6 flex-shrink-0">
                          <div className="w-20 h-20 bg-slate-200 rounded-lg overflow-hidden">
                            <img 
                              src={item.image_url} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200">
          <p className="text-slate-500">Powered by Eatnify</p>
        </div>
      </div>
    </div>
  )
}