'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, AlertCircle, RefreshCw, LogOut, CheckCircle, X } from 'lucide-react'

interface Category { id: string; name: string }
interface MenuItem {
  id: string; name: string; description: string; price: number;
  category_id: string; image_url: string; is_vegetarian: boolean;
  is_nonveg: boolean; is_available: boolean; email: string;
}

export default function MenuItemForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category_id: '',
    is_vegetarian: false, is_nonveg: false, is_available: true
  })
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [deleteModal, setDeleteModal] = useState({ show: false, itemId: null as string | null, itemName: '' })
  const [showLimitWarning, setShowLimitWarning] = useState(false)

  const MAX_MENU_ITEMS = 50

  // Get user email from localStorage
  const getUserEmail = () => {
    return localStorage.getItem('userEmail')
  }

  useEffect(() => {
    fetchCategories()
    fetchMenuItems()
  }, [])

  const fetchCategories = async () => {
    const userEmail = getUserEmail()
    if (!userEmail) {
      console.error('No email found in localStorage')
      alert('Please login first')
      window.location.href = '/login'
      return
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('email', userEmail)
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  const fetchMenuItems = async () => {
    const userEmail = getUserEmail()
    if (!userEmail) {
      console.error('No email found in localStorage')
      alert('Please login first')
      window.location.href = '/login'
      return
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('email', userEmail)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMenuItems(data || [])
    } catch (error) {
      console.error('Error fetching menu items:', error)
      setMenuItems([])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) return setError('Image too large')
    if (!file.type.startsWith('image/')) return setError('Select image file')
    setImage(file); setError(''); setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true); 
    setError(''); 
    setSuccess('')

    const userEmail = getUserEmail()
    if (!userEmail) {
      console.error('No user email found')
      alert('Please login first')
      setLoading(false)
      return
    }

    // Check menu item limit for new items (not editing)
    if (!editingItem && menuItems.length >= MAX_MENU_ITEMS) {
      setShowLimitWarning(true)
      setTimeout(() => setShowLimitWarning(false), 5000)
      setLoading(false)
      return
    }

    if (!formData.name.trim()) {
      alert('Menu item name is required')
      setLoading(false)
      return
    }

    try {
      let imageUrl = editingItem?.image_url || ''
      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `menu/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('menu-images').upload(fileName, image)
        
        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)
        
        const { data: { publicUrl } } = supabase.storage.from('menu-images').getPublicUrl(fileName)
        imageUrl = publicUrl
      }

      const itemData = {
        name: formData.name, 
        description: formData.description, 
        price: parseFloat(formData.price),
        category_id: formData.category_id, 
        is_vegetarian: formData.is_vegetarian,
        is_nonveg: formData.is_nonveg, 
        is_available: formData.is_available, 
        image_url: imageUrl,
        email: userEmail
      }

      if (editingItem) {
        const { data, error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id)
          .select()
        if (error) throw error
        setSuccess('✨ Updated!')
      } else {
        const { data, error } = await supabase
          .from('menu_items')
          .insert([itemData])
          .select()
        if (error) throw error
        setSuccess('✨ Created!')
      }

      resetForm(); 
      await fetchMenuItems(); 
      setShowForm(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      console.error('Error saving menu item:', error)
      setError(error.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ 
      name: '', 
      description: '', 
      price: '', 
      category_id: '', 
      is_vegetarian: false, 
      is_nonveg: false, 
      is_available: true 
    })
    setImage(null); 
    setImagePreview(''); 
    setEditingItem(null); 
    setError('')
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name, 
      description: item.description || '', 
      price: item.price.toString(),
      category_id: item.category_id, 
      is_vegetarian: item.is_vegetarian,
      is_nonveg: item.is_nonveg, 
      is_available: item.is_available
    })
    setImagePreview(item.image_url || '')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (itemId: string) => {
    setLoading(true)
    try {
      const item = menuItems.find(i => i.id === itemId)
      
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId)
      if (error) throw error

      if (item?.image_url) {
        const url = new URL(item.image_url)
        const pathParts = url.pathname.split('/menu-images/')
        if (pathParts[1]) {
          await supabase.storage.from('menu-images').remove([pathParts[1]])
        }
      }
      
      setSuccess('🗑️ Deleted!'); 
      setDeleteModal({ show: false, itemId: null, itemName: '' })
      await fetchMenuItems(); 
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      console.error('Delete error:', error)
      setError(`Delete failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle veg/nonveg toggle logic
  const handleVegToggle = (isVeg: boolean) => {
    if (isVeg) {
      setFormData({ ...formData, is_vegetarian: true, is_nonveg: false })
    } else {
      setFormData({ ...formData, is_vegetarian: false, is_nonveg: true })
    }
  }

  const userEmail = getUserEmail()

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center bg-slate-800/50 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 max-w-md w-full">
          <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-400/30">
            <AlertCircle className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-blue-200 mb-6">Please login to manage your menu</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteModal({ show: false, itemId: null, itemName: '' })}></div>
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-red-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-3">Delete Item?</h3>
            <p className="text-gray-400 text-center mb-6 text-sm">"{deleteModal.itemName}" will be permanently deleted</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ show: false, itemId: null, itemName: '' })} className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl font-semibold transition-all text-sm">Cancel</button>
              <button onClick={() => deleteModal.itemId && handleDelete(deleteModal.itemId)} disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold transition-all text-sm disabled:opacity-50">
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Notifications */}
        {(error || success || showLimitWarning) && (
          <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in slide-in-from-top">
            {error && (
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 mb-2 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
                <p className="text-red-300 text-sm flex-1">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-4 mb-2 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                <p className="text-green-300 text-sm flex-1">{success}</p>
              </div>
            )}
            {showLimitWarning && (
              <div className="bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-amber-300 text-sm font-semibold">Menu Limit Reached</p>
                  <p className="text-amber-300/80 text-xs">You can only create up to {MAX_MENU_ITEMS} items on the Starter plan.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-6 sm:p-8 mb-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
              🍽️ Menu Items
            </h1>
            <p className="text-blue-200 text-sm sm:text-base">
              Manage your menu items (Max: {MAX_MENU_ITEMS})
            </p>
          </div>
          
          {/* User Info Card */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-left">
                <p className="text-blue-200 text-sm">Logged in as</p>
                <p className="text-white font-semibold text-sm sm:text-base truncate">{userEmail}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-blue-300 text-sm">Items: {menuItems.length}/{MAX_MENU_ITEMS}</span>
                  {menuItems.length >= MAX_MENU_ITEMS && (
                    <span className="text-amber-300 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Limit Reached
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={fetchMenuItems}
                  className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 sm:px-4 py-2 rounded-lg border border-green-400/30 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('userEmail')
                    window.location.href = '/login'
                  }}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 sm:px-4 py-2 rounded-lg border border-red-400/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden mb-6 flex gap-2">
          <button 
            onClick={() => setShowForm(true)} 
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
              showForm 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                : 'bg-white/5 text-gray-400 border border-white/10'
            }`}
          >
            {editingItem ? 'Edit' : 'Create'}
          </button>
          <button 
            onClick={() => setShowForm(false)} 
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
              !showForm 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                : 'bg-white/5 text-gray-400 border border-white/10'
            }`}
          >
            Menu ({menuItems.length})
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Form Section */}
          <div className={`${showForm ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-slate-800/40 backdrop-blur-xl border border-blue-400/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-400/30">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                  </div>
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h2>
                {editingItem && (
                  <button onClick={resetForm} className="text-gray-400 hover:text-white p-2">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-blue-300 mb-2">Item Image</label>
                  <div 
                    className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all ${
                      dragActive ? 'border-blue-400 bg-blue-400/10' : 'border-blue-400/30 hover:border-blue-400'
                    }`} 
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="space-y-3 sm:space-y-4">
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl mx-auto shadow-lg" />
                        <button type="button" onClick={() => { setImage(null); setImagePreview('') }} className="text-red-400 hover:text-red-300 text-xs sm:text-sm">Remove Image</button>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                          <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-300 text-xs sm:text-sm mb-2">Drag & drop or click to upload</p>
                          <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-white cursor-pointer transition-all text-xs sm:text-sm">
                            <Upload className="w-4 h-4" />
                            Browse Files
                            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Price */}
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-blue-300">Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full bg-slate-700/50 border border-blue-400/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-all backdrop-blur-sm" 
                      placeholder="Item name" 
                      disabled={!editingItem && menuItems.length >= MAX_MENU_ITEMS}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-blue-300">Price *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        required 
                        value={formData.price} 
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                        className="w-full bg-slate-700/50 border border-blue-400/20 rounded-lg sm:rounded-xl pl-8 pr-3 sm:px-4 py-2 sm:py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-all backdrop-blur-sm" 
                        placeholder="0.00"
                        disabled={!editingItem && menuItems.length >= MAX_MENU_ITEMS}
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-300">Category *</label>
                  <select 
                    required 
                    value={formData.category_id} 
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} 
                    className="w-full bg-slate-700/50 border border-blue-400/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-400 transition-all backdrop-blur-sm"
                    disabled={!editingItem && menuItems.length >= MAX_MENU_ITEMS}
                  >
                    <option value="" className="bg-slate-800">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id} className="bg-slate-800">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-300">Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    rows={3} 
                    className="w-full bg-slate-700/50 border border-blue-400/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-all resize-none backdrop-blur-sm" 
                    placeholder="Item description..."
                    disabled={!editingItem && menuItems.length >= MAX_MENU_ITEMS}
                  />
                </div>

                {/* Food Type Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-300">Food Type *</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => handleVegToggle(true)}
                      disabled={!editingItem && menuItems.length >= MAX_MENU_ITEMS}
                      className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                        formData.is_vegetarian
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-slate-700/50 border-blue-400/20 text-blue-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-sm">🌱</span>
                      <span className="font-semibold text-xs sm:text-sm">Vegetarian</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVegToggle(false)}
                      disabled={!editingItem && menuItems.length >= MAX_MENU_ITEMS}
                      className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                        formData.is_nonveg
                          ? 'bg-red-500/20 border-red-500 text-red-400'
                          : 'bg-slate-700/50 border-blue-400/20 text-blue-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-sm">🍗</span>
                      <span className="font-semibold text-xs sm:text-sm">Non-Veg</span>
                    </button>
                  </div>
                </div>

                {/* Availability Toggle */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_available: !formData.is_available })}
                  disabled={!editingItem && menuItems.length >= MAX_MENU_ITEMS}
                  className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                    formData.is_available
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-red-500/20 border-red-500 text-red-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="font-semibold text-sm sm:text-base">
                    {formData.is_available ? '✓ Available' : '✕ Unavailable'}
                  </span>
                  <div className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all relative ${
                    formData.is_available ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <div className={`absolute top-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-transform ${
                      formData.is_available ? 'right-1' : 'left-1'
                    }`}></div>
                  </div>
                </button>

                {/* Limit Info */}
                {!editingItem && (
                  <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-300 text-sm">Menu items used:</span>
                      <span className="text-white font-semibold text-sm">
                        {menuItems.length}/{MAX_MENU_ITEMS}
                      </span>
                    </div>
                    <div className="w-full bg-blue-500/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(menuItems.length / MAX_MENU_ITEMS) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit" 
                    disabled={loading || !formData.name.trim() || (!editingItem && menuItems.length >= MAX_MENU_ITEMS)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {editingItem ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : (
                      editingItem ? 'Update Item' : 'Create Item'
                    )}
                  </button>
                  
                  {editingItem && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 sm:px-6 py-3 bg-slate-600/50 hover:bg-slate-600 text-white rounded-lg transition-all border border-slate-500/30 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Menu Items List */}
          <div className={`${!showForm ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-slate-800/40 backdrop-blur-xl border border-blue-400/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-400/30">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                  </div>
                  Your Menu Items
                </h2>
                <div className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full">
                  <span className="text-blue-300 font-bold text-sm sm:text-base">{menuItems.length}/{MAX_MENU_ITEMS}</span>
                </div>
              </div>

              {menuItems.length > 0 ? (
                <div className="space-y-3 sm:space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  {menuItems.map((item) => (
                    <div key={item.id} className="bg-slate-700/30 hover:bg-slate-700/50 border border-blue-400/10 hover:border-blue-400/30 rounded-xl p-3 sm:p-4 transition-all group">
                      <div className="flex gap-3 sm:gap-4">
                        <div className="flex-shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-lg" />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-400/20">
                              <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg sm:text-xl font-black text-green-400">₹{item.price}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                  item.is_available 
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                  {item.is_available ? 'Available' : 'Unavailable'}
                                </span>
                              </div>
                            </div>
                          </div>
                          {item.description && (
                            <p className="text-blue-200/80 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex gap-1 sm:gap-2">
                              {item.is_vegetarian && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold border border-green-500/30">
                                  🌱 Veg
                                </span>
                              )}
                              {item.is_nonveg && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold border border-red-500/30">
                                  🍗 Non-Veg
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1 sm:gap-2">
                              <button 
                                onClick={() => handleEdit(item)} 
                                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-bold border border-blue-500/30 transition-all"
                              >
                                <Edit className="w-3 h-3" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button 
                                onClick={() => setDeleteModal({ show: true, itemId: item.id, itemName: item.name })} 
                                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold border border-red-500/30 transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-400/30">
                    <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-blue-300" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">No menu items yet</h4>
                  <p className="text-blue-200 text-sm sm:text-base mb-4 sm:mb-6">Start creating your menu items</p>
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Item
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}