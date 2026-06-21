"use client";
"use no memo";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { Check, Settings2 } from "lucide-react";

import { cn, toSentenceCase } from "@/lib/utils";
import { Button } from "@fossus/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@fossus/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@fossus/ui/components/popover";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  isLoading?: boolean;
  accessorKeyLabels?: Record<string, string>;
}

export function DataTableViewOptions<TData>({
  table,
  isLoading,
  accessorKeyLabels,
}: DataTableViewOptionsProps<TData>) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Popover modal>
      <PopoverTrigger
        render={
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            disabled={isLoading}
            className="ml-auto hidden gap-2 focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0 lg:flex"
          />
        }
      >
        <Settings2 className="size-4" />
        Visualizar
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-0">
        <Command>
          <CommandInput placeholder="Procurar colunas..." />
          <CommandList>
            <CommandEmpty>Nenhuma coluna encontrada.</CommandEmpty>
            <CommandGroup>
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <CommandItem
                      key={column.id}
                      onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                    >
                      <span className="truncate">
                        {accessorKeyLabels?.[column.id] || toSentenceCase(column.id)}
                      </span>
                      <Check
                        className={cn(
                          "ml-auto size-4 shrink-0",
                          column.getIsVisible() ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
