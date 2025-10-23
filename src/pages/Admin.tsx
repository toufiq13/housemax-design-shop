import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  BarChart3,
  Settings,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRecommendations } from '@/contexts/RecommendationContext';

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

interface AdminStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  trendingProducts: number;
  lowStockItems: number;
}

const Admin = () => {
  const { searchHistory, recommendations, clearHistory } = useRecommendations();
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 40,
    totalUsers: 1250,
    totalOrders: 3420,
    totalRevenue: 125000,
    trendingProducts: 8,
    lowStockItems: 3
  });

  const [products, setProducts] = useState<Product[]>([
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
    }
  ]);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: '',
    category: '',
    subcategory: '',
    image: '',
    description: '',
    tags: [],
    popularity: 0,
    rating: 0,
    trending: false
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Furniture', 'Lighting', 'Flooring & Rugs', 'Window Treatments', 'Textiles & Soft Furnishings', 'Storage & Organization', 'Kitchen & Dining Accessories', 'Bathroom Accessories', 'Décor & Accessories', 'Technology & Smart Devices', 'Outdoor/Patio Interior'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const product: Product = {
      id: products.length + 1,
      name: newProduct.name,
      price: newProduct.price,
      category: newProduct.category,
      subcategory: newProduct.subcategory || '',
      image: newProduct.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      description: newProduct.description || '',
      tags: newProduct.tags || [],
      popularity: newProduct.popularity || 0,
      rating: newProduct.rating || 0,
      trending: newProduct.trending || false
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      price: '',
      category: '',
      subcategory: '',
      image: '',
      description: '',
      tags: [],
      popularity: 0,
      rating: 0,
      trending: false
    });
    toast.success('Product added successfully!');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    toast.success('Product updated successfully!');
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully!');
  };

  const handleToggleTrending = (id: number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, trending: !p.trending } : p
    ));
  };

  const handleClearSearchHistory = () => {
    clearHistory();
    toast.success('Search history cleared!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage products, view analytics, and configure recommendations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Create a new product for your store
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price *</Label>
                        <Input
                          id="price"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          placeholder="Enter price (e.g., $299)"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.slice(1).map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Input
                          id="subcategory"
                          value={newProduct.subcategory}
                          onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                          placeholder="Enter subcategory"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Enter product description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Input
                          id="rating"
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={newProduct.rating}
                          onChange={(e) => setNewProduct({...newProduct, rating: parseFloat(e.target.value)})}
                          placeholder="0.0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="popularity">Popularity</Label>
                        <Input
                          id="popularity"
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={newProduct.popularity}
                          onChange={(e) => setNewProduct({...newProduct, popularity: parseFloat(e.target.value)})}
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddProduct}>Add Product</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Products ({filteredProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.subcategory}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>★</span>
                            <span>{product.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {product.trending && (
                              <Badge variant="destructive">Trending</Badge>
                            )}
                            <Badge variant="secondary">Active</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleTrending(product.id)}
                            >
                              {product.trending ? 'Remove Trending' : 'Make Trending'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.filter(p => p.trending).slice(0, 5).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{product.price}</div>
                          <div className="text-sm text-muted-foreground">★ {product.rating}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.slice(1).map(category => {
                      const categoryProducts = products.filter(p => p.category === category);
                      const avgRating = categoryProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / categoryProducts.length || 0;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{category}</div>
                            <div className="text-sm text-muted-foreground">{categoryProducts.length} products</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">★ {avgRating.toFixed(1)}</div>
                            <div className="text-sm text-muted-foreground">avg rating</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search History Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Searches</span>
                      <Badge variant="secondary">{searchHistory.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Recommendations</span>
                      <Badge variant="secondary">{recommendations.length}</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleClearSearchHistory}
                      className="w-full"
                    >
                      Clear Search History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Search Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {searchHistory.slice(0, 10).map((search, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>{search.query}</span>
                        <span className="text-muted-foreground">
                          {new Date(search.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {searchHistory.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No search history available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Recommendation Engine</h3>
                    <p className="text-sm text-muted-foreground">Configure ML-based product recommendations</p>
                  </div>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Data Export</h3>
                    <p className="text-sm text-muted-foreground">Export product and analytics data</p>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Data Import</h3>
                    <p className="text-sm text-muted-foreground">Import products from CSV or other sources</p>
                  </div>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
