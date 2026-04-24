import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

type Column<T> = Readonly<{
  key: string;
  title: string;
  render: (row: T) => React.ReactNode;
}>;

type Props<T> = Readonly<{
  title: string;
  description?: string;
  actions?: React.ReactNode;
  columns: ReadonlyArray<Column<T>>;
  rows: ReadonlyArray<T>;
  emptyLabel?: string;
}>;

export function DataTable<T>({ title, description, actions, columns, rows, emptyLabel }: Props<T>) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[var(--line)] bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{title}</h3>
          {description ? <p className="mt-1 text-sm text-[var(--muted)]">{description}</p> : null}
        </div>
        {actions}
      </header>
      <div className="overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key}>{col.title}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell className="px-5 py-10 text-center text-sm text-[var(--muted)]" colSpan={columns.length}>
                  {emptyLabel ?? "No data"}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.render(row)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
