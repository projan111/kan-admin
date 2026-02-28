export type UUID = string;

export type ApiListQuery = Readonly<{
  page?: number;   
  limit?: number;  
  search?: string;
}>;
export type PaginationQuery = Readonly<{
  page?: number;
  limit?: number;
  search?: string;
}>;

export type PaginatedResponse<T> = Readonly<{
  data: ReadonlyArray<T>;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}>;

export type RecoverDto = Readonly<{
  ids: ReadonlyArray<UUID>;
}>;

export type CommaIds = string; 

export type JsonObject = Record<string, unknown>;
export type JsonLike = string | JsonObject;

export type ApiEnvelope<T> = Readonly<{
  success: boolean;
  message?: string;
  data: T;
}>;

export type ApiListEnvelope<T> = Readonly<{
  success: boolean;
  message?: string;
  data: ReadonlyArray<T>;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}>;