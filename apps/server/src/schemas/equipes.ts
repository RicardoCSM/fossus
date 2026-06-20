import { z } from "zod";

export const equipeSchemaBase = z.object({
  id: z.number().int(),
  nome: z.string().min(1, "O nome é obrigatório").max(30),
  telefones: z.array(z.string().min(8).max(20)),
});

export const createEquipeSchema = equipeSchemaBase.omit({ id: true });

export const updateEquipeSchema = createEquipeSchema.partial();

export type CreateEquipeInput = z.infer<typeof createEquipeSchema>;
export type UpdateEquipeInput = z.infer<typeof updateEquipeSchema>;
