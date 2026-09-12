// Banner store — promo strip + mid-page banner ads via localStorage.
const PROMO_KEY = "promo_strip";
const BANNERS_KEY = "mid_banners";

export interface PromoStrip {
  enabled: boolean;
  text: string;
  bgColor: string; // tailwind class
}

export interface MidBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  gradient: string; // tailwind classes
  enabled: boolean;
  badge?: string; // e.g. "50% OFF", "NEW", "LIMITED"
}

const defaultPromo: PromoStrip = {
  enabled: true,
  text: "🎉 Mega Eid Sale — Free shipping on orders over Rs. 5,000 | Use code EID20",
  bgColor: "bg-primary",
};

const defaultBanners: MidBanner[] = [
  {
    id: "b1",
    title: "Eid Collection 2025",
    subtitle: "Up to 50% off on premium fashion & accessories",
    ctaText: "Shop the Sale",
    ctaHref: "/products?category=fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=500&fit=crop",
    gradient: "from-primary/90 via-primary/70 to-accent/60",
    enabled: true,
    badge: "50% OFF",
  },
  {
    id: "b2",
    title: "New Tech Arrivals",
    subtitle: "Latest gadgets from top sellers — exclusive launch prices",
    ctaText: "Explore Tech",
    ctaHref: "/products?category=electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&h=500&fit=crop",
    gradient: "from-foreground/85 via-foreground/65 to-primary/50",
    enabled: true,
    badge: "NEW",
  },
  {
    id: "b3",
    title: "Home & Living Deals",
    subtitle: "Refresh your space — up to 40% off home essentials",
    ctaText: "Shop Home",
    ctaHref: "/products?category=home",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=500&fit=crop",
    gradient: "from-accent/85 via-accent/60 to-primary/50",
    enabled: true,
    badge: "40% OFF",
  },
];

export const getPromoStrip = (): PromoStrip => {
  const raw = localStorage.getItem(PROMO_KEY);
  if (!raw) {
    localStorage.setItem(PROMO_KEY, JSON.stringify(defaultPromo));
    return defaultPromo;
  }
  try { return JSON.parse(raw); } catch { return defaultPromo; }
};

export const savePromoStrip = (p: PromoStrip) => {
  localStorage.setItem(PROMO_KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("banners-updated"));
};

export const getBanners = (): MidBanner[] => {
  const raw = localStorage.getItem(BANNERS_KEY);
  if (!raw) {
    localStorage.setItem(BANNERS_KEY, JSON.stringify(defaultBanners));
    return defaultBanners;
  }
  try { return JSON.parse(raw); } catch { return defaultBanners; }
};

export const saveBanners = (b: MidBanner[]) => {
  localStorage.setItem(BANNERS_KEY, JSON.stringify(b));
  window.dispatchEvent(new Event("banners-updated"));
};

export const PROMO_BG_OPTIONS = [
  { label: "Primary Blue", value: "bg-primary" },
  { label: "Accent Orange", value: "bg-accent" },
  { label: "Success Green", value: "bg-success" },
  { label: "Foreground Dark", value: "bg-foreground" },
];

export const GRADIENT_OPTIONS = [
  { label: "Primary → Accent", value: "from-primary/90 via-primary/70 to-accent/60" },
  { label: "Dark → Primary", value: "from-foreground/85 via-foreground/65 to-primary/50" },
  { label: "Accent → Primary", value: "from-accent/85 via-accent/60 to-primary/50" },
  { label: "Deep Dark", value: "from-foreground/95 via-foreground/80 to-foreground/60" },
];
