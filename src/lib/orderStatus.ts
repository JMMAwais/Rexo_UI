import type { BuyerOrder } from "./ordersApi";


export function overallStatus(order: BuyerOrder): string {
  const subs = order.subOrders;
  if (order.status === "Cancelled") return "Cancelled";
  const active = subs.filter((s) => s.status !== "Cancelled");
  if (subs.length > 0 && active.length === 0) return "Cancelled";
  if (active.length === 0) return order.status;
  if (active.every((s) => s.status === "Delivered")) return "Delivered";
  if (active.some((s) => s.status === "Shipped" || s.status === "Delivered")) return "Shipped";
  if (active.some((s) => s.status === "Processing")) return "Processing";
  if (active.some((s) => s.status === "Confirmed")) return "Confirmed";
  return "Pending";
}

export function canCancel(order: BuyerOrder): boolean {
  const status = overallStatus(order);
  if (status === "Cancelled" || status === "Delivered" || status === "Shipped") return false;
  return !order.subOrders.some((s) => s.status === "Shipped" || s.status === "Delivered");
}

export const statusBadge: Record<string, string> = {
  Pending: "bg-secondary text-muted-foreground",
  Confirmed: "bg-primary/10 text-primary",
  Processing: "bg-accent/15 text-accent",
  Shipped: "bg-primary/10 text-primary",
  Delivered: "bg-success/10 text-success",
  Cancelled: "bg-destructive/10 text-destructive",
  Refunded: "bg-secondary text-muted-foreground",
};

export const TIMELINE_STEPS = ["Confirmed", "Processing", "Shipped", "Delivered"] as const;


export function stepIndex(status: string): number {
  const i = TIMELINE_STEPS.indexOf(status as (typeof TIMELINE_STEPS)[number]);
  if (i >= 0) return i + 1;
  return status === "Pending" ? 0 : 0;
}