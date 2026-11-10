import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications } from "@/context/NotificationsContext";
import type { AppNotification } from "@/lib/notificationsApi";


const routeFor = (n: AppNotification): string | null => {
  switch (n.type) {
    case "NewSellerApplication":
      return "/admin/sellers";
     case "NewOrder":
      return "/seller/orders";  
    default:
      return null;
  }
};

const timeAgo = (iso: string): string => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
};

const NotificationBell = () => {
  const { notifications, unreadCount, isLive, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (n: AppNotification) => {
    setOpen(false);
    void markAsRead(n.id);
    const route = routeFor(n);
    if (route) navigate(route);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
          className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" sideOffset={8} className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            <span
              title={isLive ? "Live updates on" : "Live updates off (refreshing every minute)"}
              className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500" : "bg-muted-foreground/40"}`}
            />
          </div>
          <button
            type="button"
            onClick={() => void markAllAsRead()}
            disabled={unreadCount === 0}
            className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-40 disabled:no-underline"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all as read
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              You're all caught up.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-secondary transition-colors ${
                      n.isRead ? "" : "bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.isRead && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 break-words">{n.message}</p>
                        <p className="text-[11px] text-muted-foreground/70 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;