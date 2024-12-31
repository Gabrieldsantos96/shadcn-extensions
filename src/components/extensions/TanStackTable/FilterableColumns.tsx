import type { Table as TableType } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FilterableColumns<TData>({
  table,
}: {
  table: TableType<TData>;
}) {
  return (
    <DropdownMenu>
      <div className="flex justify-end pb-2 pt-3">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Filtrar Colunas <ChevronDown className="ml-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
