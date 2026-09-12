import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Globe, Share2, Wrench } from "lucide-react";
import { toast } from "sonner";

interface Settings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  supportPhone: string;
  currency: string;
  timezone: string;
  language: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  googleAnalytics: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  linkedin: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowRegistration: boolean;
  allowGuestCheckout: boolean;
}

const KEY = "admin_settings";
const defaults: Settings = {
  siteName: "Marketplace",
  tagline: "Pakistan's premier multi-vendor marketplace",
  logoUrl: "",
  faviconUrl: "",
  contactEmail: "support@marketplace.pk",
  supportPhone: "+92 300 0000000",
  currency: "PKR",
  timezone: "Asia/Karachi",
  language: "en",
  metaTitle: "Marketplace — Shop from Pakistan's best sellers",
  metaDescription: "Discover thousands of products from verified sellers across Pakistan.",
  metaKeywords: "marketplace, pakistan, shopping, ecommerce",
  ogImage: "",
  googleAnalytics: "",
  facebook: "",
  instagram: "",
  twitter: "",
  youtube: "",
  linkedin: "",
  maintenanceMode: false,
  maintenanceMessage: "We're upgrading. Back shortly.",
  allowRegistration: true,
  allowGuestCheckout: true,
};

const AdminSettings = () => {
  const [s, setS] = useState<Settings>(defaults);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) try { setS({ ...defaults, ...JSON.parse(raw) }); } catch {}
  }, []);

  const update = <K extends keyof Settings>(k: K, v: Settings[K]) => setS({ ...s, [k]: v });
  const save = () => { localStorage.setItem(KEY, JSON.stringify(s)); toast.success("Settings saved"); };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">General site settings, SEO, social & maintenance mode</p>
          </div>
          <Button onClick={save}>Save Changes</Button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Settings" />
          <main className="flex-1">
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general"><SettingsIcon className="w-4 h-4 mr-1" />General</TabsTrigger>
                <TabsTrigger value="seo"><Globe className="w-4 h-4 mr-1" />SEO</TabsTrigger>
                <TabsTrigger value="social"><Share2 className="w-4 h-4 mr-1" />Social</TabsTrigger>
                <TabsTrigger value="system"><Wrench className="w-4 h-4 mr-1" />System</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <div className="bg-card rounded-lg shadow-card p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Site Name</Label><Input value={s.siteName} onChange={e => update("siteName", e.target.value)} /></div>
                    <div><Label>Tagline</Label><Input value={s.tagline} onChange={e => update("tagline", e.target.value)} /></div>
                    <div><Label>Logo URL</Label><Input value={s.logoUrl} onChange={e => update("logoUrl", e.target.value)} placeholder="https://…" /></div>
                    <div><Label>Favicon URL</Label><Input value={s.faviconUrl} onChange={e => update("faviconUrl", e.target.value)} placeholder="https://…" /></div>
                    <div><Label>Contact Email</Label><Input value={s.contactEmail} onChange={e => update("contactEmail", e.target.value)} /></div>
                    <div><Label>Support Phone</Label><Input value={s.supportPhone} onChange={e => update("supportPhone", e.target.value)} /></div>
                    <div><Label>Currency</Label>
                      <Select value={s.currency} onValueChange={v => update("currency", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PKR">PKR — Pakistani Rupee</SelectItem>
                          <SelectItem value="USD">USD — US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR — Euro</SelectItem>
                          <SelectItem value="GBP">GBP — Pound</SelectItem>
                          <SelectItem value="AED">AED — Dirham</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Timezone</Label>
                      <Select value={s.timezone} onValueChange={v => update("timezone", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Karachi">Asia/Karachi</SelectItem>
                          <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                          <SelectItem value="America/New_York">America/New_York</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Language</Label>
                      <Select value={s.language} onValueChange={v => update("language", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ur">Urdu</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo">
                <div className="bg-card rounded-lg shadow-card p-6 space-y-4">
                  <div><Label>Meta Title</Label><Input value={s.metaTitle} onChange={e => update("metaTitle", e.target.value)} /><p className="text-xs text-muted-foreground mt-1">{s.metaTitle.length}/60</p></div>
                  <div><Label>Meta Description</Label><Textarea value={s.metaDescription} onChange={e => update("metaDescription", e.target.value)} /><p className="text-xs text-muted-foreground mt-1">{s.metaDescription.length}/160</p></div>
                  <div><Label>Meta Keywords</Label><Input value={s.metaKeywords} onChange={e => update("metaKeywords", e.target.value)} placeholder="comma, separated, keywords" /></div>
                  <div><Label>OG Image URL</Label><Input value={s.ogImage} onChange={e => update("ogImage", e.target.value)} placeholder="1200×630 recommended" /></div>
                  <div><Label>Google Analytics ID</Label><Input value={s.googleAnalytics} onChange={e => update("googleAnalytics", e.target.value)} placeholder="G-XXXXXXXXXX" /></div>
                </div>
              </TabsContent>

              <TabsContent value="social">
                <div className="bg-card rounded-lg shadow-card p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Facebook</Label><Input value={s.facebook} onChange={e => update("facebook", e.target.value)} placeholder="https://facebook.com/…" /></div>
                    <div><Label>Instagram</Label><Input value={s.instagram} onChange={e => update("instagram", e.target.value)} placeholder="https://instagram.com/…" /></div>
                    <div><Label>Twitter / X</Label><Input value={s.twitter} onChange={e => update("twitter", e.target.value)} placeholder="https://x.com/…" /></div>
                    <div><Label>YouTube</Label><Input value={s.youtube} onChange={e => update("youtube", e.target.value)} placeholder="https://youtube.com/…" /></div>
                    <div><Label>LinkedIn</Label><Input value={s.linkedin} onChange={e => update("linkedin", e.target.value)} placeholder="https://linkedin.com/…" /></div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="system">
                <div className="bg-card rounded-lg shadow-card p-6 space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div><div className="font-medium">Maintenance Mode</div><div className="text-xs text-muted-foreground">Hide the site from visitors while you make updates.</div></div>
                    <Switch checked={s.maintenanceMode} onCheckedChange={c => update("maintenanceMode", c)} />
                  </div>
                  {s.maintenanceMode && (
                    <div><Label>Maintenance Message</Label><Textarea value={s.maintenanceMessage} onChange={e => update("maintenanceMessage", e.target.value)} /></div>
                  )}
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div><div className="font-medium">Allow New Registrations</div><div className="text-xs text-muted-foreground">Let new users create accounts.</div></div>
                    <Switch checked={s.allowRegistration} onCheckedChange={c => update("allowRegistration", c)} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div><div className="font-medium">Allow Guest Checkout</div><div className="text-xs text-muted-foreground">Buyers can checkout without an account.</div></div>
                    <Switch checked={s.allowGuestCheckout} onCheckedChange={c => update("allowGuestCheckout", c)} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
