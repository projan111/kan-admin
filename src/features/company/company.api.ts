import { makeCrud } from "../../shared/api/crudFactory";
import type { CrudPaths } from "../../shared/api/crudFactory";
import type { FormFieldValue, FormFileValue } from "../../shared/api/api";
import type { Company, CompanyCreatePayload, CompanyUpdatePayload } from "./company.types";

const paths: CrudPaths = {
  getAll: "/company/get-all",
  getOne: (id) => `/company/get/${id}`,

  create: "/company/create",
  update: (id) => `/company/update/${id}`,

  softDelete: (ids) => `/company/delete/${ids}`, 

  deletedList: "/company/deleted",
  recover: "/company/recover",

  destroy: (ids) => `/company/destroy/${ids}`, 
} as const;

export const companyModule = makeCrud<Company, CompanyCreatePayload, CompanyUpdatePayload>(
  "company",
  paths,
  {
    create: (dto) => {
      const { logo, ...rest } = dto;
      return {
        fields: rest as Readonly<Record<string, FormFieldValue>>,
        files: { logo: (logo ?? undefined) as FormFileValue },
      };
    },
    update: (dto) => {
      const { logo, ...rest } = dto;
      return {
        fields: rest as Readonly<Record<string, FormFieldValue>>,
        files: { logo: (logo ?? undefined) as FormFileValue },
      };
    },
  }
);