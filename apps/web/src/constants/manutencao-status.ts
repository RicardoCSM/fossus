export const ManutencaoStatuses = ["ABERTA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"] as const;

export type ManutencaoStatus = (typeof ManutencaoStatuses)[number];

export const ManutencaoStatusLabels: Record<ManutencaoStatus, string> = {
  ABERTA: "Aberta",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
};

export const ManutencaoStatusColors: Record<ManutencaoStatus, { bg: string; text: string }> = {
  ABERTA: { bg: "bg-sky-500", text: "text-sky-500" },
  EM_ANDAMENTO: { bg: "bg-amber-500", text: "text-amber-500" },
  CONCLUIDA: { bg: "bg-emerald-500", text: "text-emerald-500" },
  CANCELADA: { bg: "bg-zinc-400", text: "text-zinc-400" },
};

export const ManutencaoStatusOptions = ManutencaoStatuses.map((status) => ({
  label: ManutencaoStatusLabels[status],
  value: status,
}));

export function getManutencaoStatusLabel(status: string | null) {
  if (status === null) return "—";
  return ManutencaoStatusLabels[status as ManutencaoStatus] ?? status;
}

export function getManutencaoStatusColors(status: string | null) {
  if (status === null) return { bg: "bg-zinc-400", text: "text-zinc-400" };
  return (
    ManutencaoStatusColors[status as ManutencaoStatus] ?? {
      bg: "bg-zinc-400",
      text: "text-zinc-400",
    }
  );
}
