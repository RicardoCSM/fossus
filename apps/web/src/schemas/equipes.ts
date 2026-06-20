import { z } from "zod";

export const equipeSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório").max(30),
  telefones: z.array(z.string().min(8).max(20)),
});

export const updateEquipeSchema = equipeSchema.partial();

export type EquipeInput = z.infer<typeof equipeSchema>;
export type UpdateEquipeInput = z.infer<typeof updateEquipeSchema>;
