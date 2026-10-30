import { graphqlRequest } from "./graphqlClient";
import { isUuid } from "./productsApi";

export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  label: string | null;
}

export interface NewAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  label: string | null;
}

export interface PlacedOrderItem {
  id: string;
  productId: string;
  productTitle: string;
  variantInfo: string | null;
  productImage: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  isDropshipped: boolean;
}

export interface PlacedSubOrder {
  id: string;
  sellerId: string;
  storeName: string;
  status: string;
  subTotal: number;
  items: PlacedOrderItem[];
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  status: string;
  subTotal: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  subOrders: PlacedSubOrder[];
  createdAt: string;
}

export interface OrderLine {
  productId: string;
  quantity: number;
  variantId: string | null;
}

const ADDRESS_FIELDS = `id fullName phoneNumber addressLine1 addressLine2 city state country zipCode isDefault label`;

export async function fetchMyAddresses(): Promise<Address[]> {
  const res = await graphqlRequest<{ myAddresses: Address[] | null }>(
    `query MyAddresses { myAddresses { ${ADDRESS_FIELDS} } }`
  );
  return res.myAddresses ?? [];
}

export async function addAddressApi(input: NewAddress): Promise<Address> {
  const res = await graphqlRequest<{ addAddress: { data: Address | null; error: string | null } }>(
    `mutation AddAddress($input: AddAddressInput!) {
       addAddress(input: $input) { data { ${ADDRESS_FIELDS} } error }
     }`,
    { input }
  );
  if (!res.addAddress.data) throw new Error(res.addAddress.error ?? "Address cannot be added");
  return res.addAddress.data;
}


export async function fetchShippingEstimate(items: OrderLine[]): Promise<number> {
  const valid = items.filter((i) => isUuid(i.productId));
  if (valid.length === 0) return 0;

  const literal = valid
    .map((i) => {
      const qty = Math.max(1, Math.floor(i.quantity));
      const variant = i.variantId && isUuid(i.variantId) ? `, variantId: "${i.variantId}"` : "";
      return `{ productId: "${i.productId}", quantity: ${qty}${variant} }`;
    })
    .join(", ");

  const res = await graphqlRequest<{ shippingEstimate: number }>(
    `query ShippingEstimate { shippingEstimate(items: [${literal}]) }`
  );
  return res.shippingEstimate ?? 0;
}

export async function placeOrderApi(input: {
  items: OrderLine[];
  addressId: string;
  notes: string | null;
}): Promise<PlacedOrder> {
  const res = await graphqlRequest<{ placeOrder: { data: PlacedOrder | null; error: string | null } }>(
    `mutation PlaceOrder($input: PlaceOrderInput!) {
       placeOrder(input: $input) {
         data {
           id orderNumber status subTotal shippingCost discount totalAmount createdAt
           subOrders {
             id sellerId storeName status subTotal
             items { id productId productTitle variantInfo productImage unitPrice quantity totalPrice isDropshipped }
           }
         }
         error
       }
     }`,
    { input }
  );
  if (!res.placeOrder.data) throw new Error(res.placeOrder.error ?? "Order cannot be placed");
  return res.placeOrder.data;
}

// ─────────────── BUYER ORDERS ───────────────
export interface OrderAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface BuyerSubOrder {
  id: string;
  sellerId: string;
  storeName: string;
  status: string;
  subTotal: number;
  trackingNumber: string | null;
  trackingUrl: string | null;
  items: PlacedOrderItem[];
}

export interface BuyerOrder {
  id: string;
  orderNumber: string;
  status: string;
  subTotal: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  createdAt: string;
  notes: string | null;
  shippingAddress: OrderAddress | null;
  subOrders: BuyerSubOrder[];
}

export interface OrdersPage {
  items: BuyerOrder[];
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const BUYER_ORDER_FIELDS = `
  id orderNumber status subTotal shippingCost discount totalAmount createdAt notes
  shippingAddress { fullName phoneNumber addressLine1 addressLine2 city state country zipCode }
  subOrders {
    id sellerId storeName status subTotal trackingNumber trackingUrl
    items { id productId productTitle variantInfo productImage unitPrice quantity totalPrice isDropshipped }
  }
`;

export async function fetchMyOrders(pageNumber = 1, pageSize = 10): Promise<OrdersPage> {
  const res = await graphqlRequest<{ myOrders: OrdersPage | null }>(
    `query MyOrders($pageNumber: Int, $pageSize: Int) {
       myOrders(pageNumber: $pageNumber, pageSize: $pageSize) {
         items { ${BUYER_ORDER_FIELDS} }
         pageNumber totalCount totalPages hasNext hasPrevious
       }
     }`,
    { pageNumber, pageSize }
  );
  return (
    res.myOrders ?? { items: [], pageNumber: 1, totalCount: 0, totalPages: 0, hasNext: false, hasPrevious: false }
  );
}

export async function fetchOrderById(id: string): Promise<BuyerOrder | null> {
  const res = await graphqlRequest<{ orderById: BuyerOrder | null }>(
    `query OrderById($id: UUID!) { orderById(id: $id) { ${BUYER_ORDER_FIELDS} } }`,
    { id }
  );
  return res.orderById;
}

export async function cancelOrderApi(orderId: string, reason: string): Promise<void> {
  const res = await graphqlRequest<{ cancelOrder: { success: boolean; error: string | null } }>(
    `mutation CancelOrder($input: CancelOrderInput!) { cancelOrder(input: $input) { success error } }`,
    { input: { orderId, reason } }
  );
  if (!res.cancelOrder.success) throw new Error(res.cancelOrder.error ?? "Order cannot be canceled");
}