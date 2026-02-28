import type { UUID } from "../../shared/types/common.types";

export type Contact = Readonly<{
  id: UUID;
  name: string;
  email: string;
  number: string; 
  message: string;
  sortOrder?: number;
  isView?: boolean;

  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}>;

export type ContactCreateDto = Readonly<{
  name: string;
  email: string;
  number: string;
  message: string;
  sortOrder?: number;
}>;
