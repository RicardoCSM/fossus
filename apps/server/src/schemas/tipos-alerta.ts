import { z } from "zod";

export const createTipoAlertaSchema = z.object({
  nome: z.string().min(1).max(50),
  descricao: z.string().optional(),
});

export const updateTipoAlertaSchema = createTipoAlertaSchema.partial();

export type CreateTipoAlertaInput = z.infer<typeof createTipoAlertaSchema>;
export type UpdateTipoAlertaInput = z.infer<typeof updateTipoAlertaSchema>;
