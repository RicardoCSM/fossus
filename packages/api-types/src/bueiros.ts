import type { EnderecoDto } from "./enderecos";

export type BueiroStatus = "normal" | "warning" | "critical";

export interface BueiroDto {
  id: number;
  endereco: EnderecoDto;
  diametro: number | null;
  profundidade: number | null;
  capacidade_fluxo: number | null;
  data_instalacao: string | null;
  status: BueiroStatus;
  alertas_ativos: number;
}

export interface BueiroRefDto {
  id: number;
  rua: string;
  numero: number | null;
}
