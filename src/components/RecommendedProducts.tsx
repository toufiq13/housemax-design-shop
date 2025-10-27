import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Sparkles, TrendingUp, Clock, History, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRecommendations } from '@/contexts/RecommendationContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ScrollReveal from '@/components/ScrollReveal';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  subcategory: string;
  image: string;
  description: string;
  tags: string[];
  popularity?: number;
  rating?: number;
  trending?: boolean;
}

interface RecommendedProductsProps {
  products: Product[];
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products }) => {
  const { recommendations, generateRecommendations, searchHistory } = useRecommendations();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommended');
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Generate recommendations when component mounts or products change
    if (products.length > 0) {
      setIsLoading(true);
      // Simulate ML processing time
      setTimeout(() => {
        generateRecommendations(products);
        
        // Set trending products
        setTrendingProducts(products.filter(p => p.trending).slice(0, 8));
        
        // Set recently viewed (simulate from search history)
        const recentCategories = searchHistory
          .slice(0, 3)
          .map(search => search.category)
          .filter(Boolean);
        
        const recentProducts = products.filter(p => 
          recentCategories.includes(p.category)
        ).slice(0, 8);
        setRecentlyViewed(recentProducts);
        
        // Set favorite products (simulate high-rated products)
        setFavoriteProducts(products
          .filter(p => p.rating && p.rating >= 4.5)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 8)
        );
        
        setIsLoading(false);
      }, 500);
    }
  }, [products, generateRecommendations, searchHistory]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const getRecommendationReason = (product: Product) => {
    if (searchHistory.length === 0) {
      return product.trending ? 'Trending Now' : 'Popular Choice';
    }

    // Check if user has searched for similar categories
    const recentCategories = searchHistory
      .slice(0, 5)
      .map(search => search.category)
      .filter(Boolean);
    
    if (recentCategories.includes(product.category)) {
      return 'Based on your interests';
    }

    // Check if user has clicked on similar products
    const clickedProducts = searchHistory
      .flatMap(search => search.clickedProducts || []);
    
    if (clickedProducts.includes(product.id)) {
      return 'You viewed this before';
    }

    return 'Recommended for you';
  };

  const getRecommendationIcon = (reason: string) => {
    switch (reason) {
      case 'Trending Now':
        return <TrendingUp className="h-3 w-3" />;
      case 'Based on your interests':
        return <Sparkles className="h-3 w-3" />;
      case 'You viewed this before':
        return <Clock className="h-3 w-3" />;
      default:
        return <Sparkles className="h-3 w-3" />;
    }
  };

  const renderProductGrid = (productList: Product[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted animate-pulse" />
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse mb-3" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (productList.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productList.map((product, index) => {
          const reason = getRecommendationReason(product);
          return (
            <ScrollReveal key={product.id} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs flex items-center gap-1 bg-background/80 backdrop-blur-sm"
                      >
                        {getRecommendationIcon(reason)}
                        {reason}
                      </Badge>
                    </div>
                    {product.trending && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="text-xs">
                          Trending
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">★</span>
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{product.subcategory}</p>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-2xl font-bold text-primary">{product.price}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-xs bg-muted px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </ScrollReveal>
          );
        })}
      </div>
    );
  };

  if (recommendations.length === 0 && trendingProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Discover Products</h2>
            <p className="text-xl text-muted-foreground">
              {user 
                ? "Personalized recommendations based on your preferences and activity"
                : "Explore our curated collection of premium home furnishings"
              }
            </p>
          </div>
        </ScrollReveal>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="recommended" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Recommended
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Top Rated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommended">
            {renderProductGrid(
              recommendations, 
              "No recommendations available. Start browsing to get personalized suggestions!"
            )}
            {searchHistory.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground">
                  Recommendations are based on your {searchHistory.length} recent search{searchHistory.length !== 1 ? 'es' : ''}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending">
            {renderProductGrid(
              trendingProducts, 
              "No trending products available at the moment."
            )}
          </TabsContent>

          <TabsContent value="recent">
            {renderProductGrid(
              recentlyViewed, 
              "No recently viewed products. Start browsing to see your recent activity!"
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {renderProductGrid(
              favoriteProducts, 
              "No highly rated products available at the moment."
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default RecommendedProducts;
