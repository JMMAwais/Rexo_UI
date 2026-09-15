import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Eye } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 45000, orders: 32 },
  { month: "Feb", revenue: 52000, orders: 41 },
  { month: "Mar", revenue: 48000, orders: 38 },
  { month: "Apr", revenue: 61000, orders: 55 },
  { month: "May", revenue: 55000, orders: 48 },
  { month: "Jun", revenue: 72000, orders: 62 },
];

const categoryData = [
  { name: "Electronics", value: 45, fill: "hsl(var(--primary))" },
  { name: "Fashion", value: 25, fill: "hsl(var(--accent))" },
  { name: "Home", value: 18, fill: "hsl(var(--warning))" },
  { name: "Sports", value: 12, fill: "hsl(var(--success))" },
];

const topProducts = [
  { name: "Wireless Earbuds Pro", sales: 124, revenue: 868600 },
  { name: "Smart Watch Ultra", sales: 89, revenue: 1246100 },
  { name: "Cotton T-Shirt Pack", sales: 210, revenue: 524790 },
  { name: "Running Shoes", sales: 76, revenue: 531240 },
];

const stats = [
  { label: "Monthly Revenue", value: "Rs. 72,000", icon: DollarSign, change: "+18.3%", up: true },
  { label: "Total Orders", value: "62", icon: ShoppingCart, change: "+12.7%", up: true },
  { label: "New Customers", value: "28", icon: Users, change: "+5.2%", up: true },
  { label: "Conversion Rate", value: "3.2%", icon: Eye, change: "-0.4%", up: false },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--primary))" },
  orders: { label: "Orders", color: "hsl(var(--accent))" },
};

const SellerAnalytics = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <SellerSidebar active="Analytics" />
        <main className="flex-1 space-y-6">
          <h1 className="text-2xl font-bold text-foreground font-display">Analytics</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Revenue Chart */}
          <Card className="shadow-card">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary inline-block" /> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-accent inline-block" /> Orders</span>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[320px] w-full">
                <BarChart data={revenueData} barGap={4}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" className="text-xs" axisLine={false} tickLine={false} />
                  <YAxis className="text-xs" axisLine={false} tickLine={false} />
                 <ChartTooltip content={(props) => <ChartTooltipContent {...props} />} />
                  <Bar dataKey="revenue" fill="url(#revGrad)" radius={[6, 6, 0, 0]} barSize={28} />
                  <Bar dataKey="orders" fill="url(#ordGrad)" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Orders Trend */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Orders Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                   <ChartTooltip content={(props) => <ChartTooltipContent {...props} />} />
                    <Line type="monotone" dataKey="orders" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Category Split */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Sales by Category</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="h-[200px] w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                        {categoryData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
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

          {/* Top Products */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 font-medium">Product</th>
                    <th className="text-left py-2 font-medium">Sales</th>
                    <th className="text-left py-2 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.name} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium text-foreground">{p.name}</td>
                      <td className="py-3 text-muted-foreground">{p.sales}</td>
                      <td className="py-3 text-foreground">Rs. {p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
    <Footer />
  </div>
);

export default SellerAnalytics;
