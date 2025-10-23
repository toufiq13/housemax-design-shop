import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Palette, Layers, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import ScrollReveal from "@/components/ScrollReveal";
import heroImage from "@/assets/hero-interior.jpg";

const Home = () => {
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
                            // Scroll to a design section or navigate to a design page
                            document.getElementById('design-section')?.scrollIntoView({ behavior: 'smooth' });
                            break;
                          case '3D Planning':
                            window.location.href = '/planner';
                            break;
                          case 'Premium Products':
                            window.location.href = '/shop';
                            break;
                          case 'AI Assistant':
                            // Trigger AI assistant
                            const aiButton = document.querySelector('[data-ai-assistant]') as HTMLElement;
                            if (aiButton) {
                              aiButton.click();
                            }
                            break;
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

      <Footer />
    </div>
  );
};

export default Home;
