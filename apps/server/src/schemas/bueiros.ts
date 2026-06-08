import { z } from "zod";

export const createBueiroSchema = z.object({
  rua: z.string().min(1).max(100),
  numero: z.number().int().optional(),
  cep: z.string().max(10).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  diametro: z.number().optional(),
  profundidade: z.number().optional(),
  capacidade_fluxo: z.number().optional(),
  data_instalacao: z.string().date().optional(),
});

export const updateBueiroSchema = createBueiroSchema.partial();

export type CreateBueiroInput = z.infer<typeof createBueiroSchema>;
export type UpdateBueiroInput = z.infer<typeof updateBueiroSchema>;
