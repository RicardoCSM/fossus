export const SensorStatuses = ["ATIVO", "INATIVO", "MANUTENCAO"] as const;

export type SensorStatus = (typeof SensorStatuses)[number];

export const SensorStatusLabels: Record<SensorStatus, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
  MANUTENCAO: "Em manutenção",
};

export const SensorStatusColors: Record<SensorStatus, { bg: string; text: string }> = {
  ATIVO: { bg: "bg-emerald-500", text: "text-emerald-500" },
  INATIVO: { bg: "bg-zinc-400", text: "text-zinc-400" },
  MANUTENCAO: { bg: "bg-amber-500", text: "text-amber-500" },
};

export const SensorStatusOptions = SensorStatuses.map((status) => ({
  label: SensorStatusLabels[status],
  value: status,
}));

export function getSensorStatusLabel(status: string | null) {
  if (status === null) return "—";
  return SensorStatusLabels[status as SensorStatus] ?? status;
}

export function getSensorStatusColors(status: string | null) {
  if (status === null) return { bg: "bg-zinc-400", text: "text-zinc-400" };
  return SensorStatusColors[status as SensorStatus] ?? { bg: "bg-zinc-400", text: "text-zinc-400" };
}
