import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Palette, Layers, ShoppingBag, Sparkles, X, Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { consultationService } from "@/lib/database";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import ScrollReveal from "@/components/ScrollReveal";
import RecommendedProducts from "@/components/RecommendedProducts";
import heroImage from "@/assets/hero-interior.jpg";

const Home = () => {
  const { user } = useAuth();
  const [showDesignConsultation, setShowDesignConsultation] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    phone: '',
    roomType: '',
    style: '',
    budget: '',
    timeline: '',
    message: ''
  });

  // Sample products data for recommendations with realistic images
  const products = [
    {
      id: 1,
      name: "Modern Sectional Sofa",
      price: "₹1,07,817",
      category: "Furniture",
      subcategory: "Sofas & Couches",
      image: "/products/living_room_sofa.png",
      description: "Comfortable and stylish sectional sofa perfect for modern living spaces",
      tags: ["modern", "comfortable", "sectional", "gray"],
      popularity: 0.9,
      rating: 4.8,
      trending: true
    },
    {
      id: 2,
      name: "Luxury Chesterfield Sofa",
      price: "₹1,57,617",
      category: "Furniture",
      subcategory: "Sofas & Couches",
      image: "/products/chesterfield_sofa.png",
      description: "Classic Chesterfield design with premium leather upholstery",
      tags: ["luxury", "leather", "classic", "brown"],
      popularity: 0.8,
      rating: 4.7,
      trending: true
    },
    {
      id: 3,
      name: "Minimalist Loveseat",
      price: "₹66,317",
      category: "Furniture",
      subcategory: "Sofas & Couches",
      image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop&q=80",
      description: "Clean lines and minimalist design for contemporary homes",
      tags: ["minimalist", "modern", "compact", "white"],
      popularity: 0.7,
      rating: 4.5,
      trending: false
    },
    {
      id: 4,
      name: "Premium Recliner Chair",
      price: "₹74,617",
      category: "Furniture",
      subcategory: "Armchairs & Recliners",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop&q=80",
      description: "Ultra-comfortable recliner with massage function and cup holders",
      tags: ["recliner", "comfortable", "massage", "brown"],
      popularity: 0.8,
      rating: 4.6,
      trending: true
    },
    {
      id: 5,
      name: "Designer Accent Chair",
      price: "₹53,867",
      category: "Furniture",
      subcategory: "Armchairs & Recliners",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop&q=80",
      description: "Stylish accent chair with unique geometric pattern",
      tags: ["accent", "designer", "geometric", "colorful"],
      popularity: 0.6,
      rating: 4.3,
      trending: false
    },
    {
      id: 6,
      name: "Wingback Reading Chair",
      price: "₹62,167",
      category: "Furniture",
      subcategory: "Armchairs & Recliners",
      image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop&q=80",
      description: "Classic wingback chair perfect for reading and relaxation",
      tags: ["wingback", "reading", "classic", "navy"],
      popularity: 0.5,
      rating: 4.2,
      trending: false
    },
    {
      id: 7,
      name: "Glass Coffee Table",
      price: "₹33,117",
      category: "Furniture",
      subcategory: "Coffee Tables & Side Tables",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80",
      description: "Elegant glass coffee table with metal frame",
      tags: ["glass", "modern", "metal", "elegant"],
      popularity: 0.7,
      rating: 4.4,
      trending: false
    },
    {
      id: 8,
      name: "Wooden Side Table Set",
      price: "₹24,817",
      category: "Furniture",
      subcategory: "Coffee Tables & Side Tables",
      image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop&q=80",
      description: "Set of two matching wooden side tables with storage",
      tags: ["wood", "storage", "set", "natural"],
      popularity: 0.6,
      rating: 4.3,
      trending: false
    },
    {
      id: 9,
      name: "Marble Coffee Table",
      price: "₹99,517",
      category: "Furniture",
      subcategory: "Coffee Tables & Side Tables",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80",
      description: "Luxury marble coffee table with gold accents",
      tags: ["marble", "luxury", "gold", "premium"],
      popularity: 0.8,
      rating: 4.7,
      trending: true
    },
    {
      id: 10,
      name: "Farmhouse Dining Table",
      price: "₹1,07,817",
      category: "Furniture",
      subcategory: "Dining Tables & Chairs",
      image: "/products/dining_table_modern.png",
      description: "Rustic farmhouse dining table seating 8 people",
      tags: ["farmhouse", "rustic", "wood", "large"],
      popularity: 0.7,
      rating: 4.5,
      trending: false
    },
    {
      id: 11,
      name: "Modern Dining Chair Set",
      price: "₹49,717",
      category: "Furniture",
      subcategory: "Dining Tables & Chairs",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop&q=80",
      description: "Set of 4 modern dining chairs with upholstered seats",
      tags: ["modern", "upholstered", "set", "comfortable"],
      popularity: 0.6,
      rating: 4.3,
      trending: false
    },
    {
      id: 12,
      name: "Extendable Dining Table",
      price: "₹1,32,717",
      category: "Furniture",
      subcategory: "Dining Tables & Chairs",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop&q=80",
      description: "Versatile extendable dining table for 6-10 people",
      tags: ["extendable", "versatile", "wood", "spacious"],
      popularity: 0.8,
      rating: 4.6,
      trending: true
    },
    {
      id: 13,
      name: "King Size Platform Bed",
      price: "₹99,517",
      category: "Furniture",
      subcategory: "Beds",
      image: "/products/luxury_bedroom.png",
      description: "Modern platform bed with built-in storage drawers",
      tags: ["king", "platform", "storage", "modern"],
      popularity: 0.9,
      rating: 4.8,
      trending: true
    },
    {
      id: 14,
      name: "Queen Size Upholstered Bed",
      price: "₹74,617",
      category: "Furniture",
      subcategory: "Beds",
      image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop&q=80",
      description: "Luxurious upholstered bed with tufted headboard",
      tags: ["queen", "upholstered", "tufted", "luxury"],
      popularity: 0.8,
      rating: 4.7,
      trending: true
    },
    {
      id: 15,
      name: "Single Daybed",
      price: "₹49,717",
      category: "Furniture",
      subcategory: "Beds",
      image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop&q=80",
      description: "Versatile daybed perfect for guest rooms or small spaces",
      tags: ["single", "daybed", "versatile", "compact"],
      popularity: 0.5,
      rating: 4.2,
      trending: false
    },
    {
      id: 16,
      name: "Crystal Chandelier",
      price: "₹1,57,617",
      category: "Lighting",
      subcategory: "Chandeliers",
      image: "/products/crystal_chandelier.png",
      description: "Elegant crystal chandelier with 12 lights",
      tags: ["crystal", "elegant", "luxury", "dining"],
      popularity: 0.8,
      rating: 4.7,
      trending: true
    },
    {
      id: 17,
      name: "Modern Geometric Chandelier",
      price: "₹66,317",
      category: "Lighting",
      subcategory: "Chandeliers",
      image: "/products/crystal_chandelier.png",
      description: "Contemporary geometric chandelier with LED lights",
      tags: ["modern", "geometric", "LED", "contemporary"],
      popularity: 0.7,
      rating: 4.5,
      trending: false
    },
    {
      id: 18,
      name: "Adjustable Floor Lamp",
      price: "₹24,817",
      category: "Lighting",
      subcategory: "Floor Lamps",
      image: "/products/arc_floor_lamp.png",
      description: "Modern floor lamp with adjustable height and brightness",
      tags: ["adjustable", "modern", "brightness", "reading"],
      popularity: 0.6,
      rating: 4.3,
      trending: false
    },
    {
      id: 19,
      name: "Arc Floor Lamp",
      price: "₹37,267",
      category: "Lighting",
      subcategory: "Floor Lamps",
      image: "/products/arc_floor_lamp.png",
      description: "Stylish arc floor lamp perfect for reading corners",
      tags: ["arc", "stylish", "reading", "corner"],
      popularity: 0.7,
      rating: 4.4,
      trending: false
    },
    {
      id: 20,
      name: "Ceramic Table Lamp",
      price: "₹12,367",
      category: "Lighting",
      subcategory: "Table Lamps",
      image: "/products/white_ceramic_vases.png",
      description: "Handcrafted ceramic table lamp with fabric shade",
      tags: ["ceramic", "handcrafted", "fabric", "bedside"],
      popularity: 0.5,
      rating: 4.1,
      trending: false
    }
  ];

  const openInteriorDesignConsultation = () => {
    setShowDesignConsultation(true);
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await consultationService.createConsultation({
        user_id: user?.id || null,
        name: consultationForm.name,
        email: consultationForm.email,
        phone: consultationForm.phone || null,
        room_type: consultationForm.roomType || null,
        style: consultationForm.style || null,
        budget: consultationForm.budget || null,
        timeline: consultationForm.timeline || null,
        message: consultationForm.message,
        status: 'pending'
      });

      toast.success('Thank you! We\'ll contact you within 24 hours to schedule your consultation.');
      setShowDesignConsultation(false);
      setConsultationForm({
        name: '',
        email: '',
        phone: '',
        roomType: '',
        style: '',
        budget: '',
        timeline: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting consultation:', error);
      toast.error('Failed to submit consultation. Please try again.');
    }
  };

  const updateConsultationForm = (field: string, value: string) => {
    setConsultationForm(prev => ({ ...prev, [field]: value }));
  };

  const features = [
    {
      icon: Palette,
      title: "Interior Design",
      description: "Expert design consultation and personalized style recommendations",
    },
    {
      icon: Layers,
      title: "3D Planning",
      description: "Visualize your space in 3D before making any changes",
    },
    {
      icon: ShoppingBag,
      title: "Premium Products",
      description: "Curated collection of high-quality interior furnishings",
    },
    {
      icon: Sparkles,
      title: "AI Assistant",
      description: "Get instant design advice powered by artificial intelligence",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AIAssistant />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Transform Your
                <motion.span
                  className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Living Space
                </motion.span>
              </h1>
              <motion.p
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Expert interior design, premium products, and AI-powered planning—all in one place.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link to="/shop">
                  <Button variant="hero" size="lg" className="group">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/planner">
                  <Button variant="outline" size="lg">
                    Try 3D Planner
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-[var(--gradient-hero)] rounded-3xl blur-3xl opacity-30"></div>
              <motion.img
                src={heroImage}
                alt="Beautiful modern interior design"
                className="relative rounded-3xl shadow-2xl w-full h-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive tools and services for your interior design journey
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-border hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent
                      className="p-6 space-y-4"
                      onClick={() => {
                        switch (feature.title) {
                          case 'Interior Design':
                            // Open interior design consultation modal or navigate to design page
                            openInteriorDesignConsultation();
                            break;
                          case '3D Planning':
                            window.location.href = '/planner';
                            break;
                          case 'Premium Products':
                            window.location.href = '/shop';
                            break;
                          case 'AI Assistant': {
                            // Trigger AI assistant
                            const aiButton = document.querySelector('[data-ai-assistant]') as HTMLElement;
                            if (aiButton) {
                              aiButton.click();
                            }
                            break;
                          }
                          default:
                            break;
                        }
                      }}
                    >
                      <motion.div
                        className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <feature.icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                      <div className="pt-2">
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products Section */}
      <RecommendedProducts products={products} />

      {/* Design Section */}
      <section id="design-section" className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Professional Interior Design</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our expert designers work with you to create beautiful, functional spaces that reflect your personal style and meet your lifestyle needs.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <Palette className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Style Consultation</h3>
                  <p className="text-muted-foreground">
                    Get personalized style recommendations based on your preferences and space requirements.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <Layers className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Space Planning</h3>
                  <p className="text-muted-foreground">
                    Optimize your space layout for maximum functionality and visual appeal.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Product Selection</h3>
                  <p className="text-muted-foreground">
                    Curated furniture and decor selections that perfectly match your design vision.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <ScrollReveal>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
                <CardContent className="p-12 text-center space-y-6">
                  <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Join thousands of homeowners who have transformed their spaces with HOUSEMAX
                  </p>
                  <Link to="/auth">
                    <Button variant="hero" size="lg" className="group">
                      Create Free Account
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* Interior Design Consultation Modal */}
      <Dialog open={showDesignConsultation} onOpenChange={setShowDesignConsultation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Free Interior Design Consultation
            </DialogTitle>
            <DialogDescription>
              Get personalized design advice from our expert interior designers. Fill out the form below and we'll contact you within 24 hours.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConsultationSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={consultationForm.name}
                  onChange={(e) => updateConsultationForm('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={consultationForm.email}
                  onChange={(e) => updateConsultationForm('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={consultationForm.phone}
                  onChange={(e) => updateConsultationForm('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label htmlFor="roomType">Room Type *</Label>
                <Select value={consultationForm.roomType} onValueChange={(value) => updateConsultationForm('roomType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="living-room">Living Room</SelectItem>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="bathroom">Bathroom</SelectItem>
                    <SelectItem value="dining-room">Dining Room</SelectItem>
                    <SelectItem value="office">Home Office</SelectItem>
                    <SelectItem value="outdoor">Outdoor Space</SelectItem>
                    <SelectItem value="entire-home">Entire Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="style">Preferred Style</Label>
                <Select value={consultationForm.style} onValueChange={(value) => updateConsultationForm('style', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="traditional">Traditional</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="scandinavian">Scandinavian</SelectItem>
                    <SelectItem value="bohemian">Bohemian</SelectItem>
                    <SelectItem value="farmhouse">Farmhouse</SelectItem>
                    <SelectItem value="contemporary">Contemporary</SelectItem>
                    <SelectItem value="not-sure">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Select value={consultationForm.budget} onValueChange={(value) => updateConsultationForm('budget', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-5k">Under $5,000</SelectItem>
                    <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="over-100k">Over $100,000</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="timeline">Project Timeline</Label>
              <Select value={consultationForm.timeline} onValueChange={(value) => updateConsultationForm('timeline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="When would you like to start?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="3-months">Within 3 months</SelectItem>
                  <SelectItem value="6-months">Within 6 months</SelectItem>
                  <SelectItem value="planning">Just planning for now</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Tell us about your project *</Label>
              <Textarea
                id="message"
                value={consultationForm.message}
                onChange={(e) => updateConsultationForm('message', e.target.value)}
                placeholder="Describe your space, what you're looking to achieve, any specific requirements or challenges..."
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <Calendar className="mr-2 h-4 w-4" />
                Request Free Consultation
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowDesignConsultation(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Home;
