import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Trash2,
  MoreVertical,
  Loader2,
  Package,
  Eye,
  EyeOff,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/mock-data";
import {
  deleteProduct,
  fetchCategoryNames,
  publishProduct,
  unpublishProduct,
  type SellerProduct,
} from "@/lib/sellerApi";
import { MY_PRODUCTS_KEY, useMyProducts } from "@/hooks/useMyProducts";

type StatusFilter = "all" | "published" | "draft" | "unpublished";

const LOW_STOCK_LIMIT = 10;

const statusStyles: Record<string, string> = {
  published: "bg-success/10 text-success border-success/20",
  draft: "bg-warning/10 text-warning border-warning/20",
  unpublished: "bg-muted text-muted-foreground border-border",
  archived: "bg-muted text-muted-foreground border-border",
};

const statusKey = (p: SellerProduct) => p.status.toLowerCase();

const SellerProducts = () => {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading, isError, error, refetch } = useMyProducts();

  const { data: categoryNames = {} } = useQuery({
    queryKey: ["categories", "names"],
    queryFn: fetchCategoryNames,
    staleTime: 10 * 60 * 1000,
  });

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [toDelete, setToDelete] = useState<SellerProduct | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: MY_PRODUCTS_KEY });

  const publishMutation = useMutation({
    mutationFn: (p: SellerProduct) => publishProduct(p.id),
    onSuccess: (_d, p) => {
      toast.success(`"${p.title}" is now live`);
      void refresh();
    },
    onError: (err: Error) => toast.error("Could not publish product", { description: err.message }),
  });

  const unpublishMutation = useMutation({
    mutationFn: (p: SellerProduct) => unpublishProduct(p.id),
    onSuccess: (_d, p) => {
      toast.success(`"${p.title}" was unpublished`);
      void refresh();
    },
    onError: (err: Error) => toast.error("Could not unpublish product", { description: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (p: SellerProduct) => deleteProduct(p.id),
    onSuccess: (_d, p) => {
      toast.success(`"${p.title}" was deleted`);
      setToDelete(null);
      void refresh();
    },
    onError: (err: Error) => toast.error("Could not delete product", { description: err.message }),
  });

  const counts: Record<StatusFilter, number> = {
    all: products.length,
    published: products.filter((p) => statusKey(p) === "published").length,
    draft: products.filter((p) => statusKey(p) === "draft").length,
    unpublished: products.filter((p) => statusKey(p) === "unpublished").length,
  };

  const visible = products
    .filter((p) => filter === "all" || statusKey(p) === filter)
    .filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()));

  const filters: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Draft" },
    { key: "unpublished", label: "Unpublished" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <SellerSidebar active="Products" />
          <main className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground font-display">My Products</h1>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Loading..." : `${products.length} product${products.length === 1 ? "" : "s"} listed`}
                </p>
              </div>
              <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/seller/products/new">
                  <Plus className="w-4 h-4" /> Add Product
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {filters.map((f) => (
                  <Button
                    key={f.key}
                    size="sm"
                    variant={filter === f.key ? "default" : "outline"}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label} ({counts[f.key]})
                  </Button>
                ))}
              </div>
            </div>

            <Card className="shadow-card">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-10 flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading your products...
                  </div>
                ) : isError ? (
                  <div className="p-10 text-center space-y-3">
                    <p className="text-sm text-destructive">
                      {error instanceof Error ? error.message : "Unable to load products"}
                    </p>
                    <Button size="sm" variant="outline" onClick={() => void refetch()}>
                      Try again
                    </Button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <Package className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">You haven't added any products yet.</p>
                    <Button asChild size="sm">
                      <Link to="/seller/products/new">Add your first product</Link>
                    </Button>
                  </div>
                ) : visible.length === 0 ? (
                  <div className="p-10 text-center text-sm text-muted-foreground">
                    No products match your search.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="text-left py-3 px-4 font-medium">Product</th>
                          <th className="text-left py-3 px-4 font-medium">Category</th>
                          <th className="text-left py-3 px-4 font-medium">Price</th>
                          <th className="text-left py-3 px-4 font-medium">Stock</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-right py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visible.map((product) => {
                          const key = statusKey(product);
                          const hasDiscount =
                            product.discountedPrice != null && product.discountedPrice < product.price;
                          const busy =
                            (publishMutation.isPending && publishMutation.variables?.id === product.id) ||
                            (unpublishMutation.isPending && unpublishMutation.variables?.id === product.id);

                          return (
                            <tr
                              key={product.id}
                              className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  {product.primaryImageUrl ? (
                                    <img
                                      src={product.primaryImageUrl}
                                      alt={product.title}
                                      className="w-10 h-10 rounded-md object-cover bg-secondary"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center">
                                      <Package className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                  )}
                                  <span className="font-medium text-foreground line-clamp-1 max-w-[220px]">
                                    {product.title}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {categoryNames[product.categoryId] ?? "-"}
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-medium text-foreground">
                                  {formatPrice(hasDiscount ? product.discountedPrice! : product.price)}
                                </div>
                                {hasDiscount && (
                                  <div className="text-xs text-muted-foreground line-through">
                                    {formatPrice(product.price)}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={
                                    product.stock === 0
                                      ? "text-destructive font-medium"
                                      : product.stock <= LOW_STOCK_LIMIT
                                        ? "text-warning font-medium"
                                        : "text-foreground"
                                  }
                                >
                                  {product.stock}
                                </span>
                                {product.stock === 0 && (
                                  <span className="ml-2 text-xs text-destructive">Out of stock</span>
                                )}
                                {product.stock > 0 && product.stock <= LOW_STOCK_LIMIT && (
                                  <span className="ml-2 text-xs text-warning">Low</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className={statusStyles[key] ?? ""}>
                                  {product.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={busy}>
                                      {busy ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <MoreVertical className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {(key === "draft" || key === "unpublished") && (
                                      <DropdownMenuItem
                                        className="gap-2"
                                        onClick={() => publishMutation.mutate(product)}
                                      >
                                        <Rocket className="w-3.5 h-3.5" /> Publish
                                      </DropdownMenuItem>
                                    )}
                                    {key === "published" && (
                                      <DropdownMenuItem
                                        className="gap-2"
                                        onClick={() => unpublishMutation.mutate(product)}
                                      >
                                        <EyeOff className="w-3.5 h-3.5" /> Unpublish
                                      </DropdownMenuItem>
                                    )}
                                    {key === "published" && (
                                      <DropdownMenuItem asChild className="gap-2">
                                        <Link to={`/product/${product.id}`}>
                                          <Eye className="w-3.5 h-3.5" /> View in store
                                        </Link>
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="gap-2 text-destructive"
                                      onClick={() => setToDelete(product)}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
      <Footer />

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              "{toDelete?.title}" will be removed from your store. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (toDelete) deleteMutation.mutate(toDelete);
              }}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SellerProducts;