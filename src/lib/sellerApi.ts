import { graphqlRequest } from "./graphqlClient";

export interface MySeller {
  id: string;
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  /** Pending | Active | Suspended | Rejected */
  status: string;
}

const MY_SELLER_QUERY = `
  query MySeller {
    mySeller {
      id
      storeName
      storeDescription
      contactEmail
      contactPhone
      status
    }
  }
`;

export async function fetchMySeller(): Promise<MySeller | null> {
  const res = await graphqlRequest<{ mySeller: MySeller | null }>(MY_SELLER_QUERY);
  return res.mySeller;
}

// ── Seller ke apne products ──────────────────────────────
export interface SellerProduct {
  id: string;
  title: string;
  categoryId: string;
  price: number;
  currency: string;
  discountedPrice: number | null;
  stock: number;
  /** Draft | Published | Unpublished | Archived */
  status: string;
  primaryImageUrl: string | null;
}

type ActionPayload = { success: boolean; error: string | null };

const MY_PRODUCTS_QUERY = `
  query MyProducts {
    myProducts {
      id
      title
      categoryId
      price
      currency
      discountedPrice
      stock
      status
      primaryImageUrl
    }
  }
`;

const CATEGORY_NAMES_QUERY = `
  query CategoryNames {
    allCategories { id name }
  }
`;

const PUBLISH_MUTATION = `
  mutation PublishProduct($id: UUID!) {
    publishProduct(id: $id) { success error }
  }
`;

const UNPUBLISH_MUTATION = `
  mutation UnpublishProduct($id: UUID!) {
    unpublishProduct(id: $id) { success error }
  }
`;

const DELETE_MUTATION = `
  mutation DeleteProduct($id: UUID!) {
    deleteProduct(id: $id) { success error }
  }
`;

export async function fetchMyProducts(): Promise<SellerProduct[]> {
  const res = await graphqlRequest<{ myProducts: SellerProduct[] }>(MY_PRODUCTS_QUERY);
  return res.myProducts;
}

export async function fetchCategoryNames(): Promise<Record<string, string>> {
  const res = await graphqlRequest<{ allCategories: { id: string; name: string }[] }>(
    CATEGORY_NAMES_QUERY
  );
  return Object.fromEntries(res.allCategories.map((c) => [c.id, c.name]));
}

function assertSuccess(payload: ActionPayload, fallback: string) {
  if (!payload.success) throw new Error(payload.error ?? fallback);
}

export async function publishProduct(id: string): Promise<void> {
  const res = await graphqlRequest<{ publishProduct: ActionPayload }>(PUBLISH_MUTATION, { id });
  assertSuccess(res.publishProduct, "Unable to publish product");
}

export async function unpublishProduct(id: string): Promise<void> {
  const res = await graphqlRequest<{ unpublishProduct: ActionPayload }>(UNPUBLISH_MUTATION, { id });
  assertSuccess(res.unpublishProduct, "Unable to unpublish product");
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await graphqlRequest<{ deleteProduct: ActionPayload }>(DELETE_MUTATION, { id });
  assertSuccess(res.deleteProduct, "Unable to delete product");
}