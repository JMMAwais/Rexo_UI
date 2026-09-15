import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Store, CreditCard, Truck, Bell, Shield } from "lucide-react";
import { toast } from "sonner";

const SellerSettings = () => {
  const handleSave = () => toast.success("Settings saved successfully!");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <SellerSidebar active="Settings" />
          <main className="flex-1 space-y-6">
            <h1 className="text-2xl font-bold text-foreground font-display">Store Settings</h1>

            {/* Store Info */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Store className="w-4 h-4 text-primary" /> Store Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Store Name</Label>
                    <Input defaultValue="TechVault" />
                  </div>
                  <div className="space-y-2">
                    <Label>Store URL Slug</Label>
                    <Input defaultValue="techvault" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Store Description</Label>
                  <Textarea defaultValue="Premium electronics and gadgets at the best prices in Pakistan." rows={3} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input type="email" defaultValue="contact@techvault.pk" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input defaultValue="+92 300 1234567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Store Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">TV</div>
                    <Button variant="outline" size="sm">Upload Logo</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" /> Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input defaultValue="HBL" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Title</Label>
                    <Input defaultValue="TechVault Pvt Ltd" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Account Number / IBAN</Label>
                    <Input defaultValue="PK36HABB0012345678901234" />
                  </div>
                  <div className="space-y-2">
                    <Label>Payout Schedule</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Accepted Payment Methods</p>
                  <div className="space-y-2">
                    {["Stripe", "PayFast (JazzCash/EasyPaisa)", "Cash on Delivery (COD)"].map((method) => (
                      <div key={method} className="flex items-center justify-between py-1">
                        <span className="text-sm text-muted-foreground">{method}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" /> Shipping Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Shipping Rate</Label>
                    <Input type="number" defaultValue="200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Free Shipping Above (Rs.)</Label>
                    <Input type="number" defaultValue="3000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Shipping Zones</Label>
                  <Select defaultValue="nationwide">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nationwide">Nationwide</SelectItem>
                      <SelectItem value="city">City Only</SelectItem>
                      <SelectItem value="province">Province Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Enable Express Delivery</p>
                    <p className="text-xs text-muted-foreground">Offer 1-2 day delivery at extra cost</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "New Order Alerts", desc: "Get notified when a new order is placed" },
                  { label: "Low Stock Warnings", desc: "Alert when product stock falls below 5" },
                  { label: "New Review Notifications", desc: "Get notified when customers leave reviews" },
                  { label: "Payout Confirmations", desc: "Email confirmation when payouts are processed" },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pb-8">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerSettings;
