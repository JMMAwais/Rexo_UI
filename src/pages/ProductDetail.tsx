import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/mock-data";
import { PLACEHOLDER_IMAGE, isUuid, trackProductView } from "@/lib/productsApi";
import { useProductDetail } from "@/hooks/useProductDetail";
import { Truck, Shield, ShoppingCart, Heart, Store, Minus, Plus, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";



const NotFound = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-foreground">{message}</h1>
      <Link to="/products" className="text-primary hover:underline mt-4 inline-block">
        Browse products
      </Link>
    </div>
    <Footer />
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, adding } = useCart();
  const { isWishlisted, toggle } = useWishlist();

   useEffect(() => {
    if (!isUuid(id)) return;
    const key = `viewed:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch { /* ignore */ }
    trackProductView(id).catch(() => {});
  }, [id]);

  const { data: product, isLoading, isError, refetch } = useProductDetail(id);

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Doosre product par jate hi gallery aur quantity reset
  useEffect(() => {
    setQty(1);
    setActiveImage(0);
  }, [id]);

  if (!isUuid(id)) return <NotFound message="Product not found" />;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading product...
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center space-y-3">
          <h1 className="text-2xl font-bold text-foreground">We couldn't load this product</h1>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) return <NotFound message="Product not found" />;

  const onSale = product.discountedPrice != null && product.discountedPrice < product.price;
  const price = onSale ? product.discountedPrice! : product.price;
  const discountPercent = onSale ? Math.round(((product.price - price) / product.price) * 100) : null;

  const images = product.images.length > 0 ? product.images : [];
  const current = images[activeImage]?.url ?? PLACEHOLDER_IMAGE;

  const inStock = product.stock > 0;
  const maxQty = Math.max(1, product.stock);
  const shipping = product.shipping;

  const dimensions =
    shipping?.lengthCm && shipping?.widthCm && shipping?.heightCm
      ? `${shipping.lengthCm} × ${shipping.widthCm} × ${shipping.heightCm} cm`
      : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          {product.categoryName && (
            <>
              <span>/</span>
              <span>{product.categoryName}</span>
            </>
          )}
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary relative">
              <img src={current} alt={images[activeImage]?.altText ?? product.title} className="w-full h-full object-cover" />
              {discountPercent !== null && (
                <Badge variant="destructive" className="absolute top-4 left-4 text-xs">-{discountPercent}%</Badge>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      idx === activeImage ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={img.url} alt={img.altText ?? `${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              {product.sellerStoreName && (
                <p className="text-sm text-primary flex items-center gap-1 mb-1">
                  <Store className="w-3 h-3" /> {product.sellerStoreName}
                </p>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display">{product.title}</h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">{formatPrice(price)}</span>
              {onSale && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
              )}
            </div>

            <div>
              {inStock ? (
                <span className="text-sm font-medium text-success">
                  In stock{product.stock <= 10 ? ` (only ${product.stock} left)` : ""}
                </span>
              ) : (
                <span className="text-sm font-medium text-destructive">Out of stock</span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-md">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 hover:bg-secondary transition-colors"
                  disabled={!inStock}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-medium">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(maxQty, qty + 1))}
                  className="p-2 hover:bg-secondary transition-colors"
                  disabled={!inStock || qty >= maxQty}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
                       <Button
                size="lg"
                className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!inStock || adding}
                onClick={() => id && addToCart(id, qty)}
              >
                <ShoppingCart className="w-4 h-4" />
                {!inStock ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
              </Button>
                 <Button
                size="lg"
                variant="outline"
                onClick={() => id && toggle(id)}
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    id && isWishlisted(id) ? "fill-destructive text-destructive" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Shipping & trust */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-4 h-4 text-success" />
                <span>
                  {shipping
                    ? shipping.freeShipping
                      ? "Free shipping"
                      : `Shipping: ${formatPrice(shipping.shippingFee)}`
                    : "Shipping calculated at checkout"}
                </span>
              </div>
              {shipping?.processingDays != null && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-success" />
                  <span>
                    {shipping.processingDays === 0
                      ? "Dispatched the same day"
                      : `Dispatched within ${shipping.processingDays} day${shipping.processingDays === 1 ? "" : "s"}`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-success" />
                <span>Buyer protection guarantee</span>
              </div>
            </div>

            {/* Product details */}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-4 border-t border-border">
              <dt className="text-muted-foreground">SKU</dt>
              <dd className="text-foreground break-all">{product.sku}</dd>
              {product.categoryName && (
                <>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="text-foreground">{product.categoryName}</dd>
                </>
              )}
              {shipping?.weightKg != null && (
                <>
                  <dt className="text-muted-foreground">Weight</dt>
                  <dd className="text-foreground">{shipping.weightKg} kg</dd>
                </>
              )}
              {dimensions && (
                <>
                  <dt className="text-muted-foreground">Dimensions</dt>
                  <dd className="text-foreground">{dimensions}</dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;