import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RotateCcw, Package, Clock, ShieldCheck, AlertCircle, Mail } from "lucide-react";

const sections = [
  {
    icon: RotateCcw,
    title: "Return Eligibility",
    content:
      "Items can be returned within 7 days of delivery if they are unused, in original packaging, and include all tags and accessories. Perishable, intimate, and digital goods are not eligible for return unless defective.",
  },
  {
    icon: Package,
    title: "How to Return",
    content:
      "Initiate a return from your account order history. Pack the item securely with the original invoice, attach the provided return label, and drop it off at the designated courier location. Returns without a valid request may be rejected.",
  },
  {
    icon: Clock,
    title: "Refund Timeline",
    content:
      "Once we receive and inspect the returned item, your refund will be processed within 5-7 business days. Depending on your payment method, it may take an additional 2-5 business days for the funds to reflect in your account.",
  },
  {
    icon: ShieldCheck,
    title: "Damaged or Defective Items",
    content:
      "If you receive a damaged, defective, or incorrect item, report it within 48 hours of delivery with photos. We will arrange a free replacement or a full refund, including any return shipping costs.",
  },
  {
    icon: AlertCircle,
    title: "Non-Returnable Items",
    content:
      "Clearance items, gift cards, personalized products, and items marked as final sale cannot be returned. Sellers may define additional non-returnable categories, which are shown on the product page.",
  },
  {
    icon: Mail,
    title: "Need Help?",
    content:
      "For any return or refund questions, contact our support team at support@markethub.pk or visit the Help Center. Our team is available Monday to Saturday, 9 AM to 6 PM.",
  },
];

const ReturnPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <RotateCcw className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display mb-2">Return & Refund Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
      </div>

      <div className="bg-card rounded-lg shadow-card p-6 mb-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          At <span className="font-semibold text-foreground">MarketHub</span>, we want you to shop with confidence. This Return & Refund Policy explains how you can return products and receive refunds when shopping on our marketplace.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map(({ icon: Icon, title, content }) => (
          <div key={title} className="bg-card rounded-lg shadow-card p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground mb-2">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-secondary rounded-lg text-center">
        <p className="text-xs text-muted-foreground">
          Policies may vary by seller for certain products. Always check the seller-specific return note on the product page before placing an order.
        </p>
      </div>
    </div>
    <Footer />
  </div>
);

export default ReturnPolicy;
