'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, RefreshCw, LogOut, AlertCircle, CheckCircle, X } from 'lucide-react'

interface Category {
  id: string
  email: string
  name: string
  description: string
  display_order: number
  created_at: string
}

export default function CategoryForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '', 
    description: '',
    display_order: 0
  })
  const [loading, setLoading] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showLimitWarning, setShowLimitWarning] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ show: false, categoryId: null as string | null, categoryName: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const MAX_CATEGORIES = 10

  // Set mounted state and get user email after component mounts
  useEffect(() => {
    setMounted(true)
    const email = localStorage.getItem('userEmail')
    setUserEmail(email)
  }, [])

  // Fetch categories when userEmail is available
  useEffect(() => {
    if (userEmail) {
      fetchCategories()
    }
  }, [userEmail])

  // Fetch categories for this email
  const fetchCategories = async () => {
    if (!userEmail) {
      setError('No email found')
      return
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('email', userEmail)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Supabase fetch error:', error)
        setError('Failed to fetch categories')
        throw error
      }

      setCategories(data || [])
      
      // Set next display order
      if (data && data.length > 0) {
        const maxOrder = Math.max(...data.map(c => c.display_order))
        setFormData(prev => ({ ...prev, display_order: maxOrder + 1 }))
      } else {
        setFormData(prev => ({ ...prev, display_order: 0 }))
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userEmail) {
      setError('Please login first')
      return
    }

    // Check category limit for new categories (not editing)
    if (!editingCategory && categories.length >= MAX_CATEGORIES) {
      setShowLimitWarning(true)
      setTimeout(() => setShowLimitWarning(false), 5000)
      return
    }

    if (!formData.name.trim()) {
      setError('Category name is required')
      setTimeout(() => setError(''), 3000)
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        display_order: formData.display_order,
        email: userEmail
      }

      if (editingCategory) {
        const { data, error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id)
          .select()

        if (error) throw error
        setSuccess('Category updated successfully!')
      } else {
        const { data, error } = await supabase
          .from('categories')
          .insert([categoryData])
          .select()

        if (error) throw error
        setSuccess('Category created successfully!')
      }
      
      resetForm()
      await fetchCategories()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      console.error('Error saving category:', error)
      setError(error.message || 'Failed to save category')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.display_order)) + 1 : 0
    setFormData({ 
      name: '', 
      description: '',
      display_order: nextOrder
    })
    setEditingCategory(null)
    setError('')
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      display_order: category.display_order
    })
  }

  const handleDelete = async (categoryId: string) => {
    setLoading(true)
    setError('')
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error
      
      setSuccess('Category deleted successfully!')
      setDeleteModal({ show: false, categoryId: null, categoryName: '' })
      await fetchCategories()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      console.error('Delete error:', error)
      setError(`Delete failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    window.location.href = '/login'
  }

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200 text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if no user email
  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center bg-slate-800/50 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 max-w-md w-full">
          <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-400/30">
            <AlertCircle className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-blue-200 mb-6">Please login to manage your categories</p>
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
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteModal({ show: false, categoryId: null, categoryName: '' })}></div>
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-red-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-3">Delete Category?</h3>
            <p className="text-gray-400 text-center mb-6 text-sm">"{deleteModal.categoryName}" will be permanently deleted</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModal({ show: false, categoryId: null, categoryName: '' })} 
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl font-semibold transition-all text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteModal.categoryId && handleDelete(deleteModal.categoryId)} 
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold transition-all text-sm disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
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
                  <p className="text-amber-300 text-sm font-semibold">Category Limit Reached</p>
                  <p className="text-amber-300/80 text-xs">You can only create up to {MAX_CATEGORIES} categories on the Starter plan.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-6 sm:p-8 mb-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
              🍽️ Menu Categories
            </h1>
            <p className="text-blue-200 text-sm sm:text-base">
              Organize your menu with categories (Max: {MAX_CATEGORIES})
            </p>
          </div>
          
          {/* User Info Card */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-left">
                <p className="text-blue-200 text-sm">Logged in as</p>
                <p className="text-white font-semibold text-sm sm:text-base truncate">{userEmail}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-blue-300 text-sm">Categories: {categories.length}/{MAX_CATEGORIES}</span>
                  {categories.length >= MAX_CATEGORIES && (
                    <span className="text-amber-300 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Limit Reached
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={fetchCategories}
                  className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 sm:px-4 py-2 rounded-lg border border-green-400/30 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 sm:px-4 py-2 rounded-lg border border-red-400/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-blue-400/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-400/30">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
              </div>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 text-white rounded-lg sm:rounded-xl border border-blue-400/20 focus:border-blue-500 focus:outline-none backdrop-blur-sm"
                  placeholder="e.g., Appetizers, Main Course, Desserts"
                  disabled={!editingCategory && categories.length >= MAX_CATEGORIES}
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 text-white rounded-lg sm:rounded-xl border border-blue-400/20 focus:border-blue-500 focus:outline-none backdrop-blur-sm"
                  disabled={!editingCategory && categories.length >= MAX_CATEGORIES}
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 text-white rounded-lg sm:rounded-xl border border-blue-400/20 focus:border-blue-500 focus:outline-none resize-none backdrop-blur-sm"
                  placeholder="Describe this category..."
                  disabled={!editingCategory && categories.length >= MAX_CATEGORIES}
                />
              </div>

              {/* Limit Info */}
              {!editingCategory && (
                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-300 text-sm">Categories used:</span>
                    <span className="text-white font-semibold text-sm">
                      {categories.length}/{MAX_CATEGORIES}
                    </span>
                  </div>
                  <div className="w-full bg-blue-500/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(categories.length / MAX_CATEGORIES) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || !formData.name.trim() || (!editingCategory && categories.length >= MAX_CATEGORIES)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {editingCategory ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    editingCategory ? 'Update Category' : 'Create Category'
                  )}
                </button>
                
                {editingCategory && (
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

          {/* Categories List */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-blue-400/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-400/30">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                </div>
                Your Categories
              </h2>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-bold text-sm border border-blue-400/30">
                {categories.length}/{MAX_CATEGORIES}
              </span>
            </div>

            {categories.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 max-h-[500px] overflow-y-auto">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="bg-slate-700/30 p-3 sm:p-4 rounded-xl border border-blue-400/10 hover:border-blue-400/30 transition-all backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2 truncate">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-blue-200 text-sm mb-2 sm:mb-3 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-blue-300">
                          <span>Order: {category.display_order}</span>
                          <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(category)}
                          className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 p-2 rounded-lg border border-yellow-400/30 transition-all"
                          title="Edit category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, categoryId: category.id, categoryName: category.name })}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-lg border border-red-400/30 transition-all"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
                  <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-blue-300" />
                </div>
                <h3 className="text-white text-lg sm:text-xl font-bold mb-2">No categories yet</h3>
                <p className="text-blue-200 text-sm sm:text-base">Create your first category to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}