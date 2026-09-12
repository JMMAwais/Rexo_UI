import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Store,
  Package, Eye,
} from "lucide-react";
import { getSellers } from "@/lib/admin-store";
import { products as allProducts } from "@/lib/mock-data";

const revenueData = [
  { month: "Jan", revenue: 245000, orders: 132, customers: 48 },
  { month: "Feb", revenue: 312000, orders: 178, customers: 61 },
  { month: "Mar", revenue: 288000, orders: 165, customers: 55 },
  { month: "Apr", revenue: 401000, orders: 224, customers: 82 },
  { month: "May", revenue: 365000, orders: 198, customers: 74 },
  { month: "Jun", revenue: 489000, orders: 271, customers: 96 },
];

const categoryData = [
  { name: "Electronics", value: 38, fill: "hsl(var(--primary))" },
  { name: "Fashion", value: 27, fill: "hsl(var(--accent))" },
  { name: "Home", value: 18, fill: "hsl(var(--warning))" },
  { name: "Sports", value: 11, fill: "hsl(var(--success))" },
  { name: "Other", value: 6, fill: "hsl(var(--muted-foreground))" },
];

const topSellers = [
  { name: "TechHub Store", orders: 312, revenue: 1245000 },
  { name: "Fashion Avenue", orders: 268, revenue: 892000 },
  { name: "Home Essentials", orders: 195, revenue: 654000 },
  { name: "Sportify", orders: 142, revenue: 487000 },
  { name: "Gadget World", orders: 118, revenue: 421000 },
];

const paymentSplit = [
  { method: "Stripe", value: 52 },
  { method: "PayFast", value: 31 },
  { method: "COD", value: 17 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--primary))" },
  orders: { label: "Orders", color: "hsl(var(--accent))" },
  customers: { label: "Customers", color: "hsl(var(--success))" },
  value: { label: "Share", color: "hsl(var(--primary))" },
};

const AdminAnalytics = () => {
  const sellers = getSellers();
  const stats = [
    { label: "Total Revenue", value: "Rs. 2.1M", icon: DollarSign, change: "+22.4%", up: true },
    { label: "Total Orders", value: "1,168", icon: ShoppingCart, change: "+15.8%", up: true },
    { label: "Active Sellers", value: String(sellers.filter((s) => s.status === "approved").length || 24), icon: Store, change: "+8.1%", up: true },
    { label: "Products Listed", value: String(allProducts.length), icon: Package, change: "+12.0%", up: true },
    { label: "New Customers", value: "416", icon: Users, change: "+9.7%", up: true },
    { label: "Conversion Rate", value: "3.6%", icon: Eye, change: "-0.3%", up: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-foreground font-display">Admin Panel</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <AdminSidebar active="Analytics" />
          <main className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground font-display">Analytics</h2>
              <p className="text-sm text-muted-foreground mt-1">Marketplace performance overview</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map(({ label, value, icon: Icon, change, up }) => (
                <Card key={label} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className={`text-xs font-medium flex items-center gap-0.5 ${up ? "text-success" : "text-destructive"}`}>
                        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Revenue Area Chart */}
            <Card className="shadow-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
                <span className="text-xs text-muted-foreground">Last 6 months</span>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis dataKey="month" className="text-xs" axisLine={false} tickLine={false} />
                    <YAxis className="text-xs" axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revArea)" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Orders + Customers */}
              <Card className="shadow-card">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold">Orders vs Customers</CardTitle>
                  <div className="flex gap-3 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-accent inline-block" /> Orders</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-success inline-block" /> Customers</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                      <XAxis dataKey="month" className="text-xs" axisLine={false} tickLine={false} />
                      <YAxis className="text-xs" axisLine={false} tickLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="orders" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="customers" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Category Pie */}
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Sales by Category</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <div className="h-[200px] w-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                          {categoryData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 flex-1">
                    {categoryData.map((c) => (
                      <div key={c.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-sm" style={{ background: c.fill }} />
                        <span className="text-muted-foreground">{c.name}</span>
                        <span className="font-medium text-foreground ml-auto">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Method bar */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Payment Method Split</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[220px] w-full">
                  <BarChart data={paymentSplit} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis type="number" className="text-xs" axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="method" className="text-xs" axisLine={false} tickLine={false} width={80} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} barSize={28} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Sellers */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Top Sellers Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-2 font-medium">#</th>
                      <th className="text-left py-2 font-medium">Seller</th>
                      <th className="text-left py-2 font-medium">Orders</th>
                      <th className="text-left py-2 font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellers.map((s, i) => (
                      <tr key={s.name} className="border-b border-border last:border-0">
                        <td className="py-3 text-muted-foreground">{i + 1}</td>
                        <td className="py-3 font-medium text-foreground">{s.name}</td>
                        <td className="py-3 text-muted-foreground">{s.orders}</td>
                        <td className="py-3 text-foreground">Rs. {s.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
