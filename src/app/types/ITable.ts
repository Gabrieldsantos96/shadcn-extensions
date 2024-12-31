import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";

export interface TableProps<TData> {
  paginatedTableData?: UseGetTableResponseType<TData>;
  columns: ColumnDef<TData>[];
  pagination?: PaginationState;
  setPagination?: Dispatch<SetStateAction<PaginationState>>;
  sorting?: SortingState;
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  rowSelection?: RowSelectionState;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  columnVisibility?: Record<string, boolean>;
}

export interface UseGetTableResponseType<TData> {
  limit: number; // pageSize
  page: number; // currentPage
  total: number; // totalPages
  total_filtered: number; // totalItemsCount
  data: TData; // payload
}
