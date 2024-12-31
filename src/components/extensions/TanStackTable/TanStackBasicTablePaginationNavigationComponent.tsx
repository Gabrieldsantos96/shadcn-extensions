import type { Table } from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TanStackBasicTablePaginationNavigationComponentProps<TData> {
  table: Table<TData>;
}

export default function TanStackBasicTablePaginationNavigationComponent<TData>({
  table,
}: TanStackBasicTablePaginationNavigationComponentProps<TData>) {
  return (
    <Pagination className="m-0 mt-2 md:mt-0 md:justify-end">
      <PaginationContent>
        <PaginationItem className="rounded-md bg-background hover:cursor-pointer">
          <PaginationPrevious onClick={() => table.previousPage()} />
        </PaginationItem>

        <PaginationItem className="rounded-md bg-background hover:cursor-pointer">
          <PaginationNext onClick={() => table.nextPage()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
