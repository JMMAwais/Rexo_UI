import { useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare, Star, CheckCircle2, XCircle, Search, Eye, Trash2,
  Flag, Clock,
} from "lucide-react";
import { toast } from "sonner";

type ReviewStatus = "pending" | "approved" | "rejected";

interface Review {
  id: string;
  product: string;
  productImage: string;
  buyer: string;
  buyerEmail: string;
  seller: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: ReviewStatus;
  reported: boolean;
}

const seed: Review[] = [
  { id: "RV-1001", product: "Wireless Headphones Pro", productImage: "🎧", buyer: "Ali Raza", buyerEmail: "ali@example.com", seller: "TechHub Store", rating: 5, title: "Excellent sound quality", comment: "Bohat zabardast headphones hain. Bass crisp hai aur battery life amazing.", date: "2026-06-15", status: "pending", reported: false },
  { id: "RV-1002", product: "Cotton Kurta Set", productImage: "👕", buyer: "Sara Khan", buyerEmail: "sara@example.com", seller: "Fashion Point", rating: 4, title: "Nice fabric", comment: "Quality acchi hai, stitching b theek hai. Color thora different tha.", date: "2026-06-14", status: "approved", reported: false },
  { id: "RV-1003", product: "Smart Watch X1", productImage: "⌚", buyer: "Bilal Ahmed", buyerEmail: "bilal@example.com", seller: "GadgetWorld", rating: 1, title: "Worst experience", comment: "Product damaged aya, refund b nahi mil raha. Scammer hai seller!!", date: "2026-06-13", status: "pending", reported: true },
  { id: "RV-1004", product: "Leather Wallet", productImage: "👛", buyer: "Hina Tariq", buyerEmail: "hina@example.com", seller: "LeatherCraft", rating: 5, title: "Premium quality", comment: "Genuine leather, finishing perfect. Highly recommended.", date: "2026-06-12", status: "approved", reported: false },
  { id: "RV-1005", product: "Running Shoes Air", productImage: "👟", buyer: "Usman Shah", buyerEmail: "usman@example.com", seller: "SportZone", rating: 2, title: "Not as shown", comment: "Picture mein different the, asal product cheap lag raha hai.", date: "2026-06-11", status: "pending", reported: false },
  { id: "RV-1006", product: "Bluetooth Speaker", productImage: "🔊", buyer: "Maryam Iqbal", buyerEmail: "maryam@example.com", seller: "TechHub Store", rating: 4, title: "Good for the price", comment: "Sound clear hai, portable b hai. Value for money.", date: "2026-06-10", status: "approved", reported: false },
  { id: "RV-1007", product: "Office Chair Ergo", productImage: "🪑", buyer: "Faisal Munir", buyerEmail: "faisal@example.com", seller: "HomeOffice Pk", rating: 3, title: "Average build", comment: "Comfortable hai but assembly mushkil thi. Instructions clear nahi.", date: "2026-06-09", status: "rejected", reported: false },
  { id: "RV-1008", product: "Organic Honey 1kg", productImage: "🍯", buyer: "Ayesha Noor", buyerEmail: "ayesha@example.com", seller: "PureFoods", rating: 5, title: "Pure and tasty", comment: "Bilkul khalis lagi, taste b natural. Will reorder.", date: "2026-06-08", status: "pending", reported: false },
];

const initials = (n: string) =>
  n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const Stars = ({ value }: { value: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
        }`}
      />
    ))}
  </div>
);

const statusBadge = (s: ReviewStatus) => {
  if (s === "approved")
    return <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/20">Approved</Badge>;
  if (s === "rejected")
    return <Badge variant="destructive">Rejected</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(seed);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | ReviewStatus | "reported">("all");
  const [viewing, setViewing] = useState<Review | null>(null);

  const stats = useMemo(() => ({
    total: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    reported: reviews.filter((r) => r.reported).length,
  }), [reviews]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return reviews.filter((r) => {
      const matchTab =
        tab === "all" ? true :
        tab === "reported" ? r.reported : r.status === tab;
      const matchQ =
        !q ||
        r.product.toLowerCase().includes(q) ||
        r.buyer.toLowerCase().includes(q) ||
        r.seller.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q);
      return matchTab && matchQ;
    });
  }, [reviews, query, tab]);

  const setStatus = (id: string, status: ReviewStatus) => {
    setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Review ${status}`);
    setViewing(null);
  };

  const remove = (id: string) => {
    setReviews((rs) => rs.filter((r) => r.id !== id));
    toast.success("Review deleted");
    setViewing(null);
  };

  const statCards = [
    { label: "Total Reviews", value: stats.total, icon: MessageSquare, color: "text-primary" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
    { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-green-500" },
    { label: "Reported", value: stats.reported, icon: Flag, color: "text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <AdminSidebar active="Reviews" />

        <main className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Reviews Moderation</h1>
            <p className="text-sm text-muted-foreground">
              Approve, reject ya delete buyer reviews.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${color}`} />
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by product, buyer, seller, ID..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="reported">Reported</TabsTrigger>
              </TabsList>

              <TabsContent value={tab} className="mt-4">
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="min-w-[260px]">Review</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                            No reviews found.
                          </TableCell>
                        </TableRow>
                      ) : filtered.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">{initials(r.buyer)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium leading-tight">{r.buyer}</p>
                                <p className="text-xs text-muted-foreground">{r.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{r.productImage}</span>
                              <div>
                                <p className="text-sm font-medium leading-tight">{r.product}</p>
                                <p className="text-xs text-muted-foreground">{r.seller}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell><Stars value={r.rating} /></TableCell>
                          <TableCell className="max-w-[320px]">
                            <p className="text-sm font-medium leading-tight">{r.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{r.comment}</p>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{r.date}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {statusBadge(r.status)}
                              {r.reported && (
                                <Badge variant="outline" className="border-destructive text-destructive text-[10px]">
                                  <Flag className="w-2.5 h-2.5 mr-1" /> Reported
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" onClick={() => setViewing(r)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {r.status !== "approved" && (
                                <Button size="icon" variant="ghost" className="text-green-600" onClick={() => setStatus(r.id, "approved")}>
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                              )}
                              {r.status !== "rejected" && (
                                <Button size="icon" variant="ghost" className="text-amber-600" onClick={() => setStatus(r.id, "rejected")}>
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="icon" variant="ghost" className="text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Ye action permanent hai. Review delete hone ke baad restore nahi hoga.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => remove(r.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </main>
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>{initials(viewing.buyer)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{viewing.buyer}</p>
                  <p className="text-xs text-muted-foreground">{viewing.buyerEmail}</p>
                  <div className="mt-1"><Stars value={viewing.rating} /></div>
                </div>
                {statusBadge(viewing.status)}
              </div>

              <div className="rounded-lg border p-3 bg-secondary/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{viewing.productImage}</span>
                  <div>
                    <p className="text-sm font-medium">{viewing.product}</p>
                    <p className="text-xs text-muted-foreground">Seller: {viewing.seller}</p>
                  </div>
                </div>
                <p className="font-medium text-sm">{viewing.title}</p>
                <Textarea value={viewing.comment} readOnly className="mt-2 resize-none" rows={4} />
                <p className="text-xs text-muted-foreground mt-2">Posted on {viewing.date}</p>
              </div>

              {viewing.reported && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
                  <Flag className="w-4 h-4" /> This review has been reported by users.
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex-wrap gap-2">
            {viewing && (
              <>
                <Button variant="outline" onClick={() => remove(viewing.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
                <Button variant="outline" onClick={() => setStatus(viewing.id, "rejected")}>
                  <XCircle className="w-4 h-4 mr-1" /> Reject
                </Button>
                <Button onClick={() => setStatus(viewing.id, "approved")}>
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReviews;
