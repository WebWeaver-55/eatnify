'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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

    console.log('Fetching categories for email:', userEmail)

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('email', userEmail)
        .order('name')

      if (error) {
        console.error('Supabase categories fetch error:', error)
        throw error
      }

      console.log('Fetched categories:', data)
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

    console.log('Fetching menu items for email:', userEmail)

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('email', userEmail)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase menu items fetch error:', error)
        throw error
      }

      console.log('Fetched menu items:', data)
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

    try {
      let imageUrl = editingItem?.image_url || ''
      if (image) {
        console.log('Uploading image...')
        const fileExt = image.name.split('.').pop()
        const fileName = `menu/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('menu-images').upload(fileName, image)
        
        if (uploadError) {
          console.error('Image upload error:', uploadError)
          throw new Error(`Upload failed: ${uploadError.message}`)
        }
        
        const { data: { publicUrl } } = supabase.storage.from('menu-images').getPublicUrl(fileName)
        imageUrl = publicUrl
        console.log('Image uploaded, URL:', imageUrl)
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

      console.log('Saving menu item:', itemData)

      if (editingItem) {
        const { data, error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id)
          .select()

        if (error) {
          console.error('Supabase UPDATE error:', error)
          console.error('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          })
          throw error
        }
        console.log('Update successful:', data)
        setSuccess('✨ Updated!')
      } else {
        const { data, error } = await supabase
          .from('menu_items')
          .insert([itemData])
          .select()

        if (error) {
          console.error('Supabase INSERT error:', error)
          console.error('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          })
          throw error
        }
        console.log('Insert successful:', data)
        setSuccess('✨ Created!')
      }

      resetForm(); 
      await fetchMenuItems(); 
      setShowForm(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      console.error('Full error object:', error)
      console.error('Error message:', error.message)
      console.error('Error code:', error.code)
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
      console.log('Deleting menu item ID:', itemId)
      const item = menuItems.find(i => i.id === itemId)
      
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId)

      if (error) {
        console.error('Supabase DELETE error:', error)
        throw error
      }

      if (item?.image_url) {
        console.log('Deleting image for item:', item.image_url)
        const url = new URL(item.image_url)
        const pathParts = url.pathname.split('/menu-images/')
        if (pathParts[1]) {
          const { error: storageError } = await supabase.storage.from('menu-images').remove([pathParts[1]])
          if (storageError) {
            console.error('Image delete error:', storageError)
          }
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Please login first</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteModal({ show: false, itemId: null, itemName: '' })}></div>
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-3">Delete Item?</h3>
            <p className="text-gray-400 text-center mb-6">"{deleteModal.itemName}" will be permanently deleted</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ show: false, itemId: null, itemName: '' })} className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl font-semibold transition-all">Cancel</button>
              <button onClick={() => deleteModal.itemId && handleDelete(deleteModal.itemId)} disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50">
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Notifications */}
        {(error || success) && (
          <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in slide-in-from-top">
            {error && <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 mb-2"><p className="text-red-300 text-sm">⚠️ {error}</p></div>}
            {success && <div className="bg-green-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-4"><p className="text-green-300 text-sm">{success}</p></div>}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-2">Menu Matrix</h1>
          <p className="text-blue-200 text-sm">Neural food management system</p>
          <div className="flex justify-between items-center bg-blue-500/10 p-4 rounded-lg mt-4">
            <div className="text-left">
              <p className="text-gray-400 text-sm">Logged in as</p>
              <p className="text-white font-semibold">{userEmail}</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('userEmail')
                window.location.href = '/login'
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden mb-6 flex gap-2">
          <button onClick={() => setShowForm(true)} className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${showForm ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
            {editingItem ? 'Edit' : 'Create'}
          </button>
          <button onClick={() => setShowForm(false)} className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${!showForm ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
            Menu ({menuItems.length})
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className={`${showForm ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{editingItem ? '⚡ Edit Dish' : '✨ New Dish'}</h2>
                {editingItem && <button onClick={resetForm} className="text-gray-400 hover:text-white">✕</button>}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-blue-300 mb-3">Visual</label>
                  <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragActive ? 'border-blue-400 bg-blue-400/10' : 'border-blue-400/30 hover:border-blue-400'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-2xl mx-auto shadow-2xl" />
                        <button type="button" onClick={() => { setImage(null); setImagePreview('') }} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                          <span className="text-3xl">📸</span>
                        </div>
                        <div>
                          <p className="text-blue-300 text-sm mb-2">Drag & drop</p>
                          <label className="inline-block px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-300 hover:text-white cursor-pointer transition-all">
                            Browse
                            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Price */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-blue-300">Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-all" placeholder="Cosmic Pizza" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-blue-300">Price *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 font-bold">₹</span>
                      <input type="number" step="0.01" min="0" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-blue-500/10 border border-blue-500/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-all" placeholder="299" />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-300">Category *</label>
                  <select required value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all">
                    <option value="" className="bg-slate-800">Select category</option>
                    {categories.map((category) => <option key={category.id} value={category.id} className="bg-slate-800">{category.name}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-300">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-all resize-none" placeholder="Describe the magic..." />
                </div>

                {/* Food Type Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-300">Food Type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleVegToggle(true)}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        formData.is_vegetarian
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                      }`}
                    >
                      <span className="text-xl">🌱</span>
                      <span className="font-semibold text-sm">Vegetarian</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVegToggle(false)}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        formData.is_nonveg
                          ? 'bg-red-500/20 border-red-500 text-red-400'
                          : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                      }`}
                    >
                      <span className="text-xl">🍗</span>
                      <span className="font-semibold text-sm">Non-Veg</span>
                    </button>
                  </div>
                </div>

                {/* Availability */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_available: !formData.is_available })}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    formData.is_available
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-red-500/20 border-red-500 text-red-400'
                  }`}
                >
                  <span className="font-semibold">{formData.is_available ? '✓ Available' : '✕ Unavailable'}</span>
                  <div className={`w-14 h-7 rounded-full transition-all relative ${formData.is_available ? 'bg-green-500' : 'bg-red-500'}`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${formData.is_available ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </button>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 shadow-lg shadow-blue-500/25">
                    {loading ? (editingItem ? 'Updating...' : 'Creating...') : (editingItem ? '⚡ Update' : '✨ Create')}
                  </button>
                  {editingItem && <button type="button" onClick={resetForm} className="px-6 py-4 border-2 border-blue-500/30 text-blue-300 hover:text-white hover:border-blue-400 rounded-2xl transition-all font-semibold">Cancel</button>}
                </div>
              </form>
            </div>
          </div>

          {/* Menu Items List */}
          <div className={`${!showForm ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Menu Gallery</h2>
                <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
                  <span className="text-blue-400 font-bold">{menuItems.length}</span>
                </div>
              </div>

              {menuItems.length > 0 ? (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  {menuItems.map((item) => (
                    <div key={item.id} className="bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-400/30 rounded-2xl p-4 transition-all group">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {item.image_url ? <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-lg" /> : <div className="w-20 h-20 bg-blue-500/10 rounded-xl flex items-center justify-center"><span className="text-2xl">🍽️</span></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">{item.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xl font-black text-green-400">₹{item.price}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.is_available ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>{item.is_available ? '●' : '○'}</span>
                              </div>
                            </div>
                          </div>
                          {item.description && <p className="text-blue-200/80 text-xs line-clamp-2 mb-3">{item.description}</p>}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex gap-2">
                              {item.is_vegetarian && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold border border-green-500/30">🌱 Veg</span>}
                              {item.is_nonveg && <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold border border-red-500/30">🍗 Non-Veg</span>}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(item)} className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-bold border border-blue-500/30 transition-all hover:scale-105">Edit</button>
                              <button onClick={() => setDeleteModal({ show: true, itemId: item.id, itemName: item.name })} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold border border-red-500/30 transition-all hover:scale-105">Delete</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-blue-500/10 rounded-3xl flex items-center justify-center"><span className="text-5xl">🍽️</span></div>
                  <h4 className="text-xl font-bold text-white mb-2">No dishes yet</h4>
                  <p className="text-blue-200 mb-6">Start creating your menu</p>
                  <button onClick={() => setShowForm(true)} className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:scale-105 transition-transform">Create First Dish</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}