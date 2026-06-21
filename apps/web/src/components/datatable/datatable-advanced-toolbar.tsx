"use client";
"use no memo";

import * as React from "react";
import { type Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { DataTableViewOptions } from "./datatable-view-options";
import DatatableSearch from "./datatable-search";

interface DataTableAdvancedToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  headerLeft?: React.ReactNode;
  table: Table<TData>;
  isLoading: boolean;
  search?: string;
  setSearch?: (value: string) => void;
  accessorKeyLabels?: Record<string, string>;
  showDataViewOptions?: boolean;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  headerLeft,
  children,
  className,
  isLoading,
  search = "",
  setSearch,
  accessorKeyLabels,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full min-w-0 items-center justify-between gap-2 overflow-auto p-1",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {setSearch && (
          <DatatableSearch search={search} setSearch={setSearch} isLoading={isLoading} />
        )}
        {headerLeft}
      </div>
      <div className="flex items-center gap-2">
        {accessorKeyLabels && (
          <DataTableViewOptions
            table={table}
            isLoading={isLoading}
            accessorKeyLabels={accessorKeyLabels}
          />
        )}
        {children}
      </div>
    </div>
  );
}
