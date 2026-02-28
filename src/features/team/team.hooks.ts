import { teamModule } from "./team.api";

export const useTeamList = teamModule.hooks.useList;
export const useTeamGet = teamModule.hooks.useGet;
export const useTeamDeleted = teamModule.hooks.useDeleted;

export const useCreateTeam = teamModule.hooks.useCreate;
export const useUpdateTeam = teamModule.hooks.useUpdate;

export const useSoftDeleteTeam = teamModule.hooks.useSoftDelete;
export const useRecoverTeam = teamModule.hooks.useRecover;
export const useDestroyTeam = teamModule.hooks.useDestroy;