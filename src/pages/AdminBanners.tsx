import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Megaphone, Image as ImageIcon, Save } from "lucide-react";
import {
  getPromoStrip, savePromoStrip, getBanners, saveBanners,
  type PromoStrip, type MidBanner,
  PROMO_BG_OPTIONS, GRADIENT_OPTIONS,
} from "@/lib/banner-store";
import { toast } from "sonner";

const AdminBanners = () => {
  const [promo, setPromo] = useState<PromoStrip>(getPromoStrip());
  const [banners, setBanners] = useState<MidBanner[]>(getBanners());

  const handleSavePromo = () => {
    savePromoStrip(promo);
    toast.success("Promo strip updated");
  };

  const updateBanner = (id: string, patch: Partial<MidBanner>) => {
    const next = banners.map((b) => (b.id === id ? { ...b, ...patch } : b));
    setBanners(next);
  };

  const handleSaveBanners = () => {
    saveBanners(banners);
    toast.success("Banners saved");
  };

  const handleToggle = (id: string, enabled: boolean) => {
    const next = banners.map((b) => (b.id === id ? { ...b, enabled } : b));
    setBanners(next);
  };

  const handleAdd = () => {
    const newBanner: MidBanner = {
      id: `b${Date.now()}`,
      title: "New Offer Banner",
      subtitle: "Compelling subtitle to attract customers",
      ctaText: "Shop Now",
      ctaHref: "/products",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=500&fit=crop",
      gradient: GRADIENT_OPTIONS[0].value,
      enabled: true,
      badge: "20% OFF",
    };
    setBanners([...banners, newBanner]);
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground font-display">Banner Manager</h1>
          <p className="text-sm text-muted-foreground">Control what customers see on the homepage</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Banners" />

          <main className="flex-1 space-y-6">
            {/* Promo Strip */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Top Promo Strip</h2>
                    <p className="text-xs text-muted-foreground">Announcement bar above the navbar</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Show</Label>
                  <Switch
                    checked={promo.enabled}
                    onCheckedChange={(v) => setPromo({ ...promo, enabled: v })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={promo.text}
                    onChange={(e) => setPromo({ ...promo, text: e.target.value })}
                    className="bg-secondary border-0"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Select value={promo.bgColor} onValueChange={(v) => setPromo({ ...promo, bgColor: v })}>
                    <SelectTrigger className="bg-secondary border-0"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROMO_BG_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Live preview */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Live Preview</Label>
                  <div className={`${promo.bgColor} text-primary-foreground rounded-lg`}>
                    <div className="px-4 py-2 text-center text-sm font-medium">
                      {promo.text || "Your message here"}
                    </div>
                  </div>
                </div>

                <Button onClick={handleSavePromo} className="gap-2">
                  <Save className="w-4 h-4" /> Save Promo Strip
                </Button>
              </div>
            </Card>

            {/* Mid-page Banners */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Offer Banners</h2>
                    <p className="text-xs text-muted-foreground">Add multiple offers — all active ones show on the homepage</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleAdd} className="gap-2">
                  <Plus className="w-4 h-4" /> Add Banner
                </Button>
              </div>

              <div className="space-y-4">
                {banners.map((b) => (
                  <div key={b.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Switch checked={b.enabled} onCheckedChange={(v) => handleToggle(b.id, v)} />
                        <Label className="text-sm font-medium">{b.enabled ? "Active" : "Hidden"}</Label>
                        {b.enabled && <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/15">Live</Badge>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(b.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Title</Label>
                        <Input value={b.title} onChange={(e) => updateBanner(b.id, { title: e.target.value })} className="bg-secondary border-0" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Subtitle</Label>
                        <Input value={b.subtitle} onChange={(e) => updateBanner(b.id, { subtitle: e.target.value })} className="bg-secondary border-0" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">CTA Button Text</Label>
                        <Input value={b.ctaText} onChange={(e) => updateBanner(b.id, { ctaText: e.target.value })} className="bg-secondary border-0" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">CTA Link (e.g. /products)</Label>
                        <Input value={b.ctaHref} onChange={(e) => updateBanner(b.id, { ctaHref: e.target.value })} className="bg-secondary border-0" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs">Discount Badge (optional, e.g. "50% OFF")</Label>
                        <Input value={b.badge || ""} onChange={(e) => updateBanner(b.id, { badge: e.target.value })} className="bg-secondary border-0" placeholder="50% OFF" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs">Background Image URL</Label>
                        <Input value={b.image} onChange={(e) => updateBanner(b.id, { image: e.target.value })} className="bg-secondary border-0" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs">Color Overlay</Label>
                        <Select value={b.gradient} onValueChange={(v) => updateBanner(b.id, { gradient: v })}>
                          <SelectTrigger className="bg-secondary border-0"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {GRADIENT_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Mini preview */}
                    <div className="relative rounded-lg overflow-hidden h-24">
                      <img src={b.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${b.gradient}`} />
                      <div className="relative z-10 h-full flex items-center px-4">
                        <div>
                          <p className="text-background font-bold text-sm">{b.title}</p>
                          <p className="text-background/80 text-xs">{b.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {banners.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">No banners yet — add one to get started</div>
                )}

                <Button onClick={handleSaveBanners} className="gap-2">
                  <Save className="w-4 h-4" /> Save All Banners
                </Button>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminBanners;
