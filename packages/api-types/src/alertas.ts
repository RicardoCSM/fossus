import type { BueiroRefDto } from "./bueiros";
import type { TipoAlertaDto } from "./tipos-alerta";

export interface AlertaDto {
  id: number;
  bueiro: BueiroRefDto;
  tipo_alerta: TipoAlertaDto | null;
  data_hora: string;
  nivel: string | null;
  descricao: string | null;
  resolvido: boolean;
}
