import { supabase } from '@/lib/supabase'
import DashboardHeader from '../components/DashboardHeader'
import CategoryForm from '../components/CategoryForm'

export default async function StarterCategoriesPage() {
  const { data: categories } = await supabase
    .from('categories')
    .select(`
      *,
      menu_items (id)
    `)
    .order('sort_order', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <CategoryForm categories={categories || []} />
    </div>
  )
}