import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Banknote, Lock, MapPin, Plus, Shield, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/mock-data";
import { PLACEHOLDER_IMAGE } from "@/lib/productsApi";
import {
  addAddressApi,
  fetchMyAddresses,
  fetchShippingEstimate,
  placeOrderApi,
  type NewAddress,
} from "@/lib/ordersApi";
import { useAuth } from "@/context/AuthContext";
import { cartItemKey, useCart } from "@/context/CartContext";

const emptyForm = {
  fullName: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "Pakistan",
  zipCode: "",
  label: "",
};

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { cart, isLoading: cartLoading } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [savingAddress, setSavingAddress] = useState(false);
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);

  const addressesKey = ["addresses", user?.email ?? "guest"];
  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: addressesKey,
    queryFn: fetchMyAddresses,
    enabled: !!user,
  });

  // Default (ya pehla) address khud chun lo
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId((addresses.find((a) => a.isDefault) ?? addresses[0]).id);
    }
  }, [addresses, selectedAddressId]);

  const orderLines = useMemo(
    () =>
      cart.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        variantId: i.variantId,
      })),
    [cart.items]
  );

  const linesSignature = orderLines.map((l) => `${l.productId}:${l.variantId ?? ""}:${l.quantity}`).join("|");
  const { data: shipping, isLoading: shippingLoading } = useQuery({
    queryKey: ["shipping-estimate", linesSignature],
    queryFn: () => fetchShippingEstimate(orderLines),
    enabled: orderLines.length > 0,
  });

  const total = cart.totalAmount + (shipping ?? 0);
  const formVisible = showForm || (!addressesLoading && addresses.length === 0);

  const setField = (key: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSaveAddress = async () => {
    const f = form;
    if (!f.fullName.trim() || !f.phoneNumber.trim() || !f.addressLine1.trim() ||
        !f.city.trim() || !f.state.trim() || !f.country.trim() || !f.zipCode.trim()) {
      toast.error("Address ki saari zaroori fields bharein");
      return;
    }
    if (f.phoneNumber.replace(/\D/g, "").length < 10) {
      toast.error("Sahi phone number likhein");
      return;
    }

    const payload: NewAddress = {
      fullName: f.fullName.trim(),
      phoneNumber: f.phoneNumber.trim(),
      addressLine1: f.addressLine1.trim(),
      addressLine2: f.addressLine2.trim() || null,
      city: f.city.trim(),
      state: f.state.trim(),
      country: f.country.trim(),
      zipCode: f.zipCode.trim(),
      isDefault: addresses.length === 0,
      label: f.label.trim() || null,
    };

    setSavingAddress(true);
    try {
      const saved = await addAddressApi(payload);
      await queryClient.invalidateQueries({ queryKey: addressesKey });
      setSelectedAddressId(saved.id);
      setForm(emptyForm);
      setShowForm(false);
      toast.success("Address save ho gaya");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Address save nahi ho saka");
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Pehle delivery address chunein ya add karein");
      return;
    }
    setPlacing(true);
    try {
      const order = await placeOrderApi({
        items: orderLines,
        addressId: selectedAddressId,
        notes: notes.trim() || null,
      });

      navigate("/order-placed", {
        replace: true,
        state: { order, paymentMethod: "Cash on Delivery" },
      });

    
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Order cannot be placed");
    } finally {
      setPlacing(false);
    }
  };

  // ── Guards ──
  if (!user) {
    return (
      <Shell>
        <div className="text-center py-20">
          <Lock className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">For Checkout, Please Login</p>
          <Link to="/login" state={{ from: { pathname: "/checkout" } }}>
            <Button>Login</Button>
          </Link>
        </div>
      </Shell>
    );
  }

  if (cartLoading) {
    return (
      <Shell>
        <div className="h-64 rounded-lg bg-secondary animate-pulse" />
      </Shell>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Shell>
        <div className="text-center py-20">
          <ShoppingBag className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery address */}
          <div className="bg-card rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Delivery Address
              </h2>
              {addresses.length > 0 && !formVisible && (
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowForm(true)}>
                  <Plus className="w-3 h-3" /> New address
                </Button>
              )}
            </div>

            {addressesLoading ? (
              <div className="h-24 rounded-md bg-secondary animate-pulse" />
            ) : (
              <>
                {addresses.length > 0 && (
                  <div className="space-y-3">
                    {addresses.map((a) => (
                      <label
                        key={a.id}
                        className={`flex gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedAddressId === a.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-1 accent-primary"
                          checked={selectedAddressId === a.id}
                          onChange={() => setSelectedAddressId(a.id)}
                        />
                        <div className="text-sm">
                          <p className="font-medium text-foreground">
                            {a.fullName}
                            {a.label && (
                              <span className="ml-2 text-xs text-muted-foreground">({a.label})</span>
                            )}
                            {a.isDefault && (
                              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                Default
                              </span>
                            )}
                          </p>
                          <p className="text-muted-foreground">
                            {a.addressLine1}
                            {a.addressLine2 ? `, ${a.addressLine2}` : ""}, {a.city}, {a.state} {a.zipCode},{" "}
                            {a.country}
                          </p>
                          <p className="text-muted-foreground">{a.phoneNumber}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {formVisible && (
                  <div className={addresses.length > 0 ? "mt-5 pt-5 border-t border-border" : ""}>
                    <p className="text-sm font-medium text-foreground mb-3">
                      {addresses.length > 0 ? "New address" : "Add Delivery address"}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Full name *</Label>
                        <Input value={form.fullName} onChange={(e) => setField("fullName", e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs">Phone *</Label>
                        <Input
                          value={form.phoneNumber}
                          onChange={(e) => setField("phoneNumber", e.target.value)}
                          placeholder="03xx xxxxxxx"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs">Address line 1 *</Label>
                        <Input
                          value={form.addressLine1}
                          onChange={(e) => setField("addressLine1", e.target.value)}
                          placeholder="House / street / area"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs">Address line 2</Label>
                        <Input
                          value={form.addressLine2}
                          onChange={(e) => setField("addressLine2", e.target.value)}
                          placeholder="Apartment, landmark (optional)"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">City *</Label>
                        <Input value={form.city} onChange={(e) => setField("city", e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs">Province / State *</Label>
                        <Input value={form.state} onChange={(e) => setField("state", e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs">Country *</Label>
                        <Input value={form.country} onChange={(e) => setField("country", e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs">Postal code *</Label>
                        <Input value={form.zipCode} onChange={(e) => setField("zipCode", e.target.value)} />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs">Label (Home, Office...)</Label>
                        <Input value={form.label} onChange={(e) => setField("label", e.target.value)} />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleSaveAddress} disabled={savingAddress}>
                        {savingAddress ? "Saving..." : "Save address"}
                      </Button>
                      {addresses.length > 0 && (
                        <Button variant="outline" onClick={() => setShowForm(false)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Payment */}
          <div className="bg-card rounded-lg shadow-card p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Payment Method
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-primary bg-primary/5">
                <Banknote className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Pay on Delivery</p>
                </div>
                <span className="w-4 h-4 rounded-full border-4 border-primary" />
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border opacity-50">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">SafePay (Card / Wallet / Bank)</p>
                  <p className="text-xs text-muted-foreground">Comming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card rounded-lg shadow-card p-6">
            <Label className="text-sm font-semibold text-foreground">Order notes (optional)</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={300}
              rows={3}
              placeholder="Any instructions for the sellers..."
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card rounded-lg shadow-card p-6 h-fit sticky top-24">
          <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={cartItemKey(item)} className="flex gap-3">
                <img
                  src={item.productImage ?? PLACEHOLDER_IMAGE}
                  alt={item.productTitle}
                  className="w-12 h-12 rounded-md object-cover bg-secondary"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground line-clamp-1">{item.productTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <span className="text-xs font-semibold text-foreground">{formatPrice(item.totalPrice)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(cart.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>
                {shippingLoading ? "..." : shipping === 0 ? "Free" : formatPrice(shipping ?? 0)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border text-base">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Payment: Cash on Delivery</p>
          </div>

          <Button
            className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handlePlaceOrder}
            disabled={placing || shippingLoading || !selectedAddressId}
          >
            {placing ? "Placing order..." : `Place Order · ${formatPrice(total)}`}
          </Button>
          {!selectedAddressId && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
            Select dilivery address before placing order
            </p>
          )}
        </div>
      </div>
    </Shell>
  );
};

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8 font-display">Checkout</h1>
      {children}
    </div>
    <Footer />
  </div>
);

export default Checkout;