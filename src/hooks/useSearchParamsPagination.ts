"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { QuerySearchParams } from "@/app/tanstack-table/useExampleFetchData";
import { ColumnFilter } from "@tanstack/react-table";

export const updateQueryParams = ({
  pagination,
  allCols,
  columnFilters,
  searchParams,
  sorting,
}: QuerySearchParams) => {
  const newParams = new URLSearchParams(searchParams);

  const perPage = pagination.pageSize;

  // Serializar os filtros de coluna
  columnFilters.forEach((col: ColumnFilter) => {
    const value = JSON.stringify(col.value);
    if (value === "0") {
      newParams.delete(`${col.id}`);
    } else {
      newParams.set(`${col.id}`, value);
    }
  });

  // Remover colunas que não estão nos filtros
  allCols.forEach((c) => {
    if (!columnFilters.find((filtered: ColumnFilter) => filtered.id === c)) {
      newParams.delete(`${c}`);
    }
  });

  // Atualizar ordenação
  sorting.forEach((param) => {
    if (param.desc) {
      newParams.set(`SortBy:desc-${param.id}`, `${param.desc}`);
    } else {
      newParams.delete(`SortBy:desc-${param.id}`);
    }
  });

  // Atualizar paginação
  newParams.set("page", `${pagination.pageIndex}`);
  newParams.set("pageSize", `${perPage}`);

  return newParams;
};

export type UseSearchParams = Omit<QuerySearchParams, "searchParams">;

const useSearchParamsPagination = ({
  allCols,
  pagination,
  sorting,
  columnFilters,
}: UseSearchParams) => {
  const router = useRouter();
  const firstRender = useRef(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const newParams = updateQueryParams({
      pagination,
      searchParams,
      columnFilters,
      sorting,
      allCols,
    });

    router.push(`?${newParams.toString()}`, { scroll: false });
  }, [columnFilters, sorting, pagination]);

  return searchParams;
};

export default useSearchParamsPagination;
