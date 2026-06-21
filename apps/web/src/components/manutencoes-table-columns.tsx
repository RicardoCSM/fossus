"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { DeleteManutencaoDialog } from "@/components/delete-manutencao-dialog";
import { EditManutencaoDialog } from "@/components/edit-manutencao-dialog";
import { getManutencaoStatusColors, getManutencaoStatusLabel } from "@/constants/manutencao-status";
import type { ManutencaoDto } from "@fossus/api-types";
import type { ColumnDef } from "@tanstack/react-table";

export const manutencaoAccessorKeyLabels: Record<string, string> = {
  equipe: "Equipe",
  data_abertura: "Abertura",
  data_execucao: "Execução",
  status: "Status",
  descricao: "Descrição",
  actions: "Ações",
};

function formatDateTime(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR");
}

export function getManutencoesColumns(refetch: () => void): ColumnDef<ManutencaoDto>[] {
  return [
    {
      id: "equipe",
      accessorFn: (row) => row.equipe.nome,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Equipe" />,
    },
    {
      id: "data_abertura",
      accessorKey: "data_abertura",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Abertura" />,
      cell: ({ row }) => formatDateTime(row.original.data_abertura),
    },
    {
      id: "data_execucao",
      accessorKey: "data_execucao",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Execução" />,
      cell: ({ row }) => formatDateTime(row.original.data_execucao),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const colors = getManutencaoStatusColors(row.original.status);
        return (
          <span className="flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${colors.bg}`} />
            <span className={colors.text}>{getManutencaoStatusLabel(row.original.status)}</span>
          </span>
        );
      },
    },
    {
      id: "descricao",
      accessorKey: "descricao",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Descrição" />,
      cell: ({ row }) => (
        <span className="block max-w-64 truncate" title={row.original.descricao ?? undefined}>
          {row.original.descricao ?? "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <EditManutencaoDialog manutencao={row.original} refetch={refetch} />
          <DeleteManutencaoDialog manutencao={row.original} refetch={refetch} />
        </div>
      ),
    },
  ];
}
