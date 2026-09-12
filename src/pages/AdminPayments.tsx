import { useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Wallet, CreditCard, RefreshCw, TrendingUp, Search, Download,
  CheckCircle2, XCircle, Clock, Eye, Undo2, Banknote,
} from "lucide-react";

type PayMethod = "Stripe" | "PayFast" | "COD";
type PayStatus = "successful" | "pending" | "failed" | "refunded";
type RefundStatus = "pending" | "approved" | "rejected";

interface Transaction {
  id: string;
  orderId: string;
  buyer: string;
  buyerEmail: string;
  seller: string;
  amount: number;
  fee: number;
  method: PayMethod;
  status: PayStatus;
  date: string;
  txnRef: string;
}

interface Refund {
  id: string;
  txnId: string;
  orderId: string;
  buyer: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  date: string;
}

const seedTxns: Transaction[] = [
  { id: "TXN-2401", orderId: "ORD-1001", buyer: "Ali Khan", buyerEmail: "ali@example.com", seller: "TechZone", amount: 18500, fee: 555, method: "Stripe", status: "successful", date: "2026-06-19", txnRef: "ch_3PqA1bC2x" },
  { id: "TXN-2402", orderId: "ORD-1002", buyer: "Sara Ahmed", buyerEmail: "sara@example.com", seller: "FashionHub", amount: 4299, fee: 129, method: "PayFast", status: "successful", date: "2026-06-19", txnRef: "pf_8821x" },
  { id: "TXN-2403", orderId: "ORD-1003", buyer: "Bilal Raza", buyerEmail: "bilal@example.com", seller: "HomeMart", amount: 12750, fee: 0, method: "COD", status: "pending", date: "2026-06-18", txnRef: "cod_1003" },
  { id: "TXN-2404", orderId: "ORD-1004", buyer: "Hina Tariq", buyerEmail: "hina@example.com", seller: "BeautyBox", amount: 3499, fee: 105, method: "Stripe", status: "failed", date: "2026-06-18", txnRef: "ch_3PqAfail" },
  { id: "TXN-2405", orderId: "ORD-1005", buyer: "Usman Iqbal", buyerEmail: "usman@example.com", seller: "TechZone", amount: 25999, fee: 780, method: "Stripe", status: "refunded", date: "2026-06-17", txnRef: "ch_3PqArefund" },
  { id: "TXN-2406", orderId: "ORD-1006", buyer: "Mehwish Noor", buyerEmail: "meh@example.com", seller: "FashionHub", amount: 6599, fee: 198, method: "PayFast", status: "successful", date: "2026-06-17", txnRef: "pf_9120x" },
  { id: "TXN-2407", orderId: "ORD-1007", buyer: "Hamza Shah", buyerEmail: "hamza@example.com", seller: "SportsArena", amount: 8990, fee: 0, method: "COD", status: "successful", date: "2026-06-16", txnRef: "cod_1007" },
];

const seedRefunds: Refund[] = [
  { id: "RF-501", txnId: "TXN-2405", orderId: "ORD-1005", buyer: "Usman Iqbal", amount: 25999, reason: "Item damaged on arrival", status: "approved", date: "2026-06-18" },
  { id: "RF-502", txnId: "TXN-2402", orderId: "ORD-1002", buyer: "Sara Ahmed", amount: 4299, reason: "Wrong size delivered", status: "pending", date: "2026-06-19" },
  { id: "RF-503", txnId: "TXN-2406", orderId: "ORD-1006", buyer: "Mehwish Noor", amount: 1500, reason: "Partial refund — missing accessory", status: "pending", date: "2026-06-19" },
  { id: "RF-504", txnId: "TXN-2404", orderId: "ORD-1004", buyer: "Hina Tariq", amount: 3499, reason: "Duplicate charge", status: "rejected", date: "2026-06-18" },
];

const statusVariant = (s: PayStatus) => {
  if (s === "successful") return "default";
  if (s === "pending") return "secondary";
  if (s === "failed") return "destructive";
  return "outline";
};

const refundVariant = (s: RefundStatus) => {
  if (s === "approved") return "default";
  if (s === "pending") return "secondary";
  return "destructive";
};

const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;

const AdminPayments = () => {
  const [txns, setTxns] = useState<Transaction[]>(seedTxns);
  const [refunds, setRefunds] = useState<Refund[]>(seedRefunds);
  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewTxn, setViewTxn] = useState<Transaction | null>(null);
  const [refundOpen, setRefundOpen] = useState<Transaction | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const filteredTxns = useMemo(() => {
    return txns.filter((t) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.orderId.toLowerCase().includes(q) ||
        t.buyer.toLowerCase().includes(q) ||
        t.seller.toLowerCase().includes(q) ||
        t.txnRef.toLowerCase().includes(q);
      const matchM = methodFilter === "all" || t.method === methodFilter;
      const matchS = statusFilter === "all" || t.status === statusFilter;
      return matchQ && matchM && matchS;
    });
  }, [txns, query, methodFilter, statusFilter]);

  const stats = useMemo(() => {
    const success = txns.filter((t) => t.status === "successful");
    const totalRev = success.reduce((s, t) => s + t.amount, 0);
    const totalFees = success.reduce((s, t) => s + t.fee, 0);
    const refundedAmt = refunds.filter((r) => r.status === "approved").reduce((s, r) => s + r.amount, 0);
    const pendingRefunds = refunds.filter((r) => r.status === "pending").length;
    return { totalRev, totalFees, refundedAmt, pendingRefunds };
  }, [txns, refunds]);

  const submitRefund = () => {
    if (!refundOpen) return;
    const amt = parseFloat(refundAmount);
    if (!amt || amt <= 0 || amt > refundOpen.amount) {
      toast.error("Enter a valid refund amount");
      return;
    }
    if (!refundReason.trim()) {
      toast.error("Reason is required");
      return;
    }
    const newRefund: Refund = {
      id: `RF-${Math.floor(Math.random() * 9000) + 1000}`,
      txnId: refundOpen.id,
      orderId: refundOpen.orderId,
      buyer: refundOpen.buyer,
      amount: amt,
      reason: refundReason.trim(),
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
    };
    setRefunds((r) => [newRefund, ...r]);
    toast.success("Refund request created");
    setRefundOpen(null);
    setRefundAmount("");
    setRefundReason("");
  };

  const updateRefund = (id: string, status: RefundStatus) => {
    setRefunds((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    if (status === "approved") {
      const r = refunds.find((x) => x.id === id);
      if (r) {
        setTxns((ts) => ts.map((t) => (t.id === r.txnId ? { ...t, status: "refunded" } : t)));
      }
    }
    toast.success(`Refund ${status}`);
  };

  const exportCsv = () => {
    const rows = [
      ["ID", "Order", "Buyer", "Seller", "Amount", "Fee", "Method", "Status", "Date", "Ref"],
      ...filteredTxns.map((t) => [t.id, t.orderId, t.buyer, t.seller, t.amount, t.fee, t.method, t.status, t.date, t.txnRef]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Payments" />

          <main className="flex-1 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold">Payments & Refunds</h1>
                <p className="text-sm text-muted-foreground">Track all transactions and manage refund requests</p>
              </div>
              <Button variant="outline" onClick={exportCsv}>
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="text-xl font-bold mt-1">{fmt(stats.totalRev)}</p>
                  </div>
                  <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Platform Fees</p>
                    <p className="text-xl font-bold mt-1">{fmt(stats.totalFees)}</p>
                  </div>
                  <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Refunded</p>
                    <p className="text-xl font-bold mt-1">{fmt(stats.refundedAmt)}</p>
                  </div>
                  <div className="w-9 h-9 rounded-md bg-destructive/10 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-destructive" />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Pending Refunds</p>
                    <p className="text-xl font-bold mt-1">{stats.pendingRefunds}</p>
                  </div>
                  <div className="w-9 h-9 rounded-md bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
              </Card>
            </div>

            <Tabs defaultValue="transactions">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="refunds">Refunds</TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="space-y-4">
                <Card className="p-4">
                  <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by txn, order, buyer, seller, ref…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={methodFilter} onValueChange={setMethodFilter}>
                      <SelectTrigger className="w-[160px]"><SelectValue placeholder="Method" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All methods</SelectItem>
                        <SelectItem value="Stripe">Stripe</SelectItem>
                        <SelectItem value="PayFast">PayFast</SelectItem>
                        <SelectItem value="COD">COD</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All status</SelectItem>
                        <SelectItem value="successful">Successful</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Txn ID</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTxns.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-mono text-xs">{t.id}</TableCell>
                          <TableCell className="font-medium">{t.orderId}</TableCell>
                          <TableCell>
                            <div className="text-sm">{t.buyer}</div>
                            <div className="text-xs text-muted-foreground">{t.buyerEmail}</div>
                          </TableCell>
                          <TableCell>{t.seller}</TableCell>
                          <TableCell className="font-semibold">{fmt(t.amount)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {t.method === "COD" ? <Banknote className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                              <span className="text-sm">{t.method}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariant(t.status)} className="capitalize">{t.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{t.date}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="sm" variant="ghost" onClick={() => setViewTxn(t)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {t.status === "successful" && (
                                <Button size="sm" variant="ghost" onClick={() => { setRefundOpen(t); setRefundAmount(String(t.amount)); }}>
                                  <Undo2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredTxns.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-muted-foreground py-8">No transactions found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="refunds">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Refund ID</TableHead>
                        <TableHead>Txn ID</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {refunds.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs">{r.id}</TableCell>
                          <TableCell className="font-mono text-xs">{r.txnId}</TableCell>
                          <TableCell>{r.orderId}</TableCell>
                          <TableCell>{r.buyer}</TableCell>
                          <TableCell className="font-semibold">{fmt(r.amount)}</TableCell>
                          <TableCell className="max-w-[260px] text-sm text-muted-foreground truncate">{r.reason}</TableCell>
                          <TableCell>
                            <Badge variant={refundVariant(r.status)} className="capitalize">{r.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{r.date}</TableCell>
                          <TableCell className="text-right">
                            {r.status === "pending" ? (
                              <div className="flex justify-end gap-1">
                                <Button size="sm" variant="ghost" onClick={() => updateRefund(r.id, "approved")}>
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => updateRefund(r.id, "rejected")}>
                                  <XCircle className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {refunds.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-muted-foreground py-8">No refunds yet</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* View Txn */}
      <Dialog open={!!viewTxn} onOpenChange={(o) => !o && setViewTxn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {viewTxn && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Txn ID</p><p className="font-mono">{viewTxn.id}</p></div>
                <div><p className="text-xs text-muted-foreground">Order</p><p className="font-medium">{viewTxn.orderId}</p></div>
                <div><p className="text-xs text-muted-foreground">Buyer</p><p>{viewTxn.buyer}</p><p className="text-xs text-muted-foreground">{viewTxn.buyerEmail}</p></div>
                <div><p className="text-xs text-muted-foreground">Seller</p><p>{viewTxn.seller}</p></div>
                <div><p className="text-xs text-muted-foreground">Amount</p><p className="font-semibold">{fmt(viewTxn.amount)}</p></div>
                <div><p className="text-xs text-muted-foreground">Platform Fee</p><p>{fmt(viewTxn.fee)}</p></div>
                <div><p className="text-xs text-muted-foreground">Method</p><p>{viewTxn.method}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><Badge variant={statusVariant(viewTxn.status)} className="capitalize">{viewTxn.status}</Badge></div>
                <div className="col-span-2"><p className="text-xs text-muted-foreground">Gateway Reference</p><p className="font-mono text-xs break-all">{viewTxn.txnRef}</p></div>
                <div className="col-span-2"><p className="text-xs text-muted-foreground">Date</p><p>{viewTxn.date}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund */}
      <Dialog open={!!refundOpen} onOpenChange={(o) => !o && setRefundOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Refund</DialogTitle>
          </DialogHeader>
          {refundOpen && (
            <div className="space-y-4">
              <div className="rounded-md bg-secondary p-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Txn</span><span className="font-mono">{refundOpen.id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Order</span><span>{refundOpen.orderId}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="font-semibold">{fmt(refundOpen.amount)}</span></div>
              </div>
              <div className="space-y-2">
                <Label>Refund Amount (Rs.)</Label>
                <Input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} max={refundOpen.amount} />
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="Why is this refund being issued?" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundOpen(null)}>Cancel</Button>
            <Button onClick={submitRefund}>Create Refund Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments;
