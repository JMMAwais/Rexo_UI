import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, X, Store, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MegaMenu from "./MegaMenu";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(3);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-1.5 text-xs text-muted-foreground border-b border-border">
          <span>Free shipping on orders over Rs. 5,000</span>
          <div className="flex items-center gap-4">
            <Link to="/seller/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Store className="w-3 h-3" /> Sell on MarketHub
            </Link>
            <Link to="/help" className="hover:text-foreground transition-colors">Help Center</Link>
            <Link to="/order-tracking" className="hover:text-foreground transition-colors">Track Order</Link>
          </div>
        </div>

        {/* Main navbar */}
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg font-body">M</span>
            </div>
            <span className="text-xl font-bold font-display text-foreground hidden sm:block">MarketHub</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Input
              placeholder="Search products, brands, sellers..."
              className="pr-10 bg-secondary border-0 h-10 text-sm focus-visible:ring-primary"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground md:hidden">
              <Search className="w-5 h-5" />
            </Button>
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Category nav with mega menu */}
        <MegaMenu />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <div className="p-4 space-y-3">
            <Input placeholder="Search..." className="bg-secondary border-0" />
            {["All Categories", "Electronics", "Fashion", "Home & Living", "Beauty", "Sports", "Deals"].map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat.toLowerCase()}`}
                className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
            <div className="pt-2 border-t border-border space-y-2">
              <Link to="/seller/dashboard" className="block py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>
                Seller Dashboard
              </Link>
              <Link to="/order-tracking" className="block py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>
                Track Order
              </Link>
              <Link to="/login" className="block py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>
                Sign In / Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
