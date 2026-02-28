// src/features/newsroom/newsroom.types.ts
import type { UUID } from "../../shared/types/common.types";

export type MediaAsset = Readonly<{
  id: UUID;
  url: string;
}>;

export type Newsroom = Readonly<{
  id: UUID;
  title: string;
  slug: string;
  description: string;

  imageUrl?: string;
  mediaAssets?: ReadonlyArray<MediaAsset>;

  sortOrder?: number;

  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}>;

export type NewsroomCreateDto = Readonly<{
  title: string;
  slug: string;
  description: string;

  removeImage?: boolean;
  removeMediaAssetsIds?: ReadonlyArray<UUID>;
  sortOrder?: number;
}>;

export type NewsroomUpdateDto = Readonly<Partial<NewsroomCreateDto>>;

export type NewsroomCreatePayload = Readonly<
  NewsroomCreateDto & {
    image?: File | null;
    mediaAssets?: ReadonlyArray<File>;
  }
>;

export type NewsroomUpdatePayload = Readonly<
  NewsroomUpdateDto & {
    image?: File | null;
    mediaAssets?: ReadonlyArray<File>;
  }
>;