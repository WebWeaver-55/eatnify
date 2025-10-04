import { supabase } from '@/lib/supabase'

export interface MenuItem {
  id: string
  restaurant_id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url: string
  is_vegetarian: boolean
  is_spicy: boolean
  is_available: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export class MenuManager {
  static async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data || []
  }

  static async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([item])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  static async toggleAvailability(id: string, currentStatus: boolean): Promise<MenuItem> {
    return this.updateMenuItem(id, { is_available: !currentStatus })
  }
}