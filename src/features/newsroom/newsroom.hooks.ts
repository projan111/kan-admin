// src/features/newsroom/newsroom.hooks.ts
import { newsroomModule } from "./newsroom.api";

export const useNewsroomList = newsroomModule.hooks.useList;
export const useNewsroomGet = newsroomModule.hooks.useGet;
export const useNewsroomDeleted = newsroomModule.hooks.useDeleted;

export const useCreateNewsroom = newsroomModule.hooks.useCreate;
export const useUpdateNewsroom = newsroomModule.hooks.useUpdate;

export const useSoftDeleteNewsroom = newsroomModule.hooks.useSoftDelete;
export const useRecoverNewsroom = newsroomModule.hooks.useRecover;
export const useDestroyNewsroom = newsroomModule.hooks.useDestroy;