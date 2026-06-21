"use client";

import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";

import { fetchSensoresByBueiro } from "@/actions/sensores";
import { DataTable } from "@/components/datatable/datatable";
import { DataTableAdvancedToolbar } from "@/components/datatable/datatable-advanced-toolbar";
import { CreateSensorDialog } from "@/components/create-sensor-dialog";
import { getSensoresColumns, sensorAccessorKeyLabels } from "@/components/sensores-table-columns";

interface SensoresTableProps {
  bueiroId: number;
}

export function SensoresTable({ bueiroId }: SensoresTableProps) {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, error, status, refetch } = useQuery({
    queryKey: ["sensores", bueiroId],
    queryFn: async () => {
      const response = await fetchSensoresByBueiro(bueiroId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });

  const isLoading = status === "pending";
  const sensores = data ?? [];

  const table = useReactTable({
    data: sensores,
    columns: getSensoresColumns(() => refetch()),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearch,
    state: {
      sorting,
      pagination,
      globalFilter: search,
    },
  });

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <h2 className="text-lg font-semibold text-tenant-primary">Algo deu errado</h2>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <DataTable table={table} isLoading={isLoading}>
      <DataTableAdvancedToolbar
        table={table}
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        accessorKeyLabels={sensorAccessorKeyLabels}
      >
        <CreateSensorDialog bueiroId={bueiroId} refetch={refetch} />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
