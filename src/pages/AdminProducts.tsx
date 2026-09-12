import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash2, Eye, EyeOff, Package } from "lucide-react";
import { products as seedProducts, categories } from "@/lib/mock-data";
import { toast } from "sonner";

type Status = "active" | "hidden";
interface Row {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  sellerName: string;
  sellerId: string;
  rating: number;
  reviews: number;
  status: Status;
}

const initialRows: Row[] = seedProducts.map((p) => ({
  id: p.id,
  name: p.name,
  image: p.image,
  price: p.price,
  category: p.category,
  sellerName: p.seller.name,
  sellerId: p.seller.id,
  rating: p.rating,
  reviews: p.reviews,
  status: "active" as Status,
}));

const AdminProducts = () => {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const toggleStatus = (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === "active" ? "hidden" : "active" } : r)),
    );
    toast.success("Product status updated");
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Product removed");
  };

  const filtered = rows
    .filter((r) =>
      tab === "all" ? true : tab === "active" ? r.status === "active" : r.status === "hidden",
    )
    .filter((r) =>
      [r.name, r.sellerName, r.category].join(" ").toLowerCase().includes(query.toLowerCase()),
    );

  const totalValue = rows.reduce((sum, r) => sum + r.price, 0);
  const activeCount = rows.filter((r) => r.status === "active").length;
  const hiddenCount = rows.filter((r) => r.status === "hidden").length;

  const stats = [
    { label: "Total Products", value: rows.length, icon: Package },
    { label: "Active", value: activeCount, icon: Eye },
    { label: "Hidden", value: hiddenCount, icon: EyeOff },
    { label: "Catalog Value", value: `Rs ${totalValue.toLocaleString()}` },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground font-display">Products Oversight</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and moderate every product listed across all seller stores
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Products" />

          <main className="flex-1 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((s) => (
                <Card key={s.label} className="p-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
                </Card>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name, seller, category..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All ({rows.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
                <TabsTrigger value="hidden">Hidden ({hiddenCount})</TabsTrigger>
              </TabsList>

              <TabsContent value={tab} className="mt-4">
                <Card className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                            No products found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filtered.map((r) => {
                          const cat = categories.find((c) => c.id === r.category);
                          return (
                            <TableRow key={r.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <img
                                    src={r.image}
                                    alt={r.name}
                                    className="w-10 h-10 rounded-md object-cover"
                                    loading="lazy"
                                  />
                                  <span className="font-medium text-sm line-clamp-1 max-w-[260px]">
                                    {r.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm capitalize">
                                {cat?.icon} {cat?.name ?? r.category}
                              </TableCell>
                              <TableCell className="text-sm">{r.sellerName}</TableCell>
                              <TableCell className="text-sm font-medium">
                                Rs {r.price.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-sm">
                                ⭐ {r.rating} ({r.reviews})
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    r.status === "active"
                                      ? "bg-success/15 text-success border-success/30"
                                      : "bg-muted text-muted-foreground"
                                  }
                                >
                                  {r.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toggleStatus(r.id)}
                                    title={r.status === "active" ? "Hide product" : "Show product"}
                                  >
                                    {r.status === "active" ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeRow(r.id)}
                                    title="Remove product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
