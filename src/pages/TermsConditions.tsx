import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, Scale, Truck, CreditCard, UserCheck, AlertCircle, Mail } from "lucide-react";

const sections = [
  {
    icon: Scale,
    title: "Acceptance of Terms",
    content:
      "By accessing or using MarketHub, you agree to be bound by these Terms & Conditions and all applicable laws and regulations. If you do not agree with any part of these terms, please do not use our marketplace.",
  },
  {
    icon: UserCheck,
    title: "Account Registration",
    content:
      "To buy or sell on MarketHub, you must create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must provide accurate and complete information.",
  },
  {
    icon: Truck,
    title: "Orders & Delivery",
    content:
      "When you place an order, you are making an offer to purchase from the relevant seller. Delivery times are estimates provided by sellers and may vary based on location and product availability. Risk of loss passes to the buyer upon delivery.",
  },
  {
    icon: CreditCard,
    title: "Payments & Fees",
    content:
      "Payments are processed securely through Stripe, PayFast, or Cash on Delivery (COD). Buyers must pay the full order amount, including shipping and applicable taxes. Sellers are responsible for any platform fees or commissions as outlined in the seller agreement.",
  },
  {
    icon: AlertCircle,
    title: "Prohibited Activities",
    content:
      "Users may not engage in fraud, abuse, harassment, infringement of intellectual property, or any illegal activity. Misrepresentation of products, fake reviews, or attempts to manipulate the platform will result in account suspension.",
  },
  {
    icon: FileText,
    title: "Limitation of Liability",
    content:
      "MarketHub acts as a platform connecting buyers and sellers. We are not liable for the quality, safety, or legality of products listed by sellers. Our total liability to you for any claim arising from your use of the platform is limited to the amount you paid for the relevant order.",
  },
  {
    icon: Mail,
    title: "Contact & Disputes",
    content:
      "If you have any questions about these terms or need to report a dispute, contact us at support@markethub.pk. We encourage users to resolve disputes directly through the order resolution tools available in your account.",
  },
];

const TermsConditions = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <FileText className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display mb-2">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
      </div>

      <div className="bg-card rounded-lg shadow-card p-6 mb-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Welcome to <span className="font-semibold text-foreground">MarketHub</span>. These Terms & Conditions govern your use of our marketplace platform as a buyer or seller. Please read them carefully before using our services.
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
          These terms may be updated from time to time. Continued use of MarketHub after changes means you accept the revised terms.
        </p>
      </div>
    </div>
    <Footer />
  </div>
);

export default TermsConditions;
