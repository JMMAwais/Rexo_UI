import { useState } from "react";
import { Link,useNavigate  } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, X, Store, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MegaMenu from "./MegaMenu";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMenuCategories } from "@/lib/publicCategoriesApi";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";


  const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
    const { count: cartCount } = useCart();
  const [searchValue, setSearchValue] = useState(""); 
  const navigate = useNavigate(); 


    const { user, logout } = useAuth();
      const { count: wishlistCount } = useWishlist();
    const { data: menuCategories = [] } = useMenuCategories();
    const sellerLink = user?.roles?.includes("Seller") ? "/seller/dashboard" : "/seller/register";

    const handleSearch = () => {                          
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

   const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };


  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">

      

        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-1.5 text-xs text-muted-foreground border-b border-border">
          <span>Free shipping on orders over Rs. 5,000</span>
          <div className="flex items-center gap-4">
            <Link to={sellerLink} className="hover:text-foreground transition-colors flex items-center gap-1">
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
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer"
          onClick={handleSearch}
        />
      </div>
      
          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground md:hidden">
              <Search className="w-5 h-5" />
            </Button>
                       <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hidden sm:flex">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                    {wishlistCount}
                  </span>
                )}
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
                       {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary hover:text-primary">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium truncate">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground font-normal truncate">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/account")}>My Account</DropdownMenuItem>
                  {user.roles?.includes("Seller") && (
                    <DropdownMenuItem onClick={() => navigate("/seller/dashboard")}>Seller Dashboard</DropdownMenuItem>
                  )}
                  {user.roles?.includes("Admin") && (
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>Admin Dashboard</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}
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


        <MegaMenu />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <div className="p-4 space-y-3">
            <Input placeholder="Search..." className="bg-secondary border-0" />
                        <Link
              to="/products"
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              All Categories
            </Link>
            {menuCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/products?badge=deals"
              className="block py-2 text-sm text-accent font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              🔥 Deals
            </Link>
            <div className="pt-2 border-t border-border space-y-2">
              <Link to={sellerLink} className="block py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>
                Seller Dashboard
              </Link>
              <Link to="/orders" className="block py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>
                Track Order
              </Link>
                            {user ? (
                <>
                  <Link to="/account" className="block py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>
                    My Account ({user.fullName})
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left py-2 text-sm text-destructive">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="block py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;