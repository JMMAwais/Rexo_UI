import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductScrollRow from "@/components/ProductScrollRow";
import TopSellers from "@/components/TopSellers";
import PromoStripBar from "@/components/PromoStripBar";
import MidPageBanner from "@/components/MidPageBanner";
import { useNewArrivals } from "@/hooks/useNewArrivals";
import { useTrendingProducts } from "@/hooks/useTrendingProducts";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";

const Index = () => {
    const { data: featured = [], isLoading: featuredLoading } = useFeaturedProducts(12);

   const { data: trending = [], isLoading: trendingLoading } = useTrendingProducts(12);

  const { data: newArrivals = [], isLoading: newArrivalsLoading } = useNewArrivals(12);
  
  return (
    <div className="min-h-screen bg-background">
      <PromoStripBar />
      <Navbar />
      <HeroSection />
      <CategoryGrid />
            <ProductScrollRow
        title="Featured Products"
        products={featured}
        isLoading={featuredLoading}
        emptyMessage="Featured products will appear here soon."
        bgClassName="bg-secondary/50"
      />
      <MidPageBanner />
      <ProductScrollRow
        title="Trending Now"
        products={trending}
        isLoading={trendingLoading}
        emptyMessage="Trending products will appear here soon."
        bgClassName="bg-background"
      />
      <ProductScrollRow
        title="New Arrivals"
        products={newArrivals}
        isLoading={newArrivalsLoading}
        emptyMessage="New products will appear here soon."
        bgClassName="bg-secondary/50"
      />
      <TopSellers />
      <Footer />
    </div>
  );
};

export default Index;