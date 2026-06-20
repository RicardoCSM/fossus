import type { BueiroRefDto } from "./bueiros";

export interface EquipeRefDto {
  id: number;
  nome: string;
}

export interface ManutencaoDto {
  id: number;
  bueiro: BueiroRefDto;
  equipe: EquipeRefDto;
  data_abertura: string | null;
  data_execucao: string | null;
  status: string | null;
  descricao: string | null;
}
