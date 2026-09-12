import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { sellers } from "@/lib/mock-data";

const TopSellers = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">Top Sellers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sellers.map((seller) => (
          <Link
            key={seller.id}
            to={`/store/${seller.id}`}
            className="group p-5 rounded-lg bg-card shadow-card hover:shadow-card-hover transition-all duration-300 text-center"
          >
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-16 h-16 rounded-full mx-auto mb-3"
              loading="lazy"
            />
            <h3 className="font-semibold text-foreground text-sm font-body">{seller.name}</h3>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span className="text-xs font-medium">{seller.rating}</span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" /> {seller.location}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{seller.totalSales.toLocaleString()} sales</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default TopSellers;
