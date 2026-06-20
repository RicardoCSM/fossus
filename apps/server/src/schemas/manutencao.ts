import { z } from "zod";

export const createManutencaoSchema = z.object({
  equipe_id: z.number().int(),

  data_abertura: z.coerce.date().optional(),
  data_manutencao: z.coerce.date().optional(),

  status: z.string().min(1).max(30).optional(),
  descricao: z.string().optional(),
});
export const updateManutencaoSchema = createManutencaoSchema.partial();

export type CreateManutencaoInput = z.infer<typeof createManutencaoSchema>;

export type UpdateManutencaoInput = z.infer<typeof updateManutencaoSchema>;
