const HIDDEN_ROWS_KEY = "dashboard.hidden.rows";

type HiddenRowsState = Readonly<Record<string, ReadonlyArray<string>>>;

const readState = (): HiddenRowsState => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.sessionStorage.getItem(HIDDEN_ROWS_KEY);
    const parsed = raw ? (JSON.parse(raw) as HiddenRowsState) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeState = (nextState: HiddenRowsState) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(HIDDEN_ROWS_KEY, JSON.stringify(nextState));
};

export const readHiddenRowIds = (scope: string): ReadonlySet<string> => {
  const state = readState();
  return new Set(state[scope] ?? []);
};

export const hideRowIds = (scope: string, rowIds: ReadonlyArray<string>) => {
  const state = readState();
  const nextIds = new Set([...(state[scope] ?? []), ...rowIds]);

  writeState({
    ...state,
    [scope]: [...nextIds],
  });
};
