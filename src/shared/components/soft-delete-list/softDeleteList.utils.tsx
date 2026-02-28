import React from "react";

export function parseListData<TItem>(rawData: unknown): Readonly<{ rows: ReadonlyArray<TItem>; totalPages: number }> {
  let rows: ReadonlyArray<TItem> = [];
  let totalPages = 1;

  const pickFirstArray = (value: unknown): ReadonlyArray<TItem> | null => {
    if (!value || typeof value !== "object") return null;

    for (const v of Object.values(value as Record<string, unknown>)) {
      if (Array.isArray(v)) return v as ReadonlyArray<TItem>;
    }

    for (const v of Object.values(value as Record<string, unknown>)) {
      if (v && typeof v === "object") {
        for (const vv of Object.values(v as Record<string, unknown>)) {
          if (Array.isArray(vv)) return vv as ReadonlyArray<TItem>;
        }
      }
    }

    return null;
  };

  if (Array.isArray(rawData)) {
    rows = rawData as ReadonlyArray<TItem>;
  } else if (rawData && typeof rawData === "object") {
    const envelope = rawData as Readonly<{
      data?: unknown;
      items?: unknown;
      totalPages?: number;
      pages?: number;
    }>;

    const level1 = envelope.data ?? envelope.items;
    const level2 =
      level1 && typeof level1 === "object"
        ? (level1 as Readonly<{ data?: unknown; items?: unknown }>).data ??
          (level1 as Readonly<{ data?: unknown; items?: unknown }>).items
        : undefined;

    if (Array.isArray(level1)) rows = level1 as ReadonlyArray<TItem>;
    else if (Array.isArray(level2)) rows = level2 as ReadonlyArray<TItem>;
    else rows = pickFirstArray(rawData) ?? [];

    totalPages = envelope.totalPages ?? envelope.pages ?? 1;
  }

  return { rows, totalPages };
}

export function sortRows<TItem>(rows: ReadonlyArray<TItem>, sortValue: string): ReadonlyArray<TItem> {
  if (!sortValue) return rows;
  const [key, dir] = sortValue.split(":");
  const sign = dir === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const av = (a as Record<string, unknown>)[key];
    const bv = (b as Record<string, unknown>)[key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * sign;
    return String(av).localeCompare(String(bv)) * sign;
  });
}

export function withDefaultSortOptions(
  options: ReadonlyArray<Readonly<{ label: string; value: string }>>
): ReadonlyArray<Readonly<{ label: string; value: string }>> {
  const hasCreated = options.some((opt) => opt.value.startsWith("createdAt:"));
  if (hasCreated) return options;
  return [
    { label: "Created (Newest)", value: "createdAt:desc" },
    { label: "Created (Oldest)", value: "createdAt:asc" },
    ...options,
  ];
}

export function cloneHeadWithSelection(
  head: React.ReactNode,
  extra: React.ReactNode
): React.ReactNode {
  if (!(React.isValidElement(head) && head.type === "tr")) return head;
  const el = head as React.ReactElement<{ children?: React.ReactNode }>;
  return React.cloneElement(el, {
    children: (
      <>
        {extra}
        {el.props.children}
      </>
    ),
  });
}
