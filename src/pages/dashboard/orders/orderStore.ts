export const orderStatuses = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

const STORAGE_KEY = "dashboard.orders.statuses";

type StoredStatuses = Readonly<Record<string, OrderStatus>>;

export const readStoredOrderStatuses = (): StoredStatuses => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredStatuses) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const saveStoredOrderStatus = (orderId: string, status: OrderStatus) => {
  if (typeof window === "undefined") return;

  const current = readStoredOrderStatuses();
  window.sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...current,
      [orderId]: status,
    })
  );
};
