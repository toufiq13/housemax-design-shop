import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, ShoppingCart, ExternalLink, Image, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  timestamp?: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  description: string;
}

const AIAssistant = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your HOUSEMAX AI assistant. I can help you with interior design ideas, product recommendations, and space planning. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sample product data for recommendations
  const sampleProducts: Product[] = [
    {
      id: 1,
      name: "Modern Sectional Sofa",
      price: "$1,299",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      category: "Furniture",
      description: "Comfortable modern sectional sofa perfect for any living space"
    },
    {
      id: 2,
      name: "Crystal Chandelier",
      price: "$1,899",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
      category: "Lighting",
      description: "Elegant crystal chandelier with 12 lights for dining rooms"
    },
    {
      id: 3,
      name: "Persian Area Rug",
      price: "$899",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      category: "Flooring & Rugs",
      description: "Authentic Persian rug with traditional patterns"
    },
    {
      id: 4,
      name: "Smart Thermostat",
      price: "$249",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      category: "Technology & Smart Devices",
      description: "WiFi-enabled smart thermostat with app control"
    },
    {
      id: 5,
      name: "Luxury Bedding Set",
      price: "$199",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      category: "Textiles & Soft Furnishings",
      description: "Premium cotton bedding set with duvet cover and pillowcases"
    },
    {
      id: 6,
      name: "Outdoor Dining Set",
      price: "$799",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      category: "Outdoor/Patio Interior",
      description: "Weather-resistant outdoor dining set for 6 people"
    }
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { 
      role: "user", 
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);
    setIsLoading(true);

    try {
      // Check if user is asking for product recommendations
      const isProductRequest = userMessage.toLowerCase().includes('recommend') || 
                              userMessage.toLowerCase().includes('suggest') ||
                              userMessage.toLowerCase().includes('product') ||
                              userMessage.toLowerCase().includes('furniture') ||
                              userMessage.toLowerCase().includes('buy') ||
                              userMessage.toLowerCase().includes('shop');

      if (isProductRequest) {
        // Simulate AI response with product recommendations
        setTimeout(() => {
          const recommendedProducts = sampleProducts.slice(0, 2); // Show 2 products
          setMessages((prev) => [
            ...prev,
            { 
              role: "assistant", 
              content: `Based on your request, here are some product recommendations that might interest you:`,
              products: recommendedProducts,
              timestamp: new Date().toISOString()
            },
          ]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Check if user wants to go to shop
      if (userMessage.toLowerCase().includes('shop') || userMessage.toLowerCase().includes('store')) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { 
              role: "assistant", 
              content: "I'd be happy to help you shop! Let me take you to our store where you can browse our full collection of furniture and home decor items.",
              timestamp: new Date().toISOString()
            },
          ]);
          setIsLoading(false);
          setTimeout(() => {
            navigate('/shop');
            setIsOpen(false);
          }, 1500);
        }, 1000);
        return;
      }

      // Check if user wants to use 3D planner
      if (userMessage.toLowerCase().includes('3d') || userMessage.toLowerCase().includes('planner') || userMessage.toLowerCase().includes('design')) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { 
              role: "assistant", 
              content: "Great! Our 3D planner is perfect for visualizing your space. Let me take you there so you can start designing your room.",
              timestamp: new Date().toISOString()
            },
          ]);
          setIsLoading(false);
          setTimeout(() => {
            navigate('/planner');
            setIsOpen(false);
          }, 1500);
        }, 1000);
        return;
      }

      // Regular AI chat
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { message: userMessage, conversationHistory: messages },
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: data.response,
          timestamp: new Date().toISOString()
        },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or feel free to browse our shop or try our 3D planner!",
          timestamp: new Date().toISOString()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    // Navigate to shop with product filter or show product details
    navigate('/shop');
    setIsOpen(false);
    toast.success(`Viewing ${product.name} in our shop!`);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
          variant="hero"
          data-ai-assistant
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[32rem] flex flex-col shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Product Recommendations */}
                    {message.products && message.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.products.map((product) => (
                          <div
                            key={product.id}
                            className="bg-background border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleProductClick(product)}
                          >
                            <div className="flex gap-3">
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                <Image className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                                <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {product.category}
                                  </Badge>
                                  <span className="text-xs font-medium text-primary">{product.price}</span>
                                </div>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                        <div className="pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              navigate('/shop');
                              setIsOpen(false);
                            }}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            View All Products
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <p className="text-sm text-muted-foreground">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about interior design..."
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
