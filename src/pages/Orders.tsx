import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { 
  Package, 
  Calendar, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock, 
  X, 
  MapPin, 
  Phone, 
  RefreshCw,
  Eye,
  Download,
  Star
} from "lucide-react";

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: number;
    name: string;
    price: string;
    quantity: number;
    image: string;
    category: string;
  }>;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  carrier?: string;
  progress?: number;
}

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    // Load sample orders with enhanced data
    const sampleOrders: Order[] = [
      {
        id: 'ORD-001',
        date: '2024-01-15',
        status: 'shipped',
        total: 1299,
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2024-01-20',
        carrier: 'FedEx',
        progress: 75,
        items: [
          {
            id: 1,
            name: 'Modern Sectional Sofa',
            price: '$1,299',
            quantity: 1,
            image: '/placeholder.svg',
            category: 'Living Room'
          }
        ],
        shippingAddress: '123 Main St, New York, NY 10001',
        paymentMethod: 'Credit Card ending in 1234'
      },
      {
        id: 'ORD-002',
        date: '2024-01-10',
        status: 'delivered',
        total: 899,
        trackingNumber: 'TRK987654321',
        estimatedDelivery: '2024-01-12',
        carrier: 'UPS',
        progress: 100,
        items: [
          {
            id: 2,
            name: 'Glass Coffee Table',
            price: '$599',
            quantity: 1,
            image: '/placeholder.svg',
            category: 'Living Room'
          },
          {
            id: 3,
            name: 'LED Floor Lamp',
            price: '$299',
            quantity: 1,
            image: '/placeholder.svg',
            category: 'Lighting'
          }
        ],
        shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
        paymentMethod: 'PayPal'
      },
      {
        id: 'ORD-003',
        date: '2024-01-18',
        status: 'processing',
        total: 599,
        progress: 25,
        items: [
          {
            id: 4,
            name: 'Storage Ottoman',
            price: '$299',
            quantity: 2,
            image: '/placeholder.svg',
            category: 'Storage'
          }
        ],
        shippingAddress: '789 Pine St, Chicago, IL 60601',
        paymentMethod: 'Credit Card ending in 5678'
      }
    ];

    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(sampleOrders);
      localStorage.setItem('orders', JSON.stringify(sampleOrders));
    }
    setLoading(false);
  }, [isAuthenticated, navigate]);

  const cancelOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' as const }
        : order
    ));
    localStorage.setItem('orders', JSON.stringify(orders));
    toast.success('Order cancelled successfully');
  };

  const trackOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowTrackingDialog(true);
  };

  const reorderItems = (order: Order) => {
    // Add items to cart and navigate to shop
    toast.success('Items added to cart! Redirecting to shop...');
    setTimeout(() => {
      navigate('/shop');
    }, 1500);
  };

  const downloadInvoice = (order: Order) => {
    // Simulate invoice download
    toast.success('Invoice downloaded successfully!');
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">My Orders</h1>
            <Button onClick={() => navigate('/shop')} variant="outline">
              Continue Shopping
            </Button>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Button onClick={() => navigate('/shop')}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4" />
                            {order.paymentMethod}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <p className="text-lg font-semibold mt-2">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Items Ordered</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium">{item.name}</h5>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">Qty: {item.quantity}</p>
                                <p className="text-sm text-muted-foreground">{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2">Shipping Address</h4>
                        <p className="text-muted-foreground">{order.shippingAddress}</p>
                      </div>
                      
                      {/* Progress Bar */}
                      {order.progress !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Order Progress</span>
                            <span>{order.progress}%</span>
                          </div>
                          <Progress value={order.progress} className="h-2" />
                        </div>
                      )}

                      {/* Tracking Info */}
                      {order.trackingNumber && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Truck className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">Tracking Information</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tracking Number:</span>
                              <span className="font-mono">{order.trackingNumber}</span>
                            </div>
                            {order.carrier && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Carrier:</span>
                                <span>{order.carrier}</span>
                              </div>
                            )}
                            {order.estimatedDelivery && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Estimated Delivery:</span>
                                <span>{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-4">
                        {order.trackingNumber && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => trackOrder(order)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Track Order
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadInvoice(order)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Invoice
                        </Button>
                        {order.status === 'delivered' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => reorderItems(order)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Reorder
                          </Button>
                        )}
                        {(order.status === 'pending' || order.status === 'processing') && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => cancelOrder(order.id)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tracking Dialog */}
      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Order Tracking - {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Tracking Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tracking Number:</span>
                    <p className="font-mono font-medium">{selectedOrder.trackingNumber}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Carrier:</span>
                    <p className="font-medium">{selectedOrder.carrier}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated Delivery:</span>
                    <p className="font-medium">
                      {selectedOrder.estimatedDelivery 
                        ? new Date(selectedOrder.estimatedDelivery).toLocaleDateString()
                        : 'TBD'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              {selectedOrder.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Delivery Progress</span>
                    <span>{selectedOrder.progress}%</span>
                  </div>
                  <Progress value={selectedOrder.progress} className="h-3" />
                </div>
              )}

              {/* Tracking Timeline */}
              <div className="space-y-4">
                <h4 className="font-medium">Tracking Timeline</h4>
                <div className="space-y-3">
                  {selectedOrder.status === 'delivered' && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Delivered</p>
                        <p className="text-xs text-muted-foreground">
                          Package delivered to {selectedOrder.shippingAddress}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'shipped' && (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">In Transit</p>
                          <p className="text-xs text-muted-foreground">
                            Package is on its way to destination
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Package className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-sm">Shipped</p>
                          <p className="text-xs text-muted-foreground">
                            Package left our facility
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Package className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-sm">Processing</p>
                        <p className="text-xs text-muted-foreground">
                          Your order is being prepared for shipment
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">Order Confirmed</p>
                      <p className="text-xs text-muted-foreground">
                        Order placed on {new Date(selectedOrder.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-2">
                <h4 className="font-medium">Shipping Address</h4>
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm">{selectedOrder.shippingAddress}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Orders;
