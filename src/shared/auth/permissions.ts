import type { Role } from "@/features/auth";

export type AppPermission =
  | "dashboard.view"
  | "users.manage"
  | "contact.manage"
  | "entity.create"
  | "entity.update"
  | "entity.delete"
  | "entity.recover"
  | "entity.destroy";

const ROLE_PERMISSIONS: Readonly<Record<Role, ReadonlySet<AppPermission>>> = {
  SUDOADMIN: new Set<AppPermission>([
    "dashboard.view",
    "users.manage",
    "contact.manage",
    "entity.create",
    "entity.update",
    "entity.delete",
    "entity.recover",
    "entity.destroy",
  ]),
  ADMIN: new Set<AppPermission>([
    "dashboard.view",
    "users.manage",
    "contact.manage",
    "entity.create",
    "entity.update",
    "entity.delete",
  ]),
  USER: new Set<AppPermission>(["dashboard.view"]),
};

export function can(role: Role | null | undefined, permission: AppPermission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].has(permission);
}
