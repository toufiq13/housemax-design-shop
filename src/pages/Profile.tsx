import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  LogOut, 
  Mail, 
  User, 
  Calendar, 
  Package, 
  Edit, 
  Save, 
  X, 
  MapPin, 
  Phone, 
  Home,
  Palette,
  Settings,
  Heart,
  Star,
  ShoppingBag,
  Plus,
  Trash2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  addresses: Address[];
  preferences: {
    favoriteStyle: string;
    budget: string;
    roomTypes: string[];
  };
}

interface AddressFormProps {
  address?: Address | null;
  onSave: (address: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: address?.type || 'home' as Address['type'],
    name: address?.name || '',
    address: address?.address || '',
    city: address?.city || '',
    state: address?.state || '',
    zipCode: address?.zipCode || '',
    country: address?.country || '',
    isDefault: address?.isDefault || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="addressType">Address Type</Label>
          <Select value={formData.type} onValueChange={(value: Address['type']) => updateFormData('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select address type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="addressName">Address Name</Label>
          <Input
            id="addressName"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="e.g., My Home, Office, etc."
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="streetAddress">Street Address</Label>
        <Input
          id="streetAddress"
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
          placeholder="Enter your street address"
          required
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
            placeholder="City"
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => updateFormData('state', e.target.value)}
            placeholder="State"
            required
          />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => updateFormData('zipCode', e.target.value)}
            placeholder="ZIP Code"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={formData.country}
          onChange={(e) => updateFormData('country', e.target.value)}
          placeholder="Country"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e) => updateFormData('isDefault', e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isDefault">Set as default address</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {address ? 'Update Address' : 'Add Address'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    addresses: [],
    preferences: {
      favoriteStyle: '',
      budget: '',
      roomTypes: []
    }
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    // Load saved profile data
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setIsEditing(false);
  };

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updatePreferences = (field: keyof UserProfile['preferences'], value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`
    };
    
    setProfile(prev => ({
      ...prev,
      addresses: [...prev.addresses, newAddress]
    }));
    
    setShowAddressDialog(false);
    toast.success('Address added successfully!');
  };

  const updateAddress = (addressId: string, updatedAddress: Omit<Address, 'id'>) => {
    setProfile(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => 
        addr.id === addressId 
          ? { ...updatedAddress, id: addressId }
          : addr
      )
    }));
    
    setShowAddressDialog(false);
    setEditingAddress(null);
    toast.success('Address updated successfully!');
  };

  const deleteAddress = (addressId: string) => {
    setProfile(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr.id !== addressId)
    }));
    toast.success('Address deleted successfully!');
  };

  const setDefaultAddress = (addressId: string) => {
    setProfile(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    }));
    toast.success('Default address updated!');
  };

  const openAddressDialog = (address?: Address) => {
    setEditingAddress(address || null);
    setShowAddressDialog(true);
  };

  const closeAddressDialog = () => {
    setShowAddressDialog(false);
    setEditingAddress(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">My Profile</h1>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveProfile} size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit} size="sm">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => updateProfile('firstName', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => updateProfile('lastName', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => updateProfile('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => updateProfile('bio', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Address Information
                    </CardTitle>
                    {isEditing && (
                      <Button 
                        size="sm" 
                        onClick={() => openAddressDialog()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.addresses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No addresses added yet</p>
                      {isEditing && (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => openAddressDialog()}
                        >
                          Add Your First Address
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.addresses.map((address) => (
                        <div 
                          key={address.id}
                          className={`p-4 border rounded-lg ${
                            address.isDefault ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{address.name}</h4>
                                <Badge variant={address.type === 'home' ? 'default' : address.type === 'work' ? 'secondary' : 'outline'}>
                                  {address.type}
                                </Badge>
                                {address.isDefault && (
                                  <Badge variant="default" className="bg-primary">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {address.address}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.zipCode}, {address.country}
                              </p>
                            </div>
                            {isEditing && (
                              <div className="flex gap-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openAddressDialog(address)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                {!address.isDefault && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDefaultAddress(address.id)}
                                  >
                                    <Star className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteAddress(address.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Design Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="favoriteStyle">Favorite Design Style</Label>
                    <Select 
                      value={profile.preferences.favoriteStyle} 
                      onValueChange={(value) => updatePreferences('favoriteStyle', value)}
                      disabled={!isEditing}
                    >
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
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select 
                      value={profile.preferences.budget} 
                      onValueChange={(value) => updatePreferences('budget', value)}
                      disabled={!isEditing}
                    >
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
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Preferred Room Types</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining Room', 'Office', 'Outdoor', 'Nursery'].map((roomType) => (
                        <div key={roomType} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={roomType}
                            checked={profile.preferences.roomTypes.includes(roomType)}
                            onChange={(e) => {
                              const currentTypes = profile.preferences.roomTypes;
                              const newTypes = e.target.checked
                                ? [...currentTypes, roomType]
                                : currentTypes.filter(type => type !== roomType);
                              updatePreferences('roomTypes', newTypes);
                            }}
                            disabled={!isEditing}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={roomType} className="text-sm">{roomType}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Theme</span>
                    <Badge variant="outline">{theme}</Badge>
                  </div>
                  <Button variant="destructive" onClick={handleSignOut} className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
                <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/orders')}
                >
                  <Package className="mr-2 h-4 w-4" />
                    View Orders
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/shop')}
                >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/planner')}
                >
                    <Home className="mr-2 h-4 w-4" />
                    3D Planner
                </Button>
              </CardContent>
            </Card>

              <Card>
            <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Statistics
                  </CardTitle>
            </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                    <Badge variant="secondary">0</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Saved Designs</span>
                    <Badge variant="secondary">0</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Favorites</span>
                    <Badge variant="secondary">0</Badge>
                  </div>
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={closeAddressDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          <AddressForm
            address={editingAddress}
            onSave={editingAddress ? (address) => updateAddress(editingAddress.id, address) : addAddress}
            onCancel={closeAddressDialog}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Profile;
