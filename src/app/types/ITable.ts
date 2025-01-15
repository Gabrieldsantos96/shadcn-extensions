import type {
  ColumnDef,
  ColumnFilter,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableState,
} from "@tanstack/react-table";
import { Table as ReactTable } from "@tanstack/react-table";
import { ReadonlyURLSearchParams } from "next/navigation";

export type IPickedTableState = Pick<
  TableState,
  "sorting" | "rowSelection" | "columnFilters" | "pagination"
>;

export type IUseTableStateParams = Partial<IPickedTableState>;

export type IUseTableReturn = IPickedTableState & {
  setSorting: OnChangeFn<SortingState>;
  setRowSelection: OnChangeFn<RowSelectionState>;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  setPagination: OnChangeFn<PaginationState>;
};

export type IUseTableAction =
  | { type: "SET_SORTING"; payload: SortingState }
  | { type: "SET_ROW_SELECTION"; payload: RowSelectionState }
  | { type: "SET_COLUMN_FILTERS"; payload: ColumnFiltersState }
  | { type: "SET_PAGINATION"; payload: PaginationState };

export type useTableProps<TData> = {
  columns: ColumnDef<TData, string>[];
  paginatedTableData?: UseGetTableResponseType<TData>;
  columnVisibility?: Record<string, boolean>;
  setSorting: OnChangeFn<SortingState>;
  setRowSelection: OnChangeFn<RowSelectionState>;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  setPagination: OnChangeFn<PaginationState>;
} & Pick<
  TableState,
  "columnFilters" | "sorting" | "pagination" | "rowSelection"
>;

export type RootTableProps<TData> = {
  className?: string;
  styleConditions?: Record<string, Record<string, unknown>>;
  isLoading: boolean;
  isError: boolean;
  cols: ColumnDef<TData>[];
  refetch?: VoidFunction;
};

export type UseTableReturn<TData> = {
  table: ReactTable<TData>;
  state: {
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    rowSelection: RowSelectionState;
    setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
    columnFilters: ColumnFiltersState;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  };
  RootTable: (props: {
    className?: string;
    styleConditions?: Record<string, Record<string, unknown>>;
    isLoading: boolean;
    isError: boolean;
    cols: ColumnDef<TData>[];
    refetch?: VoidFunction;
  }) => JSX.Element;
};

export interface UseGetTableResponseType<TData> {
  limit: number; // pageSize
  page: number; // currentPage
  total: number; // totalPages
  total_filtered: number; // totalItemsCount
  data: TData; // payload
}

export type UseUpdateSearchParamsProps = {
  pagination: PaginationState;
  searchParams: ReadonlyURLSearchParams;
  columnFilters: ColumnFilter[];
  sorting: SortingState;
  allCols: string[];
};

export type UseSearchParamsProps = Omit<
  UseUpdateSearchParamsProps,
  "searchParams"
>;

export type RqQueryHooks = Omit<
  UseSearchParamsProps,
  "searchParams" | "allCols"
>;
