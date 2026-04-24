import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

type Props = Readonly<{
  columns?: number;
  rows?: number;
  titleWidthClassName?: string;
  actionWidthClassName?: string;
}>;

export function TableShimmer({
  columns = 7,
  rows = 5,
  titleWidthClassName = "w-48",
  actionWidthClassName = "w-28",
}: Props) {
  return (
    <section className="overflow-hidden rounded-md border border-[var(--line)] bg-white shadow-[var(--card-shadow)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--surface-soft)] px-5 py-4">
        <div className={`h-5 animate-pulse rounded-full bg-[var(--surface-strong)] ${titleWidthClassName}`} />
        <div className={`h-9 animate-pulse rounded-full bg-[var(--surface-strong)] ${actionWidthClassName}`} />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index}>
                  <div className="h-4 w-full animate-pulse rounded-full bg-[var(--surface-strong)]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((__, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <div
                      className="h-4 animate-pulse rounded-full bg-[var(--surface-strong)]"
                      style={{ width: `${Math.max(48, 92 - cellIndex * 6)}%` }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
