import { faqModule } from "./faq.api";

export const useFaqList = faqModule.hooks.useList;
export const useFaqGet = faqModule.hooks.useGet;
export const useFaqDeleted = faqModule.hooks.useDeleted;

export const useCreateFaq = faqModule.hooks.useCreate;
export const useUpdateFaq = faqModule.hooks.useUpdate;

export const useSoftDeleteFaq = faqModule.hooks.useSoftDelete;
export const useRecoverFaq = faqModule.hooks.useRecover;
export const useDestroyFaq = faqModule.hooks.useDestroy;