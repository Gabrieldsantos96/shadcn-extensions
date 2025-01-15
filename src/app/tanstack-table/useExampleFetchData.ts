import { useQuery } from "@tanstack/react-query";
import { RqQueryHooks, UseGetTableResponseType } from "../types/ITable";

export const QUERY_KEY = "example";

export function useExampleFetchData<T>({
  columnFilters,
  pagination,
  sorting,
}: RqQueryHooks) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEY, sorting, columnFilters, pagination],
    queryFn: async () => {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            limit: 10,
            page: 1,
            total: 23,
            total_filtered: 60,
            data: [],
          });
        }, 1000);
      });
      return response;
    },
  });

  return {
    data: data as UseGetTableResponseType<T>,
    isLoading,
    isError,
    refetch,
  };
}
