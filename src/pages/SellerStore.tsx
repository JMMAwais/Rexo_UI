import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { sellers, products } from "@/lib/mock-data";
import { Star, MapPin, Shield } from "lucide-react";

const SellerStore = () => {
  const { id } = useParams();
  const seller = sellers.find((s) => s.id === id);
  const sellerProducts = products.filter((p) => p.seller.id === id);

  if (!seller) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Store not found</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">Back to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Store header */}
      <div className="bg-gradient-to-r from-primary/10 via-seller/10 to-accent/10">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-5">
            <img src={seller.avatar} alt={seller.name} className="w-20 h-20 rounded-full shadow-elevated" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground font-display">{seller.name}</h1>
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" /> {seller.rating} rating</span>
                <span>{seller.totalSales.toLocaleString()} sales</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {seller.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Products ({sellerProducts.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sellerProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {sellerProducts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No products listed yet.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SellerStore;
