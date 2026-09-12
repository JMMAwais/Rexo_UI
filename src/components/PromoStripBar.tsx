import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getPromoStrip, type PromoStrip } from "@/lib/banner-store";

const PromoStripBar = () => {
  const [promo, setPromo] = useState<PromoStrip | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const refresh = () => setPromo(getPromoStrip());
    refresh();
    window.addEventListener("banners-updated", refresh);
    return () => window.removeEventListener("banners-updated", refresh);
  }, []);

  if (!promo || !promo.enabled || dismissed) return null;

  return (
    <div className={`${promo.bgColor} text-primary-foreground`}>
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3 text-sm font-medium relative">
        <span className="text-center">{promo.text}</span>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PromoStripBar;
