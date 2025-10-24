import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CreditCard, CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { stripeService } from "@/lib/stripe";
import { exchangeRateService } from "@/lib/exchangerate";
import { loadStripe } from '@stripe/stripe-js';

const Payment = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [convertedTotal, setConvertedTotal] = useState(0);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (items.length === 0) {
      navigate('/shop');
      return;
    }
  }, [isAuthenticated, items, navigate]);

  // Load exchange rates and set user's preferred currency
  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        setIsLoadingRates(true);
        const userCurrency = exchangeRateService.getUserCurrency();
        setSelectedCurrency(userCurrency);
        
        if (userCurrency !== 'USD') {
          const rates = await exchangeRateService.getCachedRates('USD');
          const rate = rates[userCurrency] || 1;
          setExchangeRate(rate);
          setConvertedTotal(getTotalPrice() * rate);
        } else {
          setConvertedTotal(getTotalPrice());
        }
      } catch (error) {
        console.error('Error loading exchange rates:', error);
        setConvertedTotal(getTotalPrice());
      } finally {
        setIsLoadingRates(false);
      }
    };

    loadExchangeRates();
  }, [getTotalPrice]);

  // Handle currency change
  const handleCurrencyChange = async (currency: string) => {
    try {
      setIsLoadingRates(true);
      setSelectedCurrency(currency);
      
      if (currency !== 'USD') {
        const rates = await exchangeRateService.getCachedRates('USD');
        const rate = rates[currency] || 1;
        setExchangeRate(rate);
        setConvertedTotal(getTotalPrice() * rate);
      } else {
        setExchangeRate(1);
        setConvertedTotal(getTotalPrice());
      }
    } catch (error) {
      console.error('Error converting currency:', error);
      toast.error('Failed to convert currency');
    } finally {
      setIsLoadingRates(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');
    
    try {
      // Create Stripe payment intent
      const paymentIntent = await stripeService.createPaymentIntent(
        convertedTotal,
        selectedCurrency.toLowerCase(),
        {
          order_id: `ORD-${Date.now()}`,
          user_email: formData.email,
          items: JSON.stringify(items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })))
        }
      );

      // Confirm payment with Stripe
      const result = await stripeService.confirmPayment(paymentIntent.client_secret);
      
      if (result.success) {
        // Create order
        const order = {
          id: `ORD-${Date.now()}`,
          date: new Date().toISOString(),
          status: 'processing' as const,
          total: convertedTotal,
          currency: selectedCurrency,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.category,
        })),
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        paymentMethod: `Stripe Payment`,
        paymentIntentId: paymentIntent.id,
      };

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.unshift(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      setPaymentStep('success');
      clearCart();
      toast.success('Payment successful! Your order has been placed.');
    } else {
      throw new Error(result.error || 'Payment failed');
    }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStep('form');
      toast.error('Payment failed. Please try again.');
    }
  };

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-12">
                <LoadingSpinner size="lg" text="Processing Payment..." />
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/orders')} variant="default">
                    View Orders
                  </Button>
                  <Button onClick={() => navigate('/shop')} variant="outline">
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/shop')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
            <h1 className="text-4xl font-bold">Checkout</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="123 Main St"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          placeholder="10001"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">Qty: {item.quantity}</Badge>
                          </div>
                        </div>
                        <p className="font-semibold">{item.price}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Currency Selector */}
                  <div className="mb-4">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      value={selectedCurrency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      disabled={isLoadingRates}
                    >
                      {exchangeRateService.getCommonCurrencies().map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                    {isLoadingRates && (
                      <p className="text-sm text-muted-foreground mt-1">Loading exchange rates...</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span>{exchangeRateService.formatCurrency(getTotalPrice(), selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{exchangeRateService.formatCurrency(getTotalPrice() * 0.08, selectedCurrency)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{exchangeRateService.formatCurrency(convertedTotal * 1.08, selectedCurrency)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    onClick={handleSubmit}
                  >
                    Complete Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;
