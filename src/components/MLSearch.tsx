import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Star,
  Filter,
  X
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  popularity?: number;
  rating?: number;
  trending?: boolean;
}

interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'style' | 'color';
  confidence: number;
}

interface MLSearchProps {
  products: Product[];
  onSearch: (query: string, filters: any) => void;
  onProductClick: (product: Product) => void;
}

const MLSearch: React.FC<MLSearchProps> = ({ products, onSearch, onProductClick }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    category: string[];
    priceRange: [number, number];
    style: string[];
    color: string[];
  }>({
    category: [],
    priceRange: [0, 5000],
    style: [],
    color: [],
  });

  // ML-powered search suggestions
  const generateSuggestions = (input: string): SearchSuggestion[] => {
    if (input.length < 2) return [];

    const allTags = products.flatMap(p => p.tags);
    const categories = [...new Set(products.map(p => p.category))];
    const styles = ['modern', 'vintage', 'minimalist', 'luxury', 'scandinavian', 'industrial'];
    const colors = ['white', 'black', 'gray', 'brown', 'blue', 'green', 'red', 'yellow'];

    const suggestions: SearchSuggestion[] = [];

    // Product name suggestions
    products.forEach(product => {
      if (product.name.toLowerCase().includes(input.toLowerCase())) {
        suggestions.push({
          text: product.name,
          type: 'product',
          confidence: 0.9
        });
      }
    });

    // Category suggestions
    categories.forEach(category => {
      if (category.toLowerCase().includes(input.toLowerCase())) {
        suggestions.push({
          text: category,
          type: 'category',
          confidence: 0.8
        });
      }
    });

    // Style suggestions
    styles.forEach(style => {
      if (style.toLowerCase().includes(input.toLowerCase())) {
        suggestions.push({
          text: style,
          type: 'style',
          confidence: 0.7
        });
      }
    });

    // Color suggestions
    colors.forEach(color => {
      if (color.toLowerCase().includes(input.toLowerCase())) {
        suggestions.push({
          text: color,
          type: 'color',
          confidence: 0.6
        });
      }
    });

    // Tag suggestions
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(input.toLowerCase()) && 
          !suggestions.some(s => s.text === tag)) {
        suggestions.push({
          text: tag,
          type: 'product',
          confidence: 0.5
        });
      }
    });

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8);
  };

  // Simulate trending searches based on product popularity
  useEffect(() => {
    const trending = products
      .filter(p => p.trending || (p.popularity && p.popularity > 0.7))
      .map(p => p.name)
      .slice(0, 5);
    setTrendingSearches(trending);
  }, [products]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 2) {
      setSuggestions(generateSuggestions(value));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));

      // Perform search
      onSearch(searchQuery, selectedFilters);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      category: [],
      priceRange: [0, 5000],
      style: [],
      color: [],
    });
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return <Search className="h-4 w-4" />;
      case 'category':
        return <Filter className="h-4 w-4" />;
      case 'style':
        return <Sparkles className="h-4 w-4" />;
      case 'color':
        return <Star className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return 'text-blue-600';
      case 'category':
        return 'text-green-600';
      case 'style':
        return 'text-purple-600';
      case 'color':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for furniture, styles, colors, or describe what you're looking for..."
              value={query}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 pr-4"
            />
            <Button
              onClick={() => handleSearch()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size="sm"
            >
              Search
            </Button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <Card className="mt-2">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className={getSuggestionColor(suggestion.type)}>
                        {getSuggestionIcon(suggestion.type)}
                      </span>
                      <span className="flex-1">{suggestion.text}</span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(suggestion.confidence * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Recent & Trending Searches */}
      <div className="grid md:grid-cols-2 gap-4">
        {recentSearches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(search)}
                    className="text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {trendingSearches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(search)}
                    className="text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Advanced Filters</CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Categories</label>
              <div className="space-y-1">
                {[...new Set(products.map(p => p.category))].map(category => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.category.includes(category)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...selectedFilters.category, category]
                          : selectedFilters.category.filter(c => c !== category);
                        handleFilterChange('category', newCategories);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={selectedFilters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [selectedFilters.priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  ${selectedFilters.priceRange[0]} - ${selectedFilters.priceRange[1]}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Styles</label>
              <div className="space-y-1">
                {['modern', 'vintage', 'minimalist', 'luxury'].map(style => (
                  <label key={style} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.style.includes(style)}
                      onChange={(e) => {
                        const newStyles = e.target.checked
                          ? [...selectedFilters.style, style]
                          : selectedFilters.style.filter(s => s !== style);
                        handleFilterChange('style', newStyles);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{style}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Colors</label>
              <div className="space-y-1">
                {['white', 'black', 'gray', 'brown', 'blue'].map(color => (
                  <label key={color} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.color.includes(color)}
                      onChange={(e) => {
                        const newColors = e.target.checked
                          ? [...selectedFilters.color, color]
                          : selectedFilters.color.filter(c => c !== color);
                        handleFilterChange('color', newColors);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{color}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLSearch;
