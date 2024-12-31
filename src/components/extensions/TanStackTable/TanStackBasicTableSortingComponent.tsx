import type { SortingState } from '@tanstack/react-table';

interface TanStackBasicTableSortingComponentProps {
  sorting: SortingState;
}

export default function TanStackBasicTableSortingComponent({
  sorting,
}: TanStackBasicTableSortingComponentProps) {
  return (
    <div className="rounded-xl bg-violet-300 p-4">
      <h1 className="text-2xl font-bold">Sorts</h1>
      <div className="flex gap-4">
        {sorting.length === 0 ? (
          <p>No sorting applied</p>
        ) : (
          <div>
            {sorting.map((sort) => (
              <p key={sort.id}>
                {sort.id.toUpperCase()} sorted in
                {sort.desc ? <> descending</> : <> ascending</>} order.
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
