import { z } from "zod";

export const leituraSchema = z.object({
  sensor_id: z.number().int(),
  valor: z.number(),
  data_hora: z.string().datetime(),
});

export type LeituraInput = z.infer<typeof leituraSchema>;
