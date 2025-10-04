import { supabase } from '@/lib/supabase'
import DashboardHeader from '../components/DashboardHeader'
import MenuItemForm from '../components/MenuItemForm'

export const revalidate = 0 // Disable caching for real-time data

export default async function StarterMenuPage() {
  // Fetch menu items with category names
  const { data: menuItems, error: menuError } = await supabase
    .from('menu_items')
    .select(`
      *,
      categories (name)
    `)
    .order('created_at', { ascending: false })

  // Fetch all categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Log errors for debugging
  if (menuError) console.error('Error fetching menu items:', menuError)
  if (catError) console.error('Error fetching categories:', catError)

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      
      <MenuItemForm 
        categories={categories || []} 
        menuItems={menuItems || []} 
      />
    </div>
  )
}