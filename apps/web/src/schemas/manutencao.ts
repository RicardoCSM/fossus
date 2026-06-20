import { z } from "zod";

export const manutencaoSchema = z.object({
  equipe_id: z.number().int(),
  data_abertura: z.coerce.date().optional(),
  data_manutencao: z.coerce.date().optional(),
  status: z.string().min(1).max(30).optional(),
  descricao: z.string().optional(),
});

export const updateManutencaoSchema = manutencaoSchema.partial();

export type ManutencaoInput = z.infer<typeof manutencaoSchema>;
export type UpdateManutencaoInput = z.infer<typeof updateManutencaoSchema>;
