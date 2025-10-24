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

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    
    try {
      const favoritesData = await favoritesService.getFavorites(user.id);
      const favoriteIds = new Set(favoritesData.map(fav => fav.product_id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, [user]);

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

      if (filters.category && filters.category.length > 0) {
        const category = categories.find(c => c.name === filters.category[0]);
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

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '',
      quantity: 1
    });
    toast.success(`${product.name} added to cart`);
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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
          <MLSearch onSearch={handleSearch} />
          
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
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.name}
                    className={`w-full object-cover ${
                      viewMode === 'grid' ? 'h-64' : 'h-48 w-48'
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
                        className={`h-4 w-4 ${
                          favorites.has(product.id) ? 'fill-red-500 text-red-500' : ''
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
                          onClick={() => handleAddToCart(product)}
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
      <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      
      <Footer />
    </div>
  );
};

export default Shop;