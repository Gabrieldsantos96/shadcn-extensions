import { Label } from "@radix-ui/react-label";
import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

interface TableFilterProps<TData> {
  table: Table<TData>;
}

export default function TableFilter<TData>({ table }: TableFilterProps<TData>) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Filters</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {table.getHeaderGroups()[0]?.headers.map(
          (header) =>
            !header.isPlaceholder &&
            header.column.getCanFilter() && (
              <div key={header.id} className="">
                <Label className="block text-lg font-semibold">
                  {`${flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}`}
                  :
                </Label>
                <Input
                  className="w-full"
                  placeholder={`Filter ${flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )} ...`}
                  value={(header.column.getFilterValue() as string) || ""}
                  onChange={(e) => {
                    header.column?.setFilterValue(e.target.value);
                  }}
                />
              </div>
            )
        )}
      </div>
    </div>
  );
}
