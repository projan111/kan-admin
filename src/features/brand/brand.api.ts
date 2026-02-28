import { makeCrud } from "../../shared/api/crudFactory";
import type { CrudPaths } from "../../shared/api/crudFactory";
import type { FormFieldValue, FormFileValue } from "../../shared/api/api";
import type { Brand, BrandCreatePayload, BrandUpdatePayload } from "./brand.types";
import { api, unwrap } from "@/shared/api/api";
import type { PaginationQuery, PaginatedResponse } from "@/shared/types/common.types";

const paths: CrudPaths = {
  getAll: "/brand/get-all",
  getOne: (id) => `/brand/get/${id}`,

  create: "/brand/create",
  update: (id) => `/brand/update/${id}`,

  softDelete: (ids) => `/brand/delete/${ids}`,

  deletedList: "/brand/deleted",
  recover: "/brand/recover",

  destroy: (ids) => `/brand/destroy/${ids}`,
} as const;



export const brandModule = makeCrud<Brand, BrandCreatePayload, BrandUpdatePayload>(
  "brand",
  paths,
  {
    create: (dto) => {
      const { coverImage, mediaAssets, ...rest } = dto;

      const files: Readonly<Record<string, FormFileValue>> = {
        coverImage: (coverImage ?? undefined) as FormFileValue,
        mediaAssets: (mediaAssets ?? undefined) as FormFileValue,
      };

      return {
        fields: rest as Readonly<Record<string, FormFieldValue>>,
        files,
      };
    },

    update: (dto) => {
      const { coverImage, mediaAssets, ...rest } = dto;

      const files: Readonly<Record<string, FormFileValue>> = {
        coverImage: (coverImage ?? undefined) as FormFileValue,
        mediaAssets: (mediaAssets ?? undefined) as FormFileValue,
      };

      return {
        fields: rest as Readonly<Record<string, FormFieldValue>>,
        files,
      };
    },
  }
);

export const brandApi = {
  getAll: async (params: PaginationQuery): Promise<PaginatedResponse<Brand>> => {
    const res = await api.get("/brand/get-all", { params });
    return unwrap<PaginatedResponse<Brand>>(res);
  },

};