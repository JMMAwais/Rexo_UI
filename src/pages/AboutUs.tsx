import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Target, Users, ShieldCheck, Truck, HeartHandshake, Sparkles } from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Built for Everyone",
    content:
      "MarketHub connects independent sellers and buyers on one trusted platform. Whether you are a small business owner or a savvy shopper, we make commerce simple, transparent, and accessible.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    content:
      "Every seller is verified, every transaction is secured, and our support team is always ready to help. We prioritize your safety so you can shop and sell with confidence.",
  },
  {
    icon: Truck,
    title: "Dropshipping Ready",
    content:
      "Our platform supports modern dropshipping integrations, giving sellers flexible fulfillment options and buyers access to a wider range of products without borders.",
  },
  {
    icon: HeartHandshake,
    title: "Support That Cares",
    content:
      "From order tracking to returns, our dedicated support team works Monday to Saturday to ensure every question is answered and every issue is resolved quickly.",
  },
];

const stats = [
  { label: "Trusted Sellers", value: "1,200+" },
  { label: "Products Listed", value: "50,000+" },
  { label: "Happy Buyers", value: "85,000+" },
  { label: "Cities Covered", value: "120+" },
];

const AboutUs = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display mb-2">About MarketHub</h1>
        <p className="text-sm text-muted-foreground">Your trusted multi-vendor marketplace</p>
      </div>

      <div className="bg-card rounded-lg shadow-card p-6 mb-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">MarketHub</span> is a modern multi-vendor marketplace designed to empower sellers and delight buyers. We bring together a curated community of verified sellers offering everything from electronics and fashion to home essentials and beauty products.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
          Our mission is simple: make online commerce effortless, secure, and rewarding for everyone. With flexible payment options, reliable delivery partners, and powerful seller tools, MarketHub is where businesses grow and customers find exactly what they need.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-card rounded-lg shadow-card p-5 text-center">
            <div className="text-2xl font-bold text-foreground font-display">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground font-display">Our Mission</h2>
      </div>

      <div className="bg-card rounded-lg shadow-card p-6 mb-10">
        <p className="text-sm text-muted-foreground leading-relaxed">
          To build Pakistan’s most trusted marketplace by giving sellers the tools to succeed and buyers a seamless shopping experience — backed by secure payments, transparent policies, and exceptional customer support.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-foreground font-display mb-6">Why MarketHub?</h2>

      <div className="space-y-4">
        {values.map(({ icon: Icon, title, content }) => (
          <div key={title} className="bg-card rounded-lg shadow-card p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-secondary rounded-lg text-center">
        <p className="text-xs text-muted-foreground">
          Want to sell on MarketHub? Join our growing community of verified sellers and reach thousands of buyers across the country.
        </p>
        <a
          href="/seller/register"
          className="inline-block mt-3 text-xs font-semibold text-primary hover:underline"
        >
          Become a Seller →
        </a>
      </div>
    </div>
    <Footer />
  </div>
);

export default AboutUs;
