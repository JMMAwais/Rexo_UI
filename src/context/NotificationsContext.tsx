import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "graphql-ws";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/config";
import { ADMIN_SELLERS_KEY } from "@/lib/adminSellersApi";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from "@/lib/notificationsApi";

const WS_URL = `${API_URL.replace(/^http/, "ws")}/graphql`;
const FALLBACK_POLL_MS = 60_000;
const MAX_ITEMS = 50;

const SUBSCRIPTION = `
  subscription OnNotificationReceived {
    onNotificationReceived { id type title message referenceId isRead createdAt }
  }
`;

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  
  isLive: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  
    const enabled =
    !!accessToken && !!user?.roles?.some((r) => r === "Admin" || r === "Seller");

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLive, setIsLive] = useState(false);

  const isLiveRef = useRef(false);
  const idsRef = useRef<Set<string>>(new Set());
  const notificationsRef = useRef<AppNotification[]>([]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const setLive = useCallback((value: boolean) => {
    isLiveRef.current = value;
    setIsLive(value);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [items, count] = await Promise.all([fetchNotifications(20), fetchUnreadCount()]);
      idsRef.current = new Set(items.map((n) => n.id));
      setNotifications(items);
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  }, []);

  const handleIncoming = useCallback((incoming: AppNotification) => {
  
    if (idsRef.current.has(incoming.id)) return;
    idsRef.current.add(incoming.id);

    setNotifications((prev) => [incoming, ...prev].slice(0, MAX_ITEMS));
    if (!incoming.isRead) setUnreadCount((c) => c + 1);

    toast.info(incoming.title, { description: incoming.message });

    
    if (incoming.type === "NewSellerApplication") {
      void queryClient.invalidateQueries({ queryKey: ADMIN_SELLERS_KEY });
    }

      if (incoming.type === "NewOrder") {
      void queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
    }
  }, [queryClient]);

  // Realtime:
  useEffect(() => {
    if (!enabled) {
      idsRef.current = new Set();
      setNotifications([]);
      setUnreadCount(0);
      setLive(false);
      return;
    }

    void refresh();

    let everConnected = false;
    const client = createClient({
      url: WS_URL,
      retryAttempts: Infinity,

      connectionParams: () => ({
        authorization: `Bearer ${localStorage.getItem("rexo_access_token") ?? ""}`,
      }),
      on: {
        connected: () => {
          setLive(true);
         
          if (everConnected) void refresh();
          everConnected = true;
        },
        closed: () => setLive(false),
      },
    });

    const unsubscribe = client.subscribe<{ onNotificationReceived: AppNotification }>(
      { query: SUBSCRIPTION },
      {
        next: ({ data }) => {
          if (data?.onNotificationReceived) handleIncoming(data.onNotificationReceived);
        },
        error: (err) => {
          console.error("Notification subscription error", err);
          setLive(false);
        },
        complete: () => setLive(false),
      }
    );

    return () => {
      unsubscribe();
      void client.dispose();
      setLive(false);
    };
  }, [enabled, refresh, handleIncoming, setLive]);

  // Fallback: 
  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => {
      if (!isLiveRef.current) void refresh();
    }, FALLBACK_POLL_MS);
    return () => clearInterval(timer);
  }, [enabled, refresh]);

  const markAsRead = useCallback(
    async (id: string) => {
      const target = notificationsRef.current.find((n) => n.id === id);
      if (!target || target.isRead) return;

      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));

      try {
        await markNotificationRead(id);
      } catch (err) {
        console.error("Failed to mark notification as read", err);
        await refresh(); // server ki asli halat wapas
      }
    },
    [refresh]
  );

  const markAllAsRead = useCallback(async () => {
    if (unreadCount === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
      await refresh();
    }
  }, [unreadCount, refresh]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, isLive, markAsRead, markAllAsRead, refresh }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside <NotificationsProvider>");
  return ctx;
}