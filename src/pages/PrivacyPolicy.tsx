import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Lock, Eye, Database, Cookie, Mail } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content:
      "We collect information you provide directly to us, such as your name, email, shipping address, phone number, and payment details when you create an account, place an order, or contact us. We also automatically collect device information, IP address, and browsing activity.",
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content:
      "We use your information to process orders, deliver products, provide customer support, send order updates, personalize your shopping experience, prevent fraud, and improve our services. With your consent, we may also send promotional offers.",
  },
  {
    icon: Lock,
    title: "Data Security",
    content:
      "We implement industry-standard security measures including SSL encryption, secure payment gateways (Stripe, PayFast), and restricted access to personal data. Your payment information is never stored on our servers.",
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content:
      "We use cookies and similar technologies to remember your preferences, keep you signed in, analyze site traffic, and personalize content. You can control cookies through your browser settings.",
  },
  {
    icon: Shield,
    title: "Your Rights",
    content:
      "You have the right to access, update, or delete your personal information at any time from your account settings. You can also opt out of marketing communications and request a copy of your data by contacting our support team.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    content:
      "If you have any questions about this Privacy Policy or how we handle your data, please contact us at privacy@markethub.pk or visit our Help Center for assistance.",
  },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
      </div>

      <div className="bg-card rounded-lg shadow-card p-6 mb-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          At <span className="font-semibold text-foreground">MarketHub</span>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our marketplace.
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
          By using MarketHub, you agree to this Privacy Policy. We may update this policy periodically; changes will be posted on this page.
        </p>
      </div>
    </div>
    <Footer />
  </div>
);

export default PrivacyPolicy;
