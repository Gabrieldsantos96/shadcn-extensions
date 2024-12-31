import Example1 from "./example1";

const TITLE = "TanStack Table";

export function generateMetadata() {
  return {
    title: TITLE,
  };
}

export default async function TanstackPage({
  searchParams,
}: {
  searchParams: Record<any, any>;
}) {
  const initialColumnFilters = Object.entries(searchParams)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([id, _]) => !id.includes("page"))
    .map(([id, value]) => ({
      id,
      value,
    }));

  const initialPaginationState = {
    pageSize: Number(searchParams?.pageSize) || 10,
    pageIndex: Number(searchParams?.page) - 1 || 0,
  };

  return (
    <Example1
      initialPaginationState={initialPaginationState}
      initialColumnFilters={initialColumnFilters}
    />
  );
}

export const dynamic = "force-dynamic";
