import { fakeModuleDefinitions } from "@/pages/dashboard/common/moduleFakeData";
import { readHiddenRowIds } from "@/pages/dashboard/common/dashboardTableState";
import {
  readCreatedProducts,
  readProductOverrides,
  type CosmeticProductDraft,
} from "./productDraftStore";

export type ProductRecord = Readonly<{
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  subcategory: string;
  brand: string;
  size: string;
  finish: string;
  skinType: string;
  shadeName: string;
  shadeFamily: string;
  mrp: string;
  salePrice: string;
  stock: string;
  lowStockThreshold: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  hoverImage: string;
  ingredients: string;
  usageDirections: string;
  publishStatus: string;
  crueltyFree: boolean;
  vegan: boolean;
  fragranceFree: boolean;
  createdAt: string;
}>;

const assetByName: Readonly<Record<string, string>> = {
  "Radiance Vitamin C Serum": "/KAN WEBSITE/KAN PRODUCTS/foundation 1.png",
  "Velvet Matte Lip Kit": "/KAN WEBSITE/KAN PRODUCTS/liquid lipstick.png",
  "Botanical Cleansing Balm": "/KAN WEBSITE/KAN PRODUCTS/Wet-wipe Professional.png",
  "Silk Repair Shampoo": "/KAN WEBSITE/KAN PRODUCTS/setting spray.png",
  "Dewdrop Gel Cream": "/KAN WEBSITE/KAN PRODUCTS/cc air cushion-02.png",
};

const seededDescriptions: Readonly<Record<string, string>> = {
  "Radiance Vitamin C Serum": "Brightening serum built for dull and uneven skin with a lightweight finish suitable for daily layering.",
  "Velvet Matte Lip Kit": "High-pigment lip color with a velvet matte finish designed for long wear and strong shade payoff.",
  "Botanical Cleansing Balm": "Soft cleansing balm that melts makeup and sunscreen while leaving skin comfortable and hydrated.",
  "Silk Repair Shampoo": "Repair-focused hair cleanser intended to smooth dry strands and reduce visible frizz after wash day.",
  "Dewdrop Gel Cream": "Cooling gel moisturizer with a dewy finish for lightweight hydration and fast absorption.",
};

const seededCategories: Readonly<Record<string, string>> = {
  "Radiance Vitamin C Serum": "Skincare",
  "Velvet Matte Lip Kit": "Lips",
  "Botanical Cleansing Balm": "Skincare",
  "Silk Repair Shampoo": "Hair",
  "Dewdrop Gel Cream": "Face",
};

const seededRecords: ReadonlyArray<ProductRecord> = (fakeModuleDefinitions.products?.rows ?? []).map((row, index) => {
  const name = String(row.name);
  const category = seededCategories[name] ?? "Cosmetics";
  const salePrice = String(row.price).replace(/^Rs\s*/i, "");

  return {
    id: row.id,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    sku: `${name.slice(0, 3).toUpperCase()}-00${index + 1}`,
    category,
    subcategory: category === "Lips" ? "Lip Color" : category === "Hair" ? "Hair Repair" : "Daily Essentials",
    brand: "KAN Cosmetics",
    size: category === "Hair" ? "250 ml" : "30 ml",
    finish: category === "Lips" ? "Matte" : category === "Face" ? "Dewy" : "Natural",
    skinType: category === "Hair" ? "All Hair Types" : "All Skin Types",
    shadeName: category === "Lips" ? "Signature Nude" : "",
    shadeFamily: category === "Lips" ? "Warm Nude" : "",
    mrp: salePrice,
    salePrice,
    stock: String(40 - index * 5),
    lowStockThreshold: "10",
    shortDescription: seededDescriptions[name] ?? "KAN cosmetic product.",
    description: seededDescriptions[name] ?? "KAN cosmetic product.",
    coverImage: assetByName[name] ?? "/KAN WEBSITE/KAN PRODUCTS/IMG_1296.PNG",
    hoverImage: "/KAN WEBSITE/KAN PRODUCTS/IMG_1296.PNG",
    ingredients: "Aqua, Glycerin, Butylene Glycol, Fragrance.",
    usageDirections: "Apply to clean skin or lips as part of the regular beauty routine.",
    publishStatus: "Active",
    crueltyFree: true,
    vegan: false,
    fragranceFree: false,
    createdAt: new Date(2025, 4, index + 1).toISOString(),
  };
});

const fromCreatedProduct = (product: CosmeticProductDraft): ProductRecord => ({
  ...product,
});

export const readProductRecords = (): ReadonlyArray<ProductRecord> => {
  const overrides = readProductOverrides();
  const hiddenIds = readHiddenRowIds("products");
  const createdRecords = readCreatedProducts().map(fromCreatedProduct);
  const seededWithOverrides = seededRecords.map((record) => overrides[record.id] ?? record);

  return [...createdRecords, ...seededWithOverrides]
    .map((record) => overrides[record.id] ?? record)
    .filter((record) => !hiddenIds.has(record.id));
};

export const findProductRecord = (id: string) => readProductRecords().find((product) => product.id === id);
