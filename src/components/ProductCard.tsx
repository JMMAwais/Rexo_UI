import { useState, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
import type { Product } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

const ProductCard = ({ product, showActions = false }: ProductCardProps) => {
  const { isWishlisted, toggle } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const liked = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  const outOfStock = product.stock !== undefined && product.stock <= 0;

  const handleAddToCart = async (e: MouseEvent) => {
    // Poora card Link hai, isliye button click se page navigate na ho
    e.preventDefault();
    e.stopPropagation();
    if (busy || outOfStock) return;
    setBusy(true);
    try {
      await addToCart(product.id, 1);
    } finally {
      setBusy(false);
    }
  };

  const handleShopNow = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.badge && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-semibold border-0">
            {product.badge}
          </Badge>
        )}
        {discount && (
          <Badge className="absolute top-2 right-10 bg-destructive text-destructive-foreground text-[10px] font-semibold border-0">
            -{discount}%
          </Badge>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-1">{product.seller.name}</p>
        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight mb-2 font-body">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-accent text-accent" />
          <span className="text-xs font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {showActions && (
          <div className="mt-3 space-y-2">
            <Button
              size="sm"
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={busy || outOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
              {outOfStock ? "Out of Stock" : busy ? "Adding..." : "Add to Cart"}
            </Button>
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleShopNow}>
              Shop Now <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;