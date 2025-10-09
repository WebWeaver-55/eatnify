'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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
      console.error('No email found')
      return
    }

    console.log('Fetching categories for email:', userEmail)

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('email', userEmail)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Supabase fetch error:', error)
        throw error
      }

      console.log('Fetched categories:', data)
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
      console.error('No user email found')
      alert('Please login first')
      return
    }

    if (!formData.name.trim()) {
      alert('Category name is required')
      return
    }

    setLoading(true)
    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        display_order: formData.display_order,
        email: userEmail
      }

      console.log('Attempting to save category:', categoryData)

      if (editingCategory) {
        const { data, error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id)
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
      } else {
        const { data, error } = await supabase
          .from('categories')
          .insert([categoryData])
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
      }
      
      resetForm()
      await fetchCategories()
      alert(editingCategory ? 'Category updated!' : 'Category created!')
    } catch (error: any) {
      console.error('Full error object:', error)
      console.error('Error message:', error.message)
      console.error('Error code:', error.code)
      alert(`Error saving category: ${error.message || 'Unknown error'}`)
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
    if (!confirm('Are you sure you want to delete this category?')) return
    
    try {
      console.log('Deleting category ID:', categoryId)
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) {
        console.error('Supabase DELETE error:', error)
        throw error
      }
      
      await fetchCategories()
      alert('Category deleted!')
    } catch (error: any) {
      console.error('Delete error:', error)
      alert(`Error deleting category: ${error.message}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    window.location.href = '/login'
  }

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if no user email
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
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🍽️ Menu Categories
          </h1>
          
          <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-4">
            <div className="text-left">
              <p className="text-gray-400">Logged in as</p>
              <p className="text-white font-semibold">{userEmail}</p>
              <p className="text-gray-400 text-sm">Categories: {categories.length}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={fetchCategories}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                🔄 Refresh
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingCategory ? '✏️ Edit Category' : '➕ Add New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Appetizers, Main Course, Desserts"
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
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Describe this category..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || !formData.name.trim()}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {editingCategory ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    editingCategory ? '💾 Update Category' : '✨ Create Category'
                  )}
                </button>
                
                {editingCategory && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    ❌ Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                📁 Your Categories
              </h2>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full font-bold">
                {categories.length}
              </span>
            </div>

            {categories.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">
                          🍽️ {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-gray-300 text-sm mb-3">
                            {category.description}
                          </p>
                        )}
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>Order: {category.display_order}</span>
                          <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(category)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-white text-xl font-bold mb-2">No categories yet</h3>
                <p className="text-gray-400">Create your first category to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}