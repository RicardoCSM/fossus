import { z } from "zod";

export const createLeituraSchema = z.object({
  sensor_id: z.number().int(),
  valor: z.number(),
  data_hora: z.string().datetime(),
});

export const updateLeituraSchema = createLeituraSchema.partial();

export type CreateLeituraInput = z.infer<typeof createLeituraSchema>;
export type UpdateLeituraInput = z.infer<typeof updateLeituraSchema>;
