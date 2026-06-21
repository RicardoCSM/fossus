"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { DeleteSensorDialog } from "@/components/delete-sensor-dialog";
import { EditSensorDialog } from "@/components/edit-sensor-dialog";
import { getSensorStatusColors, getSensorStatusLabel } from "@/constants/sensor-status";
import type { SensorDto } from "@fossus/api-types";
import type { ColumnDef } from "@tanstack/react-table";

export const sensorAccessorKeyLabels: Record<string, string> = {
  tipo_sensor: "Tipo",
  fabricante: "Fabricante",
  numero_serie: "Número de série",
  data_instalacao: "Data de instalação",
  ultima_calibracao: "Última calibração",
  status: "Status",
  actions: "Ações",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

export function getSensoresColumns(refetch: () => void): ColumnDef<SensorDto>[] {
  return [
    {
      id: "tipo_sensor",
      accessorFn: (row) => row.tipo_sensor.nome,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
      cell: ({ row }) => (
        <span>
          {row.original.tipo_sensor.nome}{" "}
          <span className="text-xs text-muted-foreground">
            ({row.original.tipo_sensor.unidade})
          </span>
        </span>
      ),
    },
    {
      id: "fabricante",
      accessorKey: "fabricante",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fabricante" />,
      cell: ({ row }) => row.original.fabricante ?? "—",
    },
    {
      id: "numero_serie",
      accessorKey: "numero_serie",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Número de série" />,
      cell: ({ row }) => row.original.numero_serie ?? "—",
    },
    {
      id: "data_instalacao",
      accessorKey: "data_instalacao",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Instalado em" />,
      cell: ({ row }) => formatDate(row.original.data_instalacao),
    },
    {
      id: "ultima_calibracao",
      accessorKey: "ultima_calibracao",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Última calibração" />,
      cell: ({ row }) => formatDate(row.original.ultima_calibracao),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const colors = getSensorStatusColors(row.original.status);
        return (
          <span className="flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${colors.bg}`} />
            <span className={colors.text}>{getSensorStatusLabel(row.original.status)}</span>
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <EditSensorDialog sensor={row.original} refetch={refetch} />
          <DeleteSensorDialog sensor={row.original} refetch={refetch} />
        </div>
      ),
    },
  ];
}
