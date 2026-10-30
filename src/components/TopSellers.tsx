import { Link } from "react-router-dom";
import { Star, Package } from "lucide-react";
import { useTopSellers } from "@/lib/topSellersApi";

const TopSellers = () => {
  const { data: sellers = [], isLoading } = useTopSellers(8);

  // Koi active seller na ho to poora section chhupa do
  if (!isLoading && sellers.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">Top Sellers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-44 rounded-lg bg-secondary animate-pulse" />
              ))
            : sellers.map((seller) => (
                <Link
                  key={seller.id}
                  to={`/store/${seller.id}`}
                  className="group p-5 rounded-lg bg-card shadow-card hover:shadow-card-hover transition-all duration-300 text-center"
                >
                  {seller.storeLogoUrl ? (
                    <img
                      src={seller.storeLogoUrl}
                      alt={seller.storeName}
                      className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold">
                      {seller.storeName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h3 className="font-semibold text-foreground text-sm font-body">{seller.storeName}</h3>

                  {seller.reviewCount > 0 ? (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="text-xs font-medium">{seller.averageRating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({seller.reviewCount})</span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">No reviews yet</p>
                  )}

                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Package className="w-3 h-3" /> {seller.productCount} products
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {seller.salesCount > 0
                      ? `${seller.salesCount.toLocaleString()} sales`
                      : "New store"}
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellers;