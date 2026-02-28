import { makeCrud } from "../../shared/api/crudFactory";
import type { CrudPaths } from "../../shared/api/crudFactory";
import type { FormFieldValue, FormFileValue } from "../../shared/api/api";
import type { TeamCreatePayload, TeamMember, TeamUpdatePayload } from "./team.types";

const paths: CrudPaths = {
  getAll: "/team/get-all",
  getOne: (id) => `/team/get/${id}`,

  create: "/team/create",
  update: (id) => `/team/update/${id}`,

  softDelete: (id) => `/team/delete-member/${id}`,

  deletedList: "/team/deleted",
  recover: "/team/recover",

  destroy: (ids) => `/team/destroy/${ids}`,
} as const;

export const teamModule = makeCrud<TeamMember, TeamCreatePayload, TeamUpdatePayload>(
  "team",
  paths,
  {
    create: (dto) => {
      const { image, ...rest } = dto;

      return {
        fields: rest as Readonly<Record<string, FormFieldValue>>,
        files: { image: (image ?? undefined) as FormFileValue },
      };
    },

    update: (dto) => {
      const { image, ...rest } = dto;

      return {
        fields: rest as Readonly<Record<string, FormFieldValue>>,
        files: { image: (image ?? undefined) as FormFileValue },
      };
    },
  }
);