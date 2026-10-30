import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Search, Mail, Phone, Calendar, Percent, Store, Loader2, Ban } from "lucide-react";
import { toast } from "sonner";
import {
  ADMIN_SELLERS_KEY,
  approveSeller,
  fetchAllSellers,
  rejectSeller,
  suspendSeller,
  type AdminSeller,
} from "@/lib/adminSellersApi";

type StatusKey = "pending" | "active" | "suspended" | "rejected";
type ReasonMode = "reject" | "suspend";

const statusKey = (s: AdminSeller) => s.status.toLowerCase();

const statusBadge: Record<string, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  active: "bg-success/15 text-success border-success/30",
  suspended: "bg-orange-500/15 text-orange-600 border-orange-500/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const SellerCard = ({
  seller,
  busy,
  onApprove,
  onReason,
}: {
  seller: AdminSeller;
  busy: boolean;
  onApprove: (seller: AdminSeller) => void;
  onReason: (seller: AdminSeller, mode: ReasonMode) => void;
}) => {
  const key = statusKey(seller);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4 flex-1 min-w-[260px]">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{seller.storeName}</h3>
              <Badge variant="outline" className={`text-xs capitalize ${statusBadge[key] ?? ""}`}>
                {seller.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{seller.storeDescription}</p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> {seller.contactEmail}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> {seller.contactPhone}
              </span>
              <span className="flex items-center gap-1.5">
                <Percent className="w-3 h-3" /> Commission {seller.commissionRate}%
              </span>
              {seller.approvedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Approved {new Date(seller.approvedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {key === "pending" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={() => onReason(seller, "reject")}
            >
              <X className="w-4 h-4 mr-1" /> Reject
            </Button>
            <Button size="sm" disabled={busy} onClick={() => onApprove(seller)}>
              {busy ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
              Approve
            </Button>
          </div>
        )}

        {key === "active" && (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={() => onReason(seller, "suspend")}
          >
            <Ban className="w-4 h-4 mr-1" /> Suspend
          </Button>
        )}
      </div>
    </Card>
  );
};

const AdminSellers = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<{ seller: AdminSeller; mode: ReasonMode } | null>(null);
  const [reason, setReason] = useState("");

  const { data: sellers = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ADMIN_SELLERS_KEY,
    queryFn: fetchAllSellers,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ADMIN_SELLERS_KEY });

  const approveMutation = useMutation({
    mutationFn: (seller: AdminSeller) => approveSeller(seller.id),
    onSuccess: (_data, seller) => {
      toast.success(`${seller.storeName} approved`, {
        description: "The seller must sign in again to access the seller panel.",
      });
      void refresh();
    },
    onError: (err: Error) => toast.error("Could not approve seller", { description: err.message }),
  });

  const reasonMutation = useMutation({
    mutationFn: ({ seller, mode, text }: { seller: AdminSeller; mode: ReasonMode; text: string }) =>
      mode === "reject" ? rejectSeller(seller.id, text) : suspendSeller(seller.id, text),
    onSuccess: (_data, vars) => {
      toast.success(vars.mode === "reject" ? "Application rejected" : "Seller suspended");
      closeDialog();
      void refresh();
    },
    onError: (err: Error) => toast.error("Action failed", { description: err.message }),
  });

  const openDialog = (seller: AdminSeller, mode: ReasonMode) => {
    setReason("");
    setDialog({ seller, mode });
  };

  const closeDialog = () => {
    setDialog(null);
    setReason("");
  };

  const confirmReason = () => {
    if (!dialog) return;
    const text = reason.trim();
    if (text.length < 3) {
      toast.error("Please enter a reason");
      return;
    }
    reasonMutation.mutate({ seller: dialog.seller, mode: dialog.mode, text });
  };

  const approvingId = approveMutation.isPending ? approveMutation.variables?.id : null;

  const filter = (status: StatusKey) =>
    sellers
      .filter((s) => statusKey(s) === status)
      .filter((s) =>
        [s.storeName, s.contactEmail, s.contactPhone, s.storeDescription]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      );

  const groups: { key: StatusKey; label: string; empty: string; items: AdminSeller[] }[] = [
    { key: "pending", label: "Pending", empty: "No pending applications", items: filter("pending") },
    { key: "active", label: "Active", empty: "No active sellers", items: filter("active") },
    { key: "suspended", label: "Suspended", empty: "No suspended sellers", items: filter("suspended") },
    { key: "rejected", label: "Rejected", empty: "No rejected sellers", items: filter("rejected") },
  ];

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
                placeholder="Search by store name, email, phone..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>

            {isLoading ? (
              <Card className="p-10 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading sellers...
              </Card>
            ) : isError ? (
              <Card className="p-10 text-center space-y-3">
                <p className="text-sm text-destructive">
                  {error instanceof Error ? error.message : "Unable to load sellers"}
                </p>
                <Button size="sm" variant="outline" onClick={() => void refetch()}>
                  Try again
                </Button>
              </Card>
            ) : (
              <Tabs defaultValue="pending">
                <TabsList>
                  {groups.map((g) => (
                    <TabsTrigger key={g.key} value={g.key}>
                      {g.label} ({g.items.length})
                    </TabsTrigger>
                  ))}
                </TabsList>

                {groups.map((g) => (
                  <TabsContent key={g.key} value={g.key} className="space-y-3 mt-4">
                    {g.items.length === 0 ? (
                      <Card className="p-10 text-center text-muted-foreground">{g.empty}</Card>
                    ) : (
                      g.items.map((s) => (
                        <SellerCard
                          key={s.id}
                          seller={s}
                          busy={approvingId === s.id}
                          onApprove={(seller) => approveMutation.mutate(seller)}
                          onReason={openDialog}
                        />
                      ))
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </main>
        </div>
      </div>

      <Dialog open={!!dialog} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog?.mode === "reject" ? "Reject application" : "Suspend seller"}
            </DialogTitle>
            <DialogDescription>
              {dialog?.mode === "reject"
                ? `Tell ${dialog?.seller.storeName} why the application was rejected.`
                : `Tell ${dialog?.seller.storeName} why the store is being suspended.`}
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={reasonMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReason}
              disabled={reasonMutation.isPending}
            >
              {reasonMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {dialog?.mode === "reject" ? "Reject" : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSellers;