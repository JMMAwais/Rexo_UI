import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getBanners, type MidBanner } from "@/lib/banner-store";

const MidPageBanner = () => {
  const [banners, setBanners] = useState<MidBanner[]>([]);

  useEffect(() => {
    const refresh = () => setBanners(getBanners());
    refresh();
    window.addEventListener("banners-updated", refresh);
    return () => window.removeEventListener("banners-updated", refresh);
  }, []);

  const active = banners.filter((b) => b.enabled);
  if (active.length === 0) return null;

  const [hero, ...rest] = active;

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground font-display">Latest Offers</h2>
          </div>
          <Link to="/products" className="text-sm text-primary hover:underline">View all</Link>
        </div>

        {/* Hero offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden shadow-lg min-h-[220px] md:min-h-[280px]"
        >
          <img src={hero.image} alt={hero.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${hero.gradient}`} />
          {hero.badge && (
            <div className="absolute top-4 right-4 z-20 bg-background text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              {hero.badge}
            </div>
          )}
          <div className="relative z-10 h-full flex items-center px-6 md:px-12 py-10">
            <div className="max-w-lg">
              <h3 className="text-2xl md:text-4xl font-bold text-background font-display mb-2">{hero.title}</h3>
              <p className="text-background/85 text-sm md:text-base mb-5">{hero.subtitle}</p>
              <Link to={hero.ctaHref}>
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 gap-2 font-semibold">
                  {hero.ctaText} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Smaller offer cards */}
        {rest.length > 0 && (
          <div className={`grid gap-4 ${rest.length === 1 ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-" + Math.min(rest.length, 3)}`}>
            {rest.map((b, idx) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative rounded-2xl overflow-hidden shadow-card min-h-[180px] group"
              >
                <img src={b.image} alt={b.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className={`absolute inset-0 bg-gradient-to-r ${b.gradient}`} />
                {b.badge && (
                  <div className="absolute top-3 right-3 z-20 bg-background text-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                    {b.badge}
                  </div>
                )}
                <div className="relative z-10 h-full flex items-end p-5">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-background font-display mb-1">{b.title}</h4>
                    <p className="text-background/85 text-xs md:text-sm mb-3 line-clamp-2">{b.subtitle}</p>
                    <Link to={b.ctaHref} className="inline-flex items-center gap-1.5 text-background text-sm font-semibold hover:gap-2.5 transition-all">
                      {b.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MidPageBanner;
