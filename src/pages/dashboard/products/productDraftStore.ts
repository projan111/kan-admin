export type CosmeticProductDraft = Readonly<{
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

const CREATED_KEY = "dashboard.products.created";
const OVERRIDES_KEY = "dashboard.products.overrides";

const readArray = <T,>(key: string): ReadonlyArray<T> => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.sessionStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as T[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeArray = <T,>(key: string, value: ReadonlyArray<T>) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
};

const readRecord = <T,>(key: string): Readonly<Record<string, T>> => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.sessionStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as Record<string, T>) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeRecord = <T,>(key: string, value: Readonly<Record<string, T>>) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
};

export const readCreatedProducts = (): ReadonlyArray<CosmeticProductDraft> =>
  readArray<CosmeticProductDraft>(CREATED_KEY);

export const isCreatedProductId = (productId: string) =>
  readCreatedProducts().some((product) => product.id === productId);

export const saveCreatedProduct = (product: CosmeticProductDraft) => {
  const products = readCreatedProducts();
  writeArray(CREATED_KEY, [product, ...products]);
};

export const updateCreatedProduct = (product: CosmeticProductDraft) => {
  const products = readCreatedProducts();
  writeArray(
    CREATED_KEY,
    products.map((entry) => (entry.id === product.id ? product : entry))
  );
};

export const readProductOverrides = (): Readonly<Record<string, CosmeticProductDraft>> =>
  readRecord<CosmeticProductDraft>(OVERRIDES_KEY);

export const saveProductOverride = (product: CosmeticProductDraft) => {
  const overrides = readProductOverrides();
  writeRecord(OVERRIDES_KEY, {
    ...overrides,
    [product.id]: product,
  });
};

export const saveProductDraft = (product: CosmeticProductDraft, isExistingCreatedProduct: boolean) => {
  if (isExistingCreatedProduct) {
    updateCreatedProduct(product);
    return;
  }

  saveProductOverride(product);
};
