import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/mock-data";
import { Heart } from "lucide-react";

const Wishlist = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2 font-display">My Wishlist</h1>
      <p className="text-sm text-muted-foreground mb-8">Items you've saved for later</p>
      {/* Mock: show first 4 products as "wishlisted" */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Your wishlist is empty</p>
        </div>
      )}
    </div>
    <Footer />
  </div>
);

export default Wishlist;
