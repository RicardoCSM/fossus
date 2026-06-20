import type { BueiroStatus } from "@fossus/api-types";

export const BueiroStatuses = ["normal", "warning", "critical"] as const satisfies readonly BueiroStatus[];

export const BueiroStatusLabels: Record<BueiroStatus, string> = {
  normal: "Normal",
  warning: "Atenção",
  critical: "Crítico",
};

export const BueiroStatusColors: Record<BueiroStatus, { bg: string; text: string }> = {
  normal: { bg: "bg-emerald-500", text: "text-emerald-500" },
  warning: { bg: "bg-amber-500", text: "text-amber-500" },
  critical: { bg: "bg-red-500", text: "text-red-500" },
};

export const BueiroStatusOptions = BueiroStatuses.map((status) => ({
  label: BueiroStatusLabels[status],
  value: status,
}));
