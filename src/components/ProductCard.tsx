import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
import type { Product } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/context/WishlistContext";

const ProductCard = ({ product }: { product: Product }) => {
   const { isWishlisted, toggle } = useWishlist();
  const liked = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
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
      </div>
    </Link>
  );
};

export default ProductCard;
