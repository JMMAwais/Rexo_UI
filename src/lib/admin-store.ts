// Mock admin auth + pending sellers store using localStorage.
// Replace with Lovable Cloud auth + real DB when going to production.

const ADMIN_KEY = "admin_auth";
const SELLERS_KEY = "pending_sellers";

export const ADMIN_CREDENTIALS = {
  email: "admin@marketplace.com",
  password: "admin123",
};

export type SellerStatus = "pending" | "approved" | "rejected";

export interface PendingSeller {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  description: string;
  status: SellerStatus;
  appliedAt: string;
}

// ---------- Admin auth ----------
export const isAdminLoggedIn = () => localStorage.getItem(ADMIN_KEY) === "true";

export const adminLogin = (email: string, password: string) => {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem(ADMIN_KEY, "true");
    return true;
  }
  return false;
};

export const adminLogout = () => localStorage.removeItem(ADMIN_KEY);

// ---------- Pending sellers ----------
const seedSellers: PendingSeller[] = [
  {
    id: "ps1",
    storeName: "Khan Electronics",
    ownerName: "Ahmed Khan",
    email: "ahmed@khanelectronics.pk",
    phone: "+92 300 1234567",
    city: "Lahore",
    description: "Premium electronics and accessories — laptops, phones, smart home devices.",
    status: "pending",
    appliedAt: "2025-04-18",
  },
  {
    id: "ps2",
    storeName: "Lahore Fashion House",
    ownerName: "Sana Malik",
    email: "sana@lhrfashion.pk",
    phone: "+92 321 9876543",
    city: "Lahore",
    description: "Designer Pakistani clothing — pret, formal, and bridal wear.",
    status: "pending",
    appliedAt: "2025-04-19",
  },
  {
    id: "ps3",
    storeName: "Organic Roots",
    ownerName: "Bilal Hussain",
    email: "bilal@organicroots.pk",
    phone: "+92 333 5551234",
    city: "Islamabad",
    description: "100% organic skincare and wellness products handmade in Pakistan.",
    status: "pending",
    appliedAt: "2025-04-20",
  },
  {
    id: "ps4",
    storeName: "Karachi Home Decor",
    ownerName: "Fatima Sheikh",
    email: "fatima@khihome.pk",
    phone: "+92 345 7778888",
    city: "Karachi",
    description: "Modern minimalist home décor and furniture pieces.",
    status: "approved",
    appliedAt: "2025-04-10",
  },
];

export const getSellers = (): PendingSeller[] => {
  const raw = localStorage.getItem(SELLERS_KEY);
  if (!raw) {
    localStorage.setItem(SELLERS_KEY, JSON.stringify(seedSellers));
    return seedSellers;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return seedSellers;
  }
};

export const updateSellerStatus = (id: string, status: SellerStatus) => {
  const sellers = getSellers().map((s) => (s.id === id ? { ...s, status } : s));
  localStorage.setItem(SELLERS_KEY, JSON.stringify(sellers));
  return sellers;
};
