import { useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Ban,
  CheckCircle2,
  Eye,
  UserCheck,
  UserX,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

type CustomerStatus = "active" | "blocked";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedAt: string;
  orders: number;
  spent: number;
  lastOrder: string;
  status: CustomerStatus;
  avatar?: string;
}

const seedCustomers: Customer[] = [
  { id: "C-1001", name: "Ayesha Khan", email: "ayesha.khan@gmail.com", phone: "+92 300 1234567", city: "Karachi", joinedAt: "2025-02-14", orders: 24, spent: 184500, lastOrder: "2026-06-12", status: "active" },
  { id: "C-1002", name: "Bilal Ahmed", email: "bilal.a@outlook.com", phone: "+92 321 9876543", city: "Lahore", joinedAt: "2024-11-03", orders: 8, spent: 42300, lastOrder: "2026-05-28", status: "active" },
  { id: "C-1003", name: "Hira Saleem", email: "hira.s@yahoo.com", phone: "+92 333 4561230", city: "Islamabad", joinedAt: "2025-06-22", orders: 41, spent: 312900, lastOrder: "2026-06-14", status: "active" },
  { id: "C-1004", name: "Umar Farooq", email: "umar.f@gmail.com", phone: "+92 345 7894561", city: "Rawalpindi", joinedAt: "2026-01-10", orders: 3, spent: 9800, lastOrder: "2026-04-02", status: "blocked" },
  { id: "C-1005", name: "Sana Tariq", email: "sana.tariq@gmail.com", phone: "+92 312 5557890", city: "Faisalabad", joinedAt: "2025-09-30", orders: 17, spent: 96450, lastOrder: "2026-06-10", status: "active" },
  { id: "C-1006", name: "Hamza Iqbal", email: "hamza.i@hotmail.com", phone: "+92 301 3334455", city: "Multan", joinedAt: "2024-08-19", orders: 56, spent: 478200, lastOrder: "2026-06-15", status: "active" },
  { id: "C-1007", name: "Fatima Noor", email: "fatima.noor@gmail.com", phone: "+92 322 1112233", city: "Karachi", joinedAt: "2025-04-05", orders: 2, spent: 5400, lastOrder: "2025-12-18", status: "blocked" },
  { id: "C-1008", name: "Zain Abbas", email: "zain.abbas@gmail.com", phone: "+92 308 6667788", city: "Lahore", joinedAt: "2026-03-21", orders: 6, spent: 28700, lastOrder: "2026-06-09", status: "active" },
];

const initial = (n: string) =>
  n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const fmtRs = (n: number) => `Rs. ${n.toLocaleString()}`;

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);

  const toggleStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "blocked" : "active" }
          : c
      )
    );
    const c = customers.find((x) => x.id === id);
    if (c) {
      toast.success(
        c.status === "active"
          ? `${c.name} has been blocked`
          : `${c.name} has been unblocked`
      );
    }
  };

  const filter = (status?: CustomerStatus) =>
    customers
      .filter((c) => (status ? c.status === status : true))
      .filter((c) =>
        [c.name, c.email, c.phone, c.city, c.id]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      );

  const all = filter();
  const active = filter("active");
  const blocked = filter("blocked");

  const stats = useMemo(() => {
    const totalSpent = customers.reduce((s, c) => s + c.spent, 0);
    const totalOrders = customers.reduce((s, c) => s + c.orders, 0);
    return {
      total: customers.length,
      active: customers.filter((c) => c.status === "active").length,
      blocked: customers.filter((c) => c.status === "blocked").length,
      totalSpent,
      totalOrders,
    };
  }, [customers]);

  const StatCard = ({ icon: Icon, label, value, tone }: any) => (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tone}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </div>
    </Card>
  );

  const renderTable = (rows: Customer[]) =>
    rows.length === 0 ? (
      <Card className="p-10 text-center text-muted-foreground">
        No customers found
      </Card>
    ) : (
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id} className="hover:bg-secondary/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                        {initial(c.name)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{c.email}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </TableCell>
                  <TableCell className="text-sm">{c.city}</TableCell>
                  <TableCell className="text-right text-sm">{c.orders}</TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {fmtRs(c.spent)}
                  </TableCell>
                  <TableCell>
                    {c.status === "active" ? (
                      <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30">
                        Blocked
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelected(c)}>
                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                      </Button>
                      {c.status === "active" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive/40 text-destructive hover:bg-destructive/10"
                          onClick={() => toggleStatus(c.id)}
                        >
                          <Ban className="w-3.5 h-3.5 mr-1" /> Block
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => toggleStatus(c.id)}>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Unblock
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    );

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground font-display">
            Customer Management
          </h1>
          <p className="text-sm text-muted-foreground">
            View registered buyers, their activity, and manage access
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Customers" />

          <main className="flex-1 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={Users} label="Total Customers" value={stats.total} tone="bg-primary/10 text-primary" />
              <StatCard icon={UserCheck} label="Active" value={stats.active} tone="bg-success/15 text-success" />
              <StatCard icon={UserX} label="Blocked" value={stats.blocked} tone="bg-destructive/15 text-destructive" />
              <StatCard icon={Wallet} label="Lifetime Revenue" value={fmtRs(stats.totalSpent)} tone="bg-warning/15 text-warning" />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, city, ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({all.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
                <TabsTrigger value="blocked">Blocked ({blocked.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">{renderTable(all)}</TabsContent>
              <TabsContent value="active" className="mt-4">{renderTable(active)}</TabsContent>
              <TabsContent value="blocked" className="mt-4">{renderTable(blocked)}</TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                    {initial(selected.name)}
                  </div>
                  <div>
                    <div className="text-base font-semibold">{selected.name}</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {selected.id} ·{" "}
                      {selected.status === "active" ? (
                        <span className="text-success">Active</span>
                      ) : (
                        <span className="text-destructive">Blocked</span>
                      )}
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription>Customer profile and activity</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 gap-2 bg-secondary/40 rounded-lg p-3">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> {selected.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> {selected.phone}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> {selected.city}</div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /> Joined {selected.joinedAt}</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-card border rounded-lg p-3 text-center">
                    <ShoppingBag className="w-4 h-4 mx-auto text-primary mb-1" />
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="font-semibold">{selected.orders}</p>
                  </div>
                  <div className="bg-card border rounded-lg p-3 text-center">
                    <Wallet className="w-4 h-4 mx-auto text-warning mb-1" />
                    <p className="text-xs text-muted-foreground">Spent</p>
                    <p className="font-semibold">{fmtRs(selected.spent)}</p>
                  </div>
                  <div className="bg-card border rounded-lg p-3 text-center">
                    <Calendar className="w-4 h-4 mx-auto text-success mb-1" />
                    <p className="text-xs text-muted-foreground">Last order</p>
                    <p className="font-semibold text-xs">{selected.lastOrder}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {selected.status === "active" ? (
                    <Button
                      variant="outline"
                      className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        toggleStatus(selected.id);
                        setSelected({ ...selected, status: "blocked" });
                      }}
                    >
                      <Ban className="w-4 h-4 mr-1" /> Block customer
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        toggleStatus(selected.id);
                        setSelected({ ...selected, status: "active" });
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Unblock customer
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
