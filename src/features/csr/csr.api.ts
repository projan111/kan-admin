// src/features/csr/csr.api.ts
import { makeCrud } from "../../shared/api/crudFactory";
import type { CrudPaths } from "../../shared/api/crudFactory";
import type { FormFieldValue, FormFileValue } from "../../shared/api/api";
import type { Csr, CsrCreatePayload, CsrUpdatePayload } from "./csr.types";

const paths: CrudPaths = {
  getAll: "/csr/get-all",
  getOne: (id) => `/csr/get/${id}`,

  create: "/csr/create",
  update: (id) => `/csr/update/${id}`,

  softDelete: (ids) => `/csr/delete/${ids}`,

  deletedList: "/csr/deleted",
  recover: "/csr/recover",

  destroy: (ids) => `/csr/destroy/${ids}`,
} as const;

export const csrModule = makeCrud<Csr, CsrCreatePayload, CsrUpdatePayload>(
  "csr",
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