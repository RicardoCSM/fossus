import type { Request, Response } from "express";

import { createLeituraSchema } from "@/schemas/leituras";
import * as leituraService from "../services/leituras";

export async function create(req: Request, res: Response) {
  const parsed = createLeituraSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Dados inválidos" });
    return;
  }

  const novaLeitura = await leituraService.create(parsed.data);
  res.status(201).json(novaLeitura);
}

export async function list(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;

    const result = await leituraService.findAll(page, limit);

    res.json(result);
  } catch {
    res.status(500).json({ message: "Erro ao buscar leituras." });
  }
}
