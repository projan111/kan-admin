import type { UUID, JsonLike } from "../../shared/types/common.types";

export type Faq = Readonly<{
  id: UUID;
  title: string;
  description?: JsonLike;
  isActive?: boolean;
  sortOrder?: number;

  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}>;

export type FaqCreateDto = Readonly<{
  title: string;
  description?: JsonLike;
  isActive?: boolean;
  sortOrder?: number;
}>;

export type FaqUpdateDto = Readonly<Partial<FaqCreateDto>>;