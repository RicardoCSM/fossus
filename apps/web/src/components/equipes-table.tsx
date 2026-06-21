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

import { fetchEquipesList } from "@/actions/equipes";
import { DataTable } from "@/components/datatable/datatable";
import { DataTableAdvancedToolbar } from "@/components/datatable/datatable-advanced-toolbar";
import { CreateEquipeDialog } from "@/components/create-equipe-dialog";
import { getEquipesColumns, equipeAccessorKeyLabels } from "@/components/equipes-table-columns";

export function EquipesTable() {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, error, status, refetch } = useQuery({
    queryKey: ["equipes"],
    queryFn: async () => {
      const response = await fetchEquipesList();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });

  const isLoading = status === "pending";
  const equipes = data ?? [];

  const table = useReactTable({
    data: equipes,
    columns: getEquipesColumns(() => refetch()),
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
        accessorKeyLabels={equipeAccessorKeyLabels}
      >
        <CreateEquipeDialog refetch={refetch} />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
