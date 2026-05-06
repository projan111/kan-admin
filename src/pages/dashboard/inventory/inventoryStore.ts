export type InventoryMovement = Readonly<{
  id: string;
  inventoryId: string;
  type: "manual_adjustment" | "reserve" | "release" | "restock";
  quantityDelta: number;
  reason: string;
  createdAt: string;
}>;

type InventoryAdjustments = Readonly<Record<string, number>>;

const ADJUSTMENTS_KEY = "dashboard.inventory.adjustments";
const MOVEMENTS_KEY = "dashboard.inventory.movements";

export const readInventoryAdjustments = (): InventoryAdjustments => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.sessionStorage.getItem(ADJUSTMENTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as InventoryAdjustments) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const saveInventoryAdjustment = (inventoryId: string, delta: number) => {
  if (typeof window === "undefined") return;

  const current = readInventoryAdjustments();
  const nextValue = (current[inventoryId] ?? 0) + delta;

  window.sessionStorage.setItem(
    ADJUSTMENTS_KEY,
    JSON.stringify({
      ...current,
      [inventoryId]: nextValue,
    })
  );
};

export const readInventoryMovements = (): ReadonlyArray<InventoryMovement> => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.sessionStorage.getItem(MOVEMENTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as InventoryMovement[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const appendInventoryMovement = (movement: InventoryMovement) => {
  if (typeof window === "undefined") return;

  const current = readInventoryMovements();
  window.sessionStorage.setItem(MOVEMENTS_KEY, JSON.stringify([movement, ...current]));
};
