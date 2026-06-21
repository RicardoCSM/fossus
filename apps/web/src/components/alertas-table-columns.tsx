"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { EditAlertaDialog } from "@/components/edit-alerta-dialog";
import { getAlertaNivelColors, getAlertaNivelLabel } from "@/constants/alerta-nivel";
import type { AlertaDto } from "@fossus/api-types";
import type { ColumnDef } from "@tanstack/react-table";

export const alertaAccessorKeyLabels: Record<string, string> = {
  tipo_alerta: "Tipo",
  data_hora: "Data/Hora",
  nivel: "Nível",
  descricao: "Descrição",
  resolvido: "Status",
  actions: "Ações",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR");
}

export function getAlertasColumns(refetch: () => void): ColumnDef<AlertaDto>[] {
  return [
    {
      id: "tipo_alerta",
      accessorFn: (row) => row.tipo_alerta?.nome ?? "—",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    },
    {
      id: "data_hora",
      accessorKey: "data_hora",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Data/Hora" />,
      cell: ({ row }) => formatDateTime(row.original.data_hora),
    },
    {
      id: "nivel",
      accessorKey: "nivel",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nível" />,
      cell: ({ row }) => {
        const colors = getAlertaNivelColors(row.original.nivel);
        return (
          <span className="flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${colors.bg}`} />
            <span className={colors.text}>{getAlertaNivelLabel(row.original.nivel)}</span>
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
      id: "resolvido",
      accessorKey: "resolvido",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) =>
        row.original.resolvido ? (
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-500">Resolvido</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-red-500" />
            <span className="text-red-500">Ativo</span>
          </span>
        ),
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <EditAlertaDialog alerta={row.original} refetch={refetch} />
        </div>
      ),
    },
  ];
}
