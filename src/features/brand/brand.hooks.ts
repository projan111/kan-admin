import { brandModule } from "./brand.api";

export const useBrandList = brandModule.hooks.useList;
export const useBrandGet = brandModule.hooks.useGet;
export const useBrandDeleted = brandModule.hooks.useDeleted;

export const useCreateBrand = brandModule.hooks.useCreate;
export const useUpdateBrand = brandModule.hooks.useUpdate;

export const useSoftDeleteBrand = brandModule.hooks.useSoftDelete;
export const useRecoverBrand = brandModule.hooks.useRecover;
export const useDestroyBrand = brandModule.hooks.useDestroy;
