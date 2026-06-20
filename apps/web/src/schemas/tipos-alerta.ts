import { z } from "zod";

export const tipoAlertaSchema = z.object({
  nome: z.string().min(1).max(50),
  descricao: z.string().optional(),
});

export const updateTipoAlertaSchema = tipoAlertaSchema.partial();

export type TipoAlertaInput = z.infer<typeof tipoAlertaSchema>;
export type UpdateTipoAlertaInput = z.infer<typeof updateTipoAlertaSchema>;
