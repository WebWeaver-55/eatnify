import { supabase } from '@/lib/supabase'

export class ImageUploader {
  static async uploadMenuImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName)
    
    return publicUrl
  }

  static async uploadRestaurantImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `restaurant-${Math.random()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('restaurant-images')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('restaurant-images')
      .getPublicUrl(fileName)
    
    return publicUrl
  }

  static async deleteImage(imageUrl: string): Promise<void> {
    const fileName = imageUrl.split('/').pop()
    if (!fileName) return

    const { error } = await supabase.storage
      .from('menu-images')
      .remove([fileName])

    if (error) console.error('Error deleting image:', error)
  }
}