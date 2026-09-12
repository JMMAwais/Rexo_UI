import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Ticket, Plus, Search, Pencil, Trash2, Copy, Percent, BadgePercent,
  CheckCircle2, Clock, Tag,
} from "lucide-react";
import { toast } from "sonner";

type DiscountType = "percent" | "fixed";
type CouponStatus = "active" | "scheduled" | "expired" | "disabled";

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  appliesTo: "all" | "category" | "seller";
  scope?: string;
  active: boolean;
}

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (d: number) => {
  const x = new Date();
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
};

const seed: Coupon[] = [
  {
    id: "CPN-1001", code: "WELCOME10", description: "10% off for new buyers",
    type: "percent", value: 10, minOrder: 1000, maxDiscount: 500,
    usageLimit: 500, usedCount: 124, startDate: addDays(-10), endDate: addDays(20),
    appliesTo: "all", active: true,
  },
  {
    id: "CPN-1002", code: "EID500", description: "Flat Rs.500 off on Eid sale",
    type: "fixed", value: 500, minOrder: 3000, usageLimit: 1000, usedCount: 612,
    startDate: addDays(-5), endDate: addDays(10), appliesTo: "all", active: true,
  },
  {
    id: "CPN-1003", code: "FASHION20", description: "20% off on Fashion",
    type: "percent", value: 20, minOrder: 1500, maxDiscount: 1000,
    usageLimit: 300, usedCount: 88, startDate: addDays(-2), endDate: addDays(15),
    appliesTo: "category", scope: "Fashion", active: true,
  },
  {
    id: "CPN-1004", code: "STORE100", description: "Rs.100 off at TechHub",
    type: "fixed", value: 100, minOrder: 800, usageLimit: 200, usedCount: 47,
    startDate: addDays(3), endDate: addDays(30), appliesTo: "seller",
    scope: "TechHub", active: true,
  },
  {
    id: "CPN-1005", code: "SUMMER15", description: "Summer sale 15% off",
    type: "percent", value: 15, minOrder: 2000, maxDiscount: 800,
    usageLimit: 400, usedCount: 400, startDate: addDays(-40), endDate: addDays(-2),
    appliesTo: "all", active: false,
  },
];

const fmtRs = (n: number) => `Rs. ${n.toLocaleString()}`;

const statusOf = (c: Coupon): CouponStatus => {
  if (!c.active) return "disabled";
  const t = today();
  if (c.startDate > t) return "scheduled";
  if (c.endDate < t) return "expired";
  return "active";
};

const statusBadge = (s: CouponStatus) => {
  const map: Record<CouponStatus, string> = {
    active: "bg-green-100 text-green-700 hover:bg-green-100",
    scheduled: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    expired: "bg-gray-200 text-gray-700 hover:bg-gray-200",
    disabled: "bg-red-100 text-red-700 hover:bg-red-100",
  };
  return <Badge className={map[s]}>{s}</Badge>;
};

const emptyCoupon: Coupon = {
  id: "", code: "", description: "", type: "percent", value: 10,
  minOrder: 0, usageLimit: 100, usedCount: 0,
  startDate: today(), endDate: addDays(30), appliesTo: "all", active: true,
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(seed);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | CouponStatus>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<Coupon>(emptyCoupon);

  const filtered = coupons.filter((c) => {
    const q = search.toLowerCase();
    const matches =
      c.code.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q);
    const s = statusOf(c);
    return matches && (tab === "all" || s === tab);
  });

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => statusOf(c) === "active").length,
    redemptions: coupons.reduce((s, c) => s + c.usedCount, 0),
    expired: coupons.filter((c) => statusOf(c) === "expired").length,
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyCoupon, id: `CPN-${1000 + coupons.length + 1}` });
    setOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm(c);
    setOpen(true);
  };

  const save = () => {
    if (!form.code.trim()) return toast.error("Code is required");
    if (form.value <= 0) return toast.error("Discount value must be > 0");
    if (form.endDate < form.startDate) return toast.error("End date before start date");
    const normalized: Coupon = { ...form, code: form.code.toUpperCase().trim() };
    if (editing) {
      setCoupons((prev) => prev.map((c) => (c.id === editing.id ? normalized : c)));
      toast.success("Coupon updated");
    } else {
      if (coupons.some((c) => c.code === normalized.code)) {
        return toast.error("Code already exists");
      }
      setCoupons((prev) => [normalized, ...prev]);
      toast.success("Coupon created");
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success("Coupon deleted");
  };

  const toggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Coupons" />

          <main className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Ticket className="w-6 h-6 text-primary" />
                  Coupons & Discount Codes
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create, schedule and track promotional codes.
                </p>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreate}>
                    <Plus className="w-4 h-4 mr-1" /> New Coupon
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {editing ? "Edit Coupon" : "Create Coupon"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Code</Label>
                        <Input
                          value={form.code}
                          onChange={(e) =>
                            setForm({ ...form, code: e.target.value.toUpperCase() })
                          }
                          placeholder="WELCOME10"
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={form.type}
                          onValueChange={(v: DiscountType) =>
                            setForm({ ...form, type: v })
                          }
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percent">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed (Rs.)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        placeholder="10% off for new buyers"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Value</Label>
                        <Input
                          type="number"
                          value={form.value}
                          onChange={(e) =>
                            setForm({ ...form, value: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <Label>Min Order</Label>
                        <Input
                          type="number"
                          value={form.minOrder}
                          onChange={(e) =>
                            setForm({ ...form, minOrder: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <Label>Max Discount</Label>
                        <Input
                          type="number"
                          value={form.maxDiscount ?? ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              maxDiscount: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          placeholder="optional"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={form.startDate}
                          onChange={(e) =>
                            setForm({ ...form, startDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={form.endDate}
                          onChange={(e) =>
                            setForm({ ...form, endDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Usage Limit</Label>
                        <Input
                          type="number"
                          value={form.usageLimit}
                          onChange={(e) =>
                            setForm({ ...form, usageLimit: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <Label>Applies To</Label>
                        <Select
                          value={form.appliesTo}
                          onValueChange={(v: "all" | "category" | "seller") =>
                            setForm({ ...form, appliesTo: v })
                          }
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Products</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="seller">Seller</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {form.appliesTo !== "all" && (
                      <div>
                        <Label>
                          {form.appliesTo === "category" ? "Category Name" : "Seller Name"}
                        </Label>
                        <Input
                          value={form.scope ?? ""}
                          onChange={(e) =>
                            setForm({ ...form, scope: e.target.value })
                          }
                          placeholder={
                            form.appliesTo === "category" ? "e.g. Fashion" : "e.g. TechHub"
                          }
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="text-sm font-medium">Active</p>
                        <p className="text-xs text-muted-foreground">
                          Disable to stop redemptions immediately.
                        </p>
                      </div>
                      <Switch
                        checked={form.active}
                        onCheckedChange={(v) => setForm({ ...form, active: v })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={save}>
                      {editing ? "Save Changes" : "Create Coupon"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Total Coupons</p>
                  <Tag className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Active</p>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold mt-1">{stats.active}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Redemptions</p>
                  <BadgePercent className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold mt-1">{stats.redemptions}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Expired</p>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-1">{stats.expired}</p>
              </Card>
            </div>

            <Card className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search code, description, ID..."
                    className="pl-9"
                  />
                </div>
                <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="expired">Expired</TabsTrigger>
                    <TabsTrigger value="disabled">Disabled</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Validity</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No coupons found.
                        </TableCell>
                      </TableRow>
                    )}
                    {filtered.map((c) => {
                      const s = statusOf(c);
                      const usedPct = Math.min(
                        100,
                        Math.round((c.usedCount / Math.max(1, c.usageLimit)) * 100),
                      );
                      return (
                        <TableRow key={c.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="px-2 py-1 rounded bg-secondary text-foreground font-mono text-xs">
                                {c.code}
                              </code>
                              <button
                                onClick={() => copyCode(c.code)}
                                className="text-muted-foreground hover:text-foreground"
                                title="Copy"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                              {c.description}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-medium">
                              {c.type === "percent" ? (
                                <>
                                  <Percent className="w-3.5 h-3.5" />
                                  {c.value}%
                                </>
                              ) : (
                                fmtRs(c.value)
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Min {fmtRs(c.minOrder)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {c.appliesTo}
                            </Badge>
                            {c.scope && (
                              <p className="text-xs text-muted-foreground mt-1">{c.scope}</p>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {c.startDate}
                            <br />
                            to {c.endDate}
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">
                              {c.usedCount} / {c.usageLimit}
                            </p>
                            <div className="w-24 h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${usedPct}%` }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>{statusBadge(s)}</TableCell>
                          <TableCell>
                            <Switch
                              checked={c.active}
                              onCheckedChange={() => toggleActive(c.id)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEdit(c)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete coupon?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      <span>This will permanently delete <b>{c.code}</b>.</span>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => remove(c.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
