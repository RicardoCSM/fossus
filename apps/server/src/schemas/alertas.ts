import { z } from "zod";

export const createAlertaSchema = z.object({
  bueiro_id: z.number().int(),
  tipo_alerta_id: z.number().int().optional(),
  data_hora: z.coerce.date(),
  nivel: z.string().min(1).max(20).optional(),
  descricao: z.string().optional(),
});

export const updateAlertaSchema = z.object({
  resolvido: z.boolean().optional(),
  nivel: z.string().min(1).max(20).optional(),
  descricao: z.string().optional(),
});

export type CreateAlertaInput = z.infer<typeof createAlertaSchema>;
export type UpdateAlertaInput = z.infer<typeof updateAlertaSchema>;
