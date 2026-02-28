import { contactModule } from "./contact.api";

export const useContactList = contactModule.hooks.useList;
export const useContactGet = contactModule.hooks.useGet;
export const useContactDeleted = contactModule.hooks.useDeleted;

export const useCreateContact = contactModule.hooks.useCreate;

export const useSoftDeleteContact = contactModule.hooks.useSoftDelete;
export const useRecoverContact = contactModule.hooks.useRecover;
export const useDestroyContact = contactModule.hooks.useDestroy;