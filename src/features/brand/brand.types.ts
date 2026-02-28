import type { UUID } from "../../shared/types/common.types";

export type MediaAsset = Readonly<{
  id: UUID;
  url: string;
}>;

export type Brand = Readonly<{
  id: string;
  title: string;
  slug: string;
  description: string;
  link: string;
  sortOrder?: number | null;
  coverImage?: string | null;
  mediaAssets?: ReadonlyArray<unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}>;

export type BrandCreateDto = Readonly<{
  title: string;
  slug: string;
  description: string;
  link: string;

  removeCoverImage?: boolean;
  removeMediaAssetsIds?: ReadonlyArray<UUID>;
  sortOrder?: number;
}>;

export type BrandUpdateDto = Readonly<Partial<BrandCreateDto>>;

export type BrandCreatePayload = Readonly<
  BrandCreateDto & {
    coverImage?: File | null;
    mediaAssets?: ReadonlyArray<File>;
  }
>;

export type BrandUpdatePayload = Readonly<
  BrandUpdateDto & {
    coverImage?: File | null;
    mediaAssets?: ReadonlyArray<File>;
  }
>;