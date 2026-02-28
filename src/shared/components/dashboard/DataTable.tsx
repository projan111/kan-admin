import React from "react";

type Column<T> = Readonly<{
  key: string;
  title: string;
  render: (row: T) => React.ReactNode;
}>;

type Props<T> = Readonly<{
  title: string;
  columns: ReadonlyArray<Column<T>>;
  rows: ReadonlyArray<T>;
  emptyLabel?: string;
}>;

export function DataTable<T>({ title, columns, rows, emptyLabel }: Props<T>) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/70 bg-white/92 shadow-[var(--card-shadow)]">
      <header className="border-b border-[var(--line)]/80 bg-[var(--surface-soft)] px-5 py-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{title}</h3>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--muted)]">
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-3 font-semibold">{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-5 py-10 text-center text-sm text-[var(--muted)]" colSpan={columns.length}>
                  {emptyLabel ?? "No data"}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className="border-t border-[var(--line)]/70 transition-colors hover:bg-[var(--surface-soft)]/80">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3 text-[var(--text)]">{col.render(row)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
