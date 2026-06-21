"use client";

import { useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";

import { fetchAlertasByBueiro } from "@/actions/alertas";
import { DataTable } from "@/components/datatable/datatable";
import { DataTableAdvancedToolbar } from "@/components/datatable/datatable-advanced-toolbar";
import { CreateAlertaDialog } from "@/components/create-alerta-dialog";
import { getAlertasColumns, alertaAccessorKeyLabels } from "@/components/alertas-table-columns";

interface AlertasTableProps {
  bueiroId: number;
}

export function AlertasTable({ bueiroId }: AlertasTableProps) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, error, status, refetch } = useQuery({
    queryKey: ["alertas", bueiroId, pagination],
    queryFn: async () => {
      const response = await fetchAlertasByBueiro(
        bueiroId,
        pagination.pageIndex + 1,
        pagination.pageSize,
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });

  const isLoading = status === "pending";
  const alertas = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 0;
  const rowCount = data?.meta.total ?? 0;

  const table = useReactTable({
    data: alertas,
    columns: getAlertasColumns(() => refetch()),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount: totalPages,
    rowCount,
    enableSorting: false,
    state: {
      pagination,
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
        accessorKeyLabels={alertaAccessorKeyLabels}
      >
        <CreateAlertaDialog bueiroId={bueiroId} refetch={refetch} />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
