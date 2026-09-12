import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, ShoppingCart, Truck, RotateCcw, CreditCard, Shield, HelpCircle, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const topics = [
  { icon: ShoppingCart, title: "Orders", desc: "Track, modify, or cancel orders" },
  { icon: Truck, title: "Shipping", desc: "Delivery times & tracking" },
  { icon: RotateCcw, title: "Returns", desc: "Return policy & refunds" },
  { icon: CreditCard, title: "Payments", desc: "Payment methods & issues" },
  { icon: Shield, title: "Security", desc: "Account safety & privacy" },
  { icon: Store, title: "Selling", desc: "Seller account & management" },
];

const faqs = [
  { q: "How do I track my order?", a: "Go to your account → Orders → Click on the order to see real-time tracking information." },
  { q: "What payment methods do you accept?", a: "We accept Credit/Debit cards (via Stripe), PayFast (instant EFT & mobile), and Cash on Delivery (COD)." },
  { q: "What is your return policy?", a: "You can return most items within 15 days of delivery. Items must be unused and in original packaging." },
  { q: "How do I become a seller?", a: "Click on 'Sell on MarketHub' in the top bar or visit the seller registration page to create your store." },
  { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days within Pakistan. Express shipping is available for 1-2 day delivery." },
  { q: "Is Cash on Delivery available everywhere?", a: "COD is available in most major cities across Pakistan. Check availability at checkout." },
];

const HelpCenter = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground font-display mb-3">How can we help?</h1>
        <div className="relative max-w-md mx-auto">
          <Input placeholder="Search for help..." className="pr-10 bg-secondary border-0 h-12" />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Topics grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {topics.map(({ icon: Icon, title, desc }) => (
          <button key={title} className="p-5 bg-card rounded-lg shadow-card hover:shadow-card-hover transition-all text-left">
            <Icon className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
          </button>
        ))}
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" /> Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-lg shadow-card border-0 px-4">
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
    <Footer />
  </div>
);

export default HelpCenter;
