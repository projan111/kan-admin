import { companyModule } from "./company.api";

export const useCompanyList = companyModule.hooks.useList;
export const useCompanyGet = companyModule.hooks.useGet;
export const useCompanyDeleted = companyModule.hooks.useDeleted;

export const useCreateCompany = companyModule.hooks.useCreate;
export const useUpdateCompany = companyModule.hooks.useUpdate;

export const useSoftDeleteCompany = companyModule.hooks.useSoftDelete;
export const useRecoverCompany = companyModule.hooks.useRecover;
export const useDestroyCompany = companyModule.hooks.useDestroy;