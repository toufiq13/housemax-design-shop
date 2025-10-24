import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { aiRecommendationService } from '../lib/database';

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

interface SearchHistory {
  query: string;
  timestamp: number;
  category?: string;
  clickedProducts?: number[];
}

interface RecommendationContextType {
  searchHistory: SearchHistory[];
  recommendations: Product[];
  addSearchHistory: (query: string, category?: string, clickedProducts?: number[]) => void;
  generateRecommendations: (products: Product[]) => Product[];
  clearHistory: () => void;
  getAIPersonalizedRecommendations: (userId: string, preferences: string, roomType: string, style: string) => Promise<any>;
  getAIDesignIdeas: (roomDescription: string, budget: string, style: string) => Promise<string>;
  analyzeRoomWithAI: (imageDescription: string) => Promise<string>;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export const useRecommendations = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
};

interface RecommendationProviderProps {
  children: ReactNode;
}

export const RecommendationProvider: React.FC<RecommendationProviderProps> = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addSearchHistory = (query: string, category?: string, clickedProducts?: number[]) => {
    const newSearch: SearchHistory = {
      query,
      timestamp: Date.now(),
      category,
      clickedProducts: clickedProducts || []
    };

    setSearchHistory(prev => {
      // Remove duplicate searches and keep only the latest 20
      const filtered = prev.filter(search => search.query !== query);
      return [newSearch, ...filtered].slice(0, 20);
    });
  };

  // ML-based recommendation algorithm
  const generateRecommendations = (products: Product[]): Product[] => {
    if (searchHistory.length === 0) {
      // If no search history, return trending products
      return products
        .filter(p => p.trending || (p.popularity && p.popularity > 0.8))
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 8);
    }

    // Analyze search patterns
    const categoryFrequency: { [key: string]: number } = {};
    const tagFrequency: { [key: string]: number } = {};
    const clickedProducts: number[] = [];

    searchHistory.forEach(search => {
      // Weight recent searches more heavily
      const daysSinceSearch = (Date.now() - search.timestamp) / (1000 * 60 * 60 * 24);
      const weight = Math.max(0.1, 1 - (daysSinceSearch / 30)); // Decay over 30 days

      if (search.category) {
        categoryFrequency[search.category] = (categoryFrequency[search.category] || 0) + weight;
      }

      if (search.clickedProducts) {
        clickedProducts.push(...search.clickedProducts);
      }

      // Extract tags from search queries
      const queryWords = search.query.toLowerCase().split(' ');
      queryWords.forEach(word => {
        if (word.length > 2) {
          tagFrequency[word] = (tagFrequency[word] || 0) + weight;
        }
      });
    });

    // Score products based on user preferences
    const scoredProducts = products.map(product => {
      let score = 0;

      // Category preference
      if (product.category in categoryFrequency) {
        score += categoryFrequency[product.category] * 2;
      }

      // Tag matching
      product.tags.forEach(tag => {
        if (tag.toLowerCase() in tagFrequency) {
          score += tagFrequency[tag.toLowerCase()] * 1.5;
        }
      });

      // Boost if user has clicked on similar products
      if (clickedProducts.includes(product.id)) {
        score += 3;
      }

      // Boost trending and popular products
      if (product.trending) score += 1;
      if (product.popularity) score += product.popularity;
      if (product.rating) score += (product.rating - 3) * 0.5; // Boost high-rated products

      // Penalize if product was recently viewed (avoid repetition)
      const recentSearches = searchHistory.slice(0, 5);
      const wasRecentlyViewed = recentSearches.some(search => 
        search.clickedProducts?.includes(product.id)
      );
      if (wasRecentlyViewed) {
        score *= 0.3;
      }

      return { ...product, recommendationScore: score };
    });

    // Sort by recommendation score and return top products
    const sortedProducts = scoredProducts
      .sort((a, b) => (b as Product & { recommendationScore: number }).recommendationScore - (a as Product & { recommendationScore: number }).recommendationScore)
      .slice(0, 8);

    setRecommendations(sortedProducts);
    return sortedProducts;
  };

  const clearHistory = () => {
    setSearchHistory([]);
    setRecommendations([]);
    localStorage.removeItem('searchHistory');
  };

  // AI-powered recommendation methods
  const getAIPersonalizedRecommendations = async (userId: string, preferences: string, roomType: string, style: string) => {
    return await aiRecommendationService.getPersonalizedRecommendations(userId, preferences, roomType, style);
  };

  const getAIDesignIdeas = async (roomDescription: string, budget: string, style: string) => {
    return await aiRecommendationService.generateDesignIdeas(roomDescription, budget, style);
  };

  const analyzeRoomWithAI = async (imageDescription: string) => {
    return await aiRecommendationService.analyzeRoomImage(imageDescription);
  };

  const value: RecommendationContextType = {
    searchHistory,
    recommendations,
    addSearchHistory,
    generateRecommendations,
    clearHistory,
    getAIPersonalizedRecommendations,
    getAIDesignIdeas,
    analyzeRoomWithAI
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};
