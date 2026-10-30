import { graphqlRequest } from "./graphqlClient";
import type { Product } from "./mock-data";

interface ApiProduct {
  id: string;
  title: string;
  price: number;
  discountedPrice: number | null;
  primaryImageUrl: string | null;
  sellerStoreName: string | null;
  stock: number;
  /** Draft | Published | ... */
  status: string;
}


export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#f1f3f5"/>
      <g fill="none" stroke="#adb5bd" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">
        <rect x="110" y="130" width="180" height="140" rx="16"/>
        <circle cx="160" cy="180" r="14"/>
        <path d="M120 260l55-55 40 40 25-25 50 50"/>
      </g>
    </svg>`
  );

const NEW_ARRIVALS_QUERY = `
  query NewArrivals($pageSize: Int) {
    products(pageNumber: 1, pageSize: $pageSize) {
      items {
        id
        title
        price
        discountedPrice
        primaryImageUrl
        sellerStoreName
        stock
        status
      }
    }
  }
`;


export function toProduct(item: ApiProduct): Product {
  const onSale = item.discountedPrice != null && item.discountedPrice < item.price;
  return {
    id: item.id,
    name: item.title,
    price: onSale ? item.discountedPrice! : item.price,
    originalPrice: onSale ? item.price : undefined,
    image: item.primaryImageUrl ?? PLACEHOLDER_IMAGE,
    category: "",
    seller: {
      id: "",
      name: item.sellerStoreName ?? "Seller",
      avatar: "",
      rating: 0,
      totalSales: 0,
      location: "",
    },
    rating: 0,
    reviews: 0,
  };
}


export async function fetchNewArrivals(limit = 12): Promise<Product[]> {
  const res = await graphqlRequest<{ products: { items: ApiProduct[] } | null }>(
    NEW_ARRIVALS_QUERY,
    { pageSize: limit * 2 }
  );

  return (res.products?.items ?? [])
    .filter((item) => item.status?.toLowerCase() === "published")
    .slice(0, limit)
    .map(toProduct);
}

// ── Product detail page ──────────────────────────────────
export interface ProductDetail {
  id: string;
  title: string;
  description: string;
  sku: string;
  slug: string | null;
  price: number;
  currency: string;
  discountedPrice: number | null;
  stock: number;
  categoryId: string;
  categoryName: string | null;
  sellerId: string;
  sellerStoreName: string | null;
  images: { url: string; altText: string | null; isPrimary: boolean; displayOrder: number }[];
  shipping: {
    weightKg: number | null;
    lengthCm: number | null;
    widthCm: number | null;
    heightCm: number | null;
    freeShipping: boolean;
    shippingFee: number;
    processingDays: number | null;
  } | null;
}

const PRODUCT_DETAIL_QUERY = `
  query ProductDetail($id: UUID!) {
    productDetail(id: $id) {
      id
      title
      description
      sku
      slug
      price
      currency
      discountedPrice
      stock
      categoryId
      categoryName
      sellerId
      sellerStoreName
      images { url altText isPrimary displayOrder }
      shipping { weightKg lengthCm widthCm heightCm freeShipping shippingFee processingDays }
    }
  }
`;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (value: string | undefined): value is string =>
  !!value && UUID_PATTERN.test(value);

/** null ka matlab: product nahi mila (ya published nahi hai) */
export async function fetchProductDetail(id: string): Promise<ProductDetail | null> {
  const res = await graphqlRequest<{ productDetail: ProductDetail | null }>(PRODUCT_DETAIL_QUERY, { id });
  return res.productDetail;
}

const TRENDING_QUERY = `
  query Trending($limit: Int) {
    trendingProducts(limit: $limit) {
      id
      title
      price
      discountedPrice
      primaryImageUrl
      sellerStoreName
      stock
      status
    }
  }
`;

export async function fetchTrending(limit = 12): Promise<Product[]> {
  const res = await graphqlRequest<{ trendingProducts: ApiProduct[] | null }>(TRENDING_QUERY, { limit });
  return (res.trendingProducts ?? []).map(toProduct);
}

export async function trackProductView(productId: string): Promise<void> {
  await graphqlRequest(
    `mutation TrackView($productId: UUID!) { trackProductView(productId: $productId) }`,
    { productId }
  );
}

const FEATURED_QUERY = `
  query Featured($limit: Int) {
    featuredProducts(limit: $limit) {
      id
      title
      price
      discountedPrice
      primaryImageUrl
      sellerStoreName
      stock
      status
    }
  }
`;

export async function fetchFeatured(limit = 12): Promise<Product[]> {
  const res = await graphqlRequest<{ featuredProducts: ApiProduct[] | null }>(FEATURED_QUERY, { limit });
  return (res.featuredProducts ?? []).map(toProduct);
}

const MY_WISHLIST_QUERY = `
  query MyWishlist {
    myWishlist {
      id
      title
      price
      discountedPrice
      primaryImageUrl
      sellerStoreName
      stock
      status
    }
  }
`;

export async function fetchMyWishlist(): Promise<Product[]> {
  const res = await graphqlRequest<{ myWishlist: ApiProduct[] | null }>(MY_WISHLIST_QUERY);
  return (res.myWishlist ?? []).map(toProduct);
}

export async function fetchWishlistIds(): Promise<string[]> {
  const res = await graphqlRequest<{ myWishlistIds: string[] | null }>(
    `query MyWishlistIds { myWishlistIds }`
  );
  return res.myWishlistIds ?? [];
}

export interface ToggleWishlistResult {
  success: boolean;
  isWishlisted: boolean;
  error: string | null;
}

export async function toggleWishlist(productId: string): Promise<ToggleWishlistResult> {
  const res = await graphqlRequest<{ toggleWishlist: ToggleWishlistResult }>(
    `mutation ToggleWishlist($productId: UUID!) {
       toggleWishlist(productId: $productId) { success isWishlisted error }
     }`,
    { productId }
  );
  return res.toggleWishlist;
}

// CART 
export interface CartItem {
  productId: string;
  productTitle: string;
  productImage: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  sellerId: string;
  isDropshipped: boolean;
  variantId: string | null;
  variantInfo: string | null;
}

export interface CartData {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

const MY_CART_QUERY = `
  query MyCart {
    myCart {
      items {
        productId
        productTitle
        productImage
        unitPrice
        quantity
        totalPrice
        sellerId
        isDropshipped
        variantId
        variantInfo
      }
      totalAmount
      totalItems
    }
  }
`;

export async function fetchMyCart(): Promise<CartData> {
  const res = await graphqlRequest<{ myCart: CartData | null }>(MY_CART_QUERY);
  return res.myCart ?? { items: [], totalAmount: 0, totalItems: 0 };
}

type CartPayload = { success: boolean; error: string | null };

async function runCartMutation(query: string, input: object): Promise<void> {
  const res = await graphqlRequest<Record<string, CartPayload>>(query, { input });
  const payload = Object.values(res)[0];
  if (!payload?.success) throw new Error(payload?.error ?? "Cart update nahi ho saka");
}

export const addToCartApi = (productId: string, quantity: number, variantId?: string | null) =>
  runCartMutation(
    `mutation AddToCart($input: AddToCartInput!) { addToCart(input: $input) { success error } }`,
    { productId, quantity, variantId: variantId ?? null }
  );

export const updateCartItemApi = (productId: string, quantity: number, variantId?: string | null) =>
  runCartMutation(
    `mutation UpdateCartItem($input: UpdateCartItemQuantityInput!) { updateCartItemQuantity(input: $input) { success error } }`,
    { productId, quantity, variantId: variantId ?? null }
  );

export const removeFromCartApi = (productId: string, variantId?: string | null) =>
  runCartMutation(
    `mutation RemoveFromCart($input: RemoveFromCartInput!) { removeFromCart(input: $input) { success error } }`,
    { productId, variantId: variantId ?? null }
  );