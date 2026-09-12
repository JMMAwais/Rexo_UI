import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Plus, Search, Edit2, Trash2, Eye, MoreVertical } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sellerProducts = [
  {
    id: "1",
    name: "Wireless Noise Cancelling Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    price: 7999,
    stock: 45,
    status: "Active",
    category: "Electronics",
    sales: 128,
    variants: 3,
  },
  {
    id: "2",
    name: "Premium Leather Wallet",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop",
    price: 2499,
    stock: 89,
    status: "Active",
    category: "Fashion",
    sales: 76,
    variants: 4,
  },
  {
    id: "3",
    name: "Smart Watch Pro Max",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
    price: 14999,
    stock: 12,
    status: "Low Stock",
    category: "Electronics",
    sales: 54,
    variants: 2,
  },
  {
    id: "4",
    name: "Organic Face Serum",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100&h=100&fit=crop",
    price: 1299,
    stock: 0,
    status: "Out of Stock",
    category: "Beauty",
    sales: 210,
    variants: 1,
  },
  {
    id: "5",
    name: "Running Shoes Ultra Boost",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
    price: 8999,
    stock: 34,
    status: "Active",
    category: "Sports",
    sales: 92,
    variants: 6,
  },
];

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  "Low Stock": "bg-warning/10 text-warning border-warning/20",
  "Out of Stock": "bg-destructive/10 text-destructive border-destructive/20",
};

const SellerProducts = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <SellerSidebar active="Products" />
        <main className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display">My Products</h1>
              <p className="text-sm text-muted-foreground">{sellerProducts.length} products listed</p>
            </div>
            <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/seller/products/new">
                <Plus className="w-4 h-4" /> Add Product
              </Link>
            </Button>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9" />
          </div>

          <Card className="shadow-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 px-4 font-medium">Product</th>
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-left py-3 px-4 font-medium">Price</th>
                      <th className="text-left py-3 px-4 font-medium">Stock</th>
                      <th className="text-left py-3 px-4 font-medium">Sales</th>
                      <th className="text-left py-3 px-4 font-medium">Variants</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                            <span className="font-medium text-foreground line-clamp-1 max-w-[200px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                        <td className="py-3 px-4 text-foreground font-medium">{formatPrice(product.price)}</td>
                        <td className="py-3 px-4 text-foreground">{product.stock}</td>
                        <td className="py-3 px-4 text-foreground">{product.sales}</td>
                        <td className="py-3 px-4 text-foreground">{product.variants}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={statusStyles[product.status]}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2"><Eye className="w-3.5 h-3.5" /> View</DropdownMenuItem>
                              <DropdownMenuItem className="gap-2"><Edit2 className="w-3.5 h-3.5" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive"><Trash2 className="w-3.5 h-3.5" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
    <Footer />
  </div>
);

export default SellerProducts;
