import { readProductRecords } from "@/pages/dashboard/products/productData";
import { readInventoryAdjustments, readInventoryMovements, type InventoryMovement } from "./inventoryStore";

export type InventoryStatus = "In Stock" | "Low Stock" | "Reserved" | "Out Of Stock";

export type InventoryRecord = Readonly<{
  id: string;
  productId: string;
  productName: string;
  variant: string;
  sku: string;
  branch: string;
  coverImage: string;
  onHand: number;
  reserved: number;
  incoming: number;
  lowStockThreshold: number;
  available: number;
  status: InventoryStatus;
  category: string;
  lastUpdated: string;
  movements: ReadonlyArray<InventoryMovement>;
}>;

const seededInventory = [
  {
    id: "INV-5001",
    productId: "PRD-3001",
    variant: "30 ml",
    branch: "Warehouse A",
    onHand: 42,
    reserved: 5,
    incoming: 18,
    lowStockThreshold: 10,
    lastUpdated: "2025-07-05T10:24:00.000Z",
    movementSeeds: [
      { type: "reserve", quantityDelta: -2, reason: "Reserved for active orders", createdAt: "2025-07-05T09:40:00.000Z" },
      { type: "restock", quantityDelta: 18, reason: "Supplier delivery received", createdAt: "2025-07-04T15:00:00.000Z" },
    ],
  },
  {
    id: "INV-5002",
    productId: "PRD-3002",
    variant: "Rose Nude",
    branch: "Warehouse A",
    onHand: 12,
    reserved: 4,
    incoming: 0,
    lowStockThreshold: 12,
    lastUpdated: "2025-07-05T09:10:00.000Z",
    movementSeeds: [
      { type: "reserve", quantityDelta: -1, reason: "Reserved from cart conversion", createdAt: "2025-07-05T08:55:00.000Z" },
    ],
  },
  {
    id: "INV-5003",
    productId: "PRD-3003",
    variant: "100 ml",
    branch: "Warehouse B",
    onHand: 6,
    reserved: 1,
    incoming: 24,
    lowStockThreshold: 8,
    lastUpdated: "2025-07-05T08:45:00.000Z",
    movementSeeds: [
      { type: "manual_adjustment", quantityDelta: -4, reason: "Damaged items removed after QC", createdAt: "2025-07-05T07:30:00.000Z" },
      { type: "restock", quantityDelta: 24, reason: "In transit from supplier", createdAt: "2025-07-04T18:15:00.000Z" },
    ],
  },
  {
    id: "INV-5004",
    productId: "PRD-3004",
    variant: "250 ml",
    branch: "Warehouse C",
    onHand: 76,
    reserved: 18,
    incoming: 12,
    lowStockThreshold: 15,
    lastUpdated: "2025-07-05T08:02:00.000Z",
    movementSeeds: [
      { type: "reserve", quantityDelta: -6, reason: "Bulk salon order reservation", createdAt: "2025-07-05T07:55:00.000Z" },
      { type: "release", quantityDelta: 2, reason: "Cancelled order released", createdAt: "2025-07-04T19:00:00.000Z" },
    ],
  },
  {
    id: "INV-5005",
    productId: "PRD-3005",
    variant: "50 ml",
    branch: "Warehouse B",
    onHand: 7,
    reserved: 3,
    incoming: 0,
    lowStockThreshold: 10,
    lastUpdated: "2025-07-05T07:48:00.000Z",
    movementSeeds: [
      { type: "reserve", quantityDelta: -2, reason: "Wishlist conversion order", createdAt: "2025-07-05T07:20:00.000Z" },
    ],
  },
] as const;

const computeStatus = (available: number, reserved: number, threshold: number): InventoryStatus => {
  if (available <= 0) return "Out Of Stock";
  if (available <= threshold) return "Low Stock";
  if (reserved > 0) return "Reserved";
  return "In Stock";
};

export const readInventoryRecords = (): ReadonlyArray<InventoryRecord> => {
  const products = new Map(readProductRecords().map((product) => [product.id, product]));
  const adjustments = readInventoryAdjustments();
  const storedMovements = readInventoryMovements();

  return seededInventory.map((seed) => {
    const product = products.get(seed.productId);
    const onHand = seed.onHand + (adjustments[seed.id] ?? 0);
    const available = Math.max(0, onHand - seed.reserved);
    const status = computeStatus(available, seed.reserved, seed.lowStockThreshold);
    const movementSeeds: ReadonlyArray<InventoryMovement> = seed.movementSeeds.map((movement, index) => ({
      id: `${seed.id}-seed-${index + 1}`,
      inventoryId: seed.id,
      ...movement,
    }));

    return {
      id: seed.id,
      productId: seed.productId,
      productName: product?.name ?? "Unknown Product",
      variant: seed.variant,
      sku: product?.sku ?? `${seed.productId}-SKU`,
      branch: seed.branch,
      coverImage: product?.coverImage ?? "/KAN WEBSITE/KAN PRODUCTS/IMG_1296.PNG",
      onHand,
      reserved: seed.reserved,
      incoming: seed.incoming,
      lowStockThreshold: seed.lowStockThreshold,
      available,
      status,
      category: product?.category ?? "Cosmetics",
      lastUpdated: seed.lastUpdated,
      movements: [...storedMovements.filter((movement) => movement.inventoryId === seed.id), ...movementSeeds],
    };
  });
};

export const findInventoryRecord = (id: string) => readInventoryRecords().find((record) => record.id === id);
