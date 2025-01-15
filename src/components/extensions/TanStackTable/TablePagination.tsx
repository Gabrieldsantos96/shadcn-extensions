import type { Table } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import TableNavigation from "./BasicTableNavigation";

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

export default function TablePagination<TData>({
  table,
}: TablePaginationProps<TData>) {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex items-center justify-center gap-4">
        <p className="truncate">Itens por página</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[5, 10, 15, 20].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="truncate">
          {`Página ${
            table.getState().pagination.pageIndex
          } de ${table?.getPageCount()}`}
        </p>
      </div>
      <TableNavigation table={table} />
    </div>
  );
}
