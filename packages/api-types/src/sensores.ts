import type { TipoSensorDto } from "./tipos-sensor";

export interface SensorDto {
  id: number;
  bueiro_id: number;
  tipo_sensor: TipoSensorDto;
  fabricante: string | null;
  numero_serie: string | null;
  data_instalacao: string | null;
  ultima_calibracao: string | null;
  status: string | null;
}
