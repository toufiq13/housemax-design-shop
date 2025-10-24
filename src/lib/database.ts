import { supabase } from '../supabase';
import type { Database } from '@/integrations/supabase/types';
import openaiService from './openai';
import { unsplashService } from './unsplash';

type Tables = Database['public']['Tables'];
type Product = Tables['products']['Row'];
type Category = Tables['categories']['Row'];
type Subcategory = Tables['subcategories']['Row'];
type UserProfile = Tables['user_profiles']['Row'];
type UserAddress = Tables['user_addresses']['Row'];
type UserPreferences = Tables['user_preferences']['Row'];
type SearchHistory = Tables['search_history']['Row'];
type UserFavorite = Tables['user_favorites']['Row'];
type CartItem = Tables['cart_items']['Row'];
type Order = Tables['orders']['Row'];
type OrderItem = Tables['order_items']['Row'];
type DesignConsultation = Tables['design_consultations']['Row'];

// Product operations
export const productService = {
  // Get all products with optional filters
  async getProducts(filters?: {
    category?: string;
    subcategory?: string;
    trending?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name),
        subcategories(name)
      `)
      .eq('is_active', true);

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.subcategory) {
      query = query.eq('subcategory_id', filters.subcategory);
    }

    if (filters?.trending !== undefined) {
      query = query.eq('trending', filters.trending);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get single product by ID
  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name),
        subcategories(name)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  },

  // Get trending products
  async getTrendingProducts(limit = 8) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name),
        subcategories(name)
      `)
      .eq('is_active', true)
      .eq('trending', true)
      .order('popularity', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get recommended products based on user preferences
  async getRecommendedProducts(userId: string, limit = 8) {
    // Get user preferences
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('favorite_style, room_types')
      .eq('user_id', userId)
      .single();

    // Get user search history
    const { data: searchHistory } = await supabase
      .from('search_history')
      .select('query, category')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name),
        subcategories(name)
      `)
      .eq('is_active', true);

    // If user has preferences, filter by them
    if (preferences?.favorite_style) {
      query = query.contains('tags', [preferences.favorite_style]);
    }

    // If user has search history, prioritize those categories
    if (searchHistory && searchHistory.length > 0) {
      const categories = [...new Set(searchHistory.map(s => s.category).filter(Boolean))];
      if (categories.length > 0) {
        query = query.in('category_id', categories);
      }
    }

    const { data, error } = await query
      .order('popularity', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Create product (admin only)
  async createProduct(product: Omit<Tables['products']['Insert'], 'id'>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update product (admin only)
  async updateProduct(id: string, updates: Tables['products']['Update']) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete product (admin only)
  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Category operations
export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        subcategories(*)
      `)
      .order('name');

    if (error) throw error;
    return data;
  },

  async getSubcategories(categoryId?: string) {
    let query = supabase.from('subcategories').select('*');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data;
  }
};

// User profile operations
export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Tables['user_profiles']['Update']) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAddresses(userId: string) {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addAddress(userId: string, address: Omit<Tables['user_addresses']['Insert'], 'id' | 'user_id'>) {
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({ ...address, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAddress(addressId: string, updates: Tables['user_addresses']['Update']) {
    const { data, error } = await supabase
      .from('user_addresses')
      .update(updates)
      .eq('id', addressId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAddress(addressId: string) {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId);

    if (error) throw error;
  },

  async getPreferences(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  async updatePreferences(userId: string, preferences: Tables['user_preferences']['Insert']) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ ...preferences, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Search history operations
export const searchService = {
  async addSearchHistory(userId: string, query: string, category?: string) {
    const { data, error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        query,
        category
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSearchHistory(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async clearSearchHistory(userId: string) {
    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }
};

// Favorites operations
export const favoritesService = {
  async getFavorites(userId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addFavorite(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        product_id: productId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFavorite(userId: string, productId: string) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
  },

  async isFavorite(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};

// Cart operations
export const cartService = {
  async getCartItems(userId: string) {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addToCart(userId: string, productId: string, quantity = 1) {
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  async updateCartItem(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromCart(cartItemId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
  },

  async clearCart(userId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }
};

// Order operations
export const orderService = {
  async createOrder(userId: string, orderData: {
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    totalAmount: number;
    shippingAddress: Record<string, unknown>;
    billingAddress: Record<string, unknown>;
    notes?: string;
  }) {
    // Generate order number
    const { data: orderNumber } = await supabase.rpc('generate_order_number');

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        ...orderData
      })
      .select()
      .single();

    if (error) throw error;
    return order;
  },

  async addOrderItem(orderId: string, item: {
    productId?: string;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
  }) {
    const { data, error } = await supabase
      .from('order_items')
      .insert({
        order_id: orderId,
        ...item
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrder(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  }
};

// Design consultation operations
export const consultationService = {
  async createConsultation(consultation: Tables['design_consultations']['Insert']) {
    const { data, error } = await supabase
      .from('design_consultations')
      .insert(consultation)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getConsultations(userId?: string) {
    let query = supabase.from('design_consultations').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateConsultation(id: string, updates: Tables['design_consultations']['Update']) {
    const { data, error } = await supabase
      .from('design_consultations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Admin operations
export const adminService = {
  async getStats() {
    const [
      { count: totalProducts },
      { count: totalUsers },
      { count: totalOrders },
      { count: trendingProducts },
      { count: lowStockItems }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('trending', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock_quantity', 10)
    ]);

    // Calculate total revenue
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid');

    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

    return {
      totalProducts: totalProducts || 0,
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      trendingProducts: trendingProducts || 0,
      lowStockItems: lowStockItems || 0
    };
  }
};

// AI-powered recommendation services
export const aiRecommendationService = {
  async getPersonalizedRecommendations(
    userId: string,
    userPreferences: string,
    roomType: string,
    style: string
  ) {
    try {
      // Get user's purchase history and preferences
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: purchaseHistory } = await supabase
        .from('orders')
        .select(`
          order_items (
            products (
              name,
              category,
              subcategory,
              price,
              description
            )
          )
        `)
        .eq('user_id', userId);

      // Generate AI recommendations
      const aiRecommendations = await openaiService.generateProductRecommendations(
        userPreferences,
        roomType,
        style
      );

      // Get trending products as fallback
      const { data: trendingProducts } = await supabase
        .from('products')
        .select('*')
        .eq('trending', true)
        .limit(8);

      return {
        aiRecommendations,
        trendingProducts: trendingProducts || [],
        purchaseHistory: purchaseHistory || []
      };
    } catch (error) {
      console.error('AI recommendation error:', error);
      // Fallback to trending products
      const { data: trendingProducts } = await supabase
        .from('products')
        .select('*')
        .eq('trending', true)
        .limit(8);

      return {
        aiRecommendations: "I'd be happy to help you find the perfect products for your space! Please browse our trending items below.",
        trendingProducts: trendingProducts || [],
        purchaseHistory: []
      };
    }
  },

  async generateDesignIdeas(roomDescription: string, budget: string, style: string) {
    try {
      return await openaiService.generateDesignIdeas(roomDescription, budget, style);
    } catch (error) {
      console.error('AI design ideas error:', error);
      return "I'd be happy to help you with design ideas! Please try our 3D planner or browse our product categories for inspiration.";
    }
  },

  async analyzeRoomImage(imageDescription: string) {
    try {
      return await openaiService.analyzeRoomImage(imageDescription);
    } catch (error) {
      console.error('AI room analysis error:', error);
      return "I'd be happy to analyze your room and provide design recommendations! Please try our 3D planner for a more detailed analysis.";
    }
  }
};

// Unsplash image enhancement service
export const imageEnhancementService = {
  async enhanceProductImages(products: Product[]): Promise<Product[]> {
    try {
      const enhancedProducts = await Promise.all(
        products.map(async (product) => {
          try {
            // Search for better images based on product name and category
            const searchQuery = `${product.name} ${product.category}`;
            const imageResults = await unsplashService.searchPhotos(searchQuery, 1, 1, 'squarish');
            
            if (imageResults.results.length > 0) {
              const betterImage = imageResults.results[0];
              return {
                ...product,
                image: unsplashService.getOptimizedImageUrl(betterImage, 'regular'),
                image_alt: betterImage.alt_description || product.name,
                image_credit: `Photo by ${betterImage.user.name} on Unsplash`,
              };
            }
            
            return product;
          } catch (error) {
            console.error(`Error enhancing image for product ${product.id}:`, error);
            return product;
          }
        })
      );

      return enhancedProducts;
    } catch (error) {
      console.error('Error enhancing product images:', error);
      return products;
    }
  },

  async getInteriorDesignImages(roomType: string, style: string = 'modern'): Promise<any[]> {
    try {
      const results = await unsplashService.getInteriorDesignPhotos(roomType, style, 1, 10);
      return results.results.map(photo => ({
        id: photo.id,
        url: unsplashService.getOptimizedImageUrl(photo, 'regular'),
        thumb: unsplashService.getOptimizedImageUrl(photo, 'thumb'),
        alt: photo.alt_description,
        credit: `Photo by ${photo.user.name} on Unsplash`,
        color: photo.color,
        likes: photo.likes,
      }));
    } catch (error) {
      console.error('Error fetching interior design images:', error);
      return [];
    }
  },

  async getProductCategoryImages(category: string, style: string = 'minimalist'): Promise<any[]> {
    try {
      const results = await unsplashService.getProductPhotos(category, style, 1, 8);
      return results.results.map(photo => ({
        id: photo.id,
        url: unsplashService.getOptimizedImageUrl(photo, 'regular'),
        thumb: unsplashService.getOptimizedImageUrl(photo, 'thumb'),
        alt: photo.alt_description,
        credit: `Photo by ${photo.user.name} on Unsplash`,
        color: photo.color,
        likes: photo.likes,
      }));
    } catch (error) {
      console.error('Error fetching product category images:', error);
      return [];
    }
  }
};
