import type {
  ColumnDef,
  Header,
  Row,
  Table as TableType,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RawTableProps<TData> = {
  table: TableType<TData>;
  isLoading: boolean;
  isError: boolean;
  refetch?: VoidFunction;
  styleConditions?: Record<string, Record<string, TData>>;
  className?: string;
  cols: ColumnDef<TData>[];
};

export default function RawTable<TData>({
  styleConditions = {},
  className,
  table,
  isLoading,
  isError,
  refetch,
  cols,
}: RawTableProps<TData>) {
  const sortToggler = (header: Header<TData, unknown>) => {
    if (header.column.getCanSort()) {
      header.column.toggleSorting(undefined, true);
    }
  };

  const applyStyleConditions = (
    row: Row<TData>,
    styleConditions: Record<string, Record<string, TData>>
  ): Record<string, unknown> | null => {
    let appliedStyles: Record<string, unknown> | null = null;

    for (const [key, conditions] of Object.entries(styleConditions)) {
      const value = row.getValue(key);

      const s = conditions[value as string] as Record<string, TData>;

      if (s !== null && s[value as string]) {
        appliedStyles = s[value as string] as Record<string, TData>;
      }
    }

    return appliedStyles;
  };

  return (
    <Table className={className}>
      <TableHeader>
        {table.getHeaderGroups().map((header) => (
          <TableRow key={header.id}>
            {header.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : (
                  <div
                    onClick={() => sortToggler(header)}
                    className="hover:cursor-pointer"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {(header.column.getIsSorted() === "asc" ||
                      header.column.getIsSorted() === "desc") && (
                      <span>
                        {header.column.getIsSorted() === "asc" && "↑"}
                        {header.column.getIsSorted() === "desc" && "↓"}
                      </span>
                    )}
                  </div>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading &&
          Array.from({ length: 3 }).map(() => (
            <TableRow key={crypto.randomUUID()}>
              {cols.map((col) => {
                if (col.header !== "ID") {
                  return (
                    <TableCell
                      key={crypto.randomUUID()}
                      className="h-16 text-center"
                    >
                      <Skeleton className="h-4" />
                    </TableCell>
                  );
                }
                return null;
              })}
            </TableRow>
          ))}
        {!isLoading && isError && (
          <TableRow>
            <TableCell colSpan={100} className="flex-1 text-center">
              <div className="flex h-40 flex-col items-center gap-y-4">
                Erro ao carregar dados.
                <Button className="w-fit" onClick={() => refetch && refetch()}>
                  Recarregar
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
        {!isLoading && !isError && !table.getRowModel().rows?.length && (
          <TableRow>
            <TableCell colSpan={100} className="flex-1 text-center">
              <div className="flex h-40 flex-col items-center gap-y-4">
                Resultados não encontrados.
              </div>
            </TableCell>
          </TableRow>
        )}
        {!isLoading &&
          table.getRowModel().rows?.length >= 1 &&
          table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(applyStyleConditions(row, styleConditions))}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
