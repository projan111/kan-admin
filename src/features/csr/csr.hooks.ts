// src/features/csr/csr.hooks.ts
import { csrModule } from "./csr.api";

export const useCsrList = csrModule.hooks.useList;
export const useCsrGet = csrModule.hooks.useGet;
export const useCsrDeleted = csrModule.hooks.useDeleted;

export const useCreateCsr = csrModule.hooks.useCreate;
export const useUpdateCsr = csrModule.hooks.useUpdate;

export const useSoftDeleteCsr = csrModule.hooks.useSoftDelete;
export const useRecoverCsr = csrModule.hooks.useRecover;
export const useDestroyCsr = csrModule.hooks.useDestroy;