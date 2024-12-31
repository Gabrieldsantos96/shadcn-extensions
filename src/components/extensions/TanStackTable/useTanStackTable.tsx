import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useRef } from "react";

import type { TableProps } from "@/app/types/ITable";

import TanStackBasicTableComponent from "./TanStackBasicTableComponent";

export default function useTanStackTable<TData>({
  paginatedTableData,
  columns,
  pagination,
  sorting = [],
  setSorting,
  setPagination,
  columnFilters = [],
  setColumnFilters,
  columnVisibility,
  setRowSelection,
  rowSelection,
}: TableProps<TData>) {
  const firstRender = useRef(true);

  const table = useReactTable({
    data: (paginatedTableData?.data || []) as TData[],
    columns: columns as ColumnDef<TData, string>[],
    getCoreRowModel: getCoreRowModel(),

    //@ts-expect-error - TData Generic doesn`t have ID
    getRowId: (row) => row.id,

    // sort config
    onSortingChange: setSorting,
    enableMultiSort: true,
    manualSorting: true,
    sortDescFirst: true,

    onRowSelectionChange: setRowSelection,
    // filter config
    // getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: true,

    // pagination config
    // getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    // rowCount: paginatedTableData?.total_filtered,
    pageCount: Math.ceil(
      (paginatedTableData?.total_filtered || 0) /
        (paginatedTableData?.limit || 1)
    ),
    manualPagination: true,
    state: {
      rowSelection,
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  // to reset page index to first page when column is filtered
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (setPagination) {
      setPagination((pagination) => ({
        pageIndex: 0,
        pageSize: pagination.pageSize,
      }));
    }
  }, [columnFilters, setPagination]);

  return {
    table,
    RootTable: ({
      isError,
      className,
      styleConditions,
      isLoading,
      refetch,
      cols,
    }: {
      className?: string;
      styleConditions?: Record<string, Record<string, unknown>>;
      isLoading: boolean;
      isError: boolean;
      cols: ColumnDef<TData>[];
      refetch?: VoidFunction;
    }) => {
      return (
        <TanStackBasicTableComponent
          styleConditions={styleConditions}
          cols={cols as any}
          className={className}
          table={table as any}
          isError={isError}
          isLoading={isLoading}
          refetch={refetch}
        />
      );
    },
  };
}
