"use client";

import {
  ColumnFilter,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";

import React, { useMemo, useState } from "react";

import useSearchParamsPagination from "@/hooks/useSearchParamsPagination";

import TanStackBasicTablePaginationComponent from "@/components/extensions/TanStackTable/TanStackBasicTablePaginationComponent";
import useTanStackTable from "@/components/extensions/TanStackTable/useTanStackTable";
import { useDebounce } from "use-debounce";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useExampleFetchData } from "./useExampleFetchData";

type IGenericExample = {
  id: string;
  name: string;
  nature: string;
};

export default function Example1(props: {
  initialColumnFilters: ColumnFiltersState;
  initialPaginationState: PaginationState;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    props.initialColumnFilters
  );
  const debouncedValue = useDebounce<ColumnFilter[]>(columnFilters, 1000);

  const [p, setPagination] = useState<PaginationState>(
    props.initialPaginationState
  );

  const pagination = useMemo(
    () => ({
      pageIndex: p.pageIndex + 1,
      pageSize: p.pageSize,
    }),
    [p]
  );
  const cols: ColumnDef<IGenericExample>[] = [
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

  const allCols = cols.reduce<string[]>((acc, col: any) => {
    acc.push(col.accessorKey);
    return acc;
  }, []);

  useSearchParamsPagination({
    columnFilters,
    sorting,
    allCols,
    pagination,
  });

  const { isLoading, data, isError, refetch } =
    useExampleFetchData<IGenericExample>({
      sorting,
      columnFilters: debouncedValue[0],
      pagination,
    });

  const { RootTable, table } = useTanStackTable<IGenericExample>({
    columns: cols,
    columnFilters,
    paginatedTableData: data,
    rowSelection,
    setRowSelection,
    pagination,
    setColumnFilters,
    setPagination,
    sorting,
    setSorting,
    columnVisibility: {
      id: false,
    },
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
        <div className="flex flex-col gap-y-2">
          <HeaderFilters
            headers={
              table.getHeaderGroups()[0]?.headers as Record<string, any>[]
            }
          />
        </div>

        <RootTable
          className="mb-4"
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
          cols={cols}
        />

        {!isLoading && !!table.getRowModel().rows?.length && (
          <TanStackBasicTablePaginationComponent table={table} />
        )}
      </Card>
    </div>
  );
}

function HeaderFilters({ headers }: { headers: Record<any, any>[] }) {
  const mapHeaders = headers.reduce((acc, header) => {
    acc[header.id] = header;
    return acc;
  }, {} as Record<any, any>);
  return (
    <div className="mb-2 mt-5 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
      {mapHeaders.name && (
        <div className="flex flex-col space-y-2">
          <Input
            placeholder={`Pesquisar...`}
            value={(mapHeaders.name.column.getFilterValue() as string) || ""}
            onChange={(e) => {
              mapHeaders.name.column?.setFilterValue(e.target.value);
            }}
          />
        </div>
      )}
    </div>
  );
}
