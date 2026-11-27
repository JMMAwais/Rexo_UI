import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  User, Package, MapPin, Lock, Heart, LogOut,
  Pencil, Trash2, Plus, Eye, Star, CreditCard, Shield,
} from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";
import { changePasswordApi, fetchMyProfile, updateProfileApi } from "@/lib/accountApi";
import {
  addAddressApi, deleteAddressApi, fetchMyAddresses, fetchMyOrders,
  setDefaultAddressApi, updateAddressApi, type Address,
} from "@/lib/ordersApi";
import { overallStatus, statusBadge } from "@/lib/orderStatus";

interface AddressForm {
  id: string;
  label: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

const emptyAddress = (isDefault: boolean): AddressForm => ({
  id: "", label: "Home", fullName: "", phoneNumber: "", addressLine1: "", addressLine2: "",
  city: "", state: "", country: "Pakistan", zipCode: "", isDefault,
});

const toForm = (a: Address): AddressForm => ({
  id: a.id, label: a.label ?? "Home", fullName: a.fullName, phoneNumber: a.phoneNumber,
  addressLine1: a.addressLine1, addressLine2: a.addressLine2 ?? "", city: a.city,
  state: a.state, country: a.country, zipCode: a.zipCode, isDefault: a.isDefault,
});

const BuyerAccount = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const email = user?.email ?? "guest";

  // ── Data (asli backend se) ───────────────────────────
  const { data: profileData } = useQuery({
    queryKey: ["account", "profile", email],
    queryFn: fetchMyProfile,
    enabled: !!user,
  });

  const { data: ordersPage, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", "account", email],
    queryFn: () => fetchMyOrders(1, 50),
    enabled: !!user,
  });

  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses", email],
    queryFn: fetchMyAddresses,
    enabled: !!user,
  });

  const orders = useMemo(() => ordersPage?.items ?? [], [ordersPage]);

  const counts = useMemo(() => {
    const statuses = orders.map(overallStatus);
    return {
      total: ordersPage?.totalCount ?? 0,
      processing: statuses.filter((s) => s === "Pending" || s === "Confirmed" || s === "Processing").length,
      shipped: statuses.filter((s) => s === "Shipped").length,
      delivered: statuses.filter((s) => s === "Delivered").length,
    };
  }, [orders, ordersPage]);

  // ── Profile ──────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", phoneNumber: "" });

  useEffect(() => {
    if (profileData) {
      setProfileForm({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber ?? "",
      });
    }
  }, [profileData]);

  const fallbackName = (user?.fullName ?? "").trim();
  const firstName = profileData?.firstName ?? fallbackName.split(" ")[0] ?? "";
  const lastName = profileData?.lastName ?? fallbackName.split(" ").slice(1).join(" ");
  const displayName = `${firstName} ${lastName}`.trim() || user?.email || "";
  const initials =
    `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || (user?.email?.[0]?.toUpperCase() ?? "?");

  const saveProfile = useMutation({
    mutationFn: () =>
      updateProfileApi({
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phoneNumber: profileForm.phoneNumber.trim() || null,
      }),
    onSuccess: async () => {
      toast.success("Profile updated successfully");
      // Navbar / AuthContext ka naam bhi taza karo
      try {
        const raw = localStorage.getItem("rexo_user");
        if (raw) {
          const saved = JSON.parse(raw);
          saved.fullName = `${profileForm.firstName.trim()} ${profileForm.lastName.trim()}`.trim();
          localStorage.setItem("rexo_user", JSON.stringify(saved));
          window.dispatchEvent(new Event("rexo-token-refreshed"));
        }
      } catch {
        /* localStorage na mile to koi masla nahi */
      }
      await queryClient.invalidateQueries({ queryKey: ["account", "profile"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSaveProfile = () => {
    if (!profileForm.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    saveProfile.mutate();
  };

  // ── Addresses ────────────────────────────────────────
  const [editing, setEditing] = useState<AddressForm | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const refreshAddresses = () => queryClient.invalidateQueries({ queryKey: ["addresses"] });

  const saveAddress = useMutation({
    mutationFn: async (a: AddressForm) => {
      const base = {
        fullName: a.fullName.trim(),
        phoneNumber: a.phoneNumber.trim(),
        addressLine1: a.addressLine1.trim(),
        addressLine2: a.addressLine2.trim() || null,
        city: a.city.trim(),
        state: a.state.trim(),
        country: a.country.trim() || "Pakistan",
        zipCode: a.zipCode.trim(),
      };
      if (a.id) {
        await updateAddressApi({ addressId: a.id, ...base });
        const wasDefault = addresses.find((x) => x.id === a.id)?.isDefault ?? false;
        if (a.isDefault && !wasDefault) await setDefaultAddressApi(a.id);
      } else {
        await addAddressApi({ ...base, isDefault: a.isDefault, label: a.label });
      }
    },
    onSuccess: async (_data, a) => {
      toast.success(a.id ? "Address updated" : "Address added");
      setDialogOpen(false);
      setEditing(null);
      await refreshAddresses();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeAddress = useMutation({
    mutationFn: (id: string) => deleteAddressApi(id),
    onSuccess: async () => {
      toast.success("Address deleted");
      await refreshAddresses();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const makeDefault = useMutation({
    mutationFn: (id: string) => setDefaultAddressApi(id),
    onSuccess: async () => {
      toast.success("Default address updated");
      await refreshAddresses();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSaveAddress = () => {
    if (!editing) return;
    const required = [editing.fullName, editing.phoneNumber, editing.addressLine1, editing.city, editing.state, editing.zipCode];
    if (required.some((v) => !v.trim())) {
      toast.error("Please fill all required fields");
      return;
    }
    saveAddress.mutate(editing);
  };

  const openNewAddress = () => {
    setEditing(emptyAddress(addresses.length === 0));
    setDialogOpen(true);
  };

  // ── Password ─────────────────────────────────────────
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  const changePassword = useMutation({
    mutationFn: () =>
      changePasswordApi({
        currentPassword: passwords.current,
        newPassword: passwords.next,
        confirmNewPassword: passwords.confirm,
      }),
    onSuccess: () => {
      setPasswords({ current: "", next: "", confirm: "" });
      toast.success("Password changed. Please login again.");
      logout();
      navigate("/login");
    },
    onError: (err: Error) => toast.error(err.message),
  });

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
    changePassword.mutate();
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-md text-center">
          <Card className="p-8 space-y-4">
            <h1 className="text-xl font-semibold font-display text-foreground">Please sign in</h1>
            <p className="text-sm text-muted-foreground">Sign in to see your account, orders and addresses.</p>
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center text-primary-foreground text-2xl font-bold font-display">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-display text-foreground">Hi, {displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link to="/wishlist">
                <Heart className="w-4 h-4" /> Wishlist
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Orders", value: counts.total, icon: Package },
            { label: "Processing", value: counts.processing, icon: CreditCard },
            { label: "Shipped", value: counts.shipped, icon: Package },
            { label: "Delivered", value: counts.delivered, icon: Package },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{ordersLoading ? "..." : s.value}</div>
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
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile" className="mt-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold font-display text-foreground mb-1">Personal Information</h2>
              <p className="text-sm text-muted-foreground mb-6">Update your personal details below</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={profileForm.phoneNumber}
                    placeholder="03xx xxxxxxx"
                    onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveProfile} disabled={saveProfile.isPending}>
                  {saveProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
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
                  <Button variant="outline" size="sm">All Orders</Button>
                </Link>
              </div>

              {ordersLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const status = overallStatus(order);
                    const items = order.subOrders.flatMap((s) => s.items);
                    const first = items[0];
                    const itemCount = items.reduce((n, i) => n + i.quantity, 0);
                    const title = first
                      ? items.length > 1
                        ? `${first.productTitle} +${items.length - 1} more`
                        : first.productTitle
                      : "Order";

                    return (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border rounded-lg hover:bg-secondary/40 transition-colors"
                      >
                        {first?.productImage ? (
                          <img src={first.productImage} alt={title} className="w-16 h-16 rounded-md object-cover" />
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-secondary" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-foreground text-sm">{order.orderNumber}</span>
                            <Badge variant="outline" className={`text-xs ${statusBadge[status] ?? ""}`}>
                              {status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} • {itemCount} item{itemCount > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground">{formatPrice(order.totalAmount)}</div>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" className="gap-1 h-8" asChild>
                              <Link to={`/orders/${order.id}`}>
                                <Eye className="w-3.5 h-3.5" /> View
                              </Link>
                            </Button>
                            {status === "Delivered" && first && (
                              <Button variant="outline" size="sm" className="gap-1 h-8" asChild>
                                <Link to={`/product/${first.productId}`}>
                                  <Star className="w-3.5 h-3.5" /> Review
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {(ordersPage?.totalCount ?? 0) > orders.length && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Showing your latest {orders.length} orders.{" "}
                  <Link to="/orders" className="text-primary hover:underline">See all</Link>
                </p>
              )}
            </Card>
          </TabsContent>

          {/* Addresses */}
          <TabsContent value="addresses" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold font-display text-foreground">Saved Addresses</h2>
                  <p className="text-sm text-muted-foreground">Manage your shipping addresses</p>
                </div>
                <Button onClick={openNewAddress} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Add Address
                </Button>
              </div>

              {addressesLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Loading addresses...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border border-border rounded-lg relative">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{addr.label ?? "Address"}</Badge>
                          {addr.isDefault && (
                            <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">Default</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-foreground font-medium">{addr.fullName}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                        <br />
                        {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{addr.phoneNumber}</div>

                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                        {!addr.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            disabled={makeDefault.isPending}
                            onClick={() => makeDefault.mutate(addr.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => {
                            setEditing(toForm(addr));
                            setDialogOpen(true);
                          }}
                        >
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
                              <AlertDialogAction onClick={() => removeAddress.mutate(addr.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!addressesLoading && addresses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No addresses saved yet</p>
                </div>
              )}
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editing?.id ? "Edit Address" : "Add New Address"}</DialogTitle>
                </DialogHeader>
                {editing && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-60"
                          value={editing.label}
                          disabled={!!editing.id}
                          onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input value={editing.fullName} onChange={(e) => setEditing({ ...editing, fullName: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input value={editing.phoneNumber} onChange={(e) => setEditing({ ...editing, phoneNumber: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Address *</Label>
                      <Textarea rows={2} value={editing.addressLine1} onChange={(e) => setEditing({ ...editing, addressLine1: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Address line 2</Label>
                      <Input value={editing.addressLine2} onChange={(e) => setEditing({ ...editing, addressLine2: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Province *</Label>
                        <Input value={editing.state} onChange={(e) => setEditing({ ...editing, state: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Postal Code *</Label>
                        <Input value={editing.zipCode} onChange={(e) => setEditing({ ...editing, zipCode: e.target.value })} />
                      </div>
                    </div>
                    {!(editing.id && addresses.find((a) => a.id === editing.id)?.isDefault) && (
                      <div className="flex items-center justify-between pt-2">
                        <Label htmlFor="isDefault" className="cursor-pointer">Set as default address</Label>
                        <Switch
                          id="isDefault"
                          checked={editing.isDefault}
                          onCheckedChange={(v) => setEditing({ ...editing, isDefault: v })}
                        />
                      </div>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveAddress} disabled={saveAddress.isPending}>
                    {saveAddress.isPending ? "Saving..." : "Save Address"}
                  </Button>
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
                  <p className="text-sm text-muted-foreground">Use at least 8 characters. You will be signed out after changing it.</p>
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
                  <Button onClick={handleChangePassword} disabled={changePassword.isPending}>
                    {changePassword.isPending ? "Updating..." : "Update Password"}
                  </Button>
                </div>
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