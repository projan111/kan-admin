import { missingModulesMap, type MissingModuleKey, type MissingModuleRow } from "./missingModulesData";

const OVERRIDES_KEY = "dashboard.missing.overrides";

type MissingOverridesState = Readonly<
  Partial<Record<MissingModuleKey, Readonly<Record<string, MissingModuleRow>>>>
>;

const readOverridesState = (): MissingOverridesState => {
  if (typeof window === "undefined") return {} as MissingOverridesState;

  try {
    const raw = window.sessionStorage.getItem(OVERRIDES_KEY);
    const parsed = raw ? (JSON.parse(raw) as MissingOverridesState) : {};
    return parsed && typeof parsed === "object" ? parsed : ({} as MissingOverridesState);
  } catch {
    return {} as MissingOverridesState;
  }
};

const writeOverridesState = (nextState: MissingOverridesState) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(OVERRIDES_KEY, JSON.stringify(nextState));
};

export const readMissingModuleRows = (moduleKey: MissingModuleKey): ReadonlyArray<MissingModuleRow> => {
  const overridesState = readOverridesState();
  const moduleOverrides = overridesState[moduleKey] ?? {};

  return missingModulesMap[moduleKey].rows.map((row) => moduleOverrides[row.id] ?? row);
};

export const findMissingModuleRow = (moduleKey: MissingModuleKey, rowId: string) =>
  readMissingModuleRows(moduleKey).find((row) => row.id === rowId);

export const saveMissingModuleRow = (moduleKey: MissingModuleKey, row: MissingModuleRow) => {
  const state = readOverridesState();
  const nextModuleState = {
    ...(state[moduleKey] ?? {}),
    [row.id]: row,
  };

  writeOverridesState({
    ...state,
    [moduleKey]: nextModuleState,
  });
};
