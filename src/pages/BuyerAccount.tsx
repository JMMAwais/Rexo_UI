import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle,  DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  User, Package, MapPin, Lock, Heart, LogOut, Bell,
  Pencil, Trash2, Plus, Eye, Star, CreditCard, Shield,
} from "lucide-react";
import { formatPrice } from "@/lib/mock-data";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  items: number;
  total: number;
  preview: string;
  productName: string;
}

const initialAddresses: Address[] = [
  {
    id: "a1", label: "Home", fullName: "Ali Raza", phone: "+92 300 1234567",
    line1: "House 12, Street 4, DHA Phase 5", city: "Lahore", province: "Punjab",
    postalCode: "54000", isDefault: true,
  },
  {
    id: "a2", label: "Office", fullName: "Ali Raza", phone: "+92 300 1234567",
    line1: "Plot 88, Gulberg III", city: "Lahore", province: "Punjab",
    postalCode: "54660", isDefault: false,
  },
];

const orders: Order[] = [
  { id: "ORD-10245", date: "2026-07-02", status: "delivered", items: 2, total: 11498, productName: "Wireless Noise Cancelling Headphones", preview: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
  { id: "ORD-10231", date: "2026-06-24", status: "shipped", items: 1, total: 3499, productName: "Premium Leather Crossbody Bag", preview: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop" },
  { id: "ORD-10198", date: "2026-06-10", status: "processing", items: 3, total: 8197, productName: "Minimalist Ceramic Vase Set", preview: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=200&h=200&fit=crop" },
  { id: "ORD-10112", date: "2026-05-18", status: "cancelled", items: 1, total: 14999, productName: "Smart Watch Series Pro", preview: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=200&h=200&fit=crop" },
  { id: "ORD-10087", date: "2026-05-02", status: "returned", items: 1, total: 5999, productName: "Vintage Denim Jacket", preview: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop" },
];

const statusColors: Record<Order["status"], string> = {
  processing: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  returned: "bg-muted text-muted-foreground border-border",
};

const BuyerAccount = () => {
  const [profile, setProfile] = useState({
    firstName: "Ali",
    lastName: "Raza",
    email: "ali.raza@example.com",
    phone: "+92 300 1234567",
    dob: "1995-04-12",
    gender: "male",
  });

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
    priceDrops: true,
  });

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  const orderCounts = {
    total: orders.length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  const handleSaveProfile = () => toast.success("Profile updated successfully");

  const handleSaveAddress = () => {
    if (!editingAddress) return;
    if (!editingAddress.fullName || !editingAddress.line1 || !editingAddress.city) {
      toast.error("Please fill all required fields");
      return;
    }
    const exists = addresses.find(a => a.id === editingAddress.id);
    let next = exists
      ? addresses.map(a => (a.id === editingAddress.id ? editingAddress : a))
      : [...addresses, { ...editingAddress, id: `a${Date.now()}` }];
    if (editingAddress.isDefault) {
      next = next.map(a => ({ ...a, isDefault: a.id === (exists ? editingAddress.id : next[next.length - 1].id) }));
    }
    setAddresses(next);
    setAddressDialogOpen(false);
    setEditingAddress(null);
    toast.success(exists ? "Address updated" : "Address added");
  };

  const openNewAddress = () => {
    setEditingAddress({
      id: "", label: "Home", fullName: "", phone: "", line1: "",
      city: "", province: "", postalCode: "", isDefault: addresses.length === 0,
    });
    setAddressDialogOpen(true);
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success("Address deleted");
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success("Default address updated");
  };

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.next) {
      toast.error("Please fill all fields");
      return;
    }
    if (passwords.next.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setPasswords({ current: "", next: "", confirm: "" });
    toast.success("Password changed successfully");
  };


    const { logout } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = () => {
    logout();
    navigate("/");
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center text-primary-foreground text-2xl font-bold font-display">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-display text-foreground">
              Hi, {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
           <Button variant="outline" size="sm" className="gap-2" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Orders", value: orderCounts.total, icon: Package },
            { label: "Processing", value: orderCounts.processing, icon: CreditCard },
            { label: "Shipped", value: orderCounts.shipped, icon: Package },
            { label: "Delivered", value: orderCounts.delivered, icon: Package },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto p-1">
            <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Profile</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2"><Package className="w-4 h-4" /> Orders</TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2"><MapPin className="w-4 h-4" /> Addresses</TabsTrigger>
            <TabsTrigger value="password" className="gap-2"><Lock className="w-4 h-4" /> Password</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile" className="mt-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold font-display text-foreground mb-1">Personal Information</h2>
              <p className="text-sm text-muted-foreground mb-6">Update your personal details below</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input type="date" value={profile.dob} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not">Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold font-display text-foreground">My Orders</h2>
                  <p className="text-sm text-muted-foreground">Track and manage your purchases</p>
                </div>
                <Link to="/orders">
                  <Button variant="outline" size="sm">Track Order</Button>
                </Link>
              </div>

              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border rounded-lg hover:bg-secondary/40 transition-colors">
                    <img src={order.preview} alt={order.productName} className="w-16 h-16 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-foreground text-sm">{order.id}</span>
                        <Badge variant="outline" className={`text-xs capitalize ${statusColors[order.status]}`}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{order.productName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} • {order.items} item{order.items > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">{formatPrice(order.total)}</div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" className="gap-1 h-8">
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm" className="gap-1 h-8">
                            <Star className="w-3.5 h-3.5" /> Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Addresses */}
          <TabsContent value="addresses" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold font-display text-foreground">Saved Addresses</h2>
                  <p className="text-sm text-muted-foreground">Manage your shipping and billing addresses</p>
                </div>
                <Button onClick={openNewAddress} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Add Address
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 border border-border rounded-lg relative">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{addr.label}</Badge>
                        {addr.isDefault && <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">Default</Badge>}
                      </div>
                    </div>
                    <div className="text-sm text-foreground font-medium">{addr.fullName}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {addr.line1}<br />
                      {addr.city}, {addr.province} {addr.postalCode}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{addr.phone}</div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                      {!addr.isDefault && (
                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setDefaultAddress(addr.id)}>
                          Set Default
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => { setEditingAddress(addr); setAddressDialogOpen(true); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-destructive hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this address?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteAddress(addr.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>

              {addresses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No addresses saved yet</p>
                </div>
              )}
            </Card>

            <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingAddress?.id ? "Edit Address" : "Add New Address"}</DialogTitle>
                </DialogHeader>
                {editingAddress && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={editingAddress.label}
                          onChange={(e) => setEditingAddress({ ...editingAddress, label: e.target.value })}
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={editingAddress.fullName} onChange={(e) => setEditingAddress({ ...editingAddress, fullName: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={editingAddress.phone} onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea rows={2} value={editingAddress.line1} onChange={(e) => setEditingAddress({ ...editingAddress, line1: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input value={editingAddress.city} onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Province</Label>
                        <Input value={editingAddress.province} onChange={(e) => setEditingAddress({ ...editingAddress, province: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Postal Code</Label>
                        <Input value={editingAddress.postalCode} onChange={(e) => setEditingAddress({ ...editingAddress, postalCode: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Label htmlFor="isDefault" className="cursor-pointer">Set as default address</Label>
                      <Switch id="isDefault" checked={editingAddress.isDefault} onCheckedChange={(v) => setEditingAddress({ ...editingAddress, isDefault: v })} />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveAddress}>Save Address</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Password */}
          <TabsContent value="password" className="mt-6">
            <Card className="p-6 max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold font-display text-foreground">Change Password</h2>
                  <p className="text-sm text-muted-foreground">Use at least 8 characters</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleChangePassword}>Update Password</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold font-display text-foreground mb-1">Notification Preferences</h2>
              <p className="text-sm text-muted-foreground mb-6">Choose what you want to hear from us</p>
              <div className="space-y-4">
                {[
                  { key: "orderUpdates" as const, title: "Order Updates", desc: "Status changes, shipping and delivery notifications" },
                  { key: "promotions" as const, title: "Promotions & Offers", desc: "Discounts, coupons, and special promotions" },
                  { key: "newArrivals" as const, title: "New Arrivals", desc: "Latest products from your favorite sellers" },
                  { key: "priceDrops" as const, title: "Price Drops", desc: "Alerts when wishlist items go on sale" },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <div className="font-medium text-foreground text-sm">{n.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
                    </div>
                    <Switch
                      checked={notifications[n.key]}
                      onCheckedChange={(v) => setNotifications({ ...notifications, [n.key]: v })}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                <Heart className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Your Wishlist</div>
                  <div className="text-xs text-muted-foreground">Manage your saved products</div>
                </div>
                <Link to="/wishlist">
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default BuyerAccount;
