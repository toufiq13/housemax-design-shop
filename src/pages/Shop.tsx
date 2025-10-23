import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import MLSearch from "@/components/MLSearch";
import { toast } from "sonner";

const Shop = () => {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const products = [
    // FURNITURE - Sofas & Couches
    {
      id: 1,
      name: "Modern Sectional Sofa",
      price: "$1,299",
      category: "Furniture",
      subcategory: "Sofas & Couches",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      description: "Comfortable and stylish sectional sofa perfect for modern living spaces",
      tags: ["modern", "comfortable", "sectional", "gray"],
      popularity: 0.9,
      rating: 4.8,
      trending: true
    },
    {
      id: 2,
      name: "Luxury Chesterfield Sofa",
      price: "$1,899",
      category: "Furniture",
      subcategory: "Sofas & Couches",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Classic Chesterfield design with premium leather upholstery",
      tags: ["luxury", "leather", "classic", "brown"],
      popularity: 0.8,
      rating: 4.7,
      trending: true
    },
    {
      id: 3,
      name: "Minimalist Loveseat",
      price: "$799",
      category: "Furniture",
      subcategory: "Sofas & Couches",
      image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop",
      description: "Clean lines and minimalist design for contemporary homes",
      tags: ["minimalist", "modern", "compact", "white"],
      popularity: 0.7,
      rating: 4.5,
      trending: false
    },

    // FURNITURE - Armchairs & Recliners
    {
      id: 4,
      name: "Premium Recliner Chair",
      price: "$899",
      category: "Furniture",
      subcategory: "Armchairs & Recliners",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop",
      description: "Ultra-comfortable recliner with massage function and cup holders",
      tags: ["recliner", "comfortable", "massage", "brown"],
      popularity: 0.8,
      rating: 4.6,
      trending: true
    },
    {
      id: 5,
      name: "Designer Accent Chair",
      price: "$649",
      category: "Furniture",
      subcategory: "Armchairs & Recliners",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      description: "Stylish accent chair with unique geometric pattern",
      tags: ["accent", "designer", "geometric", "colorful"],
      popularity: 0.6,
      rating: 4.3,
      trending: false
    },
    {
      id: 6,
      name: "Wingback Reading Chair",
      price: "$749",
      category: "Furniture",
      subcategory: "Armchairs & Recliners",
      image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop",
      description: "Classic wingback chair perfect for reading and relaxation",
      tags: ["wingback", "reading", "classic", "navy"],
      popularity: 0.5,
      rating: 4.2,
      trending: false
    },

    // FURNITURE - Coffee Tables & Side Tables
    {
      id: 7,
      name: "Glass Coffee Table",
      price: "$399",
      category: "Furniture",
      subcategory: "Coffee Tables & Side Tables",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Elegant glass coffee table with metal frame",
      tags: ["glass", "modern", "metal", "elegant"],
      popularity: 0.7,
      rating: 4.4,
      trending: false
    },
    {
      id: 8,
      name: "Wooden Side Table Set",
      price: "$299",
      category: "Furniture",
      subcategory: "Coffee Tables & Side Tables",
      image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop",
      description: "Set of two matching wooden side tables with storage",
      tags: ["wood", "storage", "set", "natural"],
      popularity: 0.6,
      rating: 4.3,
      trending: false
    },
    {
      id: 9,
      name: "Marble Coffee Table",
      price: "$1,199",
      category: "Furniture",
      subcategory: "Coffee Tables & Side Tables",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Luxury marble coffee table with gold accents",
      tags: ["marble", "luxury", "gold", "premium"],
      popularity: 0.8,
      rating: 4.7,
      trending: true
    },

    // FURNITURE - Dining Tables & Chairs
    {
      id: 10,
      name: "Farmhouse Dining Table",
      price: "$1,299",
      category: "Furniture",
      subcategory: "Dining Tables & Chairs",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
      description: "Rustic farmhouse dining table seating 8 people",
      tags: ["farmhouse", "rustic", "wood", "large"],
      popularity: 0.7,
      rating: 4.5,
      trending: false
    },
    {
      id: 11,
      name: "Modern Dining Chair Set",
      price: "$599",
      category: "Furniture",
      subcategory: "Dining Tables & Chairs",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      description: "Set of 4 modern dining chairs with upholstered seats",
      tags: ["modern", "upholstered", "set", "comfortable"],
      popularity: 0.6,
      rating: 4.3,
      trending: false
    },
    {
      id: 12,
      name: "Extendable Dining Table",
      price: "$1,599",
      category: "Furniture",
      subcategory: "Dining Tables & Chairs",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
      description: "Versatile extendable dining table for 6-10 people",
      tags: ["extendable", "versatile", "wood", "spacious"],
      popularity: 0.8,
      rating: 4.6,
      trending: true
    },

    // FURNITURE - Beds
    {
      id: 13,
      name: "King Size Platform Bed",
      price: "$1,199",
      category: "Furniture",
      subcategory: "Beds",
      image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop",
      description: "Modern platform bed with built-in storage drawers",
      tags: ["king", "platform", "storage", "modern"],
      popularity: 0.9,
      rating: 4.8,
      trending: true
    },
    {
      id: 14,
      name: "Queen Size Upholstered Bed",
      price: "$899",
      category: "Furniture",
      subcategory: "Beds",
      image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop",
      description: "Luxurious upholstered bed with tufted headboard",
      tags: ["queen", "upholstered", "tufted", "luxury"],
      popularity: 0.8,
      rating: 4.7,
      trending: true
    },
    {
      id: 15,
      name: "Single Daybed",
      price: "$599",
      category: "Furniture",
      subcategory: "Beds",
      image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop",
      description: "Versatile daybed perfect for guest rooms or small spaces",
      tags: ["single", "daybed", "versatile", "compact"],
      popularity: 0.5,
      rating: 4.2,
      trending: false
    },

    // LIGHTING - Chandeliers
    {
      id: 16,
      name: "Crystal Chandelier",
      price: "$1,899",
      category: "Lighting",
      subcategory: "Chandeliers",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
      description: "Elegant crystal chandelier with 12 lights",
      tags: ["crystal", "elegant", "luxury", "dining"],
      popularity: 0.8,
      rating: 4.7,
      trending: true
    },
    {
      id: 17,
      name: "Modern Geometric Chandelier",
      price: "$799",
      category: "Lighting",
      subcategory: "Chandeliers",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
      description: "Contemporary geometric chandelier with LED lights",
      tags: ["modern", "geometric", "LED", "contemporary"],
      popularity: 0.7,
      rating: 4.5,
      trending: false
    },

    // LIGHTING - Floor Lamps
    {
      id: 18,
      name: "Adjustable Floor Lamp",
      price: "$299",
      category: "Lighting",
      subcategory: "Floor Lamps",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
      description: "Modern floor lamp with adjustable height and brightness",
      tags: ["adjustable", "modern", "brightness", "reading"],
      popularity: 0.6,
      rating: 4.3,
      trending: false
    },
    {
      id: 19,
      name: "Arc Floor Lamp",
      price: "$449",
      category: "Lighting",
      subcategory: "Floor Lamps",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
      description: "Stylish arc floor lamp perfect for reading corners",
      tags: ["arc", "stylish", "reading", "corner"],
      popularity: 0.7,
      rating: 4.4,
      trending: false
    },

    // LIGHTING - Table Lamps
    {
      id: 20,
      name: "Ceramic Table Lamp",
      price: "$149",
      category: "Lighting",
      subcategory: "Table Lamps",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
      description: "Handcrafted ceramic table lamp with fabric shade",
      tags: ["ceramic", "handcrafted", "fabric", "bedside"],
      popularity: 0.5,
      rating: 4.1,
      trending: false
    },
    {
      id: 21,
      name: "Smart Table Lamp",
      price: "$199",
      category: "Lighting",
      subcategory: "Table Lamps",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
      description: "WiFi-enabled smart table lamp with app control",
      tags: ["smart", "WiFi", "app", "modern"],
      popularity: 0.8,
      rating: 4.6,
      trending: true
    },

    // FLOORING & RUGS
    {
      id: 22,
      name: "Persian Area Rug",
      price: "$899",
      category: "Flooring & Rugs",
      subcategory: "Carpets & Rugs",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Authentic Persian rug with traditional patterns",
      tags: ["persian", "traditional", "handmade", "luxury"],
      popularity: 0.7,
      rating: 4.5,
      trending: false
    },
    {
      id: 23,
      name: "Modern Geometric Rug",
      price: "$399",
      category: "Flooring & Rugs",
      subcategory: "Carpets & Rugs",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Contemporary geometric rug with bold patterns",
      tags: ["geometric", "modern", "bold", "contemporary"],
      popularity: 0.6,
      rating: 4.3,
      trending: false
    },
    {
      id: 24,
      name: "Hardwood Flooring",
      price: "$8.99",
      category: "Flooring & Rugs",
      subcategory: "Hardwood Flooring",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Premium oak hardwood flooring per square foot",
      tags: ["hardwood", "oak", "premium", "natural"],
      popularity: 0.8,
      rating: 4.7,
      trending: true
    },

    // WINDOW TREATMENTS
    {
      id: 25,
      name: "Luxury Curtain Set",
      price: "$299",
      category: "Window Treatments",
      subcategory: "Curtains & Drapes",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Premium blackout curtains with thermal lining",
      tags: ["blackout", "thermal", "premium", "bedroom"],
      popularity: 0.7,
      rating: 4.4,
      trending: false
    },
    {
      id: 26,
      name: "Roman Blinds",
      price: "$199",
      category: "Window Treatments",
      subcategory: "Blinds",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Elegant roman blinds with cordless operation",
      tags: ["roman", "cordless", "elegant", "modern"],
      popularity: 0.6,
      rating: 4.2,
      trending: false
    },

    // TEXTILES & SOFT FURNISHINGS
    {
      id: 27,
      name: "Decorative Throw Pillows",
      price: "$49",
      category: "Textiles & Soft Furnishings",
      subcategory: "Cushions & Throw Pillows",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Set of 4 decorative throw pillows with various patterns",
      tags: ["decorative", "patterns", "set", "colorful"],
      popularity: 0.5,
      rating: 4.1,
      trending: false
    },
    {
      id: 28,
      name: "Luxury Bedding Set",
      price: "$199",
      category: "Textiles & Soft Furnishings",
      subcategory: "Bed Linens & Duvet Covers",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Premium cotton bedding set with duvet cover and pillowcases",
      tags: ["cotton", "premium", "bedding", "luxury"],
      popularity: 0.8,
      rating: 4.6,
      trending: true
    },

    // STORAGE & ORGANIZATION
    {
      id: 29,
      name: "Modern Storage Cabinet",
      price: "$699",
      category: "Storage & Organization",
      subcategory: "Cabinets & Cupboards",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Sleek storage cabinet with multiple compartments",
      tags: ["storage", "modern", "compartments", "sleek"],
      popularity: 0.6,
      rating: 4.3,
      trending: false
    },
    {
      id: 30,
      name: "Shoe Storage Rack",
      price: "$149",
      category: "Storage & Organization",
      subcategory: "Shoe Racks",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Space-saving shoe rack with 20 compartments",
      tags: ["shoes", "storage", "space-saving", "organized"],
      popularity: 0.5,
      rating: 4.0,
      trending: false
    },

    // KITCHEN & DINING ACCESSORIES
    {
      id: 31,
      name: "Ceramic Dinnerware Set",
      price: "$199",
      category: "Kitchen & Dining Accessories",
      subcategory: "Dinnerware",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Complete ceramic dinnerware set for 8 people",
      tags: ["ceramic", "dinnerware", "complete", "elegant"],
      popularity: 0.7,
      rating: 4.4,
      trending: false
    },
    {
      id: 32,
      name: "Stainless Steel Cookware Set",
      price: "$399",
      category: "Kitchen & Dining Accessories",
      subcategory: "Cookware",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Professional-grade stainless steel cookware set",
      tags: ["stainless", "professional", "cookware", "durable"],
      popularity: 0.8,
      rating: 4.7,
      trending: true
    },

    // BATHROOM ACCESSORIES
    {
      id: 33,
      name: "Vanity Mirror with LED",
      price: "$299",
      category: "Bathroom Accessories",
      subcategory: "Mirrors",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "LED-lit vanity mirror with touch controls",
      tags: ["LED", "vanity", "touch", "modern"],
      popularity: 0.7,
      rating: 4.5,
      trending: false
    },
    {
      id: 34,
      name: "Bathroom Storage Unit",
      price: "$199",
      category: "Bathroom Accessories",
      subcategory: "Bathroom Storage Units",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Wall-mounted bathroom storage with multiple shelves",
      tags: ["storage", "wall-mounted", "shelves", "bathroom"],
      popularity: 0.6,
      rating: 4.2,
      trending: false
    },

    // DÉCOR & ACCESSORIES
    {
      id: 35,
      name: "Abstract Wall Art",
      price: "$149",
      category: "Décor & Accessories",
      subcategory: "Wall Art & Paintings",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Large abstract wall art canvas print",
      tags: ["abstract", "wall art", "canvas", "large"],
      popularity: 0.6,
      rating: 4.3,
      trending: false
    },
    {
      id: 36,
      name: "Decorative Vase Set",
      price: "$99",
      category: "Décor & Accessories",
      subcategory: "Vases & Planters",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Set of 3 decorative ceramic vases in different sizes",
      tags: ["ceramic", "decorative", "set", "vases"],
      popularity: 0.5,
      rating: 4.1,
      trending: false
    },

    // TECHNOLOGY & SMART DEVICES
    {
      id: 37,
      name: "Smart Thermostat",
      price: "$249",
      category: "Technology & Smart Devices",
      subcategory: "Smart Thermostats",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "WiFi-enabled smart thermostat with app control",
      tags: ["smart", "thermostat", "WiFi", "energy-saving"],
      popularity: 0.8,
      rating: 4.6,
      trending: true
    },
    {
      id: 38,
      name: "Smart Speaker",
      price: "$199",
      category: "Technology & Smart Devices",
      subcategory: "Smart Speakers & Assistants",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Voice-controlled smart speaker with premium sound",
      tags: ["smart", "speaker", "voice", "premium"],
      popularity: 0.9,
      rating: 4.8,
      trending: true
    },

    // OUTDOOR/PATIO INTERIOR
    {
      id: 39,
      name: "Outdoor Dining Set",
      price: "$799",
      category: "Outdoor/Patio Interior",
      subcategory: "Outdoor Chairs & Tables",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Weather-resistant outdoor dining set for 6 people",
      tags: ["outdoor", "weather-resistant", "dining", "patio"],
      popularity: 0.7,
      rating: 4.4,
      trending: false
    },
    {
      id: 40,
      name: "Patio Umbrella",
      price: "$299",
      category: "Outdoor/Patio Interior",
      subcategory: "Patio Umbrellas",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Large patio umbrella with tilt mechanism",
      tags: ["umbrella", "patio", "tilt", "shade"],
      popularity: 0.6,
      rating: 4.2,
      trending: false
    }
  ];

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  const subcategories = Array.from(new Set(products.map(p => p.subcategory)));

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           product.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      
      // Apply ML filters
      const matchesFilters = Object.keys(appliedFilters).every(filterKey => {
        const filterValue = appliedFilters[filterKey];
        if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
          return true;
        }
        
        switch (filterKey) {
          case 'category':
            return filterValue.includes(product.category);
          case 'subcategory':
            return filterValue.includes(product.subcategory);
          case 'priceRange':
            const price = parseFloat(product.price.replace('$', '').replace(',', ''));
            return price >= filterValue[0] && price <= filterValue[1];
          case 'style':
            return filterValue.some((style: string) => 
              product.tags.some(tag => tag.toLowerCase().includes(style.toLowerCase()))
            );
          case 'color':
            return filterValue.some((color: string) => 
              product.tags.some(tag => tag.toLowerCase().includes(color.toLowerCase()))
            );
          default:
            return true;
        }
      });
      
      return matchesSearch && matchesCategory && matchesFilters;
    });
  }, [searchTerm, selectedCategory, appliedFilters]);

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleMLSearch = (query: string, filters: any) => {
    setSearchTerm(query);
    setAppliedFilters(filters);
  };

  const handleProductClick = (product: any) => {
    // Could open a product detail modal or navigate to product page
    console.log('Product clicked:', product);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AIAssistant />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Products</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover our curated collection of premium interior furnishings with AI-powered search
          </p>
          
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category === 'all' ? 'All Products' : category}
                </button>
              ))}
            </div>
          </div>
          
          {/* ML Search Component */}
          <MLSearch 
            products={products}
            onSearch={handleMLSearch}
            onProductClick={handleProductClick}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  {product.trending && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Trending</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{product.subcategory}</p>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-2xl font-bold text-primary">{product.price}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">★</span>
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
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
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? `No products match your search for "${searchTerm}"`
                  : selectedCategory !== "all"
                  ? `No products found in ${selectedCategory} category`
                  : "No products found matching your criteria"
                }
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Clearing your search terms</li>
                  <li>• Selecting a different category</li>
                  <li>• Using different keywords</li>
                  <li>• Browsing all products</li>
                </ul>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setAppliedFilters({});
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;