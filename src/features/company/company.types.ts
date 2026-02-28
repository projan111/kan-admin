import type { UUID } from "../../shared/types/common.types";

export type HexColor = `#${string}`;

export type Company = Readonly<{
  id: UUID;
  bgcolor: HexColor;
  description: string;
  title: string;
  slug: string;
  link: string;

  logoUrl?: string;
  sortOrder?: number;

  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}>;

export type CompanyCreateDto = Readonly<{
  bgcolor: HexColor;
  description: string;
  title: string;
  slug: string;
  link: string;

  removeLogo?: boolean;
  sortOrder?: number;
}>;

export type CompanyUpdateDto = Readonly<Partial<CompanyCreateDto>>;

export type CompanyCreatePayload = Readonly<CompanyCreateDto & { logo?: File | null }>;
export type CompanyUpdatePayload = Readonly<CompanyUpdateDto & { logo?: File | null }>;