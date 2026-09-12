import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Check, X, Search, MapPin, Mail, Phone, Calendar, Store } from "lucide-react";
import { getSellers, updateSellerStatus, type PendingSeller, type SellerStatus } from "@/lib/admin-store";
import { toast } from "sonner";

const statusBadge = (status: SellerStatus) => {
  const map = {
    pending: "bg-warning/15 text-warning border-warning/30",
    approved: "bg-success/15 text-success border-success/30",
    rejected: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return map[status];
};

const SellerCard = ({ seller, onAction }: { seller: PendingSeller; onAction: (id: string, status: SellerStatus) => void }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-4 flex-1 min-w-[260px]">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Store className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground">{seller.storeName}</h3>
            <Badge variant="outline" className={`text-xs capitalize ${statusBadge(seller.status)}`}>
              {seller.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">by {seller.ownerName}</p>
          <p className="text-sm text-muted-foreground mt-2">{seller.description}</p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {seller.email}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {seller.phone}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {seller.city}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Applied {seller.appliedAt}</span>
          </div>
        </div>
      </div>

      {seller.status === "pending" && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={() => onAction(seller.id, "rejected")}
          >
            <X className="w-4 h-4 mr-1" /> Reject
          </Button>
          <Button size="sm" onClick={() => onAction(seller.id, "approved")}>
            <Check className="w-4 h-4 mr-1" /> Approve
          </Button>
        </div>
      )}
      {seller.status === "rejected" && (
        <Button size="sm" variant="outline" onClick={() => onAction(seller.id, "approved")}>
          <Check className="w-4 h-4 mr-1" /> Approve
        </Button>
      )}
      {seller.status === "approved" && (
        <Button
          size="sm"
          variant="outline"
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={() => onAction(seller.id, "rejected")}
        >
          <X className="w-4 h-4 mr-1" /> Suspend
        </Button>
      )}
    </div>
  </Card>
);

const AdminSellers = () => {
  const [sellers, setSellers] = useState<PendingSeller[]>(getSellers());
  const [query, setQuery] = useState("");

  const handleAction = (id: string, status: SellerStatus) => {
    const updated = updateSellerStatus(id, status);
    setSellers(updated);
    const labels = { approved: "approved", rejected: "rejected", pending: "moved to pending" };
    toast.success(`Seller ${labels[status]}`);
  };

  const filter = (status: SellerStatus) =>
    sellers
      .filter((s) => s.status === status)
      .filter((s) =>
        [s.storeName, s.ownerName, s.email, s.city]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      );

  const pending = filter("pending");
  const approved = filter("approved");
  const rejected = filter("rejected");

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground font-display">Seller Management</h1>
          <p className="text-sm text-muted-foreground">Review applications and manage active sellers</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Sellers" />

          <main className="flex-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by store name, owner, email, city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>

            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-3 mt-4">
                {pending.length === 0 ? (
                  <Card className="p-10 text-center text-muted-foreground">No pending applications</Card>
                ) : (
                  pending.map((s) => <SellerCard key={s.id} seller={s} onAction={handleAction} />)
                )}
              </TabsContent>
              <TabsContent value="approved" className="space-y-3 mt-4">
                {approved.length === 0 ? (
                  <Card className="p-10 text-center text-muted-foreground">No approved sellers</Card>
                ) : (
                  approved.map((s) => <SellerCard key={s.id} seller={s} onAction={handleAction} />)
                )}
              </TabsContent>
              <TabsContent value="rejected" className="space-y-3 mt-4">
                {rejected.length === 0 ? (
                  <Card className="p-10 text-center text-muted-foreground">No rejected sellers</Card>
                ) : (
                  rejected.map((s) => <SellerCard key={s.id} seller={s} onAction={handleAction} />)
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminSellers;
