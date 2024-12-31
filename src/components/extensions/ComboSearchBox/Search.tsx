"use client";

import { Check } from "lucide-react";
import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import type { ComboBoxItemType } from "./ComboSearchBox";

export type SearchResponse = {
  options: ComboBoxItemType[];
  total: number;
  skip: number;
  limit: number;
};

type SearchProps = {
  selectedResult?: ComboBoxItemType;
  isLoading: boolean;
  isError: boolean;
  items?: SearchResponse;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onSelectResult: (p: ComboBoxItemType) => void;
};

export function Search({
  selectedResult,
  onSelectResult,
  isLoading,
  items,
  searchQuery,
  isError,
  setSearchQuery,
}: SearchProps) {
  const handleSelectResult = (p: ComboBoxItemType) => {
    onSelectResult(p);
  };

  return (
    <Command shouldFilter={false} className="h-auto rounded-lg shadow-md">
      <CommandInput
        value={searchQuery}
        onValueChange={setSearchQuery}
        placeholder="Pesquisar..."
      />

      <CommandList>
        {isLoading && !isError && (
          <div className="p-4 text-sm">Carregando...</div>
        )}
        {!isError &&
          !isLoading &&
          Array.isArray(items?.options) &&
          !items?.options.length && (
            <CommandEmpty>Resultados não encontrados.</CommandEmpty>
          )}
        {!isLoading && isError && (
          <div className="p-4 text-sm">Algo deu errado</div>
        )}
        {!isError &&
          !isLoading &&
          Array.isArray(items?.options) &&
          items?.options.length > 0 &&
          items?.options.map(({ label, value }, index) => {
            return (
              <CommandItem
                key={index}
                onSelect={() => handleSelectResult({ label, value })}
                value={value}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedResult?.value === value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {label}
              </CommandItem>
            );
          })}
      </CommandList>
    </Command>
  );
}
