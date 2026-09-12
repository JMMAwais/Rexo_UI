import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import SellerStore from "./pages/SellerStore";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Login from "./pages/Login";
import SellerDashboard from "./pages/SellerDashboard";
import SellerAddProduct from "./pages/SellerAddProduct";
import SellerDropshipping from "./pages/SellerDropshipping";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";
import SellerAnalytics from "./pages/SellerAnalytics";
import SellerReviews from "./pages/SellerReviews";
import SellerEarnings from "./pages/SellerEarnings";
import SellerSettings from "./pages/SellerSettings";
import SellerNotifications from "./pages/SellerNotifications";
import SellerRegister from "./pages/SellerRegister";
import BuyerRegister from "./pages/BuyerRegister";
import BuyerAccount from "./pages/BuyerAccount";
import Wishlist from "./pages/Wishlist";
import OrderTracking from "./pages/OrderTracking";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import TermsConditions from "./pages/TermsConditions";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSellers from "./pages/AdminSellers";
import AdminBanners from "./pages/AdminBanners";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminCustomers from "./pages/AdminCustomers";
import AdminCategories from "./pages/AdminCategories";
import AdminReviews from "./pages/AdminReviews";
import AdminCoupons from "./pages/AdminCoupons";
import AdminPayments from "./pages/AdminPayments";
import AdminShipping from "./pages/AdminShipping";
import AdminNotifications from "./pages/AdminNotifications";
import AdminSettings from "./pages/AdminSettings";
import AdminStaff from "./pages/AdminStaff";
import AdminPages from "./pages/AdminPages";
import AdminGuard from "./components/admin/AdminGuard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/store/:id" element={<SellerStore />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<BuyerRegister />} />
          <Route path="/account" element={<BuyerAccount />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/returns" element={<ReturnPolicy />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/products/new" element={<SellerAddProduct />} />
          <Route path="/seller/dropshipping" element={<SellerDropshipping />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/analytics" element={<SellerAnalytics />} />
          <Route path="/seller/reviews" element={<SellerReviews />} />
          <Route path="/seller/earnings" element={<SellerEarnings />} />
          <Route path="/seller/settings" element={<SellerSettings />} />
          <Route path="/seller/notifications" element={<SellerNotifications />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/sellers" element={<AdminGuard><AdminSellers /></AdminGuard>} />
          <Route path="/admin/banners" element={<AdminGuard><AdminBanners /></AdminGuard>} />
          <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
          <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
          <Route path="/admin/analytics" element={<AdminGuard><AdminAnalytics /></AdminGuard>} />
          <Route path="/admin/customers" element={<AdminGuard><AdminCustomers /></AdminGuard>} />
          <Route path="/admin/categories" element={<AdminGuard><AdminCategories /></AdminGuard>} />
          <Route path="/admin/reviews" element={<AdminGuard><AdminReviews /></AdminGuard>} />
          <Route path="/admin/coupons" element={<AdminGuard><AdminCoupons /></AdminGuard>} />
          <Route path="/admin/payments" element={<AdminGuard><AdminPayments /></AdminGuard>} />
          <Route path="/admin/shipping" element={<AdminGuard><AdminShipping /></AdminGuard>} />
          <Route path="/admin/notifications" element={<AdminGuard><AdminNotifications /></AdminGuard>} />
          <Route path="/admin/settings" element={<AdminGuard><AdminSettings /></AdminGuard>} />
          <Route path="/admin/staff" element={<AdminGuard><AdminStaff /></AdminGuard>} />
          <Route path="/admin/pages" element={<AdminGuard><AdminPages /></AdminGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
