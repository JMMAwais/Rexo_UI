import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchMyWishlist } from "@/lib/productsApi";

const Wishlist = () => {
  const { user } = useAuth();

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["wishlist", "items", user?.email ?? "guest"],
    queryFn: fetchMyWishlist,
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 font-display">My Wishlist</h1>
        <p className="text-sm text-muted-foreground mb-8">Items you've saved for later</p>

        {!user ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Apni wishlist dekhne ke liye login karein</p>
            <Link to="/login" state={{ from: { pathname: "/wishlist" } }}>
              <Button>Login</Button>
            </Link>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-lg bg-secondary animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-center py-20 text-muted-foreground">
            Wishlist load nahi ho saki. Dobara koshish karein.
          </p>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Link to="/products">
              <Button variant="outline">Browse products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;