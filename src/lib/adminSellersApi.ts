import { graphqlRequest } from "./graphqlClient";

export interface AdminSeller {
  id: string;
  userId: string;
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  commissionRate: number;
  /** Backend se string aata hai: Pending | Active | Suspended | Rejected */
  status: string;
  approvedAt: string | null;
}

export const ADMIN_SELLERS_KEY = ["admin", "sellers"] as const;

type ActionPayload = { success: boolean; error: string | null };

const SELLERS_QUERY = `
  query AdminSellers {
    allSellers {
      id userId storeName storeDescription contactEmail contactPhone
      commissionRate status approvedAt
    }
  }
`;

const APPROVE_MUTATION = `
  mutation ApproveSeller($sellerId: UUID!) {
    approveSeller(sellerId: $sellerId) { success error }
  }
`;

const REJECT_MUTATION = `
  mutation RejectSeller($sellerId: UUID!, $reason: String!) {
    rejectSeller(input: { sellerId: $sellerId, reason: $reason }) { success error }
  }
`;

const SUSPEND_MUTATION = `
  mutation SuspendSeller($sellerId: UUID!, $reason: String!) {
    suspendSeller(input: { sellerId: $sellerId, reason: $reason }) { success error }
  }
`;

function assertSuccess(payload: ActionPayload, fallback: string) {
  if (!payload.success) throw new Error(payload.error ?? fallback);
}

export async function fetchAllSellers(): Promise<AdminSeller[]> {
  const res = await graphqlRequest<{ allSellers: AdminSeller[] }>(SELLERS_QUERY);
  return res.allSellers;
}

export async function approveSeller(sellerId: string): Promise<void> {
  const res = await graphqlRequest<{ approveSeller: ActionPayload }>(APPROVE_MUTATION, { sellerId });
  assertSuccess(res.approveSeller, "Unable to approve seller");
}

export async function rejectSeller(sellerId: string, reason: string): Promise<void> {
  const res = await graphqlRequest<{ rejectSeller: ActionPayload }>(REJECT_MUTATION, { sellerId, reason });
  assertSuccess(res.rejectSeller, "Unable to reject seller");
}

export async function suspendSeller(sellerId: string, reason: string): Promise<void> {
  const res = await graphqlRequest<{ suspendSeller: ActionPayload }>(SUSPEND_MUTATION, { sellerId, reason });
  assertSuccess(res.suspendSeller, "Unable to suspend seller");
}