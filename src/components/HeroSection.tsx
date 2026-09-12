import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Truck, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-marketplace.jpg";

const HERO_SLIDES = [
  { src: heroImage, alt: "Premium marketplace products" },
  { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop", alt: "Fashion and apparel collection" },
  { src: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&h=1080&fit=crop", alt: "Latest tech gadgets" },
  { src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1920&h=1080&fit=crop", alt: "Beauty and wellness products" },
  { src: "https://images.unsplash.com/photo-1441986300917-64674bd16d99?w=1920&h=1080&fit=crop", alt: "Shopping retail experience" },
];

const SLIDE_INTERVAL = 5000;

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Hero */}
      <div className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.img
              key={index}
              src={HERO_SLIDES[index].src}
              alt={HERO_SLIDES[index].alt}
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={1080}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-background" : "w-1.5 bg-background/50 hover:bg-background/80"
                }`}
              />
            ))}
          </div>
        </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold mb-4 backdrop-blur-sm">
            Multi-Vendor Marketplace
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-4">
            Discover Products from Top Sellers
          </h1>
          <p className="text-background/70 text-lg mb-8 leading-relaxed font-body">
            Shop from hundreds of verified sellers. Enjoy free shipping, secure payments, and cash on delivery.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/seller/register">
              <Button size="lg" variant="outline" className="bg-transparent border-background/40 text-background hover:bg-background/15 hover:text-background font-semibold backdrop-blur-sm">
                Start Selling
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>

    {/* Trust bar */}
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Truck, text: "Free Shipping Over Rs. 5,000" },
            { icon: Shield, text: "Buyer Protection Guarantee" },
            { icon: CreditCard, text: "Stripe · PayFast · COD" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Icon className="w-4 h-4 text-primary" />
              <span className="font-body">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};

export default HeroSection;
