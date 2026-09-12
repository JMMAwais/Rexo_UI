import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { products, formatPrice } from "@/lib/mock-data";
import type { ProductVariant } from "@/lib/mock-data";
import { Star, Truck, Shield, ShoppingCart, Heart, Store, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <Link to="/products" className="text-primary hover:underline mt-4 inline-block">Browse products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Group variants by type
  const variantGroups: Record<string, ProductVariant[]> = {};
  product.variants?.forEach((v) => {
    if (!variantGroups[v.type]) variantGroups[v.type] = [];
    variantGroups[v.type].push(v);
  });

  const selectVariant = (type: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [type]: variantId }));
  };

  // Calculate adjusted price
  const priceAdjustment = Object.values(selectedVariants).reduce((sum, vId) => {
    const variant = product.variants?.find((v) => v.id === vId);
    return sum + (variant?.priceAdjustment || 0);
  }, 0);
  const finalPrice = product.price + priceAdjustment;

  const variantTypeLabels: Record<string, string> = {
    color: "Color",
    size: "Size",
    storage: "Storage",
    material: "Material",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-foreground capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-secondary relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground border-0">{product.badge}</Badge>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <Link to={`/store/${product.seller.id}`} className="text-sm text-primary hover:underline flex items-center gap-1 mb-1">
                <Store className="w-3 h-3" /> {product.seller.name}
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">{formatPrice(finalPrice)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  <Badge variant="destructive" className="text-xs">-{discount}%</Badge>
                </>
              )}
            </div>

            {/* Variants */}
            {Object.entries(variantGroups).map(([type, variants]) => (
              <div key={type} className="space-y-2">
                <span className="text-sm font-medium text-foreground">
                  {variantTypeLabels[type] || type}
                  {selectedVariants[type] && (
                    <span className="text-muted-foreground font-normal ml-2">
                      — {variants.find((v) => v.id === selectedVariants[type])?.label}
                    </span>
                  )}
                </span>
                <div className="flex flex-wrap gap-2">
                  {type === "color" ? (
                    variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => v.inStock && selectVariant(type, v.id)}
                        disabled={!v.inStock}
                        className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                          selectedVariants[type] === v.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-muted-foreground"
                        } ${!v.inStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                        title={v.label + (!v.inStock ? " (Out of stock)" : "")}
                      >
                        <span
                          className="absolute inset-1 rounded-full"
                          style={{ backgroundColor: v.value }}
                        />
                        {selectedVariants[type] === v.id && (
                          <Check className="absolute inset-0 m-auto w-4 h-4 text-primary z-10" />
                        )}
                        {!v.inStock && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-[120%] h-[1px] bg-destructive rotate-45 absolute" />
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => v.inStock && selectVariant(type, v.id)}
                        disabled={!v.inStock}
                        className={`px-4 py-2 rounded-md border text-sm transition-all ${
                          selectedVariants[type] === v.id
                            ? "border-primary bg-primary/5 text-primary font-medium"
                            : "border-border text-foreground hover:border-muted-foreground"
                        } ${!v.inStock ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer"}`}
                      >
                        {v.label}
                        {v.priceAdjustment ? ` (+${formatPrice(v.priceAdjustment)})` : ""}
                      </button>
                    ))
                  )}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-secondary transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-secondary transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              {[
                { icon: Truck, text: "Free shipping on orders over Rs. 5,000" },
                { icon: Shield, text: "Buyer protection guarantee" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4 text-success" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Seller card */}
            <Link to={`/store/${product.seller.id}`} className="block p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <img src={product.seller.avatar} alt={product.seller.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium text-sm text-foreground">{product.seller.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-accent text-accent" /> {product.seller.rating}</span>
                    <span>•</span>
                    <span>{product.seller.totalSales.toLocaleString()} sales</span>
                  </div>
                </div>
                <span className="ml-auto text-xs text-primary font-medium">Visit Store →</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
