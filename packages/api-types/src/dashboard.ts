import type { BueiroStatus } from "./bueiros";

export interface BueiroDashboardTotals {
  alertas_ativos: number;
  alertas_total: number;
  sensores_ativos: number;
  sensores_total: number;
  manutencoes_abertas: number;
  manutencoes_total: number;
}

export interface AlertaPorTipoDto {
  tipo: string;
  total: number;
}

export interface AlertaPorMesDto {
  mes: string;
  [tipo: string]: string | number;
}

export interface BueiroDashboardDto {
  bueiro_id: number;
  status: BueiroStatus;
  totals: BueiroDashboardTotals;
  alertas_por_tipo: AlertaPorTipoDto[];
  alertas_por_mes: AlertaPorMesDto[];
}
