import {
  ColumnDef,
  getCoreRowModel,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useRef } from "react";

import type {
  RootTableProps,
  useTableProps,
  UseTableReturn,
} from "@/app/types/ITable";

import RawTable from "./RawTable";
import useSearchParamsPagination from "@/hooks/useSearchParamsPagination";

export default function useTanStackTable<TData extends { id: string }>({
  paginatedTableData,
  columns,
  columnFilters,
  pagination,
  rowSelection,
  sorting,
  columnVisibility,
  setColumnFilters,
  setPagination,
  setRowSelection,
  setSorting,
}: useTableProps<TData>): UseTableReturn<TData> {
  const firstRender = useRef(true);

  const table = useReactTable({
    data: (paginatedTableData?.data || []) as TData[],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    enableMultiSort: true,
    manualSorting: true,
    sortDescFirst: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: true,
    onPaginationChange: setPagination,
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

  const allCols = columns.reduce<string[]>((acc, col: any) => {
    if (col.accessorKey) {
      acc.push(col.accessorKey);
    }
    return acc;
  }, []);

  useSearchParamsPagination({
    columnFilters,
    sorting,
    allCols,
    pagination,
  });

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setPagination((pagination) => ({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    }));
  }, [columnFilters]);

  return {
    table,
    state: {
      sorting,
      setSorting,
      rowSelection,
      setRowSelection,
      columnFilters,
      setColumnFilters,
      pagination,
      setPagination,
    },
    RootTable: ({
      isError,
      className,
      styleConditions,
      isLoading,
      refetch,
      cols,
    }: RootTableProps<TData>) => {
      return (
        <RawTable
          styleConditions={styleConditions}
          cols={cols as ColumnDef<unknown>[]}
          className={className}
          table={table as Table<unknown>}
          isError={isError}
          isLoading={isLoading}
          refetch={refetch}
        />
      );
    },
  };
}
