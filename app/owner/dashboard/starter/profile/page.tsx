'use client'
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { Edit3, Save, X, Check, MapPin, Phone, Clock, Star, Globe, Sparkles, Users, Award, TrendingUp, DollarSign, Instagram, Facebook, Twitter, Mail, Wifi, Car, TreePine, Calendar, ChevronRight, Utensils } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function FuturisticProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState('')

  const [formData, setFormData] = useState({
    restaurant_name: '',
    cuisine_type: '',
    phone: '',
    email: '',
    website_url: '',
    address: '',
    description: '',
    opening_time: '09:00',
    closing_time: '22:00',
    days_open: 'Monday - Sunday',
    price_range: '$$',
    rating: '4.5',
    total_reviews: '0',
    seating_capacity: '',
    average_meal_time: '45 mins',
    ambiance: 'Casual Dining',
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    specialty_dish: '',
    delivery_available: true,
    takeaway_available: true,
    parking_available: false,
    wifi_available: false,
    outdoor_seating: false,
    reservations_required: false
  })

  const fetchProfile = async () => {
    console.log('🔄 fetchProfile started...')
    setLoading(true)
    try {
      const userEmail = localStorage.getItem('userEmail')
      console.log('📧 User email from localStorage:', userEmail)

      if (!userEmail) {
        console.log('⚠️ No user email found in localStorage')
        setProfile(null)
        setStatus('empty')
        return
      }

      setFormData(prev => ({ ...prev, email: userEmail }))

      console.log(`🔍 Fetching from restaurant_profiles for email: ${userEmail}`)
      const { data: profileData, error: profileError } = await supabase
        .from('restaurant_profiles')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle()

      console.log('📊 restaurant_profiles response:', { profileData, profileError })

      if (profileError) {
        console.error('❌ restaurant_profiles error:', profileError)
      }

      if (profileData) {
        console.log('✅ Profile found in restaurant_profiles:', profileData.restaurant_name)
        setProfile(profileData)
        setFormData(profileData)
        setStatus('loaded')
        setLoading(false)
        return
      }

      console.log(`🔍 Fetching from users table for email: ${userEmail}`)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('restaurant_name, email')
        .eq('email', userEmail)
        .maybeSingle()

      console.log('📊 users table response:', { userData, userError })

      if (userError) {
        console.error('❌ users table error:', userError)
      }

      if (userData && userData.restaurant_name) {
        console.log('✅ Restaurant name found in users table:', userData.restaurant_name)
        const basicProfile = {
          restaurant_name: userData.restaurant_name,
          email: userData.email,
          cuisine_type: '',
          phone: '',
          website_url: '',
          address: '',
          description: '',
          opening_time: '09:00',
          closing_time: '22:00',
          days_open: 'Monday - Sunday',
          price_range: '$$',
          rating: '4.5',
          total_reviews: '0',
          seating_capacity: '',
          average_meal_time: '45 mins',
          ambiance: 'Casual Dining',
          instagram_url: '',
          facebook_url: '',
          twitter_url: '',
          specialty_dish: '',
          delivery_available: true,
          takeaway_available: true,
          parking_available: false,
          wifi_available: false,
          outdoor_seating: false,
          reservations_required: false
        }
        setProfile(basicProfile)
        setFormData(basicProfile)
        setStatus('loaded')
      } else {
        console.log('❌ No profile found in any table')
        setProfile(null)
        setStatus('empty')
      }

    } catch (error) {
      console.error('💥 Unexpected error:', error)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!formData.restaurant_name.trim()) {
      alert('Restaurant name is required!')
      return
    }
    
    setSaving(true)
    try {
      const userEmail = localStorage.getItem('userEmail')
      
      const profileData = {
        ...formData,
        email: userEmail
      }

      if (profile?.id) {
        const { data, error } = await supabase
          .from('restaurant_profiles')
          .update(profileData)
          .eq('id', profile.id)
          .select()
          .single()

        if (error) throw error
        setProfile(data)
      } else {
        const { data, error } = await supabase
          .from('restaurant_profiles')
          .insert([profileData])
          .select()
          .single()

        if (error) throw error
        setProfile(data)
      }
      setIsEditing(false)
      setStatus('saved')
      setTimeout(() => setStatus(''), 3000)
    } catch (error) {
      setStatus('error')
      alert('Error saving profile. Please try again.')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 safe-area-inset-bottom">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-300 text-lg font-semibold">Loading Profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-x-hidden safe-area-inset-bottom">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Success Toast */}
      {status === 'saved' && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-md safe-area-inset-top">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-blue-400">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">Profile Updated Successfully!</span>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full px-3 py-4 max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Utensils className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              EatNify
            </h1>
          </div>
          <p className="text-blue-300 text-xs font-medium">Your Premium Digital Restaurant Profile</p>
        </div>

        {profile ? (
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Main Profile Card */}
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              {/* Hero Card */}
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
                {/* Cover with Gradient Overlay */}
                <div className="relative h-40 lg:h-64 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-2 shadow-lg group text-xs"
                  >
                    <Edit3 className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                    <span className="font-bold">Edit</span>
                  </button>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl lg:text-5xl font-black text-white mb-2 drop-shadow-lg break-words">
                      {profile.restaurant_name || 'Restaurant Name'}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 text-xs">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-bold">{profile.rating}</span>
                        <span className="text-white/80">({profile.total_reviews})</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 text-xs">
                        <span className="text-white font-semibold">{profile.cuisine_type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-8">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4 lg:gap-4 lg:mb-8">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl lg:rounded-2xl p-3 border border-blue-500/30 text-center hover:scale-105 transition-transform">
                      <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400 mx-auto mb-1 lg:mb-2" />
                      <div className="text-white font-bold text-sm lg:text-lg">{profile.price_range}</div>
                      <div className="text-blue-300 text-xs font-medium">Price Range</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl lg:rounded-2xl p-3 border border-blue-500/30 text-center hover:scale-105 transition-transform">
                      <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400 mx-auto mb-1 lg:mb-2" />
                      <div className="text-white font-bold text-sm lg:text-lg">{profile.seating_capacity || 'N/A'}</div>
                      <div className="text-blue-300 text-xs font-medium">Capacity</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl lg:rounded-2xl p-3 border border-blue-500/30 text-center hover:scale-105 transition-transform">
                      <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400 mx-auto mb-1 lg:mb-2" />
                      <div className="text-white font-bold text-sm lg:text-lg">{profile.average_meal_time}</div>
                      <div className="text-blue-300 text-xs font-medium">Avg Time</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl lg:rounded-2xl p-3 border border-blue-500/30 text-center hover:scale-105 transition-transform">
                      <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400 mx-auto mb-1 lg:mb-2" />
                      <div className="text-white font-bold text-sm lg:text-lg">{profile.rating}</div>
                      <div className="text-blue-300 text-xs font-medium">Rating</div>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-xl lg:rounded-2xl p-4 mb-4 lg:mb-6 border border-blue-500/20">
                    <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500/20 rounded-lg lg:rounded-xl flex items-center justify-center">
                        <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base lg:text-lg">Opening Hours</h3>
                        <p className="text-blue-300 text-xs lg:text-sm">{profile.days_open}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/50 rounded-lg lg:rounded-xl p-3 lg:p-4 border border-blue-500/10">
                      <div className="text-center flex-1">
                        <div className="text-blue-400 text-xs font-semibold mb-1">OPENS</div>
                        <div className="text-white text-lg lg:text-2xl font-bold">{formatTime(profile.opening_time)}</div>
                      </div>
                      <div className="w-px h-8 lg:h-12 bg-blue-500/30"></div>
                      <div className="text-center flex-1">
                        <div className="text-blue-400 text-xs font-semibold mb-1">CLOSES</div>
                        <div className="text-white text-lg lg:text-2xl font-bold">{formatTime(profile.closing_time)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="flex flex-col gap-3 mb-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:mb-6">
                    {profile.phone && (
                      <a href={`tel:${profile.phone}`} className="flex items-center gap-3 p-3 lg:p-4 bg-slate-800/50 rounded-xl border border-blue-500/20 hover:border-blue-500/40 hover:bg-slate-800/70 transition-all group">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Phone className="w-4 h-4 lg:w-6 lg:h-6 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-blue-300 text-xs font-semibold uppercase mb-1">Phone</div>
                          <div className="text-white font-semibold text-sm lg:text-base truncate">{profile.phone}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    
                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className="flex items-center gap-3 p-3 lg:p-4 bg-slate-800/50 rounded-xl border border-blue-500/20 hover:border-blue-500/40 hover:bg-slate-800/70 transition-all group">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Mail className="w-4 h-4 lg:w-6 lg:h-6 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-blue-300 text-xs font-semibold uppercase mb-1">Email</div>
                          <div className="text-white font-semibold text-sm lg:text-base truncate">{profile.email}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    
                    {profile.address && (
                      <div className="flex items-start gap-3 p-3 lg:p-4 bg-slate-800/50 rounded-xl border border-blue-500/20 lg:col-span-2">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 lg:w-6 lg:h-6 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-blue-300 text-xs font-semibold uppercase mb-1">Address</div>
                          <div className="text-white font-semibold text-sm lg:text-base leading-relaxed break-words">{profile.address}</div>
                        </div>
                      </div>
                    )}

                    {profile.website_url && (
                      <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 lg:p-4 bg-slate-800/50 rounded-xl border border-blue-500/20 hover:border-blue-500/40 hover:bg-slate-800/70 transition-all group lg:col-span-2">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Globe className="w-4 h-4 lg:w-6 lg:h-6 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-blue-300 text-xs font-semibold uppercase mb-1">Website</div>
                          <div className="text-white font-semibold text-sm lg:text-base truncate">{profile.website_url}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </div>

                  {/* Services & Amenities */}
                  <div className="mb-4 lg:mb-6">
                    <h3 className="text-white font-bold text-base lg:text-lg mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                      Services & Amenities
                    </h3>
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3">
                      {profile.delivery_available && (
                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg lg:rounded-xl px-3 py-2 text-xs lg:text-sm">
                          <div className="text-lg">🚚</div>
                          <span className="text-green-400 font-semibold">Delivery</span>
                        </div>
                      )}
                      {profile.takeaway_available && (
                        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 py-2 text-xs lg:text-sm">
                          <div className="text-lg">🥡</div>
                          <span className="text-blue-400 font-semibold">Takeaway</span>
                        </div>
                      )}
                      {profile.parking_available && (
                        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-lg lg:rounded-xl px-3 py-2 text-xs lg:text-sm">
                          <Car className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                          <span className="text-purple-400 font-semibold">Parking</span>
                        </div>
                      )}
                      {profile.wifi_available && (
                        <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg lg:rounded-xl px-3 py-2 text-xs lg:text-sm">
                          <Wifi className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
                          <span className="text-cyan-400 font-semibold">Free WiFi</span>
                        </div>
                      )}
                      {profile.outdoor_seating && (
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg lg:rounded-xl px-3 py-2 text-xs lg:text-sm">
                          <TreePine className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Outdoor</span>
                        </div>
                      )}
                      {profile.reservations_required && (
                        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg lg:rounded-xl px-3 py-2 text-xs lg:text-sm">
                          <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400" />
                          <span className="text-orange-400 font-semibold">Reservations</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Specialty Dish */}
                  {profile.specialty_dish && (
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl lg:rounded-2xl p-4 mb-4 lg:mb-6">
                      <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-amber-500/20 rounded-lg lg:rounded-xl flex items-center justify-center">
                          <Award className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400" />
                        </div>
                        <h3 className="text-white font-bold text-base lg:text-lg">Chef's Signature</h3>
                      </div>
                      <p className="text-amber-100 font-medium text-sm lg:text-lg break-words">{profile.specialty_dish}</p>
                    </div>
                  )}

                  {/* Description */}
                  {profile.description && (
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-xl lg:rounded-2xl p-4 border border-blue-500/20">
                      <h3 className="text-white font-bold text-base lg:text-lg mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                        About Us
                      </h3>
                      <p className="text-gray-300 text-sm lg:text-base leading-relaxed break-words">{profile.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media Card */}
              {(profile.instagram_url || profile.facebook_url || profile.twitter_url) && (
                <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-2xl">
                  <h3 className="text-white font-bold text-lg lg:text-xl mb-4 lg:mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
                    Connect With Us
                  </h3>
                  <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:gap-4">
                    {profile.instagram_url && (
                      <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 lg:flex-col lg:flex-1 lg:min-w-[150px] bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl lg:rounded-2xl p-4 hover:scale-105 transition-transform group">
                        <Instagram className="w-6 h-6 lg:w-8 lg:h-8 text-pink-400 mb-0 lg:mb-2" />
                        <div className="flex-1 lg:text-center">
                          <div className="text-white font-bold text-sm lg:text-base">Instagram</div>
                          <div className="text-pink-300 text-xs lg:text-sm">Follow us</div>
                        </div>
                      </a>
                    )}
                    {profile.facebook_url && (
                      <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 lg:flex-col lg:flex-1 lg:min-w-[150px] bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl lg:rounded-2xl p-4 hover:scale-105 transition-transform group">
                        <Facebook className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400 mb-0 lg:mb-2" />
                        <div className="flex-1 lg:text-center">
                          <div className="text-white font-bold text-sm lg:text-base">Facebook</div>
                          <div className="text-blue-300 text-xs lg:text-sm">Like our page</div>
                        </div>
                      </a>
                    )}
                    {profile.twitter_url && (
                      <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 lg:flex-col lg:flex-1 lg:min-w-[150px] bg-gradient-to-br from-sky-500/20 to-cyan-500/20 border border-sky-500/30 rounded-xl lg:rounded-2xl p-4 hover:scale-105 transition-transform group">
                        <Twitter className="w-6 h-6 lg:w-8 lg:h-8 text-sky-400 mb-0 lg:mb-2" />
                        <div className="flex-1 lg:text-center">
                          <div className="text-white font-bold text-sm lg:text-base">Twitter</div>
                          <div className="text-sky-300 text-xs lg:text-sm">Follow updates</div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:space-y-6">
              {/* Status Card */}
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-2xl">
                <h3 className="text-white font-bold text-base lg:text-lg mb-3 lg:mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                  Profile Status
                </h3>
                <div className="space-y-3 lg:space-y-4">
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg lg:rounded-xl p-3 lg:p-4">
                    <div className="flex items-center justify-between mb-1 lg:mb-2">
                      <span className="text-green-400 font-bold text-sm lg:text-base">ACTIVE</span>
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 lg:w-5 lg:h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-green-300 text-xs">Your profile is live</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg lg:rounded-xl p-4 lg:p-6 text-center">
                    <div className="text-2xl lg:text-4xl font-black text-white mb-1 lg:mb-2">
                      {(() => {
                        let score = 0
                        if (profile.restaurant_name) score += 15
                        if (profile.cuisine_type) score += 10
                        if (profile.phone) score += 15
                        if (profile.email) score += 10
                        if (profile.address) score += 15
                        if (profile.description) score += 15
                        if (profile.specialty_dish) score += 10
                        if (profile.instagram_url || profile.facebook_url || profile.twitter_url) score += 10
                        return score + '%'
                      })()}
                    </div>
                    <div className="text-blue-300 font-semibold text-xs lg:text-sm">Profile Complete</div>
                    <div className="w-full bg-slate-700 rounded-full h-1 lg:h-2 mt-2 lg:mt-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 lg:h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(() => {
                            let score = 0
                            if (profile.restaurant_name) score += 15
                            if (profile.cuisine_type) score += 10
                            if (profile.phone) score += 15
                            if (profile.email) score += 10
                            if (profile.address) score += 15
                            if (profile.description) score += 15
                            if (profile.specialty_dish) score += 10
                            if (profile.instagram_url || profile.facebook_url || profile.twitter_url) score += 10
                            return score
                          })()}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg lg:rounded-xl p-3 lg:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <Star className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400 fill-yellow-400" />
                        <div>
                          <div className="text-white font-bold text-sm lg:text-base">{profile.rating}</div>
                          <div className="text-blue-300 text-xs">Avg Rating</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold text-sm lg:text-base">{profile.total_reviews}</div>
                        <div className="text-blue-300 text-xs">Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // EMPTY STATE
          <div className="text-center py-12 lg:py-20 px-4">
            <div className="relative w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-6 lg:mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl lg:rounded-3xl animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl lg:rounded-3xl flex items-center justify-center">
                <Utensils className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
              </div>
            </div>
            <h2 className="text-2xl lg:text-4xl font-black text-white mb-3 lg:mb-4">Create Your Profile</h2>
            <p className="text-blue-300 text-sm lg:text-lg mb-6 lg:mb-8 max-w-md mx-auto">
              Start building your digital presence and connect with customers online
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 lg:py-4 px-8 lg:px-10 rounded-xl lg:rounded-2xl transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/25 inline-flex items-center gap-2 lg:gap-3 text-sm lg:text-base"
            >
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5" />
              Get Started
            </button>
          </div>
        )}

        {/* EDIT MODAL */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-2 lg:p-4 overflow-y-auto safe-area-inset-top safe-area-inset-bottom">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500/30 rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-3xl my-2 lg:my-8 max-h-[95vh] lg:max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-blue-500/30 p-4 lg:p-6 rounded-t-2xl lg:rounded-t-3xl z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500/20 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <Edit3 className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                    </div>
                    <h2 className="text-xl lg:text-3xl font-black text-white">
                      {profile ? 'Edit Profile' : 'Create Profile'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-8 h-8 lg:w-10 lg:h-10 hover:bg-white/10 rounded-lg lg:rounded-xl transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4 lg:w-6 lg:h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-4 lg:p-8 overflow-y-auto max-h-[calc(95vh-120px)] lg:max-h-[calc(90vh-140px)]">
                <div className="space-y-4 lg:space-y-6">
                  {/* Basic Info Section */}
                  <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="text-white font-bold text-base lg:text-lg mb-3 lg:mb-4 flex items-center gap-2">
                      <Utensils className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                      Basic Information
                    </h3>
                    <div className="space-y-3 lg:space-y-4">
                      <div>
                        <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Restaurant Name *</label>
                        <input
                          type="text"
                          value={formData.restaurant_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, restaurant_name: e.target.value }))}
                          className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                          placeholder="The Golden Spoon"
                        />
                      </div>

                      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 lg:gap-4">
                        <div>
                          <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Cuisine Type *</label>
                          <input
                            type="text"
                            value={formData.cuisine_type}
                            onChange={(e) => setFormData(prev => ({ ...prev, cuisine_type: e.target.value }))}
                            className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                            placeholder="Italian, Indian, Multi-cuisine"
                          />
                        </div>

                        <div>
                          <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Ambiance</label>
                          <select
                            value={formData.ambiance}
                            onChange={(e) => setFormData(prev => ({ ...prev, ambiance: e.target.value }))}
                            className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                          >
                            <option value="Casual Dining">Casual Dining</option>
                            <option value="Fine Dining">Fine Dining</option>
                            <option value="Family Friendly">Family Friendly</option>
                            <option value="Quick Service">Quick Service</option>
                            <option value="Cafe">Cafe</option>
                            <option value="Bar & Lounge">Bar & Lounge</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-sm lg:text-base"
                          placeholder="Tell your story and what makes your restaurant special..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Chef's Signature Dish</label>
                        <input
                          type="text"
                          value={formData.specialty_dish}
                          onChange={(e) => setFormData(prev => ({ ...prev, specialty_dish: e.target.value }))}
                          className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                          placeholder="e.g., Signature Butter Chicken"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="text-white font-bold text-base lg:text-lg mb-3 lg:mb-4 flex items-center gap-2">
                      <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                      Contact Details
                    </h3>
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 lg:gap-4">
                        <div>
                          <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Phone Number *</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                            placeholder="+1 234 567 8900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Email</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                            placeholder="info@restaurant.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Website URL</label>
                        <input
                          type="url"
                          value={formData.website_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                          className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                          placeholder="https://yourrestaurant.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Address *</label>
                        <textarea
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          rows={2}
                          className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-sm lg:text-base"
                          placeholder="123 Main Street, City, State, ZIP"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="text-white font-bold text-base lg:text-lg mb-3 lg:mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                      Operating Hours
                    </h3>
                    <div className="space-y-3 lg:space-y-4">
                      <div>
                        <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Days Open</label>
                        <input
                          type="text"
                          value={formData.days_open}
                          onChange={(e) => setFormData(prev => ({ ...prev, days_open: e.target.value }))}
                          className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                          placeholder="e.g., Monday - Sunday"
                        />
                      </div>

                      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 lg:gap-4">
                        <div>
                          <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Opening Time</label>
                          <input
                            type="time"
                            value={formData.opening_time}
                            onChange={(e) => setFormData(prev => ({ ...prev, opening_time: e.target.value }))}
                            className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                          />
                        </div>

                        <div>
                          <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Closing Time</label>
                          <input
                            type="time"
                            value={formData.closing_time}
                            onChange={(e) => setFormData(prev => ({ ...prev, closing_time: e.target.value }))}
                            className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                          />
                        </div>

                        <div>
                          <label className="block text-xs lg:text-sm font-bold text-blue-300 mb-1 lg:mb-2">Avg Meal Time</label>
                          <input
                            type="text"
                            value={formData.average_meal_time}
                            onChange={(e) => setFormData(prev => ({ ...prev, average_meal_time: e.target.value }))}
                            className="w-full bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                            placeholder="45 mins"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="text-white font-bold text-base lg:text-lg mb-3 lg:mb-4 flex items-center gap-2">
                      <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                      Social Media
                    </h3>
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                          <Instagram className="w-4 h-4 lg:w-6 lg:h-6 text-pink-400" />
                        </div>
                        <input
                          type="url"
                          value={formData.instagram_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                          className="flex-1 bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                          placeholder="Instagram Profile URL"
                        />
                      </div>

                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                          <Facebook className="w-4 h-4 lg:w-6 lg:h-6 text-blue-400" />
                        </div>
                        <input
                          type="url"
                          value={formData.facebook_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                          className="flex-1 bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                          placeholder="Facebook Page URL"
                        />
                      </div>

                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-sky-500/20 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                          <Twitter className="w-4 h-4 lg:w-6 lg:h-6 text-sky-400" />
                        </div>
                        <input
                          type="url"
                          value={formData.twitter_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))}
                          className="flex-1 bg-slate-900 border border-blue-500/30 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm lg:text-base"
                          placeholder="Twitter Profile URL"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-blue-500/30 p-4 lg:p-6 rounded-b-2xl lg:rounded-b-3xl">
                <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 lg:py-4 rounded-lg lg:rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 lg:gap-3 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transform text-sm lg:text-base"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span>{profile ? 'Update Profile' : 'Create Profile'}</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 lg:px-8 py-3 lg:py-4 border-2 border-blue-500/40 text-blue-300 hover:text-white hover:border-blue-500/60 hover:bg-blue-500/10 rounded-lg lg:rounded-xl transition-all font-bold text-sm lg:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}