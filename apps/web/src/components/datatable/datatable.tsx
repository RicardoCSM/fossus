"use no memo";

import * as React from "react";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@fossus/ui/components/table";
import { DataTablePagination } from "./datatable-pagination";
import { LoaderCircle } from "lucide-react";

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: TanstackTable<TData>;
  isLoading?: boolean;
  displayPagination?: boolean;
}

export function DataTable<TData>({
  table,
  isLoading,
  displayPagination = true,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn("flex w-full h-full flex-col justify-between space-y-6", className)}
      {...props}
    >
      {children}
      <div
        className={cn(
          "flex flex-col flex-1",
          (table.getRowModel().rows?.length <= 0 || isLoading) && "items-center justify-center",
        )}
      >
        {isLoading ? (
          <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
        ) : table.getRowModel().rows?.length > 0 ? (
          <div className="px-4 md:px-0">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-semibold text-2xl text-tenant-primary">
              Sem resultados encontrados
            </h2>
          </div>
        )}
      </div>
      {displayPagination && <DataTablePagination table={table} />}
    </div>
  );
}
