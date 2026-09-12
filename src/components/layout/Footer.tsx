import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-background/80">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-display text-lg font-semibold text-background mb-4">MarketHub</h4>
          <p className="text-sm leading-relaxed text-background/60">Your trusted multi-vendor marketplace with dropshipping support.</p>
        </div>
        <div>
          <h5 className="font-semibold text-background mb-3 text-sm">Shop</h5>
          <div className="space-y-2 text-sm">
            <Link to="/products" className="block hover:text-background transition-colors">All Products</Link>
            <Link to="/products?badge=deals" className="block hover:text-background transition-colors">Deals</Link>
            <Link to="/products?category=electronics" className="block hover:text-background transition-colors">Electronics</Link>
            <Link to="/products?category=fashion" className="block hover:text-background transition-colors">Fashion</Link>
          </div>
        </div>
        <div>
          <h5 className="font-semibold text-background mb-3 text-sm">Sell</h5>
          <div className="space-y-2 text-sm">
            <Link to="/seller/dashboard" className="block hover:text-background transition-colors">Seller Dashboard</Link>
            <Link to="/seller/register" className="block hover:text-background transition-colors">Become a Seller</Link>
            <span className="block">Seller Support</span>
          </div>
        </div>
        <div>
          <h5 className="font-semibold text-background mb-3 text-sm">Support</h5>
          <div className="space-y-2 text-sm">
            <Link to="/contact" className="block hover:text-background transition-colors">Contact Us</Link>
            <Link to="/help" className="block hover:text-background transition-colors">FAQs</Link>
            <Link to="/returns" className="block hover:text-background transition-colors">Returns & Refunds</Link>
            <Link to="/privacy" className="block hover:text-background transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="block hover:text-background transition-colors">Terms & Conditions</Link>
            <Link to="/about" className="block hover:text-background transition-colors">About Us</Link>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/40">
        <span>© 2026 MarketHub. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span>Stripe</span>
          <span>PayFast</span>
          <span>COD</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
