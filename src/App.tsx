import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RecommendationProvider } from "@/contexts/RecommendationContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Planner from "./pages/Planner";
import PlanViewer from "./pages/PlanViewer";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { supabase } from "./supabase";
import ReactGA from "react-ga4";

const queryClient = new QueryClient();

const GA_ID = "G-1B7J4M18BF";

// ✅ Component to handle route change tracking
const GAListener = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize(GA_ID);
  }, []);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
    console.log("📊 Tracked page:", location.pathname);
  }, [location]);

  return null;
};

const App = () => {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from("test").select("*");
      if (error) {
        console.error("❌ Supabase connection error:", error);
      } else {
        console.log("✅ Supabase connected! Data:", data);
      }
    }
    testConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <RecommendationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <GAListener /> {/* ✅ Tracks page views */}
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/planner" element={<Planner />} />
                    <Route path="/planner/view" element={<PlanViewer />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </RecommendationProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;