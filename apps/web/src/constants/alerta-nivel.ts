export const AlertaNiveis = ["BAIXO", "MEDIO", "ALTO", "CRITICO"] as const;

export type AlertaNivel = (typeof AlertaNiveis)[number];

export const AlertaNivelLabels: Record<AlertaNivel, string> = {
  BAIXO: "Baixo",
  MEDIO: "Médio",
  ALTO: "Alto",
  CRITICO: "Crítico",
};

export const AlertaNivelColors: Record<AlertaNivel, { bg: string; text: string }> = {
  BAIXO: { bg: "bg-sky-500", text: "text-sky-500" },
  MEDIO: { bg: "bg-amber-500", text: "text-amber-500" },
  ALTO: { bg: "bg-orange-500", text: "text-orange-500" },
  CRITICO: { bg: "bg-red-500", text: "text-red-500" },
};

export const AlertaNivelOptions = AlertaNiveis.map((nivel) => ({
  label: AlertaNivelLabels[nivel],
  value: nivel,
}));

export function getAlertaNivelLabel(nivel: string | null) {
  if (nivel === null) return "—";
  return AlertaNivelLabels[nivel as AlertaNivel] ?? nivel;
}

export function getAlertaNivelColors(nivel: string | null) {
  if (nivel === null) return { bg: "bg-zinc-400", text: "text-zinc-400" };
  return AlertaNivelColors[nivel as AlertaNivel] ?? { bg: "bg-zinc-400", text: "text-zinc-400" };
}
