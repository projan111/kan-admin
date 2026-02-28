// src/features/csr/csr.types.ts
import type { UUID } from "../../shared/types/common.types";

export type CsrStatus = "ONGOING" | "UPCOMING" | "PREVIOUS";

export type MediaAsset = Readonly<{
  id: UUID;
  url: string;
}>;

export type Csr = Readonly<{
  id: UUID;
  title: string;
  slug: string;
  description: string;
  link: string;

  status: CsrStatus;
  date: string; // date string

  coverImageUrl?: string;
  mediaAssets?: ReadonlyArray<MediaAsset>;

  sortOrder?: number;

  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}>;

export type CsrCreateDto = Readonly<{
  title: string;
  slug: string;
  description: string;
  link: string;

  status: CsrStatus;
  date: string;

  removeCoverImage?: boolean;
  removeMediaAssetsIds?: ReadonlyArray<UUID>;
  sortOrder?: number;
}>;

export type CsrUpdateDto = Readonly<Partial<CsrCreateDto>>;

export type CsrCreatePayload = Readonly<
  CsrCreateDto & {
    coverImage?: File | null;
    mediaAssets?: ReadonlyArray<File>;
  }
>;

export type CsrUpdatePayload = Readonly<
  CsrUpdateDto & {
    coverImage?: File | null;
    mediaAssets?: ReadonlyArray<File>;
  }
>;