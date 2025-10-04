import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { MenuItem } from './supabase';

export const sortMenuItems = (
  items: MenuItem[],
  sortBy: 'name' | 'price' | 'recent'
): MenuItem[] => {
  const sorted = [...items];
  
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);
    case 'recent':
      return sorted.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    default:
      return sorted;
  }
};

export const filterMenuItems = (
  items: MenuItem[],
  filters: {
    searchTerm?: string;
    categoryId?: string;
    isVeg?: boolean;
    isBestseller?: boolean;
    isAvailable?: boolean;
  }
): MenuItem[] => {
  return items.filter(item => {
    // Search filter
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      const matchesName = item.name.toLowerCase().includes(search);
      const matchesDescription = item.description?.toLowerCase().includes(search);
      if (!matchesName && !matchesDescription) return false;
    }

    // Category filter
    if (filters.categoryId && item.category_id !== filters.categoryId) {
      return false;
    }

    // Veg filter
    if (filters.isVeg !== undefined && item.is_veg !== filters.isVeg) {
      return false;
    }

    // Bestseller filter
    if (filters.isBestseller !== undefined && item.is_bestseller !== filters.isBestseller) {
      return false;
    }

    // Availability filter
    if (filters.isAvailable !== undefined && item.is_available !== filters.isAvailable) {
      return false;
    }

    return true;
  });
};

export const formatPrice = (price: number): string => {
  return `₹${price.toFixed(2)}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, or WebP)'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size should be less than 5MB'
    };
  }

  return { valid: true };
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const calculateStats = (items: MenuItem[]) => {
  return {
    total: items.length,
    available: items.filter(item => item.is_available).length,
    unavailable: items.filter(item => !item.is_available).length,
    veg: items.filter(item => item.is_veg).length,
    nonVeg: items.filter(item => !item.is_veg).length,
    bestsellers: items.filter(item => item.is_bestseller).length,
    averagePrice: items.length > 0
      ? items.reduce((sum, item) => sum + item.price, 0) / items.length
      : 0,
    totalValue: items.reduce((sum, item) => sum + item.price, 0)
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};