"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";

import React from "react";

import TablePagination from "@/components/extensions/TanStackTable/TablePagination";
import useTanStackTable from "@/components/extensions/TanStackTable/useTanStackTable";

import { Card } from "@/components/ui/card";
import { useExampleFetchData } from "./useExampleFetchData";
import { useTableState } from "@/components/extensions/TanStackTable/useTableState";

type IGenericExample = {
  id: string;
  name: string;
  nature: string;
};

export default function Example1(props: {
  initialColumnFilters: ColumnFiltersState;
  initialPaginationState: PaginationState;
}) {
  const columns: ColumnDef<IGenericExample>[] = [
    {
      header: "STATUS",
      accessorKey: "status",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        return <span>{row.getValue("status")}</span>;
      },
    },
    {
      header: "NOME",
      accessorKey: "name",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        return <span>{row.getValue("name")}</span>;
      },
    },
    {
      header: "NATUREZA",
      accessorKey: "nature",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        return <span>{row.getValue("name")}</span>;
      },
    },
  ];

  const {
    setColumnFilters,
    columnFilters,
    sorting,
    pagination,
    rowSelection,
    setPagination,
    setRowSelection,
    setSorting,
  } = useTableState({
    columnFilters: props.initialColumnFilters,
    pagination: props.initialPaginationState,
  });

  const { isLoading, data, isError, refetch } =
    useExampleFetchData<IGenericExample>({
      columnFilters,
      pagination,
      sorting,
    });

  const { RootTable, table } = useTanStackTable<IGenericExample>({
    paginatedTableData: data,
    columns,
    columnFilters,
    sorting,
    pagination,
    rowSelection,
    setSorting,
    setColumnFilters,
    setPagination,
    setRowSelection,
  });

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Listagem</h3>
          <h6 className="mb-3 mt-1 text-muted-foreground">
            Gerenciar e visualizar
          </h6>
        </div>
      </div>

      <Card className="flex-1 p-4">
        <RootTable
          className="mb-4"
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
          cols={columns}
        />

        {!!table.getRowModel().rows?.length && (
          <TablePagination table={table} />
        )}
      </Card>
    </div>
  );
}
