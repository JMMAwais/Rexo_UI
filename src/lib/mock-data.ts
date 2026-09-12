export interface ProductVariant {
  id: string;
  type: "color" | "size" | "storage" | "material";
  label: string;
  value: string;
  priceAdjustment?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  seller: Seller;
  rating: number;
  reviews: number;
  badge?: string;
  description?: string;
  variants?: ProductVariant[];
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
  location: string;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  {
    id: "electronics", name: "Electronics", icon: "📱", count: 1240,
    subcategories: [
      { id: "phones", name: "Smartphones" },
      { id: "laptops", name: "Laptops & Computers" },
      { id: "audio", name: "Headphones & Audio" },
      { id: "cameras", name: "Cameras & Photography" },
      { id: "wearables", name: "Smartwatches & Wearables" },
      { id: "accessories", name: "Accessories & Cables" },
    ],
  },
  {
    id: "fashion", name: "Fashion", icon: "👗", count: 3450,
    subcategories: [
      { id: "mens", name: "Men's Clothing" },
      { id: "womens", name: "Women's Clothing" },
      { id: "shoes", name: "Shoes & Footwear" },
      { id: "bags", name: "Bags & Purses" },
      { id: "jewelry", name: "Jewelry & Watches" },
      { id: "kids", name: "Kids' Fashion" },
    ],
  },
  {
    id: "home", name: "Home & Living", icon: "🏠", count: 890,
    subcategories: [
      { id: "furniture", name: "Furniture" },
      { id: "decor", name: "Home Décor" },
      { id: "kitchen", name: "Kitchen & Dining" },
      { id: "bedding", name: "Bedding & Bath" },
      { id: "lighting", name: "Lighting" },
    ],
  },
  {
    id: "beauty", name: "Beauty", icon: "💄", count: 1560,
    subcategories: [
      { id: "skincare", name: "Skincare" },
      { id: "makeup", name: "Makeup" },
      { id: "haircare", name: "Hair Care" },
      { id: "fragrances", name: "Fragrances" },
      { id: "grooming", name: "Men's Grooming" },
    ],
  },
  {
    id: "sports", name: "Sports", icon: "⚽", count: 720,
    subcategories: [
      { id: "fitness", name: "Fitness Equipment" },
      { id: "outdoor", name: "Outdoor & Camping" },
      { id: "sportswear", name: "Sportswear" },
      { id: "cycling", name: "Cycling" },
      { id: "team-sports", name: "Team Sports" },
    ],
  },
  {
    id: "toys", name: "Toys & Games", icon: "🎮", count: 430,
    subcategories: [
      { id: "video-games", name: "Video Games" },
      { id: "board-games", name: "Board Games" },
      { id: "educational", name: "Educational Toys" },
      { id: "action-figures", name: "Action Figures" },
      { id: "puzzles", name: "Puzzles" },
    ],
  },
];

export const sellers: Seller[] = [
  { id: "s1", name: "TechVault", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TV&backgroundColor=3b82f6", rating: 4.8, totalSales: 12400, location: "Lahore" },
  { id: "s2", name: "StyleHaven", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SH&backgroundColor=8b5cf6", rating: 4.6, totalSales: 8900, location: "Karachi" },
  { id: "s3", name: "HomeNest", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=HN&backgroundColor=10b981", rating: 4.9, totalSales: 5600, location: "Islamabad" },
  { id: "s4", name: "GlowUp Beauty", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GB&backgroundColor=f59e0b", rating: 4.7, totalSales: 3200, location: "Faisalabad" },
];

export const products: Product[] = [
  {
    id: "p1", name: "Wireless Noise Cancelling Headphones", price: 7999, originalPrice: 12999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "electronics", seller: sellers[0], rating: 4.7, reviews: 234, badge: "Hot Deal",
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.",
    variants: [
      { id: "v1", type: "color", label: "Black", value: "#1a1a1a", inStock: true },
      { id: "v2", type: "color", label: "White", value: "#f5f5f5", inStock: true },
      { id: "v3", type: "color", label: "Navy", value: "#1e3a5f", inStock: false },
    ],
  },
  {
    id: "p2", name: "Premium Leather Crossbody Bag", price: 3499,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    category: "fashion", seller: sellers[1], rating: 4.5, reviews: 89,
    description: "Handcrafted genuine leather crossbody bag with adjustable strap and multiple compartments.",
    variants: [
      { id: "v4", type: "color", label: "Brown", value: "#8B4513", inStock: true },
      { id: "v5", type: "color", label: "Black", value: "#1a1a1a", inStock: true },
      { id: "v6", type: "color", label: "Tan", value: "#D2B48C", inStock: true },
    ],
  },
  {
    id: "p3", name: "Minimalist Ceramic Vase Set", price: 2199, originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop",
    category: "home", seller: sellers[2], rating: 4.9, reviews: 156,
    description: "Set of 3 minimalist ceramic vases in varying sizes, perfect for modern home décor.",
    variants: [
      { id: "v7", type: "size", label: "Small (3pc)", value: "small", inStock: true },
      { id: "v8", type: "size", label: "Large (3pc)", value: "large", priceAdjustment: 800, inStock: true },
    ],
  },
  {
    id: "p4", name: "Smart Watch Series Pro", price: 14999, originalPrice: 19999,
    image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=400&fit=crop",
    category: "electronics", seller: sellers[0], rating: 4.8, reviews: 567, badge: "Best Seller",
    description: "Advanced smartwatch with health monitoring, GPS, and 7-day battery life.",
    variants: [
      { id: "v9", type: "size", label: "40mm", value: "40mm", inStock: true },
      { id: "v10", type: "size", label: "44mm", value: "44mm", priceAdjustment: 2000, inStock: true },
      { id: "v11", type: "color", label: "Midnight", value: "#191970", inStock: true },
      { id: "v12", type: "color", label: "Silver", value: "#C0C0C0", inStock: true },
      { id: "v13", type: "color", label: "Rose Gold", value: "#B76E79", inStock: false },
    ],
  },
  {
    id: "p5", name: "Organic Skincare Gift Set", price: 4599,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    category: "beauty", seller: sellers[3], rating: 4.6, reviews: 312,
    description: "Complete organic skincare set with cleanser, toner, serum, and moisturizer.",
    variants: [
      { id: "v14", type: "size", label: "Travel Size", value: "travel", inStock: true },
      { id: "v15", type: "size", label: "Full Size", value: "full", priceAdjustment: 1500, inStock: true },
    ],
  },
  {
    id: "p6", name: "Vintage Denim Jacket", price: 5999, originalPrice: 8499,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    category: "fashion", seller: sellers[1], rating: 4.4, reviews: 78, badge: "New Arrival",
    description: "Classic vintage-style denim jacket with distressed finish and comfortable fit.",
    variants: [
      { id: "v16", type: "size", label: "S", value: "S", inStock: true },
      { id: "v17", type: "size", label: "M", value: "M", inStock: true },
      { id: "v18", type: "size", label: "L", value: "L", inStock: true },
      { id: "v19", type: "size", label: "XL", value: "XL", inStock: false },
      { id: "v20", type: "color", label: "Light Blue", value: "#ADD8E6", inStock: true },
      { id: "v21", type: "color", label: "Dark Blue", value: "#00008B", inStock: true },
    ],
  },
  {
    id: "p7", name: "Portable Bluetooth Speaker", price: 3299,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    category: "electronics", seller: sellers[0], rating: 4.3, reviews: 445,
    description: "Waterproof portable Bluetooth speaker with 360° sound and 12-hour battery.",
    variants: [
      { id: "v22", type: "color", label: "Black", value: "#1a1a1a", inStock: true },
      { id: "v23", type: "color", label: "Red", value: "#DC143C", inStock: true },
      { id: "v24", type: "color", label: "Teal", value: "#008080", inStock: true },
    ],
  },
  {
    id: "p8", name: "Handwoven Cotton Throw Blanket", price: 1899,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    category: "home", seller: sellers[2], rating: 4.8, reviews: 67,
    description: "Soft handwoven cotton throw blanket, perfect for cozy evenings.",
    variants: [
      { id: "v25", type: "color", label: "Ivory", value: "#FFFFF0", inStock: true },
      { id: "v26", type: "color", label: "Grey", value: "#808080", inStock: true },
      { id: "v27", type: "size", label: "Single", value: "single", inStock: true },
      { id: "v28", type: "size", label: "Double", value: "double", priceAdjustment: 600, inStock: true },
    ],
  },
];

export const formatPrice = (price: number) => `Rs. ${price.toLocaleString()}`;
