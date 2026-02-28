import type { UUID, JsonLike } from "../../shared/types/common.types";

export type TeamMember = Readonly<{
  id: UUID;
  fullname: string;
  designation: string;
  countryCode: string;
  phoneNumber: string;

  description?: JsonLike;
  addToHome?: boolean;
  isLeader?: boolean;

  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;

  sortOrder?: number;

  imageUrl?: string;

  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}>;

export type TeamCreateDto = Readonly<{
  addToHome?: boolean;
  isLeader?: boolean;
  description?: JsonLike;
  fullname: string;
  designation: string;
  countryCode: string;
  phoneNumber: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  sortOrder?: number;
}>;

export type TeamUpdateDto = Readonly<Partial<TeamCreateDto> & { removeImage?: boolean }>;

export type TeamCreatePayload = Readonly<TeamCreateDto & { image?: File | null }>;
export type TeamUpdatePayload = Readonly<TeamUpdateDto & { image?: File | null }>;