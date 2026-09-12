import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatPrice, sellers } from "@/lib/mock-data";
import {
  Truck, Search, Download, CheckCircle2, RefreshCw, Link2, Package,
  Store, Globe, Timer, TrendingUp, Trash2, Settings2,
} from "lucide-react";
import { toast } from "sonner";

interface CjProduct {
  id: string;
  name: string;
  image: string;
  cost: number;
  suggested: number;
  warehouse: string;
  shipDays: string;
  orders: number;
  stock: number;
  category: string;
}

const cjCatalog: CjProduct[] = [
  { id: "CJ-10241", name: "Wireless Bluetooth Earbuds Pro TWS", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", cost: 2100, suggested: 4999, warehouse: "China", shipDays: "8-14", orders: 12480, stock: 5320, category: "Electronics" },
  { id: "CJ-10388", name: "Smart Fitness Watch with Heart Monitor", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", cost: 3400, suggested: 7999, warehouse: "China", shipDays: "10-16", orders: 8320, stock: 2140, category: "Electronics" },
  { id: "CJ-10455", name: "Portable Mini Blender 500ml USB", image: "https://images.unsplash.com/photo-1610478920392-95888b4b3b04?w=400&h=400&fit=crop", cost: 1750, suggested: 3899, warehouse: "USA", shipDays: "4-7", orders: 6210, stock: 890, category: "Home" },
  { id: "CJ-10512", name: "LED Ring Light Tripod Stand 10\"", image: "https://images.unsplash.com/photo-1587826080692-6c0e4a1c1f52?w=400&h=400&fit=crop", cost: 2600, suggested: 5499, warehouse: "China", shipDays: "9-15", orders: 4390, stock: 1610, category: "Electronics" },
  { id: "CJ-10677", name: "Anti-Theft Backpack USB Charging", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", cost: 2950, suggested: 6499, warehouse: "China", shipDays: "8-14", orders: 9760, stock: 3400, category: "Fashion" },
  { id: "CJ-10709", name: "Silicone Kitchen Utensil Set (12 pcs)", image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=400&fit=crop", cost: 1450, suggested: 3299, warehouse: "USA", shipDays: "3-6", orders: 3120, stock: 760, category: "Home" },
  { id: "CJ-10814", name: "Car Phone Holder Magnetic Mount", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=400&fit=crop", cost: 620, suggested: 1699, warehouse: "China", shipDays: "8-14", orders: 15210, stock: 8900, category: "Automotive" },
  { id: "CJ-10902", name: "Skincare Facial Cleansing Brush", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop", cost: 980, suggested: 2499, warehouse: "China", shipDays: "9-15", orders: 5410, stock: 2210, category: "Beauty" },
];

const SellerDropshipping = () => {
  const [connected, setConnected] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [syncing, setSyncing] = useState<string | null>(null);
  const [imported, setImported] = useState<CjProduct[]>([]);
  const [storeId, setStoreId] = useState(sellers[0]?.id ?? "1");
  const [markup, setMarkup] = useState("120");
  const [autoStock, setAutoStock] = useState(true);
  const [detail, setDetail] = useState<CjProduct | null>(null);

  const categories = ["All", ...Array.from(new Set(cjCatalog.map((p) => p.category)))];
  const filtered = cjCatalog.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase()))
  );

  const storeName = sellers.find((s) => s.id === storeId)?.name ?? "My Store";
  const sellPrice = (p: CjProduct) => Math.round(p.cost * (1 + Number(markup || 0) / 100));

  const handleConnect = () => {
    if (!email || !apiKey) {
      toast.error("CJ email aur API key dono zaroori hain");
      return;
    }
    setConnected(true);
    toast.success("CJ Dropshipping account connected");
  };

  const handleSync = (p: CjProduct) => {
    if (!connected) {
      toast.error("Pehle CJ account connect karein");
      return;
    }
    if (imported.some((i) => i.id === p.id)) {
      toast.info("Ye product already synced hai");
      return;
    }
    setSyncing(p.id);
    setTimeout(() => {
      setImported((prev) => [...prev, p]);
      setSyncing(null);
      toast.success(`${p.name} → ${storeName} par sync ho gaya`);
    }, 1200);
  };

  const handleSyncAll = () => {
    if (!connected) {
      toast.error("Pehle CJ account connect karein");
      return;
    }
    const fresh = filtered.filter((p) => !imported.some((i) => i.id === p.id));
    if (!fresh.length) {
      toast.info("Saare filtered products already synced hain");
      return;
    }
    setSyncing("all");
    setTimeout(() => {
      setImported((prev) => [...prev, ...fresh]);
      setSyncing(null);
      toast.success(`${fresh.length} products ${storeName} par sync ho gaye`);
    }, 1600);
  };

  const stats = [
    { label: "CJ Catalog", value: cjCatalog.length.toLocaleString(), icon: Globe },
    { label: "Synced Products", value: imported.length, icon: Package },
    { label: "Avg. Ship Time", value: "8-14 days", icon: Timer },
    { label: "Est. Margin", value: `${markup || 0}%`, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <SellerSidebar active="Dropshipping" />

          <main className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground font-display flex items-center gap-2">
                  <Truck className="w-6 h-6 text-primary" />
                  CJ Dropshipping
                </h1>
                <p className="text-sm text-muted-foreground">
                  CJ catalog browse karein aur ek click par apne store par sync karein.
                </p>
              </div>
              <Badge variant={connected ? "default" : "secondary"} className="gap-1.5">
                <span className={`w-2 h-2 rounded-full ${connected ? "bg-primary-foreground" : "bg-muted-foreground"}`} />
                {connected ? "Connected" : "Not Connected"}
              </Badge>
            </div>

            {/* Connection */}
            <div className="bg-card rounded-lg shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">API Connection</h2>
              </div>
              {connected ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{email}</p>
                      <p className="text-xs text-muted-foreground">Access token valid · CJ API v2</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setConnected(false)}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5">
                    <Label htmlFor="cjEmail" className="text-xs">CJ Account Email</Label>
                    <Input id="cjEmail" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cjKey" className="text-xs">CJ API Key</Label>
                    <Input id="cjKey" type="password" placeholder="••••••••••••" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                  </div>
                  <Button onClick={handleConnect} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Connect CJ Account
                  </Button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-card rounded-lg shadow-card p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <s.icon className="w-4 h-4" />
                    <span className="text-xs">{s.label}</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Sync settings */}
            <div className="bg-card rounded-lg shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings2 className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Sync Settings</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="store" className="text-xs">Target Store</Label>
                  <select
                    id="store"
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="markup" className="text-xs">Price Markup (%)</Label>
                  <Input id="markup" inputMode="numeric" value={markup} onChange={(e) => setMarkup(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Auto Stock Sync</Label>
                  <button
                    onClick={() => setAutoStock((v) => !v)}
                    className={`w-full h-10 rounded-md border text-sm transition-colors ${
                      autoStock ? "border-primary bg-primary/5 text-foreground" : "border-input text-muted-foreground"
                    }`}
                  >
                    {autoStock ? "Enabled — stock auto update" : "Disabled"}
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog + Imported */}
            <Tabs defaultValue="catalog">
              <TabsList>
                <TabsTrigger value="catalog">CJ Catalog</TabsTrigger>
                <TabsTrigger value="imported">Synced Products ({imported.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="catalog" className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder="CJ products search karein (name ya CJ ID)"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <Button variant="outline" onClick={handleSyncAll} disabled={syncing === "all"}>
                    {syncing === "all" ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Sync All Filtered
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((p) => {
                    const done = imported.some((i) => i.id === p.id);
                    const busy = syncing === p.id || syncing === "all";
                    return (
                      <div key={p.id} className="bg-card rounded-lg shadow-card overflow-hidden flex flex-col">
                        <button onClick={() => setDetail(p)} className="relative aspect-square bg-secondary">
                          <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 text-[10px] font-mono bg-background/90 px-1.5 py-0.5 rounded">
                            {p.id}
                          </span>
                          {done && (
                            <span className="absolute top-2 right-2 text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                              Synced
                            </span>
                          )}
                        </button>
                        <div className="p-4 flex-1 flex flex-col gap-2">
                          <p className="text-sm font-medium text-foreground line-clamp-2">{p.name}</p>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1"><Globe className="w-3 h-3" />{p.warehouse}</span>
                            <span className="inline-flex items-center gap-1"><Timer className="w-3 h-3" />{p.shipDays} days</span>
                          </div>
                          <div className="flex items-end justify-between mt-auto pt-2">
                            <div>
                              <p className="text-[11px] text-muted-foreground">CJ cost {formatPrice(p.cost)}</p>
                              <p className="text-base font-bold text-foreground">{formatPrice(sellPrice(p))}</p>
                            </div>
                            <span className="text-[11px] text-muted-foreground">{p.orders.toLocaleString()} orders</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleSync(p)}
                            disabled={busy || done}
                            variant={done ? "outline" : "default"}
                            className="w-full"
                          >
                            {busy ? (
                              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                            ) : done ? (
                              <><CheckCircle2 className="w-4 h-4 mr-2" /> In Store</>
                            ) : (
                              <><Download className="w-4 h-4 mr-2" /> Sync to Store</>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {!filtered.length && (
                  <p className="text-sm text-muted-foreground text-center py-10">Koi CJ product nahi mila.</p>
                )}
              </TabsContent>

              <TabsContent value="imported" className="mt-4">
                <div className="bg-card rounded-lg shadow-card overflow-hidden">
                  {imported.length ? (
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/50 text-muted-foreground">
                        <tr>
                          <th className="text-left font-medium px-4 py-3">Product</th>
                          <th className="text-left font-medium px-4 py-3 hidden md:table-cell">CJ ID</th>
                          <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Store</th>
                          <th className="text-left font-medium px-4 py-3">Sell Price</th>
                          <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Stock</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {imported.map((p) => (
                          <tr key={p.id} className="border-t border-border">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={p.image} alt={p.name} loading="lazy" className="w-10 h-10 rounded object-cover" />
                                <span className="text-foreground line-clamp-1">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{p.id}</td>
                            <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                              <span className="inline-flex items-center gap-1"><Store className="w-3.5 h-3.5" />{storeName}</span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-foreground">{formatPrice(sellPrice(p))}</td>
                            <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{p.stock}</td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setImported((prev) => prev.filter((i) => i.id !== p.id));
                                  toast.success("Product store se remove ho gaya");
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-14">
                      <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Abhi koi product sync nahi kiya gaya.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Product detail */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{detail.name}</DialogTitle>
                <DialogDescription className="text-xs font-mono">{detail.id} · CJ Dropshipping</DialogDescription>
              </DialogHeader>
              <div className="flex gap-4">
                <img src={detail.image} alt={detail.name} className="w-32 h-32 rounded-lg object-cover" />
                <div className="text-sm space-y-1.5 flex-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">CJ Cost</span><span className="text-foreground">{formatPrice(detail.cost)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Suggested</span><span className="text-foreground">{formatPrice(detail.suggested)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Your Price</span><span className="font-semibold text-foreground">{formatPrice(sellPrice(detail))}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Warehouse</span><span className="text-foreground">{detail.warehouse}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-foreground">{detail.shipDays} days</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Stock</span><span className="text-foreground">{detail.stock}</span></div>
                </div>
              </div>
              <Button
                onClick={() => { handleSync(detail); setDetail(null); }}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" /> Sync to {storeName}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default SellerDropshipping;
