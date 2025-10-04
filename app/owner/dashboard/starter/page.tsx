"use client"

import { useState, useEffect } from 'react'
import DashboardHeader from './components/DashboardHeader'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { 
  Utensils, 
  Tag, 
  CheckCircle, 
  Clock, 
  Plus, 
  Image as ImageIcon,
  Smartphone,
  QrCode,
  BarChart3,
  Sparkles,
  TrendingUp,
  Users,
  Star
} from 'lucide-react'

export default function StarterDashboard() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Get user email from localStorage
      const userEmail = localStorage.getItem('userEmail')
      
      if (!userEmail) {
        console.log('No user email found in localStorage')
        return
      }

      console.log('Fetching data for email:', userEmail)

      // Fetch restaurant profile using localStorage email
      const { data: profileData, error: profileError } = await supabase
        .from('restaurant_profiles')
        .select('*')
        .eq('email', userEmail)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
      } else {
        console.log('Profile data:', profileData)
        setProfile(profileData)
      }

      // Fetch menu items for this email only
      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('email', userEmail)
        .order('created_at', { ascending: false })

      if (menuError) {
        console.error('Error fetching menu items:', menuError)
      } else {
        console.log('Menu items data:', menuData)
        setMenuItems(menuData || [])
      }

      // Fetch categories for this email only
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('email', userEmail)

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError)
      } else {
        console.log('Categories data:', categoriesData)
        setCategories(categoriesData || [])
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalMenuItems = menuItems?.length || 0
  const totalCategories = categories?.length || 0
  const availableItems = menuItems?.filter(item => item.is_available).length || 0
  const unavailableItems = totalMenuItems - availableItems

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-200 text-lg font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        <DashboardHeader />
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section - Enhanced */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        Welcome to EatNify!
                      </h2>
                      <p className="text-blue-200 text-lg mt-1">
                        Your futuristic restaurant dashboard
                      </p>
                    </div>
                  </div>
                  <p className="text-blue-100/80 text-base sm:text-lg max-w-2xl leading-relaxed">
                    Manage your digital menu, organize categories, and create an amazing customer experience with AI-powered insights.
                  </p>
                </div>
                <div className="mt-6 sm:mt-0 sm:ml-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-center min-w-[200px]">
                    <p className="text-blue-100 text-sm font-medium mb-1">Restaurant</p>
                    <p className="text-white font-bold text-xl truncate">
                      {profile?.restaurant_name || 'Your Restaurant'}
                    </p>
                    <div className="flex items-center justify-center mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-green-300 text-sm font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Enhanced */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-4 sm:p-6 text-white hover:scale-105 transition-transform duration-300 group">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                  <Utensils className="w-6 h-6 text-blue-300" />
                </div>
                <div className="ml-4">
                  <p className="text-blue-200 text-sm font-medium">Menu Items</p>
                  <p className="text-3xl font-bold text-white">{totalMenuItems}</p>
                </div>
              </div>
              <div className="mt-3 h-1 bg-blue-500/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalMenuItems / 50) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-500/10 backdrop-blur-xl border border-green-400/30 rounded-2xl p-4 sm:p-6 text-white hover:scale-105 transition-transform duration-300 group">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <Tag className="w-6 h-6 text-green-300" />
                </div>
                <div className="ml-4">
                  <p className="text-green-200 text-sm font-medium">Categories</p>
                  <p className="text-3xl font-bold text-white">{totalCategories}</p>
                </div>
              </div>
              <div className="mt-3 h-1 bg-green-500/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalCategories / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-600/20 to-yellow-500/10 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-4 sm:p-6 text-white hover:scale-105 transition-transform duration-300 group">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-amber-500/20 group-hover:bg-amber-500/30 transition-colors">
                  <CheckCircle className="w-6 h-6 text-amber-300" />
                </div>
                <div className="ml-4">
                  <p className="text-amber-200 text-sm font-medium">Available</p>
                  <p className="text-3xl font-bold text-white">{availableItems}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-amber-300 text-xs">{unavailableItems} unavailable</span>
                <span className="text-amber-300 text-xs font-bold">
                  {totalMenuItems > 0 ? Math.round((availableItems / totalMenuItems) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-pink-500/10 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-4 sm:p-6 text-white hover:scale-105 transition-transform duration-300 group">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                  <Star className="w-6 h-6 text-purple-300" />
                </div>
                <div className="ml-4">
                  <p className="text-purple-200 text-sm font-medium">Plan</p>
                  <p className="text-3xl font-bold text-green-400">Starter</p>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-purple-300 text-xs">Perfect for getting started</span>
              </div>
            </div>
          </div>

          {/* Quick Actions - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link 
              href="/owner/dashboard/starter/menu" 
              className="group bg-gradient-to-br from-blue-600/20 to-cyan-500/10 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6 hover:border-blue-400/50 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                  <Plus className="w-6 h-6 text-blue-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Manage Menu</h3>
              <p className="text-blue-200/80 mb-4 leading-relaxed">
                Add, edit or remove menu items with AI-powered descriptions and image optimization
              </p>
              <div className="flex items-center text-blue-300 font-semibold group-hover:text-blue-200 transition-colors">
                Get Started
                <TrendingUp className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link 
              href="/owner/dashboard/starter/categories" 
              className="group bg-gradient-to-br from-green-600/20 to-emerald-500/10 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6 hover:border-green-400/50 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <Tag className="w-6 h-6 text-green-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Categories</h3>
              <p className="text-green-200/80 mb-4 leading-relaxed">
                Organize your menu with smart categories and AI-suggested organization
              </p>
              <div className="flex items-center text-green-300 font-semibold group-hover:text-green-200 transition-colors">
                Organize
                <Users className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link 
              href="/owner/dashboard/starter/profile" 
              className="group bg-gradient-to-br from-purple-600/20 to-pink-500/10 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 hover:border-purple-400/50 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Restaurant Profile</h3>
              <p className="text-purple-200/80 mb-4 leading-relaxed">
                Customize your digital presence with futuristic themes and AI-generated content
              </p>
              <div className="flex items-center text-purple-300 font-semibold group-hover:text-purple-200 transition-colors">
                Customize
                <BarChart3 className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Recent Menu Items - Enhanced */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-blue-400/20 rounded-3xl shadow-2xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-b border-blue-400/30 px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Your Menu Items</h3>
                    <p className="text-blue-200 text-sm">Recently added and updated items</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-white/10 text-white/90 px-3 py-2 rounded-lg text-sm font-medium border border-white/20">
                    {totalMenuItems} items
                  </span>
                  <Link 
                    href="/owner/dashboard/starter/menu" 
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium border border-white/20 hover:border-white/30 transition-all"
                  >
                    Manage All
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-blue-400/10">
              {menuItems && menuItems.length > 0 ? (
                menuItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="px-6 py-4 hover:bg-blue-500/5 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {item.image_url ? (
                          <img 
                            className="h-14 w-14 rounded-2xl object-cover shadow-lg group-hover:shadow-blue-500/25 transition-all" 
                            src={item.image_url} 
                            alt={item.name} 
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center shadow-lg border border-blue-400/20">
                            <ImageIcon className="w-6 h-6 text-blue-300" />
                          </div>
                        )}
                        <div>
                          <div className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {item.name}
                          </div>
                          <div className="flex items-center space-x-3 mt-1">
                            <div className="text-xl font-bold text-green-400">₹{item.price}</div>
                            <div className="flex items-center space-x-2">
                              {item.is_vegetarian && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                                  Veg
                                </span>
                              )}
                              {item.is_nonveg && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-400/30">
                                  Non-Veg
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                        item.is_available 
                          ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                          : 'bg-red-500/20 text-red-300 border-red-400/30'
                      }`}>
                        {item.is_available ? (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            Available
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                            Unavailable
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-16 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-4 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-400/20">
                      <Plus className="w-10 h-10 text-blue-300" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">No menu items yet</h4>
                    <p className="text-blue-200 mb-6">Start building your futuristic menu experience</p>
                    <Link 
                      href="/owner/dashboard/starter/menu" 
                      className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Item
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Starter Plan Features - Enhanced */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Starter Plan Features</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Utensils, text: 'Up to 50 menu items', color: 'blue' },
                { icon: Tag, text: '10 categories', color: 'green' },
                { icon: Smartphone, text: 'Mobile responsive', color: 'cyan' },
                { icon: QrCode, text: 'Digital menu QR', color: 'amber' },
                { icon: BarChart3, text: 'Basic analytics', color: 'pink' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className={`w-10 h-10 bg-${feature.color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-${feature.color}-400/30`}>
                    <feature.icon className={`w-5 h-5 text-${feature.color}-300`} />
                  </div>
                  <span className="text-white text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
            
            {/* Upgrade CTA */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-2xl text-center">
              <p className="text-amber-100 font-semibold mb-2">Ready for more features?</p>
              <p className="text-amber-200/80 text-sm mb-3">Upgrade to Pro for unlimited items, advanced analytics, and AI-powered insights</p>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}