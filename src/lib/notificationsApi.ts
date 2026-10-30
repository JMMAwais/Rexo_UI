import { graphqlRequest } from "./graphqlClient";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string; // ISO string (UTC)
}

const FIELDS = "id type title message referenceId isRead createdAt";

const LIST_QUERY = `
  query MyNotifications($take: Int, $skip: Int, $unreadOnly: Boolean) {
    myNotifications(take: $take, skip: $skip, unreadOnly: $unreadOnly) { ${FIELDS} }
  }
`;

const COUNT_QUERY = `query UnreadNotificationCount { unreadNotificationCount }`;

const MARK_READ_MUTATION = `
  mutation MarkNotificationRead($id: UUID!) {
    markNotificationRead(id: $id) { success error }
  }
`;

const MARK_ALL_READ_MUTATION = `
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead { success error }
  }
`;

type ActionPayload = { success: boolean; error: string | null };

export async function fetchNotifications(take = 20, skip = 0): Promise<AppNotification[]> {
  const res = await graphqlRequest<{ myNotifications: AppNotification[] }>(LIST_QUERY, {
    take,
    skip,
    unreadOnly: false,
  });
  return res.myNotifications;
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await graphqlRequest<{ unreadNotificationCount: number }>(COUNT_QUERY);
  return res.unreadNotificationCount;
}

export async function markNotificationRead(id: string): Promise<void> {
  const res = await graphqlRequest<{ markNotificationRead: ActionPayload }>(MARK_READ_MUTATION, { id });
  if (!res.markNotificationRead.success) {
    throw new Error(res.markNotificationRead.error ?? "Unable to mark notification as read");
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await graphqlRequest<{ markAllNotificationsRead: ActionPayload }>(MARK_ALL_READ_MUTATION);
  if (!res.markAllNotificationsRead.success) {
    throw new Error(res.markAllNotificationsRead.error ?? "Unable to mark notifications as read");
  }
}