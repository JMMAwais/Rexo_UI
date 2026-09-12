import { Link } from "react-router-dom";
import { categories } from "@/lib/mock-data";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const MegaMenu = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMouseEnter = (catId: string) => {
    setActiveCategory(catId);
    setMenuOpen(true);
  };

  const handleMenuLeave = () => {
    setMenuOpen(false);
    setActiveCategory(null);
  };

  return (
    <nav className="hidden md:block relative" onMouseLeave={handleMenuLeave}>
      <div className="flex items-center gap-6 py-2 text-sm">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(cat.id)}
          >
            <Link
              to={`/products?category=${cat.id}`}
              className={`flex items-center gap-1 whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
              <ChevronDown className={`w-3 h-3 transition-transform ${activeCategory === cat.id ? "rotate-180" : ""}`} />
            </Link>
          </div>
        ))}
        <Link to="/products?badge=deals" className="text-accent font-semibold whitespace-nowrap">
          🔥 Deals
        </Link>
      </div>

      {/* Dropdown */}
      {menuOpen && activeCategory && (
        <div
          className="absolute left-0 right-0 top-full bg-card border border-border rounded-b-lg shadow-elevated z-50 animate-fade-in"
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={handleMenuLeave}
        >
          <div className="container mx-auto px-4 py-5">
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-2">
              {categories
                .find((c) => c.id === activeCategory)
                ?.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/products?category=${activeCategory}&sub=${sub.id}`}
                    className="py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {sub.name}
                  </Link>
                ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <Link
                to={`/products?category=${activeCategory}`}
                className="text-xs text-primary font-medium hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                View all in {categories.find((c) => c.id === activeCategory)?.name} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MegaMenu;
