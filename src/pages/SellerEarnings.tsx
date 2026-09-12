import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/mock-data";
import { Wallet, ArrowUpRight, Clock, DollarSign, Landmark, CreditCard } from "lucide-react";

const stats = [
  { label: "Available Balance", value: 84500, icon: Wallet, change: "Ready to withdraw" },
  { label: "Total Earnings", value: 284500, icon: DollarSign, change: "Lifetime revenue" },
  { label: "Pending Clearance", value: 32100, icon: Clock, change: "From recent orders" },
  { label: "Total Withdrawn", value: 167900, icon: ArrowUpRight, change: "Lifetime payouts" },
];

const recentWithdrawals = [
  { id: "#WDR-001", method: "Bank Transfer", amount: 50000, status: "Completed", date: "Jul 10, 2026" },
  { id: "#WDR-002", method: "JazzCash", amount: 25000, status: "Processing", date: "Jul 08, 2026" },
  { id: "#WDR-003", method: "Bank Transfer", amount: 45000, status: "Completed", date: "Jun 25, 2026" },
  { id: "#WDR-004", method: "EasyPaisa", amount: 15000, status: "Completed", date: "Jun 12, 2026" },
];

const earningsHistory = [
  { id: "#ORD-101", source: "Order #ORD-101", amount: 7999, fee: 400, net: 7599, date: "Jul 12, 2026" },
  { id: "#ORD-098", source: "Order #ORD-098", amount: 12499, fee: 625, net: 11874, date: "Jul 11, 2026" },
  { id: "#ORD-095", source: "Order #ORD-095", amount: 4599, fee: 230, net: 4369, date: "Jul 09, 2026" },
  { id: "#ORD-091", source: "Order #ORD-091", amount: 18999, fee: 950, net: 18049, date: "Jul 07, 2026" },
];

const withdrawalStatusColor: Record<string, string> = {
  Completed: "bg-success/10 text-success",
  Processing: "bg-warning/10 text-warning",
  Failed: "bg-destructive/10 text-destructive",
};

const SellerEarnings = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <SellerSidebar active="Earnings" />

        <main className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display">Earnings & Withdrawals</h1>
              <p className="text-sm text-muted-foreground">Manage payouts and track your revenue</p>
            </div>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Wallet className="w-4 h-4" /> Withdraw Funds
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, change }) => (
              <Card key={label} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{formatPrice(value)}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xs text-success mt-1">{change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Withdrawal Form */}
            <Card className="shadow-card lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Request Withdrawal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="Enter amount" defaultValue="84500" />
                  <p className="text-xs text-muted-foreground">Minimum withdrawal: Rs. 1,000</p>
                </div>
                <div className="space-y-2">
                  <Label>Withdrawal Method</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" className="justify-start gap-2 h-auto py-2.5 border-primary bg-primary/5">
                      <Landmark className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Bank Transfer</span>
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 h-auto py-2.5">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">JazzCash</span>
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 h-auto py-2.5">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">EasyPaisa</span>
                    </Button>
                  </div>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Request Withdrawal
                </Button>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card className="shadow-card lg:col-span-2">
              <CardContent className="p-0 pt-4">
                <Tabs defaultValue="withdrawals" className="w-full">
                  <TabsList className="ml-4">
                    <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                    <TabsTrigger value="earnings">Earnings History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="withdrawals" className="p-4 pt-2">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground">
                            <th className="text-left py-2 font-medium">Withdrawal ID</th>
                            <th className="text-left py-2 font-medium">Method</th>
                            <th className="text-left py-2 font-medium">Amount</th>
                            <th className="text-left py-2 font-medium">Status</th>
                            <th className="text-left py-2 font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentWithdrawals.map((w) => (
                            <tr key={w.id} className="border-b border-border last:border-0">
                              <td className="py-3 font-medium text-foreground">{w.id}</td>
                              <td className="py-3 text-muted-foreground">{w.method}</td>
                              <td className="py-3 text-foreground">{formatPrice(w.amount)}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${withdrawalStatusColor[w.status]}`}>
                                  {w.status}
                                </span>
                              </td>
                              <td className="py-3 text-muted-foreground">{w.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="earnings" className="p-4 pt-2">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground">
                            <th className="text-left py-2 font-medium">Source</th>
                            <th className="text-left py-2 font-medium">Amount</th>
                            <th className="text-left py-2 font-medium">Platform Fee</th>
                            <th className="text-left py-2 font-medium">Net Earnings</th>
                            <th className="text-left py-2 font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {earningsHistory.map((e) => (
                            <tr key={e.id} className="border-b border-border last:border-0">
                              <td className="py-3 font-medium text-foreground">{e.source}</td>
                              <td className="py-3 text-muted-foreground">{formatPrice(e.amount)}</td>
                              <td className="py-3 text-destructive">-{formatPrice(e.fee)}</td>
                              <td className="py-3 font-medium text-success">{formatPrice(e.net)}</td>
                              <td className="py-3 text-muted-foreground">{e.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
    <Footer />
  </div>
);

export default SellerEarnings;
