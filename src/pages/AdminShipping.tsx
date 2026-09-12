import { useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Truck, MapPin, Package, Plus, Pencil, Trash2, Search, Building2,
  Clock, DollarSign, Globe, PackageCheck,
} from "lucide-react";
import { toast } from "sonner";

// ---------------- Types ----------------
type ZoneStatus = "active" | "disabled";
type CourierStatus = "active" | "disabled";
type RateType = "flat" | "weight" | "order_value" | "free";

interface ShippingZone {
  id: string;
  name: string;
  regions: string[]; // cities/provinces
  status: ZoneStatus;
  createdAt: string;
}

interface Courier {
  id: string;
  name: string;
  code: string;
  contact: string;
  trackingUrl: string; // e.g. https://tracking.tcs.com.pk/{id}
  status: CourierStatus;
  codSupported: boolean;
}

interface ShippingRate {
  id: string;
  zoneId: string;
  courierId: string;
  type: RateType;
  price: number;         // for flat / per-kg
  minThreshold?: number; // for weight / order-value
  maxThreshold?: number;
  etaDays: string;       // "2-4"
  active: boolean;
}

// ---------------- Seed ----------------
const now = () => new Date().toISOString().slice(0, 10);

const seedZones: ShippingZone[] = [
  { id: "ZN-01", name: "Punjab Metro", regions: ["Lahore", "Rawalpindi", "Faisalabad"], status: "active", createdAt: now() },
  { id: "ZN-02", name: "Sindh Metro", regions: ["Karachi", "Hyderabad"], status: "active", createdAt: now() },
  { id: "ZN-03", name: "KPK & North", regions: ["Peshawar", "Abbottabad", "Gilgit"], status: "active", createdAt: now() },
  { id: "ZN-04", name: "Balochistan", regions: ["Quetta", "Gwadar"], status: "disabled", createdAt: now() },
  { id: "ZN-05", name: "Remote Areas", regions: ["Chitral", "Skardu", "Turbat"], status: "active", createdAt: now() },
];

const seedCouriers: Courier[] = [
  { id: "CR-01", name: "TCS Express", code: "TCS", contact: "021-111-123-456", trackingUrl: "https://tracking.tcs.com.pk/{id}", status: "active", codSupported: true },
  { id: "CR-02", name: "Leopards Courier", code: "LEO", contact: "021-111-300-786", trackingUrl: "https://leopardscourier.com/track/{id}", status: "active", codSupported: true },
  { id: "CR-03", name: "M&P Express", code: "MNP", contact: "021-111-202-202", trackingUrl: "https://mulphilog.com/track/{id}", status: "active", codSupported: false },
  { id: "CR-04", name: "Trax Online", code: "TRX", contact: "021-111-000-111", trackingUrl: "https://trax.pk/tracking/{id}", status: "disabled", codSupported: true },
];

const seedRates: ShippingRate[] = [
  { id: "RT-01", zoneId: "ZN-01", courierId: "CR-01", type: "flat", price: 200, etaDays: "1-2", active: true },
  { id: "RT-02", zoneId: "ZN-01", courierId: "CR-02", type: "flat", price: 180, etaDays: "2-3", active: true },
  { id: "RT-03", zoneId: "ZN-02", courierId: "CR-01", type: "flat", price: 220, etaDays: "1-2", active: true },
  { id: "RT-04", zoneId: "ZN-03", courierId: "CR-03", type: "weight", price: 120, minThreshold: 0, maxThreshold: 5, etaDays: "3-5", active: true },
  { id: "RT-05", zoneId: "ZN-05", courierId: "CR-02", type: "order_value", price: 350, minThreshold: 0, maxThreshold: 5000, etaDays: "5-7", active: true },
  { id: "RT-06", zoneId: "ZN-02", courierId: "CR-02", type: "free", price: 0, minThreshold: 3000, etaDays: "3-5", active: true },
];

// ---------------- Page ----------------
const AdminShipping = () => {
  const [zones, setZones] = useState<ShippingZone[]>(seedZones);
  const [couriers, setCouriers] = useState<Courier[]>(seedCouriers);
  const [rates, setRates] = useState<ShippingRate[]>(seedRates);
  const [tab, setTab] = useState("zones");
  const [query, setQuery] = useState("");

  // Dialog state
  const [zoneOpen, setZoneOpen] = useState(false);
  const [zoneEdit, setZoneEdit] = useState<ShippingZone | null>(null);
  const [zoneForm, setZoneForm] = useState({ name: "", regions: "", status: "active" as ZoneStatus });

  const [courierOpen, setCourierOpen] = useState(false);
  const [courierEdit, setCourierEdit] = useState<Courier | null>(null);
  const [courierForm, setCourierForm] = useState({
    name: "", code: "", contact: "", trackingUrl: "", status: "active" as CourierStatus, codSupported: true,
  });

  const [rateOpen, setRateOpen] = useState(false);
  const [rateEdit, setRateEdit] = useState<ShippingRate | null>(null);
  const [rateForm, setRateForm] = useState<Partial<ShippingRate>>({
    zoneId: "", courierId: "", type: "flat", price: 0, etaDays: "2-4", active: true,
  });

  // ---------------- Stats ----------------
  const stats = useMemo(() => ({
    zones: zones.length,
    activeZones: zones.filter((z) => z.status === "active").length,
    couriers: couriers.filter((c) => c.status === "active").length,
    rates: rates.filter((r) => r.active).length,
  }), [zones, couriers, rates]);

  // ---------------- Handlers: Zones ----------------
  const openZoneCreate = () => {
    setZoneEdit(null);
    setZoneForm({ name: "", regions: "", status: "active" });
    setZoneOpen(true);
  };
  const openZoneEdit = (z: ShippingZone) => {
    setZoneEdit(z);
    setZoneForm({ name: z.name, regions: z.regions.join(", "), status: z.status });
    setZoneOpen(true);
  };
  const saveZone = () => {
    if (!zoneForm.name.trim()) return toast.error("Zone name required");
    const regions = zoneForm.regions.split(",").map((r) => r.trim()).filter(Boolean);
    if (zoneEdit) {
      setZones((zs) => zs.map((z) => z.id === zoneEdit.id ? { ...z, ...zoneForm, regions } : z));
      toast.success("Zone updated");
    } else {
      const id = `ZN-${String(zones.length + 1).padStart(2, "0")}`;
      setZones((zs) => [{ id, ...zoneForm, regions, createdAt: now() }, ...zs]);
      toast.success("Zone added");
    }
    setZoneOpen(false);
  };
  const deleteZone = (id: string) => {
    setZones((zs) => zs.filter((z) => z.id !== id));
    setRates((rs) => rs.filter((r) => r.zoneId !== id));
    toast.success("Zone deleted");
  };
  const toggleZone = (id: string) => {
    setZones((zs) => zs.map((z) => z.id === id ? { ...z, status: z.status === "active" ? "disabled" : "active" } : z));
  };

  // ---------------- Handlers: Couriers ----------------
  const openCourierCreate = () => {
    setCourierEdit(null);
    setCourierForm({ name: "", code: "", contact: "", trackingUrl: "", status: "active", codSupported: true });
    setCourierOpen(true);
  };
  const openCourierEdit = (c: Courier) => {
    setCourierEdit(c);
    setCourierForm({ ...c });
    setCourierOpen(true);
  };
  const saveCourier = () => {
    if (!courierForm.name.trim() || !courierForm.code.trim()) return toast.error("Name & code required");
    if (courierEdit) {
      setCouriers((cs) => cs.map((c) => c.id === courierEdit.id ? { ...c, ...courierForm } : c));
      toast.success("Courier updated");
    } else {
      const id = `CR-${String(couriers.length + 1).padStart(2, "0")}`;
      setCouriers((cs) => [{ id, ...courierForm }, ...cs]);
      toast.success("Courier added");
    }
    setCourierOpen(false);
  };
  const deleteCourier = (id: string) => {
    setCouriers((cs) => cs.filter((c) => c.id !== id));
    setRates((rs) => rs.filter((r) => r.courierId !== id));
    toast.success("Courier deleted");
  };
  const toggleCourier = (id: string) => {
    setCouriers((cs) => cs.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "disabled" : "active" } : c));
  };

  // ---------------- Handlers: Rates ----------------
  const openRateCreate = () => {
    setRateEdit(null);
    setRateForm({ zoneId: zones[0]?.id ?? "", courierId: couriers[0]?.id ?? "", type: "flat", price: 0, etaDays: "2-4", active: true });
    setRateOpen(true);
  };
  const openRateEdit = (r: ShippingRate) => {
    setRateEdit(r);
    setRateForm({ ...r });
    setRateOpen(true);
  };
  const saveRate = () => {
    if (!rateForm.zoneId || !rateForm.courierId) return toast.error("Select zone & courier");
    const clean: ShippingRate = {
      id: rateEdit?.id ?? `RT-${String(rates.length + 1).padStart(2, "0")}`,
      zoneId: rateForm.zoneId!,
      courierId: rateForm.courierId!,
      type: (rateForm.type as RateType) ?? "flat",
      price: Number(rateForm.price ?? 0),
      minThreshold: rateForm.minThreshold ? Number(rateForm.minThreshold) : undefined,
      maxThreshold: rateForm.maxThreshold ? Number(rateForm.maxThreshold) : undefined,
      etaDays: rateForm.etaDays ?? "2-4",
      active: rateForm.active ?? true,
    };
    if (rateEdit) {
      setRates((rs) => rs.map((r) => r.id === rateEdit.id ? clean : r));
      toast.success("Rate updated");
    } else {
      setRates((rs) => [clean, ...rs]);
      toast.success("Rate added");
    }
    setRateOpen(false);
  };
  const deleteRate = (id: string) => {
    setRates((rs) => rs.filter((r) => r.id !== id));
    toast.success("Rate deleted");
  };
  const toggleRate = (id: string) => {
    setRates((rs) => rs.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  };

  // ---------------- Filtering ----------------
  const q = query.trim().toLowerCase();
  const filteredZones = zones.filter((z) =>
    !q || z.name.toLowerCase().includes(q) || z.regions.join(",").toLowerCase().includes(q) || z.id.toLowerCase().includes(q)
  );
  const filteredCouriers = couriers.filter((c) =>
    !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
  );
  const zoneById = (id: string) => zones.find((z) => z.id === id);
  const courierById = (id: string) => couriers.find((c) => c.id === id);
  const filteredRates = rates.filter((r) => {
    if (!q) return true;
    const z = zoneById(r.zoneId)?.name.toLowerCase() ?? "";
    const c = courierById(r.courierId)?.name.toLowerCase() ?? "";
    return z.includes(q) || c.includes(q) || r.id.toLowerCase().includes(q);
  });

  const rateTypeLabel: Record<RateType, string> = {
    flat: "Flat Rate",
    weight: "By Weight (per kg)",
    order_value: "By Order Value",
    free: "Free Shipping",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Shipping" />

          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Truck className="w-6 h-6 text-primary" /> Shipping & Delivery
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage delivery zones, couriers, and shipping rates
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Zones</p>
                    <p className="text-xl font-bold">{stats.zones}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Zones</p>
                    <p className="text-xl font-bold">{stats.activeZones}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Couriers</p>
                    <p className="text-xl font-bold">{stats.couriers}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <PackageCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Rates</p>
                    <p className="text-xl font-bold">{stats.rates}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Search */}
            <Card className="p-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search zones, couriers, rates..."
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </Card>

            {/* Tabs */}
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="zones">
                  <MapPin className="w-4 h-4 mr-1" /> Zones
                </TabsTrigger>
                <TabsTrigger value="couriers">
                  <Truck className="w-4 h-4 mr-1" /> Couriers
                </TabsTrigger>
                <TabsTrigger value="rates">
                  <DollarSign className="w-4 h-4 mr-1" /> Rates
                </TabsTrigger>
              </TabsList>

              {/* --------- ZONES --------- */}
              <TabsContent value="zones" className="mt-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Delivery Zones</h2>
                    <Button size="sm" onClick={openZoneCreate}>
                      <Plus className="w-4 h-4 mr-1" /> Add Zone
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Zone Name</TableHead>
                        <TableHead>Regions / Cities</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredZones.map((z) => (
                        <TableRow key={z.id}>
                          <TableCell className="font-mono text-xs">{z.id}</TableCell>
                          <TableCell className="font-medium">{z.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-md">
                              {z.regions.map((r) => (
                                <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch checked={z.status === "active"} onCheckedChange={() => toggleZone(z.id)} />
                              <Badge variant={z.status === "active" ? "default" : "outline"}>
                                {z.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{z.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openZoneEdit(z)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete zone?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will also remove all rates linked to this zone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteZone(z.id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredZones.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No zones found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* --------- COURIERS --------- */}
              <TabsContent value="couriers" className="mt-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Courier Partners</h2>
                    <Button size="sm" onClick={openCourierCreate}>
                      <Plus className="w-4 h-4 mr-1" /> Add Courier
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Courier</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Tracking URL</TableHead>
                        <TableHead>COD</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCouriers.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-mono text-xs">{c.id}</TableCell>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell><Badge variant="outline">{c.code}</Badge></TableCell>
                          <TableCell className="text-sm">{c.contact}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[220px] truncate">
                            {c.trackingUrl}
                          </TableCell>
                          <TableCell>
                            {c.codSupported ? (
                              <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/20">Yes</Badge>
                            ) : (
                              <Badge variant="outline">No</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch checked={c.status === "active"} onCheckedChange={() => toggleCourier(c.id)} />
                              <Badge variant={c.status === "active" ? "default" : "outline"}>
                                {c.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openCourierEdit(c)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete courier?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will also remove all rates using this courier.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteCourier(c.id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredCouriers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            No couriers found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* --------- RATES --------- */}
              <TabsContent value="rates" className="mt-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Shipping Rates</h2>
                    <Button size="sm" onClick={openRateCreate}>
                      <Plus className="w-4 h-4 mr-1" /> Add Rate
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Courier</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Price / Rule</TableHead>
                        <TableHead>ETA</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRates.map((r) => {
                        const z = zoneById(r.zoneId);
                        const c = courierById(r.courierId);
                        return (
                          <TableRow key={r.id}>
                            <TableCell className="font-mono text-xs">{r.id}</TableCell>
                            <TableCell className="font-medium">{z?.name ?? "—"}</TableCell>
                            <TableCell>{c?.name ?? "—"}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{rateTypeLabel[r.type]}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {r.type === "free" && <span>Free over Rs. {r.minThreshold ?? 0}</span>}
                              {r.type === "flat" && <span>Rs. {r.price}</span>}
                              {r.type === "weight" && <span>Rs. {r.price}/kg ({r.minThreshold ?? 0}–{r.maxThreshold ?? "∞"}kg)</span>}
                              {r.type === "order_value" && <span>Rs. {r.price} (order Rs. {r.minThreshold ?? 0}–{r.maxThreshold ?? "∞"})</span>}
                            </TableCell>
                            <TableCell className="text-sm">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {r.etaDays} days
                              </span>
                            </TableCell>
                            <TableCell>
                              <Switch checked={r.active} onCheckedChange={() => toggleRate(r.id)} />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => openRateEdit(r)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteRate(r.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {filteredRates.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            No rates found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* ============ Zone Dialog ============ */}
      <Dialog open={zoneOpen} onOpenChange={setZoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{zoneEdit ? "Edit Zone" : "Add Zone"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Zone Name</Label>
              <Input value={zoneForm.name} onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })} placeholder="e.g. Punjab Metro" />
            </div>
            <div>
              <Label>Regions / Cities (comma separated)</Label>
              <Textarea
                rows={3}
                value={zoneForm.regions}
                onChange={(e) => setZoneForm({ ...zoneForm, regions: e.target.value })}
                placeholder="Lahore, Rawalpindi, Faisalabad"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={zoneForm.status === "active"}
                onCheckedChange={(v) => setZoneForm({ ...zoneForm, status: v ? "active" : "disabled" })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setZoneOpen(false)}>Cancel</Button>
            <Button onClick={saveZone}>{zoneEdit ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============ Courier Dialog ============ */}
      <Dialog open={courierOpen} onOpenChange={setCourierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{courierEdit ? "Edit Courier" : "Add Courier"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Courier Name</Label>
              <Input value={courierForm.name} onChange={(e) => setCourierForm({ ...courierForm, name: e.target.value })} placeholder="TCS Express" />
            </div>
            <div>
              <Label>Code</Label>
              <Input value={courierForm.code} onChange={(e) => setCourierForm({ ...courierForm, code: e.target.value.toUpperCase() })} placeholder="TCS" />
            </div>
            <div>
              <Label>Contact</Label>
              <Input value={courierForm.contact} onChange={(e) => setCourierForm({ ...courierForm, contact: e.target.value })} placeholder="021-111-XXX-XXX" />
            </div>
            <div className="col-span-2">
              <Label>Tracking URL Template</Label>
              <Input
                value={courierForm.trackingUrl}
                onChange={(e) => setCourierForm({ ...courierForm, trackingUrl: e.target.value })}
                placeholder="https://track.example.com/{id}"
              />
              <p className="text-xs text-muted-foreground mt-1">Use {"{id}"} placeholder for tracking number</p>
            </div>
            <div className="flex items-center justify-between col-span-1">
              <Label>COD Supported</Label>
              <Switch checked={courierForm.codSupported} onCheckedChange={(v) => setCourierForm({ ...courierForm, codSupported: v })} />
            </div>
            <div className="flex items-center justify-between col-span-1">
              <Label>Active</Label>
              <Switch
                checked={courierForm.status === "active"}
                onCheckedChange={(v) => setCourierForm({ ...courierForm, status: v ? "active" : "disabled" })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourierOpen(false)}>Cancel</Button>
            <Button onClick={saveCourier}>{courierEdit ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============ Rate Dialog ============ */}
      <Dialog open={rateOpen} onOpenChange={setRateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{rateEdit ? "Edit Rate" : "Add Rate"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Zone</Label>
              <Select value={rateForm.zoneId} onValueChange={(v) => setRateForm({ ...rateForm, zoneId: v })}>
                <SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
                <SelectContent>
                  {zones.map((z) => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Courier</Label>
              <Select value={rateForm.courierId} onValueChange={(v) => setRateForm({ ...rateForm, courierId: v })}>
                <SelectTrigger><SelectValue placeholder="Select courier" /></SelectTrigger>
                <SelectContent>
                  {couriers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Rate Type</Label>
              <Select value={rateForm.type} onValueChange={(v) => setRateForm({ ...rateForm, type: v as RateType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat Rate</SelectItem>
                  <SelectItem value="weight">By Weight (per kg)</SelectItem>
                  <SelectItem value="order_value">By Order Value</SelectItem>
                  <SelectItem value="free">Free Shipping (above threshold)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {rateForm.type !== "free" && (
              <div>
                <Label>Price (Rs.)</Label>
                <Input type="number" value={rateForm.price ?? 0} onChange={(e) => setRateForm({ ...rateForm, price: Number(e.target.value) })} />
              </div>
            )}
            <div>
              <Label>ETA (days)</Label>
              <Input value={rateForm.etaDays ?? ""} onChange={(e) => setRateForm({ ...rateForm, etaDays: e.target.value })} placeholder="2-4" />
            </div>
            {(rateForm.type === "weight" || rateForm.type === "order_value" || rateForm.type === "free") && (
              <>
                <div>
                  <Label>Min {rateForm.type === "weight" ? "kg" : "Rs."}</Label>
                  <Input type="number" value={rateForm.minThreshold ?? ""} onChange={(e) => setRateForm({ ...rateForm, minThreshold: Number(e.target.value) })} />
                </div>
                {rateForm.type !== "free" && (
                  <div>
                    <Label>Max {rateForm.type === "weight" ? "kg" : "Rs."}</Label>
                    <Input type="number" value={rateForm.maxThreshold ?? ""} onChange={(e) => setRateForm({ ...rateForm, maxThreshold: Number(e.target.value) })} />
                  </div>
                )}
              </>
            )}
            <div className="flex items-center justify-between col-span-2">
              <Label>Active</Label>
              <Switch checked={rateForm.active ?? true} onCheckedChange={(v) => setRateForm({ ...rateForm, active: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRateOpen(false)}>Cancel</Button>
            <Button onClick={saveRate}>{rateEdit ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShipping;
