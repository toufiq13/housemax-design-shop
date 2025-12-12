import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Heart,
  Grid3X3,
  List,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { productService, categoryService, searchService, favoritesService } from '@/lib/database';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MLSearch from '@/components/MLSearch';
import CartSidebar from '@/components/CartSidebar';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  subcategory_id: string | null;
  image_url: string | null;
  tags: string[] | null;
  popularity: number;
  rating: number;
  trending: boolean;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: { name: string } | null;
  subcategories?: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
}

// Default product images for items without custom images
const defaultProductImages = [
  '/products/sofa_modern_1764869311544.png',
  '/products/dining_table_1764869329659.png',
  '/products/bed_frame_1764869349589.png',
  '/products/bookshelf_wood_1764869371415.png',
  '/products/office_chair_1764869389469.png',
  '/products/coffee_table_1764869410185.png',
  '/products/living_room_sofa.png',
  '/products/kitchen_organizer.png',
  '/products/blue_dinnerware.png',
  '/products/white_ceramic_vases.png',
  '/products/crystal_chandelier.png',
  '/products/decorative_pillows.png',
  '/products/dining_table_modern.png',
  '/products/chesterfield_sofa.png',
  '/products/arc_floor_lamp.png',
  '/products/luxury_bedroom.png',
  '/products/bathroom_vanity.png',
  '/products/dining_room_set.png',
  '/products/geometric_rug.png',
  '/products/storage_cabinet.png',
  '/products/table_lamp_globe.png',
  '/products/outdoor_patio_set.png',
  '/products/persian_rug.png',
  '/products/rain_shower.png',
  '/products/smart_home_devices.png',
  '/products/outdoor_dining.png',
  '/products/smart_bulbs.png',
  '/products/cookware_set.png',
];

// Get image based on product name keywords or fallback to index-based selection
const getProductImage = (product: Product, index: number): string => {
  // Always use our curated images based on keyword matching
  const name = product.name.toLowerCase();

  // Match by keyword - newest images first (specific product matches)
  if (name.includes('patio dining') || name.includes('outdoor table')) return '/products/patio_dining_table.png';
  if (name.includes('luxury throw') || name.includes('throw blanket') || name.includes('fur blanket')) return '/products/luxury_throw_blanket.png';
  if (name.includes('modern dining') || name.includes('dining set')) return '/products/modern_dining_set.png';
  if (name.includes('modern sectional') || name.includes('sectional sofa')) return '/products/modern_sectional_sofa.png';

  if (name.includes('bulb') || name.includes('led') || name.includes('cync') || name.includes('smart light')) return '/products/smart_bulbs.png';
  if (name.includes('cookware') || name.includes('pot') || name.includes('pan') || name.includes('stainless') || name.includes('cooking')) return '/products/cookware_set.png';
  if (name.includes('outdoor') || name.includes('patio') || name.includes('garden') || name.includes('terrace')) return '/products/outdoor_patio_set.png';
  if (name.includes('persian') || name.includes('oriental') || name.includes('traditional rug')) return '/products/persian_rug.png';
  if (name.includes('shower') || name.includes('rain') || name.includes('faucet') || name.includes('tap')) return '/products/rain_shower.png';
  if (name.includes('smart') || name.includes('alexa') || name.includes('speaker') || name.includes('home device') || name.includes('tech')) return '/products/smart_home_devices.png';
  if (name.includes('outdoor dining') || name.includes('balcony')) return '/products/outdoor_dining.png';

  // Previous batch
  if (name.includes('bathroom') || name.includes('vanity') || name.includes('mirror') || name.includes('sink')) return '/products/bathroom_vanity.png';
  if (name.includes('dining room') || name.includes('dining set')) return '/products/dining_room_set.png';
  if (name.includes('rug') || name.includes('carpet') || name.includes('mat') || name.includes('floor covering')) return '/products/geometric_rug.png';
  if (name.includes('cabinet') || name.includes('cupboard') || name.includes('wardrobe') || name.includes('locker')) return '/products/storage_cabinet.png';
  if (name.includes('table lamp') || name.includes('desk lamp') || name.includes('bedside lamp') || name.includes('night lamp')) return '/products/table_lamp_globe.png';

  // Previous batch
  if (name.includes('pillow') || name.includes('cushion') || name.includes('throw')) return '/products/decorative_pillows.png';
  if (name.includes('chesterfield') || name.includes('leather sofa') || name.includes('tufted')) return '/products/chesterfield_sofa.png';
  if (name.includes('floor lamp') || name.includes('arc lamp') || name.includes('standing lamp')) return '/products/arc_floor_lamp.png';
  if (name.includes('bedroom') || name.includes('bed set') || name.includes('blanket') || name.includes('fur')) return '/products/luxury_bedroom.png';

  // Previous batch images
  if (name.includes('living room') || name.includes('wall art') || name.includes('artwork')) return '/products/living_room_sofa.png';
  if (name.includes('kitchen') || name.includes('organizer') || name.includes('storage') || name.includes('drawer')) return '/products/kitchen_organizer.png';
  if (name.includes('dinner') || name.includes('plate') || name.includes('dish') || name.includes('dinnerware') || name.includes('bowl')) return '/products/blue_dinnerware.png';
  if (name.includes('vase') || name.includes('ceramic') || name.includes('decor') || name.includes('decoration')) return '/products/white_ceramic_vases.png';
  if (name.includes('chandelier') || name.includes('crystal')) return '/products/crystal_chandelier.png';

  // Original keyword matching
  if (name.includes('sofa') || name.includes('couch')) return '/products/chesterfield_sofa.png';
  if (name.includes('dining') || name.includes('table')) return '/products/dining_table_modern.png';
  if (name.includes('bed') || name.includes('mattress')) return '/products/luxury_bedroom.png';
  if (name.includes('shelf') || name.includes('bookcase') || name.includes('bookshelf')) return '/products/storage_cabinet.png';
  if (name.includes('chair') || name.includes('seat')) return defaultProductImages[4];
  if (name.includes('coffee') || name.includes('side table')) return defaultProductImages[5];
  if (name.includes('lamp') || name.includes('light')) return '/products/table_lamp_globe.png';

  // Fallback to cycling through images
  return defaultProductImages[index % defaultProductImages.length];
};

const Shop = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showCart, setShowCart] = useState(false);

  // Define loadFavorites first
  const loadFavorites = useCallback(async () => {
    if (!user) return;

    try {
      const favoritesData = await favoritesService.getFavorites(user.id);
      const favoriteIds = new Set<string>(favoritesData.map((fav: any) => String(fav.product_id)));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, [user]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Load user favorites
  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user, loadFavorites]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts({ limit: 50 }),
        categoryService.getCategories()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string, filters: Record<string, unknown>) => {
    try {
      setLoading(true);

      // Add to search history if user is logged in
      if (user) {
        await searchService.addSearchHistory(user.id, query, filters.category?.[0]);
      }

      const searchFilters: Record<string, unknown> = {
        search: query,
        limit: 50
      };

      if (filters.category && Array.isArray(filters.category) && filters.category.length > 0) {
        const categoryName = String(filters.category[0]);
        const category = categories.find(c => c.name === categoryName);
        if (category) {
          searchFilters.category = category.id;
        }
      }

      const results = await productService.getProducts(searchFilters);
      setProducts(results);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      setSelectedSubcategory("all");

      const filters: Record<string, unknown> = { limit: 50 };
      if (categoryId !== "all") {
        filters.category = categoryId;
      }

      const results = await productService.getProducts(filters);
      setProducts(results);
    } catch (error) {
      console.error('Error filtering by category:', error);
      toast.error('Failed to filter products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryChange = async (subcategoryId: string) => {
    try {
      setLoading(true);
      setSelectedSubcategory(subcategoryId);

      const filters: Record<string, unknown> = { limit: 50 };
      if (selectedCategory !== "all") {
        filters.category = selectedCategory;
      }
      if (subcategoryId !== "all") {
        filters.subcategory = subcategoryId;
      }

      const results = await productService.getProducts(filters);
      setProducts(results);
    } catch (error) {
      console.error('Error filtering by subcategory:', error);
      toast.error('Failed to filter products');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortType: string) => {
    setSortBy(sortType);
    const sortedProducts = [...products].sort((a, b) => {
      switch (sortType) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });
    setProducts(sortedProducts);
  };

  const handleAddToCart = (product: Product, index: number) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getProductImage(product, index),
      quantity: 1,
      category: product.categories?.name || 'Uncategorized'
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleProductClick = (product: any) => {
    // Navigate to product detail or show modal
    console.log('Product clicked:', product);
  };

  const handleToggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error('Please log in to add favorites');
      return;
    }

    try {
      const isFavorite = favorites.has(productId);

      if (isFavorite) {
        await favoritesService.removeFavorite(user.id, productId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success('Removed from favorites');
      } else {
        await favoritesService.addFavorite(user.id, productId);
        setFavorites(prev => new Set(prev).add(productId));
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const formatPrice = (price: number) => {
    // Convert USD to INR (1 USD ≈ 83 INR)
    const priceInINR = price * 83;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(priceInINR);
  };

  const getSelectedCategory = () => {
    return categories.find(c => c.id === selectedCategory);
  };

  const getSubcategories = () => {
    const category = getSelectedCategory();
    return category?.subcategories || [];
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading products...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shop</h1>
          <p className="text-muted-foreground">Discover our curated collection of premium home furnishings</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <MLSearch
            products={products.map((p, idx) => ({
              id: Number(p.id.split('-')[0]) || 0,
              name: p.name,
              price: String(p.price),
              category: p.categories?.name || 'Uncategorized',
              image: getProductImage(p, idx),
              description: p.description || '',
              tags: p.tags || [],
              popularity: p.popularity,
              rating: p.rating,
              trending: p.trending
            }))}
            onSearch={handleSearch}
            onProductClick={handleProductClick}
          />

          <div className="flex flex-wrap gap-4 mt-6">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Subcategory Filter */}
            {getSubcategories().length > 0 && (
              <Select value={selectedSubcategory} onValueChange={handleSubcategoryChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {getSubcategories().map(subcategory => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Sort Filter */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid'
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
          }`}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={getProductImage(product, index)}
                    alt={product.name}
                    className={`w-full object-cover ${viewMode === 'grid' ? 'h-64' : 'h-48 w-48'
                      }`}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {product.trending && (
                      <Badge variant="destructive" className="text-xs">
                        Trending
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                      onClick={() => handleToggleFavorite(product.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : ''
                          }`}
                      />
                    </Button>
                  </div>
                </div>

                <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className={viewMode === 'list' ? 'flex gap-4' : ''}>
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {product.categories?.name || 'Uncategorized'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {formatPrice(product.price)}
                        </span>
                        <Button
                          onClick={() => handleAddToCart(product, index)}
                          className="flex items-center gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && <CartSidebar />}

      <Footer />
    </div>
  );
};

export default Shop;