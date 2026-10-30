import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface ProductScrollRowProps {
  title: string;
  products: Product[];
  bgClassName?: string;
  viewAllHref?: string;
  isLoading?: boolean;
  
  emptyMessage?: string;
}

const SkeletonCard = () => (
  // <div className="min-w-[220px] max-w-[260px] flex-shrink-0 rounded-lg bg-card shadow-card overflow-hidden animate-pulse">
    <div className="w-[240px] flex-shrink-0 rounded-lg bg-card shadow-card overflow-hidden animate-pulse">
    <div className="aspect-square bg-secondary" />
    <div className="p-3 space-y-2">
      <div className="h-3 w-1/3 bg-secondary rounded" />
      <div className="h-4 w-3/4 bg-secondary rounded" />
      <div className="h-4 w-1/2 bg-secondary rounded" />
    </div>
  </div>
);

const ProductScrollRow = ({
  title,
  products,
  bgClassName = "bg-secondary/50",
  viewAllHref = "/products",
  isLoading = false,
  emptyMessage,
}: ProductScrollRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const showEmpty = !isLoading && products.length === 0 && !!emptyMessage;

  return (
    <section className={`py-12 ${bgClassName}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll("left")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll("right")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Link to={viewAllHref} className="text-sm text-primary font-medium flex items-center gap-1 hover:underline ml-2">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {showEmpty ? (
          <p className="text-sm text-muted-foreground py-8">{emptyMessage}</p>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : products.map((p) => (
                  // <div key={p.id} className="min-w-[220px] max-w-[260px] flex-shrink-0 snap-start">
                    <div key={p.id} className="w-[240px] flex-shrink-0 snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductScrollRow;