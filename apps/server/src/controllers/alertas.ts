import type { Request, Response } from "express";
import * as alertaService from "../services/alertas";
import { createAlertaSchema, updateAlertaSchema } from "../schemas/alertas";
import parseId from "@/lib/parseId";

export async function list(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;

    const result = await alertaService.findAll(page, limit);
    res.json(result);
  } catch {
    res.status(500).json({ message: "Erro ao buscar alertas." });
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const alerta = await alertaService.findById(id);

  if (!alerta) {
    res.status(404).json({ message: "Alerta não encontrado" });
    return;
  }

  res.json(alerta);
}

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = createAlertaSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.issues,
    });
    return;
  }

  const alerta = await alertaService.create(parsed.data);
  res.status(201).json(alerta);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const parsed = updateAlertaSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.issues,
    });
    return;
  }

  const alerta = await alertaService.update(id, parsed.data);

  if (!alerta) {
    res.status(404).json({ message: "Alerta não encontrado" });
    return;
  }

  res.json(alerta);
}

export async function findByBueiroId(req: Request, res: Response): Promise<void> {
  const bueiroId = parseId(req.params.bueiroId);

  if (bueiroId === null) {
    res.status(400).json({ message: "ID do bueiro inválido" });
    return;
  }

  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;

    const result = await alertaService.findByBueiroId(bueiroId, page, limit);
    res.json(result);
  } catch {
    res.status(500).json({ message: "Erro ao buscar alertas do bueiro." });
  }
}
