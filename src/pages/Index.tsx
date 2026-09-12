import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductScrollRow from "@/components/ProductScrollRow";
import TopSellers from "@/components/TopSellers";
import PromoStripBar from "@/components/PromoStripBar";
import MidPageBanner from "@/components/MidPageBanner";
import { products } from "@/lib/mock-data";

const Index = () => {
  const trending = [...products].slice().reverse();
  const newArrivals = [...products].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="min-h-screen bg-background">
      <PromoStripBar />
      <Navbar />
      <HeroSection />
      <CategoryGrid />
      <ProductScrollRow title="Featured Products" products={products} bgClassName="bg-secondary/50" />
      <MidPageBanner />
      <ProductScrollRow title="Trending Now" products={trending} bgClassName="bg-background" />
      <ProductScrollRow title="New Arrivals" products={newArrivals} bgClassName="bg-secondary/50" />
      <TopSellers />
      <Footer />
    </div>
  );
};

export default Index;
