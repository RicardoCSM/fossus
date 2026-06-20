import { z } from "zod";

export const sensorSchema = z.object({
  bueiro_id: z.number().int(),
  tipo_sensor_id: z.number().int(),
  fabricante: z.string().min(1).max(100),
  numero_serie: z.string().max(100),
  data_instalacao: z.coerce.date(),
  ultima_calibracao: z.coerce.date(),
  status: z.string().min(1).max(30),
});

export const updateSensorSchema = sensorSchema.partial();

export type SensorInput = z.infer<typeof sensorSchema>;
export type UpdateSensorInput = z.infer<typeof updateSensorSchema>;
