import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
import React, { useRef } from "react";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Search } from "./Search";

export type SearchResponse = {
  options: ComboBoxItemType[];
  total: number;
  skip: number;
  limit: number;
};

export type Combobox2Props = {
  asyncSearchFn: (searchTerm: string) => Promise<SearchResponse>;
};

export type ComboBoxItemType = {
  value: string;
  label: string;
};

const POPOVER_WIDTH = "w-[300px]";

export function ComboSearchBox({
  className,
  queryKey,
  asyncSearchFn,
  initialValue,
  onSelect,
  disabled = false,
}: Combobox2Props & {
  queryKey: string;
  initialValue?: ComboBoxItemType;
  onSelect: (searchTerm: string, items: SearchResponse | undefined) => void;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<
    ComboBoxItemType | undefined
  >();
  const firstChange = useRef(true);

  React.useEffect(() => {
    if (initialValue && firstChange.current) {
      setSelected(initialValue);
      firstChange.current = false;
    }
  }, [initialValue]);

  const displayName = selected ? selected.label : "Selecione um item";

  const [searchQuery, setSearchQuery] = React.useState("");

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const {
    data: items,
    isLoading,
    isError,
  } = useQuery<SearchResponse>({
    staleTime: 1000 * 60 * 5,
    enabled: open, // only fetch if opened
    queryKey: [queryKey, debouncedSearchQuery],
    queryFn: () => asyncSearchFn(debouncedSearchQuery),
  });

  const handleSetActive = React.useCallback(
    (p: ComboBoxItemType) => {
      setSelected(p);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onSelect && onSelect(p.value, items);
    },
    [items, onSelect]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          className={cn(
            "justify-between relative pr-10",
            POPOVER_WIDTH,
            className
          )}
        >
          <span className="truncate">{displayName}</span>

          <ChevronsUpDown className="absolute right-3 ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="bottom" className={cn("p-0", POPOVER_WIDTH)}>
        <Search
          selectedResult={selected}
          onSelectResult={handleSetActive}
          isError={isError}
          isLoading={isLoading}
          items={items}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </PopoverContent>
    </Popover>
  );
}
