"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { DeleteEquipeDialog } from "@/components/delete-equipe-dialog";
import { EditEquipeDialog } from "@/components/edit-equipe-dialog";
import type { EquipeDto } from "@fossus/api-types";
import type { ColumnDef } from "@tanstack/react-table";

export const equipeAccessorKeyLabels: Record<string, string> = {
  nome: "Nome",
  telefones: "Telefones",
  actions: "Ações",
};

export function getEquipesColumns(refetch: () => void): ColumnDef<EquipeDto>[] {
  return [
    {
      id: "nome",
      accessorKey: "nome",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    },
    {
      id: "telefones",
      accessorFn: (row) => row.telefones.join(", "),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Telefones" />,
      cell: ({ row }) =>
        row.original.telefones.length > 0 ? row.original.telefones.join(", ") : "—",
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <EditEquipeDialog equipe={row.original} refetch={refetch} />
          <DeleteEquipeDialog equipe={row.original} refetch={refetch} />
        </div>
      ),
    },
  ];
}
