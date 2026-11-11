import { graphqlRequest } from "./graphqlClient";

export type SubOrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface SellerOrderItem {
  id: string;
  productTitle: string;
  variantInfo: string | null;
  productImage: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface SellerSubOrder {
  id: string;
  status: SubOrderStatus;
  subTotal: number;
  trackingNumber: string | null;
  trackingUrl: string | null;
  items: SellerOrderItem[];
}

export interface SellerOrderAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  notes: string | null;
  shippingAddress: SellerOrderAddress | null;
  subOrders: SellerSubOrder[];
}

export const SELLER_ORDERS_KEY = ["seller-orders"];

const SELLER_ORDERS_QUERY = `
  query SellerOrders($pageNumber: Int! = 1, $pageSize: Int! = 50) {
    sellerOrders(pageNumber: $pageNumber, pageSize: $pageSize) {
      items {
        id
        orderNumber
        createdAt
        notes
        shippingAddress {
          fullName phoneNumber addressLine1 addressLine2 city state country zipCode
        }
        subOrders {
          id
          status
          subTotal
          trackingNumber
          trackingUrl
          items {
            id productTitle variantInfo productImage unitPrice quantity totalPrice
          }
        }
      }
      totalCount
    }
  }
`;

export async function fetchSellerOrders(pageSize = 50): Promise<SellerOrder[]> {
  const res = await graphqlRequest<{ sellerOrders: { items: SellerOrder[] } | null }>(
    SELLER_ORDERS_QUERY,
    { pageNumber: 1, pageSize }
  );
  return res.sellerOrders?.items ?? [];
}

const UPDATE_STATUS_MUTATION = `
  mutation UpdateSubOrderStatus($input: UpdateSubOrderStatusInput!) {
    updateSubOrderStatus(input: $input) { success error }
  }
`;

// GraphQL enum values go in UPPER_CASE (e.g. SHIPPED)
export async function updateSubOrderStatus(
  subOrderId: string,
  newStatus: SubOrderStatus
): Promise<void> {
  const res = await graphqlRequest<{
    updateSubOrderStatus: { success: boolean; error: string | null };
  }>(UPDATE_STATUS_MUTATION, {
    input: { subOrderId, newStatus: newStatus.toUpperCase() },
  });
  if (!res.updateSubOrderStatus.success) {
    throw new Error(res.updateSubOrderStatus.error ?? "Unable to update order status");
  }
}